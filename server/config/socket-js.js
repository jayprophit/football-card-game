/**
 * Socket.io configuration for real-time game functionality
 * Handles matchmaking, game state updates, and chat
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Match = require('../models/Match');

// Store active games and players in memory
const activeGames = new Map(); // Map of game ID to game state
const playerSockets = new Map(); // Map of user ID to socket ID
const matchmakingQueue = { // Queue by ELO range
  low: [], // < 1000
  medium: [], // 1000-1500
  high: [], // 1500-2000
  expert: [] // > 2000
};

/**
 * Configure socket.io with all event handlers
 * @param {Object} io Socket.io server instance
 */
const configureSocket = (io) => {
  // Middleware for authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token is required'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('User not found'));
      }
      
      // Attach user to socket for future use
      socket.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error.message);
      next(new Error('Authentication failed'));
    }
  });

  // Handle connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    
    // If user is authenticated, store their socket ID
    if (socket.user) {
      playerSockets.set(socket.user._id.toString(), socket.id);
      
      // Join user-specific room for direct messages
      socket.join(`user:${socket.user._id}`);
      
      console.log(`Authenticated user connected: ${socket.user.username}`);
    }
    
    // --- MATCHMAKING EVENTS ---
    
    /**
     * Join matchmaking queue
     * @param {Object} data Contains matchmaking preferences
     */
    socket.on('matchmaking:join', (data) => {
      if (!socket.user) return;
      
      const userId = socket.user._id.toString();
      const elo = socket.user.elo || 1000;
      
      // Determine ELO bracket
      let bracket;
      if (elo < 1000) bracket = 'low';
      else if (elo < 1500) bracket = 'medium';
      else if (elo < 2000) bracket = 'high';
      else bracket = 'expert';
      
      // Add player to appropriate queue with timestamp and preferences
      const queueEntry = {
        userId,
        socketId: socket.id,
        elo,
        timestamp: Date.now(),
        preferences: data.preferences || {}
      };
      
      matchmakingQueue[bracket].push(queueEntry);
      
      // Emit confirmation to user
      socket.emit('matchmaking:joined', {
        position: matchmakingQueue[bracket].length,
        estimatedWait: calculateWaitTime(bracket)
      });
      
      console.log(`User ${userId} joined matchmaking queue (${bracket})`);
      
      // Try to find a match
      findMatch(bracket);
    });
    
    /**
     * Leave matchmaking queue
     */
    socket.on('matchmaking:leave', () => {
      if (!socket.user) return;
      
      const userId = socket.user._id.toString();
      
      // Remove player from all queues
      for (const bracket in matchmakingQueue) {
        matchmakingQueue[bracket] = matchmakingQueue[bracket].filter(
          entry => entry.userId !== userId
        );
      }
      
      socket.emit('matchmaking:left');
      console.log(`User ${userId} left matchmaking queue`);
    });
    
    // --- GAME EVENTS ---
    
    /**
     * Join an existing game
     * @param {Object} data Contains gameId
     */
    socket.on('game:join', async (data) => {
      if (!socket.user || !data.gameId) return;
      
      const userId = socket.user._id.toString();
      const gameId = data.gameId;
      
      try {
        // Find the game in database or active games
        let gameState = activeGames.get(gameId);
        
        if (!gameState) {
          // Fetch from database if not in memory
          const match = await Match.findById(gameId);
          
          if (!match) {
            socket.emit('game:error', { message: 'Game not found' });
            return;
          }
          
          // Load game state
          gameState = JSON.parse(match.gameState);
          activeGames.set(gameId, gameState);
        }
        
        // Check if user is part of this game
        const isHomePlayer = gameState.players.home.id === userId;
        const isAwayPlayer = gameState.players.away.id === userId;
        
        if (!isHomePlayer && !isAwayPlayer) {
          socket.emit('game:error', { message: 'You are not part of this game' });
          return;
        }
        
        // Join game room
        socket.join(`game:${gameId}`);
        
        // Send initial game state
        socket.emit('game:state', gameState);
        
        console.log(`User ${userId} joined game ${gameId}`);
      } catch (error) {
        console.error(`Error joining game: ${error.message}`);
        socket.emit('game:error', { message: 'Failed to join game' });
      }
    });
    
    /**
     * Make a move in the game
     * @param {Object} data Contains gameId and move details
     */
    socket.on('game:move', async (data) => {
      if (!socket.user || !data.gameId) return;
      
      const userId = socket.user._id.toString();
      const gameId = data.gameId;
      
      try {
        // Get game state
        const gameState = activeGames.get(gameId);
        
        if (!gameState) {
          socket.emit('game:error', { message: 'Game not found' });
          return;
        }
        
        // Validate it's the player's turn
        const isCurrentPlayerTurn = 
          (gameState.currentTeam === 'home' && gameState.players.home.id === userId) ||
          (gameState.currentTeam === 'away' && gameState.players.away.id === userId);
        
        if (!isCurrentPlayerTurn) {
          socket.emit('game:error', { message: 'Not your turn' });
          return;
        }
        
        // Process the move (this would call game logic functions)
        const updatedState = processGameMove(gameState, data.move);
        
        // Update active games map
        activeGames.set(gameId, updatedState);
        
        // Broadcast updated state to all players in the game
        io.to(`game:${gameId}`).emit('game:state', updatedState);
        
        // Save to database
        await Match.findByIdAndUpdate(gameId, { 
          gameState: JSON.stringify(updatedState),
          lastMoveAt: new Date()
        });
        
        console.log(`Move processed in game ${gameId}`);
      } catch (error) {
        console.error(`Error processing move: ${error.message}`);
        socket.emit('game:error', { message: 'Failed to process move' });
      }
    });
    
    /**
     * Send a chat message in game
     * @param {Object} data Contains gameId and message
     */
    socket.on('game:chat', (data) => {
      if (!socket.user || !data.gameId || !data.message) return;
      
      const gameId = data.gameId;
      const message = {
        userId: socket.user._id,
        username: socket.user.username,
        text: data.message,
        timestamp: Date.now()
      };
      
      // Broadcast message to all players in the game
      io.to(`game:${gameId}`).emit('game:chat', message);
    });
    
    // --- GENERAL EVENTS ---
    
    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      
      if (socket.user) {
        const userId = socket.user._id.toString();
        
        // Remove from player sockets map
        playerSockets.delete(userId);
        
        // Remove from matchmaking queues
        for (const bracket in matchmakingQueue) {
          matchmakingQueue[bracket] = matchmakingQueue[bracket].filter(
            entry => entry.userId !== userId
          );
        }
      }
    });
  });
  
  // --- HELPER FUNCTIONS ---
  
  /**
   * Try to find a match for a player in a specific bracket
   * @param {string} bracket The ELO bracket to match in
   */
  function findMatch(bracket) {
    const queue = matchmakingQueue[bracket];
    
    // Need at least 2 players to make a match
    if (queue.length < 2) return;
    
    // Sort by wait time (oldest first)
    queue.sort((a, b) => a.timestamp - b.timestamp);
    
    const player1 = queue[0];
    
    // Find the best match based on ELO
    let bestMatchIndex = 1;
    let bestEloDiff = Infinity;
    
    for (let i = 1; i < queue.length; i++) {
      const eloDiff = Math.abs(player1.elo - queue[i].elo);
      
      if (eloDiff < bestEloDiff) {
        bestEloDiff = eloDiff;
        bestMatchIndex = i;
      }
    }
    
    const player2 = queue[bestMatchIndex];
    
    // Create match if ELO difference is acceptable
    const maxEloDiff = 300; // Maximum acceptable ELO difference
    
    if (bestEloDiff <= maxEloDiff) {
      createMatch(player1, player2);
      
      // Remove players from queue
      matchmakingQueue[bracket] = queue.filter(
        entry => entry.userId !== player1.userId && entry.userId !== player2.userId
      );
    }
  }
  
  /**
   * Create a new match between two players
   * @param {Object} player1 First player info
   * @param {Object} player2 Second player info
   */
  async function createMatch(player1, player2) {
    try {
      // Randomly determine home/away
      const isPlayer1Home = Math.random() >= 0.5;
      
      const homePlayer = isPlayer1Home ? player1 : player2;
      const awayPlayer = isPlayer1Home ? player2 : player1;
      
      // Create initial game state
      const gameState = {
        players: {
          home: { id: homePlayer.userId },
          away: { id: awayPlayer.userId }
        },
        currentTeam: 'home', // Home team starts
        movesRemaining: 3,
        turnNumber: 1,
        matchMinute: 0,
        score: { home: 0, away: 0 },
        // Additional game state would be initialized here
      };
      
      // Create match in database
      const match = await Match.create({
        homePlayer: homePlayer.userId,
        awayPlayer: awayPlayer.userId,
        gameState: JSON.stringify(gameState),
        startedAt: new Date(),
        lastMoveAt: new Date()
      });
      
      // Store in active games
      activeGames.set(match._id.toString(), gameState);
      
      // Notify both players
      const matchFoundData = {
        matchId: match._id,
        opponent: null, // This would be populated with opponent info
        side: null
      };
      
      // Notify player 1
      matchFoundData.side = isPlayer1Home ? 'home' : 'away';
      matchFoundData.opponent = isPlayer1Home ? awayPlayer.userId : homePlayer.userId;
      io.to(player1.socketId).emit('matchmaking:found', matchFoundData);
      
      // Notify player 2
      matchFoundData.side = isPlayer1Home ? 'away' : 'home';
      matchFoundData.opponent = isPlayer1Home ? homePlayer.userId : awayPlayer.userId;
      io.to(player2.socketId).emit('matchmaking:found', matchFoundData);
      
      console.log(`Match created between ${homePlayer.userId} and ${awayPlayer.userId}`);
    } catch (error) {
      console.error(`Error creating match: ${error.message}`);
      
      // Notify players of failure
      io.to(player1.socketId).emit('matchmaking:error', { message: 'Failed to create match' });
      io.to(player2.socketId).emit('matchmaking:error', { message: 'Failed to create match' });
    }
  }
  
  /**
   * Calculate estimated wait time based on queue length
   * @param {string} bracket ELO bracket
   * @returns {number} Estimated wait time in seconds
   */
  function calculateWaitTime(bracket) {
    const queueLength = matchmakingQueue[bracket].length;
    
    // This is a simple estimate - in a real app you'd use historical data
    if (queueLength < 10) return 60; // 1 minute
    if (queueLength < 30) return 30; // 30 seconds
    return 15; // 15 seconds for busy times
  }
  
  /**
   * Process a game move using game logic
   * @param {Object} gameState Current game state
   * @param {Object} move Move details
   * @returns {Object} Updated game state
   */
  function processGameMove(gameState, move) {
    // This would call the appropriate game logic functions from gameLogic.js
    // For now, just return the existing state
    
    // TODO: Implement actual game logic here
    
    return gameState;
  }
};

module.exports = configureSocket;

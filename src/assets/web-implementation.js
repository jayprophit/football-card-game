// FootballChess Game - Main Component Structure
import React, { useState, useEffect } from 'react';

// Game Board Component
const GameBoard = ({ gameState, onSquareClick, currentTeam, movesRemaining }) => {
  // Board dimensions: 20x10 grid (5 columns per section, 10 rows)
  const columns = 20;
  const rows = 10;
  const squares = [];

  // Create board squares
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const squareId = `${col}-${row}`;
      const players = gameState.playersOnSquare(col, row);
      const hasBall = gameState.isBallOnSquare(col, row);
      
      // Determine if this square is a goal area
      const isGoalArea = (col === 0 && row >= 4 && row <= 6) || 
                         (col === 19 && row >= 4 && row <= 6);
      
      // Determine the zone (for visual styling)
      let zone = 'midfield';
      if (col < 5) zone = 'defensive';
      else if (col >= 15) zone = 'attacking';
      
      squares.push(
        <Square 
          key={squareId}
          id={squareId}
          players={players}
          hasBall={hasBall}
          isGoalArea={isGoalArea}
          zone={zone}
          onClick={() => onSquareClick(col, row)}
        />
      );
    }
  }

  return (
    <div className="game-board">
      <div className="board-status">
        <div className="team-turn">
          {currentTeam === 'home' ? 'Home Team' : 'Away Team'}'s Turn
        </div>
        <div className="moves-remaining">
          Moves Remaining: {movesRemaining}
        </div>
      </div>
      <div className="board-grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {squares}
      </div>
    </div>
  );
};

// Individual Square Component
const Square = ({ id, players, hasBall, isGoalArea, zone, onClick }) => {
  // Group players by team
  const homeTeamPlayers = players.filter(player => player.team === 'home');
  const awayTeamPlayers = players.filter(player => player.team === 'away');
  
  return (
    <div 
      className={`square ${zone} ${isGoalArea ? 'goal-area' : ''}`}
      onClick={onClick}
    >
      {hasBall && <div className="ball"></div>}
      
      <div className="players-container">
        {homeTeamPlayers.length > 0 && (
          <div className="team-stack home-team">
            <span className="player-count">{homeTeamPlayers.length}</span>
            <div className="top-player">{homeTeamPlayers[0].position}</div>
          </div>
        )}
        
        {awayTeamPlayers.length > 0 && (
          <div className="team-stack away-team">
            <span className="player-count">{awayTeamPlayers.length}</span>
            <div className="top-player">{awayTeamPlayers[0].position}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Player Card Component (used in hand/selection UI)
const PlayerCard = ({ player, isSelected, onSelect }) => {
  return (
    <div 
      className={`player-card ${isSelected ? 'selected' : ''} ${player.hasYellowCard ? 'yellow-card' : ''} ${player.hasRedCard ? 'red-card' : ''}`}
      onClick={() => onSelect(player.id)}
    >
      <div className="card-header">
        <span className="player-position">{player.position}</span>
        <span className="player-number">{player.number}</span>
      </div>
      
      <div className="player-photo" style={{ backgroundImage: `url(${player.photoUrl || '/default-player.png'})` }}>
        {player.injury && (
          <div className={`injury-indicator ${player.injury.severity}`}>
            {player.injury.severity.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <span className="player-name">{player.name}</span>
        <div className="movement-pattern">
          {/* Visual representation of movement pattern */}
          <div className="movement-grid" data-pattern={player.movementPattern}>
            {/* Dynamic movement indicators would go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Game Control Panel Component
const ControlPanel = ({ 
  selectedPlayer, 
  possibleMoves, 
  onPass, 
  onShoot, 
  onEndTurn, 
  gameState 
}) => {
  return (
    <div className="control-panel">
      <div className="score-display">
        <span className="home-score">{gameState.score.home}</span>
        <span className="score-divider">-</span>
        <span className="away-score">{gameState.score.away}</span>
      </div>
      
      <div className="action-buttons">
        {selectedPlayer && (
          <>
            <button 
              className="move-button"
              disabled={!possibleMoves || possibleMoves.length === 0}
            >
              Move
            </button>
            
            <button 
              className="pass-button"
              onClick={onPass}
              disabled={!gameState.canPass(selectedPlayer.id)}
            >
              Pass
            </button>
            
            <button 
              className="shoot-button"
              onClick={onShoot}
              disabled={!gameState.canShoot(selectedPlayer.id)}
            >
              Shoot
            </button>
          </>
        )}
        
        <button 
          className="end-turn-button"
          onClick={onEndTurn}
        >
          End Turn
        </button>
      </div>
      
      <div className="game-info">
        <div className="match-time">{gameState.matchTime}'</div>
        <div className="turn-counter">Turn: {gameState.turnCounter}</div>
      </div>
    </div>
  );
};

// Main Game Component
const FootballChessGame = () => {
  // Game state would contain all the player positions, ball position, score, etc.
  const [gameState, setGameState] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [possiblePasses, setPossiblePasses] = useState([]);
  const [passMode, setPassMode] = useState(false);
  const [currentTeam, setCurrentTeam] = useState('home'); // 'home' or 'away'
  const [movesRemaining, setMovesRemaining] = useState(3);
  const [gamePhase, setGamePhase] = useState('play'); // 'play', 'half-time', 'full-time'
  const [matchTime, setMatchTime] = useState(0); // Simulated match time in minutes
  
  // Initialize game
  useEffect(() => {
    // This would set up the initial game state with players in kickoff formation
    const initialGameState = initializeGame();
    setGameState(initialGameState);
    
    // Set up match time simulation
    const timeInterval = setInterval(() => {
      setMatchTime(prevTime => {
        const newTime = prevTime + 1;
        
        // Check for half-time at 45 minutes
        if (newTime === 45 && gamePhase === 'play') {
          setGamePhase('half-time');
          // Handle half-time logic here (e.g., switching sides)
        }
        
        // Check for full-time at 90 minutes
        if (newTime === 90) {
          setGamePhase('full-time');
          clearInterval(timeInterval);
          // Handle game end logic here
        }
        
        return newTime;
      });
    }, 30000); // Each real-world minute = 30 seconds (to make the game more dynamic)
    
    // Clean up interval on unmount
    return () => clearInterval(timeInterval);
  }, [gamePhase]);
  
  // Initialize the game with players, positions, etc.
  const initializeGame = () => {
    // Create players for both teams
    const players = [
      // Home Team
      { id: 'h1', team: 'home', name: 'Smith', position: 'GK', number: 1, col: 1, row: 5, 
        movementPattern: 'king', onField: true, hasBall: false },
      { id: 'h2', team: 'home', name: 'Jones', position: 'LB', number: 2, col: 3, row: 2, 
        movementPattern: 'bishop', onField: true, hasBall: false },
      { id: 'h3', team: 'home', name: 'Brown', position: 'CB', number: 4, col: 3, row: 4, 
        movementPattern: 'rook', onField: true, hasBall: false },
      { id: 'h4', team: 'home', name: 'Davis', position: 'CB', number: 5, col: 3, row: 6, 
        movementPattern: 'rook', onField: true, hasBall: false },
      { id: 'h5', team: 'home', name: 'Miller', position: 'RB', number: 3, col: 3, row: 8, 
        movementPattern: 'bishop', onField: true, hasBall: false },
      { id: 'h6', team: 'home', name: 'Wilson', position: 'CDM', number: 6, col: 5, row: 5, 
        movementPattern: 'knight', onField: true, hasBall: false },
      { id: 'h7', team: 'home', name: 'Taylor', position: 'CM', number: 8, col: 7, row: 4, 
        movementPattern: 'queen', onField: true, hasBall: false },
      { id: 'h8', team: 'home', name: 'Moore', position: 'CM', number: 10, col: 7, row: 6, 
        movementPattern: 'queen', onField: true, hasBall: false },
      { id: 'h9', team: 'home', name: 'Anderson', position: 'LW', number: 7, col: 9, row: 2, 
        movementPattern: 'knight', onField: true, hasBall: false },
      { id: 'h10', team: 'home', name: 'Thomas', position: 'ST', number: 9, col: 9, row: 5, 
        movementPattern: 'rook', onField: true, hasBall: true },
      { id: 'h11', team: 'home', name: 'Jackson', position: 'RW', number: 11, col: 9, row: 8, 
        movementPattern: 'knight', onField: true, hasBall: false },
      
      // Away Team
      { id: 'a1', team: 'away', name: 'Martinez', position: 'GK', number: 1, col: 18, row: 5, 
        movementPattern: 'king', onField: true, hasBall: false },
      { id: 'a2', team: 'away', name: 'Garcia', position: 'LB', number: 2, col: 16, row: 2, 
        movementPattern: 'bishop', onField: true, hasBall: false },
      { id: 'a3', team: 'away', name: 'Rodriguez', position: 'CB', number: 4, col: 16, row: 4, 
        movementPattern: 'rook', onField: true, hasBall: false },
      { id: 'a4', team: 'away', name: 'Hernandez', position: 'CB', number: 5, col: 16, row: 6, 
        movementPattern: 'rook', onField: true, hasBall: false },
      { id: 'a5', team: 'away', name: 'Lopez', position: 'RB', number: 3, col: 16, row: 8, 
        movementPattern: 'bishop', onField: true, hasBall: false },
      { id: 'a6', team: 'away', name: 'Gonzalez', position: 'CDM', number: 6, col: 14, row: 5, 
        movementPattern: 'knight', onField: true, hasBall: false },
      { id: 'a7', team: 'away', name: 'Perez', position: 'CM', number: 8, col: 12, row: 4, 
        movementPattern: 'queen', onField: true, hasBall: false },
      { id: 'a8', team: 'away', name: 'Sanchez', position: 'CM', number: 10, col: 12, row: 6, 
        movementPattern: 'queen', onField: true, hasBall: false },
      { id: 'a9', team: 'away', name: 'Diaz', position: 'LW', number: 7, col: 10, row: 2, 
        movementPattern: 'knight', onField: true, hasBall: false },
      { id: 'a10', team: 'away', name: 'Torres', position: 'ST', number: 9, col: 10, row: 5, 
        movementPattern: 'rook', onField: true, hasBall: false },
      { id: 'a11', team: 'away', name: 'Ramirez', position: 'RW', number: 11, col: 10, row: 8, 
        movementPattern: 'knight', onField: true, hasBall: false }
    ];
    
    // Initial ball position
    const ball = { col: 9, row: 5 }; // With the home team striker
    
    // Return game state object
    return {
      players,
      ball,
      score: { home: 0, away: 0 },
      turnCounter: 1,
      lastFoul: null,
      lastInjury: null,
      
      // Helper methods to get information about the game state
      playersOnSquare: (col, row) => {
        return players.filter(p => p.col === col && p.row === row && p.onField);
      },
      
      isBallOnSquare: (col, row) => {
        return ball.col === col && ball.row === row;
      },
      
      getPossibleMoves: (playerId) => {
        const player = players.find(p => p.id === playerId);
        if (!player || !player.onField) return [];
        
        // Generate possible moves based on movement pattern
        return generatePossibleMoves(player, players);
      },
      
      canPass: (playerId) => {
        const player = players.find(p => p.id === playerId);
        return player && player.hasBall;
      },
      
      canShoot: (playerId) => {
        const player = players.find(p => p.id === playerId);
        if (!player || !player.hasBall) return false;
        
        // Check if player is in shooting range (within 3 squares of opposing goal)
        if (player.team === 'home') {
          return player.col >= 16;
        } else {
          return player.col <= 3;
        }
      }
    };
  };
  
  // Helper to generate possible moves for a player
  const generatePossibleMoves = (player, allPlayers) => {
    const { col, row, movementPattern } = player;
    const possibleMoves = [];
    
    // Apply movement reduction from injuries
    const moveReduction = player.movementReduction || 0;
    
    // Generate moves based on chess piece pattern
    switch (movementPattern) {
      case 'king': // Goalkeeper (1 square in any direction)
        // Can move 1 square in any direction
        for (let dCol = -1; dCol <= 1; dCol++) {
          for (let dRow = -1; dRow <= 1; dRow++) {
            if (dCol === 0 && dRow === 0) continue; // Skip current position
            
            const newCol = col + dCol;
            const newRow = row + dRow;
            
            // Check if new position is within bounds
            if (isInBounds(newCol, newRow)) {
              possibleMoves.push({ col: newCol, row: newRow });
            }
          }
        }
        
        // Special goalkeeper diving move (2 squares when ball is in shooting range)
        if (player.position === 'GK') {
          // Check if ball is in shooting range
          const ballOwner = allPlayers.find(p => p.hasBall);
          if (ballOwner && isInShootingRange(ballOwner)) {
            // Add diving moves (2 squares laterally)
            if (isInBounds(col, row - 2)) possibleMoves.push({ col, row: row - 2 });
            if (isInBounds(col, row + 2)) possibleMoves.push({ col, row: row + 2 });
          }
        }
        break;
        
      case 'rook': // Defenders and Strikers (horizontal and vertical)
        // Max movement range (reduced if injured)
        const rookRange = player.position.includes('B') ? 3 : 4; // CBs and FBs have 3, Strikers have 4
        const adjustedRookRange = Math.max(1, rookRange - moveReduction);
        
        // Horizontal and vertical moves
        for (let dir = 0; dir < 4; dir++) {
          const dCol = dir === 0 ? 1 : dir === 1 ? -1 : 0;
          const dRow = dir === 2 ? 1 : dir === 3 ? -1 : 0;
          
          for (let i = 1; i <= adjustedRookRange; i++) {
            const newCol = col + (dCol * i);
            const newRow = row + (dRow * i);
            
            if (isInBounds(newCol, newRow)) {
              possibleMoves.push({ col: newCol, row: newRow });
            } else {
              break; // Stop in this direction if out of bounds
            }
          }
        }
        
        // Striker special move (1 square diagonally)
        if (player.position === 'ST') {
          for (let dCol = -1; dCol <= 1; dCol += 2) {
            for (let dRow = -1; dRow <= 1; dRow += 2) {
              const newCol = col + dCol;
              const newRow = row + dRow;
              
              if (isInBounds(newCol, newRow)) {
                possibleMoves.push({ col: newCol, row: newRow });
              }
            }
          }
        }
        break;
        
      case 'bishop': // Full backs (diagonal)
        // Max movement range (reduced if injured)
        const bishopRange = 3; // Full backs have 3 squares range
        const adjustedBishopRange = Math.max(1, bishopRange - moveReduction);
        
        // Diagonal moves
        for (let dir = 0; dir < 4; dir++) {
          const dCol = dir < 2 ? 1 : -1;
          const dRow = dir % 2 === 0 ? 1 : -1;
          
          for (let i = 1; i <= adjustedBishopRange; i++) {
            const newCol = col + (dCol * i);
            const newRow = row + (dRow * i);
            
            if (isInBounds(newCol, newRow)) {
              possibleMoves.push({ col: newCol, row: newRow });
            } else {
              break; // Stop in this direction if out of bounds
            }
          }
        }
        
        // Full back special move (1 square horizontally)
        if (player.position.includes('B')) {
          if (isInBounds(col + 1, row)) possibleMoves.push({ col: col + 1, row });
          if (isInBounds(col - 1, row)) possibleMoves.push({ col: col - 1, row });
        }
        break;
        
      case 'knight': // Wingers and defensive midfielders (L-shape)
        // Knight moves (L-shape)
        const knightMoves = [
          { dCol: 2, dRow: 1 }, { dCol: 2, dRow: -1 },
          { dCol: -2, dRow: 1 }, { dCol: -2, dRow: -1 },
          { dCol: 1, dRow: 2 }, { dCol: 1, dRow: -2 },
          { dCol: -1, dRow: 2 }, { dCol: -1, dRow: -2 }
        ];
        
        for (const move of knightMoves) {
          const newCol = col + move.dCol;
          const newRow = row + move.dRow;
          
          if (isInBounds(newCol, newRow)) {
            possibleMoves.push({ col: newCol, row: newRow });
          }
        }
        
        // Winger special move (2 squares horizontally)
        if (player.position.includes('W')) {
          if (isInBounds(col + 2, row)) possibleMoves.push({ col: col + 2, row });
          if (isInBounds(col - 2, row)) possibleMoves.push({ col: col - 2, row });
        }
        
        // Defensive midfielder special move (1 square in any direction)
        if (player.position.includes('DM')) {
          for (let dCol = -1; dCol <= 1; dCol++) {
            for (let dRow = -1; dRow <= 1; dRow++) {
              if (dCol === 0 && dRow === 0) continue; // Skip current position
              
              const newCol = col + dCol;
              const newRow = row + dRow;
              
              if (isInBounds(newCol, newRow)) {
                possibleMoves.push({ col: newCol, row: newRow });
              }
            }
          }
        }
        break;
        
      case 'queen': // Midfielders (any direction)
        // Max movement range (reduced if injured)
        const queenRange = player.position.includes('AM') ? 3 : 2; // AM has 3, CM has 2
        const adjustedQueenRange = Math.max(1, queenRange - moveReduction);
        
        // Horizontal, vertical, and diagonal moves
        for (let dCol = -1; dCol <= 1; dCol++) {
          for (let dRow = -1; dRow <= 1; dRow++) {
            if (dCol === 0 && dRow === 0) continue; // Skip current position
            
            for (let i = 1; i <= adjustedQueenRange; i++) {
              const newCol = col + (dCol * i);
              const newRow = row + (dRow * i);
              
              if (isInBounds(newCol, newRow)) {
                possibleMoves.push({ col: newCol, row: newRow });
              } else {
                break; // Stop in this direction if out of bounds
              }
            }
          }
        }
        break;
    }
    
    return possibleMoves;
  };
  
  // Helper function to check if a position is within the board boundaries
  const isInBounds = (col, row) => {
    return col >= 0 && col < 20 && row >= 0 && row < 10;
  };
  
  // Execute a pass between two players
  const executePass = (fromPlayer, toPlayer) => {
    setGameState(prevState => {
      // Create a deep copy of the state
      const newState = { ...prevState };
      
      // Find the players in the new state
      const fromPlayerInState = newState.players.find(p => p.id === fromPlayer.id);
      const toPlayerInState = newState.players.find(p => p.id === toPlayer.id);
      
      // Transfer ball possession
      if (fromPlayerInState.hasBall) {
        fromPlayerInState.hasBall = false;
        toPlayerInState.hasBall = true;
        
        // Update ball position
        newState.ball = { col: toPlayerInState.col, row: toPlayerInState.row };
        
        // Check for interception (simplified)
        // In a full implementation, you would check for opponents along the path
      }
      
      return newState;
    });
  }; = row + dRow;
            
            // Check if new position is within bounds
            if (isInBounds(newCol, newRow)) {
              possibleMoves.push({ col: newCol, row: newRow });
            }
          }
        }
        
        // Special goalkeeper diving move (2 squares when ball is in shooting range)
        if (player.position === 'GK') {
          // Check if ball is in shooting range
          const ballOwner = allPlayers.find(p => p.hasBall);
          if (ballOwner && isInShootingRange(ballOwner)) {
            // Add diving moves (2 squares laterally)
            if (isInBounds(col, row - 2)) possibleMoves.push({ col, row: row - 2 });
            if (isInBounds(col, row + 2)) possibleMoves.push({ col, row: row + 2 });
          }
        }
        break;
        
      case 'rook': // Defenders and Strikers (horizontal and vertical)
        // Max movement range (reduced if injured)
        const rookRange = player.position.includes('B') ? 3 : 4; // CBs and FBs have 3, Strikers have 4
        const adjustedRookRange = Math.max(1, rookRange - moveReduction);
        
        // Horizontal and vertical moves
        for (let dir = 0; dir < 4; dir++) {
          const dCol = dir === 0 ? 1 : dir === 1 ? -1 : 0;
          const dRow = dir === 2 ? 1 : dir === 3 ? -1 : 0;
          
          for (let i = 1; i <= adjustedRookRange; i++) {
            const newCol = col + (dCol * i);
            const newRow
  };
  
  // Function to check if move is valid
  const canMoveToSquare = (player, col, row) => {
    return possibleMoves.some(move => move.col === col && move.row === row);
  };
  
  // Function to move a player
  const movePlayer = (playerId, col, row) => {
    setGameState(prevState => {
      // Create a deep copy of the state and update player position
      const newState = { ...prevState };
      const player = newState.players.find(p => p.id === playerId);
      
      // If player has the ball, move the ball too
      if (player.hasBall) {
        newState.ball = { col, row };
      }
      
      // Update player position
      player.col = col;
      player.row = row;
      
      // Check for possession changes
      checkPossessionChange(newState, col, row);
      
      // Check for fouls
      checkForFouls(newState, col, row);
      
      return newState;
    });
  };
  
  // Helper functions for foul management
  const issueYellowCard = (team) => {
    // Find a random player from the team to issue a yellow card to
    const eligiblePlayers = gameState.players.filter(
      p => p.team === team && !p.hasRedCard && p.onField
    );
    
    if (eligiblePlayers.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
      const player = eligiblePlayers[randomIndex];
      
      if (player.hasYellowCard) {
        // Second yellow = red card
        player.hasRedCard = true;
        player.onField = false; // Player is sent off
        
        gameState.lastFoul = {
          type: 'second yellow',
          team,
          result: 'red card',
          player: player.name
        };
      } else {
        player.hasYellowCard = true;
        
        gameState.lastFoul = {
          type: 'yellow card',
          team,
          result: 'yellow card',
          player: player.name
        };
      }
    }
  };
  
  const issueRedCard = (team) => {
    // Find a random player from the team to issue a red card to
    const eligiblePlayers = gameState.players.filter(
      p => p.team === team && !p.hasRedCard && p.onField
    );
    
    if (eligiblePlayers.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
      const player = eligiblePlayers[randomIndex];
      
      player.hasRedCard = true;
      player.onField = false; // Player is sent off
      
      gameState.lastFoul = {
        type: 'red card',
        team,
        result: 'red card',
        player: player.name
      };
    }
  };
  
  const causeInjury = (team, col, row) => {
    // Find a player on the square to injure
    const playersOnSquare = gameState.playersOnSquare(col, row)
      .filter(p => p.team === team && p.onField);
    
    if (playersOnSquare.length > 0) {
      const randomIndex = Math.floor(Math.random() * playersOnSquare.length);
      const player = playersOnSquare[randomIndex];
      
      // Determine injury severity
      const severityRoll = Math.random();
      let severity;
      
      if (severityRoll < 0.6) {
        // 60% chance of minor injury
        severity = 'minor';
        player.movementReduction = 1; // Reduce movement by 1 square
      } else if (severityRoll < 0.9) {
        // 30% chance of serious injury
        severity = 'serious';
        player.movementReduction = 2; // Reduce movement by 2 squares
        
        // 50% chance the player needs to be substituted
        if (Math.random() < 0.5) {
          player.needsSubstitution = true;
        }
      } else {
        // 10% chance of season-ending injury
        severity = 'season ending';
        player.onField = false;
        player.availableNextMatch = false;
      }
      
      player.injury = {
        severity,
        turnOccurred: gameState.turnCounter
      };
      
      gameState.lastInjury = {
        player: player.name,
        team,
        severity
      };
    }
  };
  
  // Function to handle shooting at goal
  const handleShoot = () => {
    if (!selectedPlayer || !selectedPlayer.hasBall) return;
    
    // Check if player is in shooting range
    const inShootingRange = isInShootingRange(selectedPlayer);
    
    if (!inShootingRange) {
      // Too far to shoot
      alert("Too far from goal to shoot!");
      return;
    }
    
    // Determine which goal to shoot at
    const targetGoalCol = selectedPlayer.team === 'home' ? 19 : 0;
    const targetGoalRows = [4, 5, 6]; // The three squares that form the goal
    
    // Choose a random target within the goal
    const targetRow = targetGoalRows[Math.floor(Math.random() * targetGoalRows.length)];
    
    // Check for defenders and goalkeeper in the way
    const defendingTeam = selectedPlayer.team === 'home' ? 'away' : 'home';
    const defendersInGoal = gameState.players.filter(p => 
      p.team === defendingTeam && 
      p.col === targetGoalCol && 
      targetGoalRows.includes(p.row) &&
      p.onField
    );
    
    const goalkeepersInTarget = defendersInGoal.filter(p => p.position === 'GK');
    const totalDefenders = defendersInGoal.length;
    
    // Calculate shot success probability
    let successProbability = 0.5; // Base 50% chance
    
    // Reduce by 15% for each defender
    successProbability -= totalDefenders * 0.15;
    
    // Reduce by 25% if goalkeeper is positioned correctly
    if (goalkeepersInTarget.some(gk => gk.row === targetRow)) {
      successProbability -= 0.25;
    }
    
    // Minimum 5% chance to score
    successProbability = Math.max(0.05, successProbability);
    
    // Attempt the shot
    const shotResult = Math.random() < successProbability;
    
    if (shotResult) {
      // Goal scored!
      if (selectedPlayer.team === 'home') {
        gameState.score.home += 1;
      } else {
        gameState.score.away += 1;
      }
      
      // Reset positions for kickoff
      resetToKickoff(defendingTeam); // Defending team will kick off
    } else {
      // Shot saved or missed
      // Give ball to goalkeeper
      const goalkeeper = gameState.players.find(p => 
        p.team === defendingTeam && 
        p.position === 'GK' &&
        p.onField
      );
      
      if (goalkeeper) {
        gameState.players.forEach(p => { p.hasBall = false; });
        goalkeeper.hasBall = true;
        gameState.ball = { col: goalkeeper.col, row: goalkeeper.row };
      } else {
        // No goalkeeper (unlikely), place ball in goal area
        gameState.ball = { col: targetGoalCol, row: 5 }; // Center of goal
        // No player has possession
      }
    }
    
    // End turn after a shot
    endTurn();
  };
  
  // Helper to check if a player is in shooting range
  const isInShootingRange = (player) => {
    const goalCol = player.team === 'home' ? 19 : 0;
    
    // Can shoot from within 3 columns of goal (columns 16-18 for home, 1-3 for away)
    if (player.team === 'home') {
      return player.col >= 16 && player.col < 19;
    } else {
      return player.col > 0 && player.col <= 3;
    }
  };
  
  // Function to handle passing the ball
  const handlePass = () => {
    if (!selectedPlayer || !selectedPlayer.hasBall) return;
    
    // Find teammates to pass to
    const teammates = gameState.players.filter(p => 
      p.team === selectedPlayer.team && 
      p.id !== selectedPlayer.id &&
      p.onField
    );
    
    // Calculate pass destinations based on distance (could be more complex)
    const passDestinations = teammates.map(teammate => ({
      player: teammate,
      distance: calculateDistance(selectedPlayer, teammate),
      coordinates: { col: teammate.col, row: teammate.row }
    })).filter(dest => dest.distance <= 5); // Maximum pass distance is 5 squares
    
    // If no valid pass destinations
    if (passDestinations.length === 0) {
      alert("No teammates in range to pass to!");
      return;
    }
    
    // Allow user to select a pass destination
    setPassMode(true);
    setPossiblePasses(passDestinations);
  };
  
  // Helper to calculate distance between two players
  const calculateDistance = (player1, player2) => {
    const colDiff = Math.abs(player1.col - player2.col);
    const rowDiff = Math.abs(player1.row - player2.row);
    return Math.sqrt(colDiff * colDiff + rowDiff * rowDiff);
  };
  
  // Reset positions for kickoff after a goal
  const resetToKickoff = (kickoffTeam) => {
    // Position players in a kickoff formation
    const newPositions = generateKickoffPositions(kickoffTeam);
    
    // Update player positions
    gameState.players.forEach(player => {
      const position = newPositions.find(p => 
        p.team === player.team && p.position === player.position
      );
      
      if (position && player.onField) {
        player.col = position.col;
        player.row = position.row;
        player.hasBall = position.hasBall || false;
      }
    });
    
    // Update ball position
    const ballCarrier = gameState.players.find(p => p.hasBall);
    if (ballCarrier) {
      gameState.ball = { col: ballCarrier.col, row: ballCarrier.row };
    } else {
      // Default to center circle
      gameState.ball = { col: 10, row: 5 };
    }
    
    // Update current team to kickoff team
    setCurrentTeam(kickoffTeam);
    setMovesRemaining(3);
  };
  
  // Generate positions for kickoff
  const generateKickoffPositions = (kickoffTeam) => {
    // This would return an array of positions for all players
    // Example structure (simplified):
    return [
      // Home team positions
      { team: 'home', position: 'GK', col: 1, row: 5 },
      { team: 'home', position: 'LB', col: 3, row: 3 },
      { team: 'home', position: 'CB', col: 3, row: 5 },
      { team: 'home', position: 'RB', col: 3, row: 7 },
      // ... midfielders and attackers
      
      // Away team positions
      { team: 'away', position: 'GK', col: 18, row: 5 },
      { team: 'away', position: 'LB', col: 16, row: 3 },
      { team: 'away', position: 'CB', col: 16, row: 5 },
      { team: 'away', position: 'RB', col: 16, row: 7 },
      // ... midfielders and attackers
      
      // Ball carrier at kickoff
      { team: kickoffTeam, position: 'CM', col: 10, row: 5, hasBall: true }
    ];
  };
  
  // Function to end the current turn
  const endTurn = () => {
    setCurrentTeam(prev => prev === 'home' ? 'away' : 'home');
    setMovesRemaining(3);
    setSelectedPlayer(null);
    setPossibleMoves([]);
    
    // Increment turn counter
    setGameState(prev => ({
      ...prev,
      turnCounter: prev.turnCounter + 1
    }));
  };
  
  // Function to check for ball possession changes
  const checkPossessionChange = (gameState, col, row) => {
    const playersOnSquare = gameState.playersOnSquare(col, row);
    const homeCount = playersOnSquare.filter(p => p.team === 'home').length;
    const awayCount = playersOnSquare.filter(p => p.team === 'away').length;
    
    // Team with more players gets the ball
    if (gameState.ball.col === col && gameState.ball.row === row) {
      if (homeCount > awayCount) {
        // Give ball to a home player
        const homePlayer = playersOnSquare.find(p => p.team === 'home');
        if (homePlayer) {
          gameState.players.forEach(p => { p.hasBall = false; });
          homePlayer.hasBall = true;
        }
      } else if (awayCount > homeCount) {
        // Give ball to an away player
        const awayPlayer = playersOnSquare.find(p => p.team === 'away');
        if (awayPlayer) {
          gameState.players.forEach(p => { p.hasBall = false; });
          awayPlayer.hasBall = true;
        }
      }
      // If equal, ball remains where it is but no player has possession
    }
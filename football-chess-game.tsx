import React, { useState } from 'react';

const FootballChessGame = () => {
  // Game state management
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentTeam, setCurrentTeam] = useState('home');
  const [movesRemaining, setMovesRemaining] = useState(3);
  const [gameBoard, setGameBoard] = useState(createInitialBoard());
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [matchTime, setMatchTime] = useState(15); // Simulated match time in minutes
  const [showMovePatterns, setShowMovePatterns] = useState(false);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [gameLog, setGameLog] = useState([
    { text: "Match started!", type: "info" },
    { text: "Home team to play first", type: "info" }
  ]);

  // Function to create initial board state
  function createInitialBoard() {
    const board = Array(20).fill().map(() => Array(10).fill(null));
    
    // Place some example players
    // Home team (red)
    board[1][5] = { team: 'home', position: 'GK', player: 'Alisson', number: 1, hasBall: false };
    board[3][3] = { team: 'home', position: 'CB', player: 'Van Dijk', number: 4, hasBall: false };
    board[3][7] = { team: 'home', position: 'CB', player: 'Konate', number: 5, hasBall: false };
    board[5][5] = { team: 'home', position: 'CDM', player: 'Fabinho', number: 6, hasBall: false };
    board[7][3] = { team: 'home', position: 'CM', player: 'Henderson', number: 14, hasBall: false };
    board[7][7] = { team: 'home', position: 'CM', player: 'Thiago', number: 6, hasBall: false };
    board[9][5] = { team: 'home', position: 'ST', player: 'Nunez', number: 9, hasBall: true };
    
    // Away team (blue)
    board[18][5] = { team: 'away', position: 'GK', player: 'Ederson', number: 31, hasBall: false };
    board[16][3] = { team: 'away', position: 'CB', player: 'Dias', number: 3, hasBall: false };
    board[16][7] = { team: 'away', position: 'CB', player: 'Stones', number: 5, hasBall: false };
    board[14][5] = { team: 'away', position: 'CDM', player: 'Rodri', number: 16, hasBall: false };
    board[12][3] = { team: 'away', position: 'CM', player: 'De Bruyne', number: 17, hasBall: false };
    board[12][7] = { team: 'away', position: 'CM', player: 'Gundogan', number: 8, hasBall: false };
    board[10][5] = { team: 'away', position: 'ST', player: 'Haaland', number: 9, hasBall: false };
    
    return board;
  }

  // Find the ball position
  const getBallPosition = () => {
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 10; y++) {
        if (gameBoard[x][y] && gameBoard[x][y].hasBall) {
          return { x, y };
        }
      }
    }
    return null;
  };

  // Generate possible moves based on player position
  const generatePossibleMoves = (x, y) => {
    if (!gameBoard[x][y]) return [];
    
    const player = gameBoard[x][y];
    const moves = [];
    
    // Different movement patterns based on position
    switch (player.position) {
      case 'GK': // Goalkeeper moves like King in chess (1 square any direction)
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            const newX = x + dx;
            const newY = y + dy;
            if (isValidPosition(newX, newY)) {
              moves.push({ x: newX, y: newY });
            }
          }
        }
        break;
      
      case 'CB': // Center backs move like Rooks (horizontal and vertical)
        // Horizontal
        for (let i = 1; i <= 3; i++) { // Up to 3 squares
          if (isValidPosition(x+i, y)) moves.push({ x: x+i, y });
          if (isValidPosition(x-i, y)) moves.push({ x: x-i, y });
        }
        // Vertical
        for (let i = 1; i <= 3; i++) {
          if (isValidPosition(x, y+i)) moves.push({ x, y: y+i });
          if (isValidPosition(x, y-i)) moves.push({ x, y: y-i });
        }
        break;
      
      case 'CDM': // Defensive midfielders move like Knights (L-shape)
        const knightMoves = [
          {dx: 2, dy: 1}, {dx: 2, dy: -1},
          {dx: -2, dy: 1}, {dx: -2, dy: -1},
          {dx: 1, dy: 2}, {dx: 1, dy: -2},
          {dx: -1, dy: 2}, {dx: -1, dy: -2}
        ];
        
        knightMoves.forEach(move => {
          const newX = x + move.dx;
          const newY = y + move.dy;
          if (isValidPosition(newX, newY)) {
            moves.push({ x: newX, y: newY });
          }
        });
        break;
      
      case 'CM': // Central midfielders move like Queens but limited to 2 squares
        // Horizontal, vertical, and diagonal
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            for (let i = 1; i <= 2; i++) { // Limited to 2 squares
              const newX = x + (dx * i);
              const newY = y + (dy * i);
              if (isValidPosition(newX, newY)) {
                moves.push({ x: newX, y: newY });
              }
            }
          }
        }
        break;
      
      case 'ST': // Strikers move like Rooks but with longer range (4 squares)
        // Horizontal
        for (let i = 1; i <= 4; i++) {
          if (isValidPosition(x+i, y)) moves.push({ x: x+i, y });
          if (isValidPosition(x-i, y)) moves.push({ x: x-i, y });
        }
        // Vertical
        for (let i = 1; i <= 4; i++) {
          if (isValidPosition(x, y+i)) moves.push({ x, y: y+i });
          if (isValidPosition(x, y-i)) moves.push({ x, y: y-i });
        }
        // Strikers also get 1 square diagonal movement
        if (isValidPosition(x+1, y+1)) moves.push({ x: x+1, y: y+1 });
        if (isValidPosition(x+1, y-1)) moves.push({ x: x+1, y: y-1 });
        if (isValidPosition(x-1, y+1)) moves.push({ x: x-1, y: y+1 });
        if (isValidPosition(x-1, y-1)) moves.push({ x: x-1, y: y-1 });
        break;
      
      default:
        // Default movement (2 squares in any direction)
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;
            for (let i = 1; i <= 2; i++) {
              const newX = x + (dx * i);
              const newY = y + (dy * i);
              if (isValidPosition(newX, newY)) {
                moves.push({ x: newX, y: newY });
              }
            }
          }
        }
    }
    
    return moves;
  };

  // Check if a position is valid on the board
  const isValidPosition = (x, y) => {
    return x >= 0 && x < 20 && y >= 0 && y < 10;
  };

  // Handle player selection
  const handlePlayerSelect = (x, y) => {
    const player = gameBoard[x][y];
    
    // Can only select players from current team
    if (player && player.team === currentTeam) {
      setSelectedPlayer({ x, y, ...player });
      const moves = generatePossibleMoves(x, y);
      setPossibleMoves(moves);
      setShowMovePatterns(true);
    } else if (selectedPlayer && possibleMoves.some(move => move.x === x && move.y === y)) {
      // Move player to this square
      movePlayer(selectedPlayer.x, selectedPlayer.y, x, y);
    } else {
      // Deselect if clicking elsewhere
      setSelectedPlayer(null);
      setPossibleMoves([]);
      setShowMovePatterns(false);
    }
  };

  // Move a player
  const movePlayer = (fromX, fromY, toX, toY) => {
    // Create a deep copy of the board
    const newBoard = JSON.parse(JSON.stringify(gameBoard));
    const player = newBoard[fromX][fromY];
    
    // Handle ball movement if player has the ball
    if (player.hasBall) {
      player.hasBall = false;
      player.hadBall = true; // Mark that this player had the ball (for pass/shoot options)
    }
    
    // Move player to new position
    newBoard[toX][toY] = player;
    newBoard[fromX][fromY] = null;
    
    // Handle ball possession based on players in the square
    if (player.hadBall) {
      // Player moved with the ball
      player.hasBall = true;
      delete player.hadBall;
      
      // Log the move
      addToGameLog(`${player.player} moved with the ball`, "move");
    } else {
      // Log regular move
      addToGameLog(`${player.player} moved to a new position`, "move");
    }
    
    // Update game state
    setGameBoard(newBoard);
    setSelectedPlayer(null);
    setPossibleMoves([]);
    setShowMovePatterns(false);
    
    // Decrement moves remaining
    setMovesRemaining(prev => prev - 1);
    
    // Check if turn is over
    if (movesRemaining <= 1) {
      endTurn();
    }
  };

  // Handle pass action
  const handlePass = () => {
    if (!selectedPlayer || !selectedPlayer.hasBall) return;
    
    // Add to game log
    addToGameLog(`${selectedPlayer.player} is looking to pass`, "action");
    
    // In a full implementation, this would show valid pass targets
    alert(`Pass functionality would be implemented here. 
Player ${selectedPlayer.player} would be able to pass to teammates within range.`);
  };

  // Handle shoot action
  const handleShoot = () => {
    if (!selectedPlayer || !selectedPlayer.hasBall) return;
    
    // Check if in shooting range
    const isInShootingRange = 
      (selectedPlayer.team === 'home' && selectedPlayer.x >= 16) || 
      (selectedPlayer.team === 'away' && selectedPlayer.x <= 3);
    
    if (!isInShootingRange) {
      addToGameLog(`${selectedPlayer.player} is too far from goal to shoot`, "warning");
      return;
    }
    
    // Simple shooting simulation
    const successChance = 0.4; // 40% chance to score
    
    if (Math.random() < successChance) {
      // Goal scored!
      if (selectedPlayer.team === 'home') {
        setScore(prev => ({ ...prev, home: prev.home + 1 }));
        addToGameLog(`GOAL! ${selectedPlayer.player} scores for the home team!`, "goal");
      } else {
        setScore(prev => ({ ...prev, away: prev.away + 1 }));
        addToGameLog(`GOAL! ${selectedPlayer.player} scores for the away team!`, "goal");
      }
    } else {
      // Shot missed or saved
      addToGameLog(`${selectedPlayer.player}'s shot is saved by the goalkeeper!`, "action");
    }
    
    // End turn after shooting
    endTurn();
  };

  // Handle end turn
  const handleEndTurn = () => {
    endTurn();
  };

  // End current turn and switch teams
  const endTurn = () => {
    setCurrentTeam(prev => prev === 'home' ? 'away' : 'home');
    setMovesRemaining(3);
    setSelectedPlayer(null);
    setPossibleMoves([]);
    setShowMovePatterns(false);
    
    // Increment match time
    setMatchTime(prev => prev + 5); // Add 5 minutes of game time per turn
    
    // Log turn change
    addToGameLog(`${currentTeam === 'home' ? 'Away' : 'Home'} team's turn`, "info");
  };

  // Add message to game log
  const addToGameLog = (text, type = "info") => {
    setGameLog(prev => [...prev, { text, type }]);
  };

  // Determine if a square is a goal
  const isGoalSquare = (x, y) => {
    return (
      (x === 0 && y >= 4 && y <= 6) || // Home goal
      (x === 19 && y >= 4 && y <= 6)   // Away goal
    );
  };

  // Determine if a move is valid
  const isMoveValid = (x, y) => {
    return possibleMoves.some(move => move.x === x && move.y === y);
  };

  // Generate square classes based on state
  const getSquareClasses = (x, y) => {
    let classes = "square";
    
    // Add zone styling
    if (x < 5) classes += " defensive-zone";
    else if (x < 10) classes += " midfield-defensive";
    else if (x < 15) classes += " midfield-attacking";
    else classes += " attacking-zone";
    
    // Add goal area styling
    if (isGoalSquare(x, y)) classes += " goal-area";
    
    // Highlight possible moves
    if (showMovePatterns && isMoveValid(x, y)) {
      classes += " possible-move";
    }
    
    // Highlight selected player
    if (selectedPlayer && selectedPlayer.x === x && selectedPlayer.y === y) {
      classes += " selected";
    }
    
    return classes;
  };

  return (
    <div className="football-chess-game">
      <div className="game-header">
        <div className="score-display">
          <div className="team home">Home</div>
          <div className="score">{score.home} - {score.away}</div>
          <div className="team away">Away</div>
        </div>
        <div className="match-info">
          <div className="match-time">{matchTime}'</div>
          <div className="current-team">{currentTeam === 'home' ? 'Home' : 'Away'} Team's Turn</div>
          <div className="moves-remaining">Moves: {movesRemaining}</div>
        </div>
      </div>
      
      <div className="game-container">
        <div className="game-board">
          {gameBoard.map((column, x) => (
            column.map((cell, y) => (
              <div 
                key={`${x}-${y}`} 
                className={getSquareClasses(x, y)}
                onClick={() => handlePlayerSelect(x, y)}
              >
                {cell && (
                  <div className={`player-token ${cell.team}`}>
                    <div className="position">{cell.position}</div>
                    <div className="player-number">{cell.number}</div>
                    {cell.hasBall && <div className="ball"></div>}
                  </div>
                )}
                {!cell && possibleMoves.some(move => move.x === x && move.y === y) && (
                  <div className="move-indicator"></div>
                )}
              </div>
            ))
          ))}
        </div>
        
        <div className="game-sidebar">
          <div className="player-details">
            {selectedPlayer ? (
              <>
                <h3>{selectedPlayer.player}</h3>
                <div className="player-position">{selectedPlayer.position}</div>
                <div className="player-actions">
                  <button 
                    className="action-button pass"
                    onClick={handlePass}
                    disabled={!selectedPlayer.hasBall}
                  >
                    Pass
                  </button>
                  <button 
                    className="action-button shoot"
                    onClick={handleShoot}
                    disabled={!selectedPlayer.hasBall}
                  >
                    Shoot
                  </button>
                </div>
              </>
            ) : (
              <div className="no-selection">Select a player</div>
            )}
          </div>
          
          <div className="game-controls">
            <button 
              className="end-turn-button"
              onClick={handleEndTurn}
            >
              End Turn ({movesRemaining} left)
            </button>
          </div>
          
          <div className="game-log">
            <h3>Match Events</h3>
            <div className="log-entries">
              {gameLog.slice(-6).map((entry, index) => (
                <div key={index} className={`log-entry ${entry.type}`}>
                  {entry.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .football-chess-game {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .score-display {
          display: flex;
          align-items: center;
          font-size: 24px;
          font-weight: bold;
        }
        
        .team {
          padding: 8px 12px;
          border-radius: 4px;
        }
        
        .team.home {
          background-color: #ef5350;
          color: white;
        }
        
        .team.away {
          background-color: #42a5f5;
          color: white;
        }
        
        .score {
          margin: 0 15px;
        }
        
        .match-info {
          text-align: right;
        }
        
        .match-time {
          font-size: 20px;
          font-weight: bold;
        }
        
        .current-team {
          font-size: 16px;
          margin: 5px 0;
        }
        
        .moves-remaining {
          font-size: 14px;
          color: #555;
        }
        
        .game-container {
          display: flex;
          gap: 20px;
        }
        
        .game-board {
          display: grid;
          grid-template-columns: repeat(20, 30px);
          grid-template-rows: repeat(10, 30px);
          gap: 1px;
          background-color: #424242;
        }
        
        .square {
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          cursor: pointer;
        }
        
        .defensive-zone {
          background-color: #81c784;
        }
        
        .midfield-defensive {
          background-color: #a5d6a7;
        }
        
        .midfield-attacking {
          background-color: #c8e6c9;
        }
        
        .attacking-zone {
          background-color: #e8f5e9;
        }
        
        .goal-area {
          background-color: #ce93d8;
          border: 2px solid #9c27b0;
        }
        
        .possible-move {
          box-shadow: inset 0 0 0 2px #ffeb3b;
        }
        
        .selected {
          box-shadow: inset 0 0 0 3px #ff9800;
        }
        
        .player-token {
          width: 26px;
          height: 26px;
          border-radius: 13px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 10px;
          position: relative;
        }
        
        .player-token.home {
          background-color: #ef5350;
          color: white;
        }
        
        .player-token.away {
          background-color: #42a5f5;
          color: white;
        }
        
        .position {
          font-weight: bold;
          font-size: 9px;
          line-height: 1;
        }
        
        .player-number {
          font-size: 8px;
          line-height: 1;
        }
        
        .ball {
          position: absolute;
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 4px;
          border: 1px solid black;
          top: -5px;
          right: -5px;
        }
        
        .move-indicator {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background-color: #ffeb3b;
        }
        
        .game-sidebar {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .player-details {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          min-height: 150px;
        }
        
        .player-actions {
          display: flex;
          gap: 10px;
          margin-top: 15px;
        }
        
        .action-button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }
        
        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .action-button.pass {
          background-color: #42a5f5;
          color: white;
        }
        
        .action-button.shoot {
          background-color: #ef5350;
          color: white;
        }
        
        .no-selection {
          color: #757575;
          font-style: italic;
        }
        
        .game-controls {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .end-turn-button {
          width: 100%;
          padding: 10px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
        }
        
        .game-log {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex: 1;
          overflow: hidden;
        }
        
        .log-entries {
          height: 200px;
          overflow-y: auto;
        }
        
        .log-entry {
          padding: 5px 10px;
          margin-bottom: 5px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .log-entry.info {
          background-color: #e3f2fd;
        }
        
        .log-entry.move {
          background-color: #f5f5f5;
        }
        
        .log-entry.action {
          background-color: #fff8e1;
        }
        
        .log-entry.warning {
          background-color: #fff3e0;
        }
        
        .log-entry.goal {
          background-color: #e8f5e9;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default FootballChessGame;

import React, { useState, useEffect } from 'react';

const FootballChess = () => {
  // Game configuration
  const GRID_WIDTH = 20;
  const GRID_HEIGHT = 10;
  const GOAL_WIDTH = 3;
  
  // Game state
  const [gameState, setGameState] = useState({
    turn: 'home', // 'home' or 'away'
    phase: 'select', // 'select', 'move', 'pass', 'shoot'
    movesRemaining: 3,
    selectedPlayer: null,
    ballPosition: { x: 10, y: 5 }, // Center of field at start
    homeScore: 0,
    awayScore: 0,
    matchTime: 0, // in minutes
    events: [],
    possibleMoves: [],
    lastAction: 'Game starts with kickoff'
  });

  // Define player movement patterns based on chess pieces
  const movementPatterns = {
    goalkeeper: (x, y, team) => {
      // Can move one square in any direction within goal area
      const moves = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          
          const newX = x + dx;
          const newY = y + dy;
          
          // Check if within goalkeeper's area
          if ((team === 'home' && newX >= 0 && newX <= 2 && newY >= 3 && newY <= 6) ||
              (team === 'away' && newX >= 17 && newX <= 19 && newY >= 3 && newY <= 6)) {
            moves.push({ x: newX, y: newY });
          }
        }
      }
      return moves;
    },
    
    defender: (x, y) => {
      // Defenders move like rooks in chess (horizontally and vertically)
      const moves = [];
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, down, left, right
      
      directions.forEach(([dx, dy]) => {
        for (let step = 1; step <= 3; step++) {
          const newX = x + (dx * step);
          const newY = y + (dy * step);
          
          if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            moves.push({ x: newX, y: newY });
          }
        }
      });
      
      return moves;
    },
    
    midfielder: (x, y) => {
      // Midfielders move like queens in chess (all directions)
      const moves = [];
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      
      directions.forEach(([dx, dy]) => {
        for (let step = 1; step <= 3; step++) {
          const newX = x + (dx * step);
          const newY = y + (dy * step);
          
          if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            moves.push({ x: newX, y: newY });
          }
        }
      });
      
      return moves;
    },
    
    winger: (x, y) => {
      // Wingers move like knights plus horizontal movement
      const moves = [];
      
      // Knight moves
      const knightMoves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      
      knightMoves.forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          moves.push({ x: newX, y: newY });
        }
      });
      
      // Horizontal moves
      [[-2, 0], [-1, 0], [1, 0], [2, 0]].forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          moves.push({ x: newX, y: newY });
        }
      });
      
      return moves;
    },
    
    striker: (x, y) => {
      // Strikers move like kings but with 2 squares range
      const moves = [];
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
      ];
      
      directions.forEach(([dx, dy]) => {
        for (let step = 1; step <= 2; step++) {
          const newX = x + (dx * step);
          const newY = y + (dy * step);
          
          if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
            moves.push({ x: newX, y: newY });
          }
        }
      });
      
      return moves;
    }
  };

  // Player data with positions
  const [players, setPlayers] = useState({
    home: [
      { id: 'h1', position: 'GK', x: 0, y: 5, rating: 87, number: 1, type: 'goalkeeper', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'h2', position: 'CB', x: 2, y: 3, rating: 85, number: 4, type: 'defender', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'h3', position: 'CB', x: 2, y: 7, rating: 84, number: 5, type: 'defender', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'h4', position: 'CM', x: 7, y: 5, rating: 85, number: 8, type: 'midfielder', hasBall: false, yellowCards: 1, redCard: false, injured: false },
      { id: 'h5', position: 'CAM', x: 10, y: 5, rating: 88, number: 10, type: 'midfielder', hasBall: true, yellowCards: 0, redCard: false, injured: false },
      { id: 'h6', position: 'LW', x: 7, y: 2, rating: 84, number: 11, type: 'winger', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'h7', position: 'RW', x: 7, y: 8, rating: 83, number: 7, type: 'winger', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'h8', position: 'ST', x: 12, y: 5, rating: 89, number: 9, type: 'striker', hasBall: false, yellowCards: 0, redCard: false, injured: false }
    ],
    away: [
      { id: 'a1', position: 'GK', x: 19, y: 5, rating: 86, number: 1, type: 'goalkeeper', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'a2', position: 'CB', x: 17, y: 3, rating: 84, number: 4, type: 'defender', hasBall: false, yellowCards: 1, redCard: false, injured: false },
      { id: 'a3', position: 'CB', x: 17, y: 7, rating: 82, number: 5, type: 'defender', hasBall: false, yellowCards: 0, redCard: false, injured: true },
      { id: 'a4', position: 'CM', x: 12, y: 5, rating: 83, number: 8, type: 'midfielder', hasBall: false, yellowCards: 1, redCard: false, injured: false },
      { id: 'a5', position: 'CAM', x: 9, y: 5, rating: 87, number: 10, type: 'midfielder', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'a6', position: 'LW', x: 12, y: 2, rating: 82, number: 11, type: 'winger', hasBall: false, yellowCards: 0, redCard: false, injured: false },
      { id: 'a7', position: 'RW', x: 13, y: 8, rating: 84, number: 7, type: 'winger', hasBall: false, yellowCards: 0, redCard: true, injured: false },
      { id: 'a8', position: 'ST', x: 7, y: 5, rating: 91, number: 9, type: 'striker', hasBall: false, yellowCards: 0, redCard: false, injured: false }
    ]
  });

  // Find which player has the ball
  const findBallOwner = () => {
    for (const team of ['home', 'away']) {
      const ballOwner = players[team].find(player => player.hasBall);
      if (ballOwner) return { player: ballOwner, team };
    }
    return null;
  };

  // Get valid moves for a player
  const getValidMoves = (playerId) => {
    const team = players.home.some(p => p.id === playerId) ? 'home' : 'away';
    const player = players[team].find(p => p.id === playerId);
    
    if (!player || player.redCard) return [];
    
    let moves;
    switch(player.type) {
      case 'goalkeeper':
        moves = movementPatterns.goalkeeper(player.x, player.y, team);
        break;
      case 'defender':
        moves = movementPatterns.defender(player.x, player.y);
        break;
      case 'midfielder':
        moves = movementPatterns.midfielder(player.x, player.y);
        break;
      case 'winger':
        moves = movementPatterns.winger(player.x, player.y);
        break;
      case 'striker':
        moves = movementPatterns.striker(player.x, player.y);
        break;
      default:
        moves = [];
    }
    
    // Filter out squares occupied by teammates
    return moves.filter(move => {
      return !players[team].some(p => p.x === move.x && p.y === move.y && !p.redCard);
    });
  };

  // Handle player selection
  const handlePlayerSelect = (playerId) => {
    if (gameState.phase !== 'select' || gameState.movesRemaining <= 0) return;
    
    const team = players.home.some(p => p.id === playerId) ? 'home' : 'away';
    
    // Can only select players from the current turn's team
    if (team !== gameState.turn) return;
    
    const player = players[team].find(p => p.id === playerId);
    
    // Can't select players with red cards
    if (player.redCard) return;
    
    // Get possible moves
    const possibleMoves = getValidMoves(playerId);
    
    setGameState({
      ...gameState,
      selectedPlayer: playerId,
      phase: 'move',
      possibleMoves
    });
  };

  // Handle player movement
  const handleMove = (x, y) => {
    if (gameState.phase !== 'move' || !gameState.selectedPlayer) return;
    
    const team = players.home.some(p => p.id === gameState.selectedPlayer) ? 'home' : 'away';
    const playerIndex = players[team].findIndex(p => p.id === gameState.selectedPlayer);
    
    if (playerIndex === -1) return;
    
    // Check if move is valid
    const isValidMove = gameState.possibleMoves.some(move => move.x === x && move.y === y);
    if (!isValidMove) return;
    
    // Update player position
    const updatedPlayers = {...players};
    updatedPlayers[team][playerIndex].x = x;
    updatedPlayers[team][playerIndex].y = y;
    
    // If player has the ball, move the ball too
    if (updatedPlayers[team][playerIndex].hasBall) {
      setGameState({
        ...gameState,
        ballPosition: { x, y }
      });
    }
    
    setPlayers(updatedPlayers);
    
    // Update game state
    setGameState({
      ...gameState,
      selectedPlayer: null,
      phase: 'select',
      movesRemaining: gameState.movesRemaining - 1,
      lastAction: `${updatedPlayers[team][playerIndex].position} #${updatedPlayers[team][playerIndex].number} moves to (${x},${y})`
    });
    
    // If no moves remaining, switch turns
    if (gameState.movesRemaining <= 1) {
      endTurn();
    }
  };

  // End turn and switch sides
  const endTurn = () => {
    const nextTurn = gameState.turn === 'home' ? 'away' : 'home';
    const newMatchTime = gameState.matchTime + 3;
    
    // Check if match is over (90 minutes)
    if (newMatchTime >= 90) {
      setGameState({
        ...gameState,
        matchTime: 90,
        phase: 'gameOver',
        lastAction: 'Game Over!'
      });
      return;
    }
    
    setGameState({
      ...gameState,
      turn: nextTurn,
      movesRemaining: 3,
      phase: 'select',
      selectedPlayer: null,
      matchTime: newMatchTime
    });
  };

  // Render the game board
  const renderGameBoard = () => {
    // Create grid cells
    const cells = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Determine cell type/color
        let cellClass = "game-cell";
        
        // Add goal areas
        if ((x < 1 || x >= GRID_WIDTH - 1) && y >= (GRID_HEIGHT/2 - GOAL_WIDTH/2) && y < (GRID_HEIGHT/2 + GOAL_WIDTH/2)) {
          cellClass += " goal-area";
        }
        
        // Highlight possible moves
        const isPossibleMove = gameState.possibleMoves.some(move => move.x === x && move.y === y);
        if (isPossibleMove) {
          cellClass += " possible-move";
        }
        
        // Add ball position
        const hasBall = gameState.ballPosition.x === x && gameState.ballPosition.y === y;
        
        cells.push(
          <div 
            key={`${x}-${y}`} 
            className={cellClass}
            onClick={() => handleMove(x, y)}
          >
            {hasBall && <div className="ball">⚽</div>}
            {renderPlayersInCell(x, y)}
          </div>
        );
      }
    }
    
    return (
      <div className="game-board" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, 1fr)` }}>
        {cells}
      </div>
    );
  };

  // Render players in a specific cell
  const renderPlayersInCell = (x, y) => {
    const playersInCell = [];
    
    for (const team of ['home', 'away']) {
      const teamPlayers = players[team].filter(p => p.x === x && p.y === y && !p.redCard);
      
      teamPlayers.forEach(player => {
        const isSelected = player.id === gameState.selectedPlayer;
        
        playersInCell.push(
          <div 
            key={player.id}
            className={`player player-${team} ${isSelected ? 'selected' : ''} ${player.injured ? 'injured' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handlePlayerSelect(player.id);
            }}
          >
            {player.position}
            <span className="player-number">{player.number}</span>
            {player.yellowCards > 0 && <span className="yellow-card">⚠️</span>}
          </div>
        );
      });
    }
    
    return playersInCell;
  };

  // Render game info
  const renderGameInfo = () => {
    return (
      <div className="game-info">
        <div className="score-board">
          <div className={`team-score ${gameState.turn === 'home' ? 'active' : ''}`}>
            HOME: {gameState.homeScore}
          </div>
          <div className="match-time">{gameState.matchTime}'</div>
          <div className={`team-score ${gameState.turn === 'away' ? 'active' : ''}`}>
            AWAY: {gameState.awayScore}
          </div>
        </div>
        <div className="game-status">
          <div className="moves-remaining">Moves: {gameState.movesRemaining}</div>
          <div className="last-action">{gameState.lastAction}</div>
        </div>
        <div className="phase-controls">
          {gameState.phase === 'shoot' && (
            <button className="action-button" onClick={() => handleShoot()}>
              SHOOT!
            </button>
          )}
          {gameState.phase === 'select' && gameState.movesRemaining > 0 && (
            <button className="action-button" onClick={() => handlePass()}>
              PASS
            </button>
          )}
          {gameState.movesRemaining > 0 && (
            <button className="action-button" onClick={() => endTurn()}>
              END TURN
            </button>
          )}
        </div>
      </div>
    );
  };

  // Handle shooting action
  const handleShoot = () => {
    const ballOwner = findBallOwner();
    if (!ballOwner) return;
    
    const { player, team } = ballOwner;
    const opposingTeam = team === 'home' ? 'away' : 'home';
    
    // Check if in shooting range (near goal)
    const nearGoal = (team === 'home' && player.x >= 16) || (team === 'away' && player.x <= 3);
    if (!nearGoal) {
      setGameState({
        ...gameState,
        phase: 'select',
        lastAction: "Too far to shoot!"
      });
      return;
    }
    
    // Simple shooting success calculation
    const goalkeeper = players[opposingTeam].find(p => p.position === 'GK');
    const goalkeepingSkill = goalkeeper ? goalkeeper.rating : 80;
    
    const shotSuccess = Math.random() * 100 + player.rating > goalkeepingSkill + 80;
    
    if (shotSuccess) {
      // Goal scored!
      const newHomeScore = team === 'home' ? gameState.homeScore + 1 : gameState.homeScore;
      const newAwayScore = team === 'away' ? gameState.awayScore + 1 : gameState.awayScore;
      
      setGameState({
        ...gameState,
        homeScore: newHomeScore,
        awayScore: newAwayScore,
        phase: 'select',
        lastAction: `GOAL! ${player.position} #${player.number} scores for ${team.toUpperCase()}!`
      });
      
      // Reset positions after goal
      resetAfterGoal(opposingTeam);
    } else {
      // Shot saved
      setGameState({
        ...gameState,
        phase: 'select',
        lastAction: `Shot saved by ${opposingTeam.toUpperCase()} goalkeeper!`
      });
      
      // Give ball to goalkeeper
      const updatedPlayers = {...players};
      
      // Remove ball from shooter
      const shooterIndex = updatedPlayers[team].findIndex(p => p.id === player.id);
      updatedPlayers[team][shooterIndex].hasBall = false;
      
      // Give ball to goalkeeper
      if (goalkeeper) {
        const goalkeeperIndex = updatedPlayers[opposingTeam].findIndex(p => p.id === goalkeeper.id);
        updatedPlayers[opposingTeam][goalkeeperIndex].hasBall = true;
        
        // Update ball position
        setGameState({
          ...gameState,
          ballPosition: { x: goalkeeper.x, y: goalkeeper.y }
        });
      }
      
      setPlayers(updatedPlayers);
    }
    
    // End turn after shot
    endTurn();
  };

  // Handle passing action
  const handlePass = () => {
    // Simplified pass option - could be expanded for more detail
    setGameState({
      ...gameState,
      phase: 'pass',
      lastAction: "Select a teammate to pass to"
    });
  };

  // Reset after a goal
  const resetAfterGoal = (kickoffTeam) => {
    // Reset positions to kickoff formation
    const updatedPlayers = {...players};
    
    // Find center midfielder to give ball to
    const kickoffPlayer = updatedPlayers[kickoffTeam].find(p => p.position === 'CAM' || p.position === 'CM');
    
    if (kickoffPlayer) {
      // Clear ball from all players
      for (const team of ['home', 'away']) {
        updatedPlayers[team].forEach(p => {
          p.hasBall = false;
        });
      }
      
      // Give ball to kickoff player and move to center
      kickoffPlayer.hasBall = true;
      kickoffPlayer.x = 10;
      kickoffPlayer.y = 5;
      
      // Update ball position
      setGameState({
        ...gameState,
        ballPosition: { x: 10, y: 5 }
      });
    }
    
    setPlayers(updatedPlayers);
  };

  // CSS styling
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    gameContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    gameBoard: {
      display: 'grid',
      gap: '1px',
      backgroundColor: '#388E3C',
      border: '2px solid #FFFFFF',
      aspectRatio: '2/1'
    },
    gameInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '5px'
    }
  };

  // Render component
  return (
    <div style={styles.container}>
      <h1>FootballChess</h1>
      <div style={styles.gameContainer}>
        {renderGameInfo()}
        {renderGameBoard()}
      </div>
      <style jsx>{`
        .game-board {
          display: grid;
          grid-template-columns: repeat(${GRID_WIDTH}, 1fr);
          background-color: #388E3C;
          gap: 1px;
          border: 2px solid white;
        }
        .game-cell {
          background-color: #4CAF50;
          aspect-ratio: 1/1;
          position: relative;
          cursor: pointer;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
        }
        .goal-area {
          background-color: rgba(156, 39, 176, 0.3);
        }
        .possible-move {
          background-color: rgba(255, 235, 59, 0.3);
        }
        .ball {
          position: absolute;
          z-index: 10;
          font-size: 1.2em;
        }
        .player {
          width: 90%;
          height: 90%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          font-weight: bold;
          font-size: 0.7em;
          color: white;
          position: relative;
        }
        .player-home {
          background-color: #E64A19;
        }
        .player-away {
          background-color: #1976D2;
        }
        .selected {
          box-shadow: 0 0 0 2px yellow;
        }
        .injured {
          opacity: 0.6;
        }
        .player-number {
          font-size: 0.9em;
          margin-top: 2px;
        }
        .yellow-card {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 0.8em;
        }
        .score-board {
          display: flex;
          gap: 20px;
          align-items: center;
          font-size: 1.2em;
        }
        .team-score.active {
          color: #FFD54F;
        }
        .action-button {
          background-color: #2196F3;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        }
        .action-button:hover {
          background-color: #0D8BF0;
        }
        .game-status {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .phase-controls {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default FootballChess;

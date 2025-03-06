import React, { useState, useEffect } from 'react';

// Card Types with Chess-Like Movements
const CARD_TYPES = {
  GOALKEEPER: {
    name: 'Goalkeeper',
    description: 'Limited movement, defensive specialist',
    movementType: 'King-like',
    specialAbility: 'Goal Line Defense',
    color: 'bg-blue-500',
    movementRules: {
      maxSquares: 1,
      directions: ['horizontal', 'vertical', 'diagonal']
    },
    statsProfile: {
      defense: 90,
      positioning: 85,
      specialAbilityStrength: 75
    }
  },
  DEFENDER: {
    name: 'Defender',
    description: 'Tactical blocking, strategic positioning',
    movementType: 'Rook-like',
    specialAbility: 'Tactical Block',
    color: 'bg-green-500',
    movementRules: {
      maxSquares: 3,
      directions: ['horizontal', 'vertical']
    },
    statsProfile: {
      defense: 85,
      tackling: 80,
      specialAbilityStrength: 70
    }
  },
  MIDFIELDER: {
    name: 'Midfielder',
    description: 'Complex movement, field control',
    movementType: 'Knight-like',
    specialAbility: 'Field Vision',
    color: 'bg-yellow-500',
    movementRules: {
      maxSquares: 2,
      directions: ['L-shape', 'diagonal jumps']
    },
    statsProfile: {
      passing: 85,
      vision: 80,
      specialAbilityStrength: 85
    }
  },
  FORWARD: {
    name: 'Forward',
    description: 'Offensive movement, goal-scoring potential',
    movementType: 'Bishop-like',
    specialAbility: 'Precision Shot',
    color: 'bg-red-500',
    movementRules: {
      maxSquares: 3,
      directions: ['diagonal']
    },
    statsProfile: {
      shooting: 90,
      speed: 85,
      specialAbilityStrength: 90
    }
  }
};

// Game Zones
const GAME_ZONES = [
  'Defensive Zone',
  'Midfield Zone',
  'Forward Zone',
  'Goal Zone'
];

const ChessFootballCardGame = () => {
  // Game State Management
  const [gameBoard, setGameBoard] = useState(
    Array(16).fill().map(() => Array(8).fill(null))
  );
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameState, setGameState] = useState({
    currentTeam: 'HOME',
    movesRemaining: 3,
    ballPossession: null
  });
  const [matchLog, setMatchLog] = useState([]);

  // Initialize Game Board
  const initializeGame = () => {
    const newBoard = Array(16).fill().map(() => Array(8).fill(null));
    
    // Initial card placement
    Object.keys(CARD_TYPES).forEach((cardType, index) => {
      // Home team (bottom of the board)
      newBoard[0][index * 2] = {
        type: cardType,
        team: 'HOME',
        ...CARD_TYPES[cardType]
      };
      
      // Away team (top of the board)
      newBoard[15][index * 2] = {
        type: cardType,
        team: 'AWAY',
        ...CARD_TYPES[cardType]
      };
    });

    setGameBoard(newBoard);
  };

  // Initialize game on component mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Handle Card Selection
  const handleCardSelection = (card, rowIndex, colIndex) => {
    if (selectedCard) {
      // Attempt to move the card
      moveCard(selectedCard, rowIndex, colIndex);
      setSelectedCard(null);
    } else {
      // Select the card
      setSelectedCard({ card, rowIndex, colIndex });
    }
  };

  // Move Card Logic
  const moveCard = (selected, targetRow, targetCol) => {
    const { card, rowIndex, colIndex } = selected;
    const newBoard = [...gameBoard];

    // Validate move based on card's movement rules
    const isValidMove = validateMove(card, rowIndex, targetRow, colIndex, targetCol);

    if (isValidMove) {
      // Move the card
      newBoard[targetRow][targetCol] = card;
      newBoard[rowIndex][colIndex] = null;

      // Update game state
      setGameBoard(newBoard);
      updateGameState(card, targetRow, targetCol);
    } else {
      // Invalid move
      addToMatchLog(`Invalid move for ${card.name}`);
    }
  };

  // Move Validation
  const validateMove = (card, fromRow, toRow, fromCol, toCol) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Check movement based on card type
    switch (card.movementType) {
      case 'King-like':
        return rowDiff <= 1 && colDiff <= 1;
      case 'Rook-like':
        return (rowDiff === 0 || colDiff === 0) && 
               rowDiff + colDiff <= card.movementRules.maxSquares;
      case 'Knight-like':
        return (rowDiff === 2 && colDiff === 1) || 
               (rowDiff === 1 && colDiff === 2);
      case 'Bishop-like':
        return rowDiff === colDiff && 
               rowDiff <= card.movementRules.maxSquares;
      default:
        return false;
    }
  };

  // Update Game State
  const updateGameState = (movedCard, toRow, toCol) => {
    const newGameState = { ...gameState };
    
    // Reduce remaining moves
    newGameState.movesRemaining--;

    // Determine ball possession
    if (!newGameState.ballPossession) {
      newGameState.ballPossession = movedCard;
    }

    // Switch teams if moves are exhausted
    if (newGameState.movesRemaining === 0) {
      newGameState.currentTeam = 
        newGameState.currentTeam === 'HOME' ? 'AWAY' : 'HOME';
      newGameState.movesRemaining = 3;
    }

    setGameState(newGameState);
  };

  // Add to Match Log
  const addToMatchLog = (message) => {
    setMatchLog(prevLog => [
      { message, timestamp: new Date() },
      ...prevLog
    ].slice(0, 5)); // Keep last 5 log entries
  };

  // Render Game Board
  const renderGameBoard = () => (
    <div className="grid grid-cols-8 gap-1">
      {gameBoard.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            className={`
              w-12 h-12 border 
              ${rowIndex < 4 ? 'bg-blue-100' : 
                rowIndex < 8 ? 'bg-green-100' : 
                rowIndex < 12 ? 'bg-yellow-100' : 'bg-red-100'}
              flex items-center justify-center
              cursor-pointer
              hover:bg-opacity-50
            `}
            onClick={() => cell 
              ? handleCardSelection(cell, rowIndex, colIndex)
              : selectedCard 
                ? moveCard(selectedCard, rowIndex, colIndex)
                : null
            }
          >
            {cell && (
              <div 
                className={`
                  w-10 h-10 rounded-full 
                  ${cell.color} 
                  flex items-center justify-center
                  text-white text-xs
                `}
              >
                {cell.name.charAt(0)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  // Render Match Log
  const renderMatchLog = () => (
    <div className="bg-white shadow-lg rounded-lg p-4 max-h-64 overflow-y-auto">
      <h3 className="font-bold mb-2">Match Log</h3>
      {matchLog.map((entry, index) => (
        <div 
          key={index} 
          className="p-2 border-b last:border-b-0"
        >
          <p>{entry.message}</p>
          <span className="text-xs text-gray-500">
            {entry.timestamp.toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );

  // Render Game State Information
  const renderGameStateInfo = () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-bold mb-2">Game State</h3>
      <p>Current Team: {gameState.currentTeam}</p>
      <p>Moves Remaining: {gameState.movesRemaining}</p>
      <p>
        Ball Possession: 
        {gameState.ballPossession 
          ? gameState.ballPossession.name 
          : 'Unassigned'}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Chess Football Card Game
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Game Board */}
        <div className="md:col-span-2">
          {renderGameBoard()}
        </div>

        {/* Sidebar */}
        <div>
          {renderGameStateInfo()}
          <div className="mt-4">
            {renderMatchLog()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessFootballCardGame;

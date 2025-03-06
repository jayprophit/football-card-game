import React, { useState, useEffect } from 'react';

// Card Types with Special Abilities
const CARD_TYPES = {
  GOALKEEPER: {
    name: 'Goalkeeper',
    specialAbilities: ['Goal Line Defense', 'High Interception'],
    baseStats: {
      defense: 90,
      positioning: 85,
      energy: 100
    }
  },
  DEFENDER: {
    name: 'Defender',
    specialAbilities: ['Tactical Block', 'Interception Expert'],
    baseStats: {
      defense: 85,
      tackling: 80,
      energy: 90
    }
  },
  MIDFIELDER: {
    name: 'Midfielder',
    specialAbilities: ['Vision Pass', 'Energy Management'],
    baseStats: {
      passing: 85,
      vision: 80,
      energy: 95
    }
  },
  FORWARD: {
    name: 'Forward',
    specialAbilities: ['Precision Shot', 'Sprint Ability'],
    baseStats: {
      shooting: 90,
      speed: 85,
      energy: 85
    }
  }
};

// Foul and Penalty System
const FOUL_TYPES = {
  SOFT_FOUL: {
    name: 'Soft Foul',
    consequences: ['Warning', 'Potential Yellow Card'],
    penaltyProbability: 0.3
  },
  HARD_FOUL: {
    name: 'Hard Foul',
    consequences: ['Yellow Card', 'Potential Red Card'],
    penaltyProbability: 0.6
  },
  INJURY_FOUL: {
    name: 'Injury Foul',
    consequences: ['Red Card', 'Player Removal'],
    penaltyProbability: 0.9
  }
};

const GameMechanicsSimulator = () => {
  const [gameState, setGameState] = useState({
    turn: 0,
    currentTeam: 'HOME',
    board: Array(16).fill().map(() => Array(8).fill(null)),
    teamCards: {
      HOME: [],
      AWAY: []
    },
    energy: {
      HOME: 300,
      AWAY: 300
    },
    morale: {
      HOME: 50,
      AWAY: 50
    }
  });

  const [selectedCard, setSelectedCard] = useState(null);

  // Initialize game with starting cards
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const initialCards = {
      HOME: [
        { type: 'GOALKEEPER', position: [0, 3], team: 'HOME' },
        { type: 'DEFENDER', position: [1, 2], team: 'HOME' },
        { type: 'MIDFIELDER', position: [2, 3], team: 'HOME' },
        { type: 'FORWARD', position: [3, 4], team: 'HOME' }
      ],
      AWAY: [
        { type: 'GOALKEEPER', position: [15, 3], team: 'AWAY' },
        { type: 'DEFENDER', position: [14, 2], team: 'AWAY' },
        { type: 'MIDFIELDER', position: [13, 3], team: 'AWAY' },
        { type: 'FORWARD', position: [12, 4], team: 'AWAY' }
      ]
    };

    setGameState(prevState => ({
      ...prevState,
      teamCards: initialCards
    }));
  };

  // Simulate move with strategic complexity
  const simulateMove = (card, targetPosition) => {
    const cardType = CARD_TYPES[card.type];
    const energyCost = calculateMoveCost(card, targetPosition);
    
    // Check if move is possible
    if (energyCost > gameState.energy[card.team]) {
      alert('Not enough energy for this move!');
      return;
    }

    // Determine move success probability
    const moveSuccessProbability = calculateMoveSuccessProbability(card, targetPosition);
    const isSuccessful = Math.random() < moveSuccessProbability;

    if (isSuccessful) {
      // Update board and card position
      const newBoard = [...gameState.board];
      newBoard[targetPosition[0]][targetPosition[1]] = card;

      // Update game state
      setGameState(prevState => ({
        ...prevState,
        board: newBoard,
        turn: prevState.turn + 1,
        currentTeam: prevState.currentTeam === 'HOME' ? 'AWAY' : 'HOME',
        energy: {
          ...prevState.energy,
          [card.team]: prevState.energy[card.team] - energyCost
        },
        morale: updateMorale(prevState, card, targetPosition)
      }));

      // Potential foul or special event
      checkForSpecialEvents(card, targetPosition);
    } else {
      // Failed move has consequences
      handleFailedMove(card);
    }
  };

  // Calculate move energy cost
  const calculateMoveCost = (card, targetPosition) => {
    const cardType = CARD_TYPES[card.type];
    const distanceMoved = Math.abs(card.position[0] - targetPosition[0]) + 
                          Math.abs(card.position[1] - targetPosition[1]);
    return distanceMoved * 10; // Base energy cost calculation
  };

  // Calculate move success probability
  const calculateMoveSuccessProbability = (card, targetPosition) => {
    const cardType = CARD_TYPES[card.type];
    // Complex probability calculation based on card type, position, etc.
    return 0.7; // Base probability
  };

  // Update team morale based on moves
  const updateMorale = (prevState, card, targetPosition) => {
    const moraleGain = calculateMoraleGain(card, targetPosition);
    return {
      ...prevState.morale,
      [card.team]: Math.min(100, prevState.morale[card.team] + moraleGain)
    };
  };

  // Calculate morale gain from strategic moves
  const calculateMoraleGain = (card, targetPosition) => {
    // Strategic position changes give more morale
    const zoneAdvancement = targetPosition[0] - card.position[0];
    return zoneAdvancement > 0 ? zoneAdvancement * 5 : 0;
  };

  // Check for special events during move
  const checkForSpecialEvents = (card, targetPosition) => {
    // Potential foul or special ability trigger
    const foulProbability = Math.random();
    if (foulProbability < 0.1) {
      triggerFoul(card);
    }
  };

  // Foul system
  const triggerFoul = (card) => {
    const foulType = Object.values(FOUL_TYPES)[
      Math.floor(Math.random() * Object.keys(FOUL_TYPES).length)
    ];
    
    alert(`${foulType.name} committed by ${card.type} from ${card.team} team!`);
  };

  // Handle failed move
  const handleFailedMove = (card) => {
    // Potential energy loss or negative consequences
    setGameState(prevState => ({
      ...prevState,
      energy: {
        ...prevState.energy,
        [card.team]: prevState.energy[card.team] - 20
      },
      morale: {
        ...prevState.morale,
        [card.team]: prevState.morale[card.team] - 10
      }
    }));
  };

  // Render game board
  const renderGameBoard = () => {
    return gameState.board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            className={`
              w-12 h-12 border 
              ${rowIndex < 4 ? 'bg-blue-100' : 
                rowIndex < 8 ? 'bg-green-100' : 
                rowIndex < 12 ? 'bg-yellow-100' : 'bg-red-100'}
              hover:bg-opacity-50
            `}
            onClick={() => handleBoardClick(rowIndex, colIndex)}
          >
            {cell && (
              <div className={`
                w-full h-full flex items-center justify-center
                ${cell.team === 'HOME' ? 'bg-blue-500' : 'bg-red-500'}
                text-white text-xs
              `}>
                {cell.type}
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  };

  // Handle board cell click
  const handleBoardClick = (rowIndex, colIndex) => {
    if (selectedCard) {
      simulateMove(selectedCard, [rowIndex, colIndex]);
      setSelectedCard(null);
    }
  };

  // Render team cards for selection
  const renderTeamCards = () => {
    const currentTeamCards = gameState.teamCards[gameState.currentTeam];
    return currentTeamCards.map((card, index) => (
      <div 
        key={index}
        className={`
          p-2 m-1 rounded cursor-pointer
          ${selectedCard === card ? 'bg-green-500 text-white' : 'bg-gray-200'}
        `}
        onClick={() => setSelectedCard(card)}
      >
        {card.type}
      </div>
    ));
  };

  return (
    <div className="flex">
      {/* Sidebar with game stats and card selection */}
      <div className="w-64 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">
          {gameState.currentTeam} Team's Turn
        </h2>
        
        <div className="mb-4">
          <h3>Energy</h3>
          <div className="flex">
            <div className="w-1/2 bg-blue-500 text-white p-2 text-center">
              HOME: {gameState.energy.HOME}
            </div>
            <div className="w-1/2 bg-red-500 text-white p-2 text-center">
              AWAY: {gameState.energy.AWAY}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3>Morale</h3>
          <div className="flex">
            <div className="w-1/2 bg-blue-300 text-white p-2 text-center">
              HOME: {gameState.morale.HOME}
            </div>
            <div className="w-1/2 bg-red-300 text-white p-2 text-center">
              AWAY: {gameState.morale.AWAY}
            </div>
          </div>
        </div>

        <div>
          <h3>Available Cards</h3>
          {renderTeamCards()}
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl font-bold mb-4">Football Card Strategy Game</h2>
        {renderGameBoard()}
      </div>
    </div>
  );
};

export default GameMechanicsSimulator;

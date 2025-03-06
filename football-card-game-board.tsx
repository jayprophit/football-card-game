import React, { useState } from 'react';
import { 
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, 
  Shield, Zap, Target, Star 
} from 'lucide-react';

// Card types with special effects
const CARD_TYPES = {
  GOALKEEPER: {
    name: 'Goalkeeper',
    icon: <Shield color="blue" />,
    specialEffect: 'Goal Line Defense'
  },
  DEFENDER: {
    name: 'Defender',
    icon: <Shield color="green" />,
    specialEffect: 'Defensive Wall'
  },
  MIDFIELDER: {
    name: 'Midfielder',
    icon: <Zap color="yellow" />,
    specialEffect: 'Creative Playmaker'
  },
  FORWARD: {
    name: 'Forward',
    icon: <Target color="red" />,
    specialEffect: 'Lightning Striker'
  }
};

// Special Move Effects
const SPECIAL_EFFECTS = {
  'Lightning Striker': {
    description: 'Increased movement speed and shooting accuracy',
    visual: 'electrical-sparks'
  },
  'Defensive Wall': {
    description: 'Block pass lanes temporarily',
    visual: 'stone-barrier'
  },
  'Creative Playmaker': {
    description: 'Enhanced diagonal passes',
    visual: 'holographic-lines'
  },
  'Goal Line Defense': {
    description: 'Increased shot blocking probability',
    visual: 'energy-shield'
  }
};

const FootballCardGameBoard = () => {
  const [board, setBoard] = useState(
    Array(16).fill().map(() => Array(8).fill(null))
  );

  const [selectedCard, setSelectedCard] = useState(null);

  // Create a card with special effects
  const createCard = (type) => {
    return {
      type: type,
      specialEffect: CARD_TYPES[type].specialEffect,
      movementPotential: 3, // Base movement points
      energy: 100 // Energy for special moves
    };
  };

  // Handle card placement
  const placeCard = (rowIndex, colIndex) => {
    if (selectedCard) {
      const newBoard = [...board];
      newBoard[rowIndex][colIndex] = selectedCard;
      setBoard(newBoard);
      setSelectedCard(null);
    }
  };

  // Render the game board grid
  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div 
            key={colIndex} 
            className={`w-16 h-16 border border-gray-300 
              ${cell ? 'bg-blue-100' : 'bg-green-50'} 
              hover:bg-blue-200 transition-colors`}
            onClick={() => placeCard(rowIndex, colIndex)}
          >
            {cell && CARD_TYPES[cell.type].icon}
          </div>
        ))}
      </div>
    ));
  };

  // Render card selection sidebar
  const renderCardSelection = () => {
    return (
      <div className="w-64 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Select Card Type</h2>
        {Object.keys(CARD_TYPES).map((cardType) => (
          <button
            key={cardType}
            className="w-full mb-2 p-2 bg-white border rounded 
              flex items-center hover:bg-gray-50"
            onClick={() => setSelectedCard(createCard(cardType))}
          >
            {CARD_TYPES[cardType].icon}
            <span className="ml-2">{CARD_TYPES[cardType].name}</span>
          </button>
        ))}
        
        {selectedCard && (
          <div className="mt-4 p-2 bg-white border rounded">
            <h3 className="font-bold">Selected Card Details</h3>
            <p>Type: {CARD_TYPES[selectedCard.type].name}</p>
            <p>Special Effect: {selectedCard.specialEffect}</p>
            <p>Effect Details: {SPECIAL_EFFECTS[selectedCard.specialEffect].description}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      {renderCardSelection()}
      <div className="flex-grow">
        <div className="bg-green-600 p-2 text-white text-center">
          Football Card Strategy Game
        </div>
        {renderBoard()}
      </div>
    </div>
  );
};

export default FootballCardGameBoard;

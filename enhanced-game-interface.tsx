import React, { useState, useEffect } from 'react';

// Custom SVG Icons for Enhanced Visuals
const StadiumBackground = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 400 300" 
    className="absolute inset-0 w-full h-full"
  >
    {/* Stadium Background */}
    <rect width="400" height="300" fill="#228B22" /> {/* Pitch Green */}
    <rect x="0" y="0" width="400" height="50" fill="#4A7023" /> {/* Top Stand */}
    <rect x="0" y="250" width="400" height="50" fill="#4A7023" /> {/* Bottom Stand */}
    
    {/* Pitch Markings */}
    <rect x="200" y="0" width="2" height="300" fill="white" /> {/* Midline */}
    <circle cx="200" cy="150" r="50" stroke="white" strokeWidth="2" fill="none" /> {/* Center Circle */}
    <rect x="0" y="125" width="20" height="50" fill="white" /> {/* Goal Area Left */}
    <rect x="380" y="125" width="20" height="50" fill="white" /> {/* Goal Area Right */}
  </svg>
);

// Card Types with Enhanced Attributes
const CARD_TYPES = {
  GOALKEEPER: {
    name: 'Goalkeeper',
    description: 'Defensive specialist with high interception skills',
    specialAbilities: ['Goal Line Defense', 'High Precision Blocking'],
    color: 'bg-blue-500',
    icon: '🧤'
  },
  DEFENDER: {
    name: 'Defender',
    description: 'Tactical blocking and strategic positioning',
    specialAbilities: ['Tactical Block', 'Interception Expert'],
    color: 'bg-green-500',
    icon: '🛡️'
  },
  MIDFIELDER: {
    name: 'Midfielder',
    description: 'Playmaker with advanced vision and passing',
    specialAbilities: ['Vision Pass', 'Field Control'],
    color: 'bg-yellow-500',
    icon: '🌟'
  },
  FORWARD: {
    name: 'Forward',
    description: 'Offensive powerhouse with scoring potential',
    specialAbilities: ['Precision Shot', 'Sprint Ability'],
    color: 'bg-red-500',
    icon: '⚽'
  }
};

// Simulate Match Mechanics
const simulateMatchAction = (card) => {
  const actionTypes = [
    'Successful Pass',
    'Goal Attempt',
    'Defensive Block',
    'Interception',
    'Strategic Movement'
  ];
  
  return {
    action: actionTypes[Math.floor(Math.random() * actionTypes.length)],
    success: Math.random() > 0.3,
    impact: Math.floor(Math.random() * 100)
  };
};

const EnhancedGameInterface = () => {
  // Game State Management
  const [playerTeam, setPlayerTeam] = useState([]);
  const [matchLog, setMatchLog] = useState([]);
  const [gamePhase, setGamePhase] = useState('TEAM_SELECTION');
  const [selectedCard, setSelectedCard] = useState(null);

  // Initialize Game
  useEffect(() => {
    // Initial team generation
    const initialTeam = Object.keys(CARD_TYPES).map(type => ({
      type,
      ...CARD_TYPES[type],
      uniqueId: `CARD-${Math.random().toString(36).substr(2, 9)}`,
      energy: 100,
      position: null
    }));
    setPlayerTeam(initialTeam);
  }, []);

  // Place Card on Field
  const placeCard = (card) => {
    // Update card position
    const updatedTeam = playerTeam.map(teamCard => 
      teamCard.uniqueId === card.uniqueId 
        ? {...teamCard, position: 'FIELD'}
        : teamCard
    );
    setPlayerTeam(updatedTeam);
    
    // Simulate match action
    const matchAction = simulateMatchAction(card);
    setMatchLog(prevLog => [
      {
        card: card.name,
        ...matchAction,
        timestamp: new Date()
      },
      ...prevLog
    ].slice(0, 5)); // Keep last 5 actions
  };

  // Render Team Selection Phase
  const renderTeamSelection = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {playerTeam.map((card) => (
        <div 
          key={card.uniqueId}
          className={`
            ${card.color} 
            rounded-lg shadow-lg p-4 
            transform transition-all 
            hover:scale-105 
            cursor-pointer
          `}
          onClick={() => placeCard(card)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-3xl">{card.icon}</span>
            <h3 className="font-bold text-white">{card.name}</h3>
          </div>
          <p className="text-sm text-white">{card.description}</p>
          <div className="mt-2">
            <h4 className="font-semibold text-white">Special Abilities:</h4>
            <ul className="list-disc pl-5 text-white text-sm">
              {card.specialAbilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  // Render Match Log
  const renderMatchLog = () => (
    <div className="bg-white shadow-lg rounded-lg p-4 max-h-64 overflow-y-auto">
      <h3 className="font-bold mb-2">Match Actions</h3>
      {matchLog.map((action, index) => (
        <div 
          key={index} 
          className={`
            p-2 rounded mb-1 
            ${action.success ? 'bg-green-100' : 'bg-red-100'}
          `}
        >
          <div className="flex justify-between">
            <span className="font-semibold">{action.card}</span>
            <span className="text-sm text-gray-600">
              {action.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <p>{action.action} - {action.success ? 'Success' : 'Failed'}</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{width: `${action.impact}%`}}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Stadium Background */}
      <StadiumBackground />
      
      <div className="relative z-10 p-4">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Football Strategy Card Game
        </h1>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Team Selection / Field Placement */}
          <div className="md:col-span-2">
            {renderTeamSelection()}
          </div>

          {/* Match Log */}
          <div>
            {renderMatchLog()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedGameInterface;

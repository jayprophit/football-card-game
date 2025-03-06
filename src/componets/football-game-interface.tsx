import React, { useState, useEffect } from 'react';

// Team and Player Configuration
const TEAM_FORMATIONS = {
  '4-4-2': {
    name: '4-4-2 Classic',
    description: 'Balanced formation with two strikers',
    positions: [
      { type: 'GOALKEEPER', count: 1 },
      { type: 'DEFENDER', count: 4 },
      { type: 'MIDFIELDER', count: 4 },
      { type: 'FORWARD', count: 2 }
    ]
  },
  '4-3-3': {
    name: '4-3-3 Attacking',
    description: 'Offensive formation with three forwards',
    positions: [
      { type: 'GOALKEEPER', count: 1 },
      { type: 'DEFENDER', count: 4 },
      { type: 'MIDFIELDER', count: 3 },
      { type: 'FORWARD', count: 3 }
    ]
  },
  '3-5-2': {
    name: '3-5-2 Tactical',
    description: 'Flexible formation with wing-backs',
    positions: [
      { type: 'GOALKEEPER', count: 1 },
      { type: 'DEFENDER', count: 3 },
      { type: 'MIDFIELDER', count: 5 },
      { type: 'FORWARD', count: 2 }
    ]
  }
};

// Player Roles and Attributes
const PLAYER_ROLES = {
  GOALKEEPER: {
    key_skills: ['Positioning', 'Reflexes', 'Distribution'],
    color: 'bg-blue-500'
  },
  DEFENDER: {
    key_skills: ['Tackling', 'Marking', 'Interception'],
    color: 'bg-green-500'
  },
  MIDFIELDER: {
    key_skills: ['Passing', 'Vision', 'Stamina'],
    color: 'bg-yellow-500'
  },
  FORWARD: {
    key_skills: ['Shooting', 'Dribbling', 'Movement'],
    color: 'bg-red-500'
  }
};

const FootballGameInterface = () => {
  // State Management
  const [selectedFormation, setSelectedFormation] = useState('4-4-2');
  const [teamStrategy, setTeamStrategy] = useState({
    attackingIntensity: 50,
    defensiveLine: 50,
    pressingIntensity: 50
  });
  const [matchSimulation, setMatchSimulation] = useState(null);

  // Simulate Match Based on Team Configuration
  const simulateMatch = () => {
    // Complex match simulation logic
    const matchOutcome = {
      possession: Math.floor(Math.random() * 100),
      shots: Math.floor(Math.random() * 20),
      accuracy: Math.floor(Math.random() * 100),
      score: `${Math.floor(Math.random() * 4)} - ${Math.floor(Math.random() * 4)}`,
      result: ['Win', 'Draw', 'Loss'][Math.floor(Math.random() * 3)]
    };

    setMatchSimulation(matchOutcome);
  };

  // Render Formation Selector
  const renderFormationSelector = () => (
    <div className="mb-4">
      <h2 className="text-xl font-bold mb-2">Select Formation</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(TEAM_FORMATIONS).map(([key, formation]) => (
          <button
            key={key}
            onClick={() => setSelectedFormation(key)}
            className={`
              p-4 rounded-lg 
              ${selectedFormation === key 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-800'}
              hover:bg-blue-600 transition-colors
            `}
          >
            <h3 className="font-bold">{formation.name}</h3>
            <p className="text-sm">{formation.description}</p>
          </button>
        ))}
      </div>
    </div>
  );

  // Render Team Strategy Configurator
  const renderTeamStrategyConfigurator = () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Team Strategy</h2>
      {Object.entries(teamStrategy).map(([key, value]) => (
        <div key={key} className="mb-2">
          <div className="flex justify-between mb-1">
            <label className="capitalize">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <span>{value}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => setTeamStrategy(prev => ({
              ...prev,
              [key]: parseInt(e.target.value)
            }))}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );

  // Render Team Composition
  const renderTeamComposition = () => {
    const currentFormation = TEAM_FORMATIONS[selectedFormation];
    
    return (
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Team Composition</h2>
        <div className="grid grid-cols-4 gap-4">
          {currentFormation.positions.map((positionGroup, index) => (
            <div 
              key={index} 
              className={`
                p-4 rounded-lg 
                ${PLAYER_ROLES[positionGroup.type].color}
              `}
            >
              <h3 className="font-bold text-white">
                {positionGroup.type} ({positionGroup.count})
              </h3>
              <div className="mt-2">
                <h4 className="font-semibold text-white">Key Skills:</h4>
                <ul className="list-disc pl-5 text-white text-sm">
                  {PLAYER_ROLES[positionGroup.type].key_skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render Match Simulation Results
  const renderMatchSimulation = () => {
    if (!matchSimulation) return null;

    return (
      <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
        <h2 className="text-xl font-bold mb-2">Match Result</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p>Possession: {matchSimulation.possession}%</p>
            <p>Total Shots: {matchSimulation.shots}</p>
            <p>Shot Accuracy: {matchSimulation.accuracy}%</p>
          </div>
          <div>
            <p className="text-2xl font-bold">Score: {matchSimulation.score}</p>
            <p>Result: {matchSimulation.result}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Football Strategy Game
      </h1>

      {/* Formation Selector */}
      {renderFormationSelector()}

      {/* Team Composition */}
      {renderTeamComposition()}

      {/* Team Strategy Configurator */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          {renderTeamStrategyConfigurator()}
        </div>
        <div className="flex flex-col justify-end">
          <button
            onClick={simulateMatch}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Simulate Match
          </button>
        </div>
      </div>

      {/* Match Simulation Results */}
      {renderMatchSimulation()}
    </div>
  );
};

export default FootballGameInterface;

import React, { useState, useEffect, useRef } from 'react';

// Rendering Mode Configurations
const RENDERING_MODES = {
  TWO_D: {
    name: '2D Mode',
    description: 'Stylized card-based interface with clean graphics',
    icon: '🎴',
    performanceImpact: 'Low',
    batteryUsage: 'Minimal'
  },
  THREE_D: {
    name: '3D Mode',
    description: 'Immersive stadium environment with detailed graphics',
    icon: '🏟️',
    performanceImpact: 'High',
    batteryUsage: 'Significant'
  }
};

// Play Mode Configurations
const PLAY_MODES = {
  MANUAL: {
    name: 'Manual Play',
    description: 'Direct control of card placement and strategy',
    icon: '🎮',
    skillLevel: 'High Strategy Requirement'
  },
  AUTO: {
    name: 'Auto Play',
    description: 'AI-driven gameplay with minimal player intervention',
    icon: '🤖',
    skillLevel: 'Passive Engagement'
  }
};

// Simulated Match Simulation
const simulateMatch = (renderMode, playMode) => {
  return {
    matchId: `MATCH-${Math.random().toString(36).substr(2, 9)}`,
    renderMode: renderMode,
    playMode: playMode,
    outcome: Math.random() > 0.5 ? 'Victory' : 'Defeat',
    score: `${Math.floor(Math.random() * 5)} - ${Math.floor(Math.random() * 5)}`,
    aiPerformance: Math.floor(Math.random() * 100)
  };
};

const GameModeSelector = () => {
  // State Management
  const [renderMode, setRenderMode] = useState('TWO_D');
  const [playMode, setPlayMode] = useState('MANUAL');
  const [matchHistory, setMatchHistory] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    graphicsQuality: 'Medium',
    aiDifficulty: 'Normal'
  });

  // Canvas Rendering Simulation
  const canvasRef = useRef(null);

  // Render Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Clear previous rendering
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render based on selected mode
    if (renderMode === 'TWO_D') {
      // 2D Stylized Rendering
      context.fillStyle = '#228B22'; // Pitch green
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Field lines
      context.strokeStyle = 'white';
      context.lineWidth = 2;
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.moveTo(canvas.width / 2, 0);
      context.lineTo(canvas.width / 2, canvas.height);
      context.stroke();
    } else {
      // Basic 3D-like Perspective
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#4A7023');   // Stadium stand color
      gradient.addColorStop(0.5, '#228B22'); // Pitch green
      gradient.addColorStop(1, '#4A7023');   // Stadium stand color
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Perspective lines
      context.strokeStyle = 'rgba(255,255,255,0.5)';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, canvas.height / 2);
      context.lineTo(canvas.width, canvas.height / 2);
      context.stroke();
    }
  }, [renderMode]);

  // Simulate Match
  const startMatch = () => {
    const newMatch = simulateMatch(renderMode, playMode);
    setMatchHistory([newMatch, ...matchHistory].slice(0, 5)); // Keep last 5 matches
  };

  // Render Mode Selection
  const renderModeSelector = () => (
    <div className="flex space-x-4">
      {Object.entries(RENDERING_MODES).map(([key, mode]) => (
        <button
          key={key}
          onClick={() => setRenderMode(key)}
          className={`
            p-4 rounded-lg flex flex-col items-center
            ${renderMode === key 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-800'}
          `}
        >
          <span className="text-3xl mb-2">{mode.icon}</span>
          <h3 className="font-bold">{mode.name}</h3>
          <p className="text-xs">{mode.description}</p>
          <div className="mt-2 text-xs">
            <p>Performance: {mode.performanceImpact}</p>
            <p>Battery: {mode.batteryUsage}</p>
          </div>
        </button>
      ))}
    </div>
  );

  // Play Mode Selection
  const playModeSelector = () => (
    <div className="flex space-x-4">
      {Object.entries(PLAY_MODES).map(([key, mode]) => (
        <button
          key={key}
          onClick={() => setPlayMode(key)}
          className={`
            p-4 rounded-lg flex flex-col items-center
            ${playMode === key 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-gray-800'}
          `}
        >
          <span className="text-3xl mb-2">{mode.icon}</span>
          <h3 className="font-bold">{mode.name}</h3>
          <p className="text-xs">{mode.description}</p>
          <div className="mt-2 text-xs">
            <p>Skill Level: {mode.skillLevel}</p>
          </div>
        </button>
      ))}
    </div>
  );

  // Game Settings Configuration
  const gameSettingsConfig = () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-bold mb-2">Game Settings</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Graphics Quality</label>
          <select
            value={gameSettings.graphicsQuality}
            onChange={(e) => setGameSettings(prev => ({
              ...prev,
              graphicsQuality: e.target.value
            }))}
            className="w-full p-2 border rounded"
          >
            {['Low', 'Medium', 'High', 'Ultra'].map((quality) => (
              <option key={quality} value={quality}>{quality}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">AI Difficulty</label>
          <select
            value={gameSettings.aiDifficulty}
            onChange={(e) => setGameSettings(prev => ({
              ...prev,
              aiDifficulty: e.target.value
            }))}
            className="w-full p-2 border rounded"
          >
            {['Easy', 'Normal', 'Hard', 'Expert'].map((difficulty) => (
              <option key={difficulty} value={difficulty}>{difficulty}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  // Match History
  const matchHistoryDisplay = () => (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="font-bold mb-2">Recent Matches</h3>
      {matchHistory.map((match, index) => (
        <div 
          key={match.matchId} 
          className={`
            p-2 mb-1 rounded 
            ${match.outcome === 'Victory' ? 'bg-green-100' : 'bg-red-100'}
          `}
        >
          <div className="flex justify-between">
            <span>
              {match.renderMode} - {match.playMode} Mode
            </span>
            <span>{match.outcome}</span>
          </div>
          <p>Score: {match.score}</p>
          <p>AI Performance: {match.aiPerformance}%</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Football Strategy Card Game
      </h1>

      {/* Game Rendering Canvas */}
      <div className="mb-4">
        <canvas 
          ref={canvasRef}
          width="800"
          height="400"
          className="w-full border rounded-lg"
        />
      </div>

      {/* Rendering Mode Selection */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Select Rendering Mode</h2>
        {renderModeSelector()}
      </div>

      {/* Play Mode Selection */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Select Play Mode</h2>
        {playModeSelector()}
      </div>

      {/* Game Settings */}
      <div className="mb-4">
        {gameSettingsConfig()}
      </div>

      {/* Match Controls */}
      <div className="mb-4">
        <button
          onClick={startMatch}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Start Match
        </button>
      </div>

      {/* Match History */}
      <div>
        {matchHistoryDisplay()}
      </div>
    </div>
  );
};

export default GameModeSelector;

import React from 'react';

const ModeSelectors = ({ renderMode, setRenderMode, gameMode, setGameMode, RENDERING_MODES, GAME_MODES }) => (
  <div className="flex space-x-4 mb-4">
    {/* Rendering Mode Selector */}
    <div>
      <h3 className="font-bold mb-2">Rendering Mode</h3>
      <div className="flex space-x-2">
        {Object.entries(RENDERING_MODES).map(([key, mode]) => (
          <button
            key={key}
            onClick={() => setRenderMode(key)}
            className={`
              p-2 rounded 
              ${renderMode === key 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200'}
            `}
          >
            <span className="text-2xl">{mode.icon}</span>
            <p className="text-xs">{mode.name}</p>
          </button>
        ))}
      </div>
    </div>

    {/* Game Mode Selector */}
    <div>
      <h3 className="font-bold mb-2">Game Mode</h3>
      <div className="flex space-x-2">
        {Object.entries(GAME_MODES).map(([key, mode]) => (
          <button
            key={key}
            onClick={() => setGameMode(key)}
            className={`
              p-2 rounded 
              ${gameMode === key 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200'}
            `}
          >
            <span className="text-2xl">{mode.icon}</span>
            <p className="text-xs">{mode.name}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default ModeSelectors;

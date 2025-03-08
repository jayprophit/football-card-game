import React from 'react';

interface GameControlsProps {
  onEndTurn: () => void;
  onPass: () => void;
  onShoot: () => void;
  canPass: boolean;
  canShoot: boolean;
  movesRemaining: number;
}

const GameControls: React.FC<GameControlsProps> = ({
  onEndTurn,
  onPass,
  onShoot,
  canPass,
  canShoot,
  movesRemaining
}) => {
  return (
    <div className="game-controls">
      <button 
        className="control-btn pass-btn"
        onClick={onPass}
        disabled={!canPass}
      >
        Pass Ball
      </button>
      
      <button 
        className="control-btn shoot-btn"
        onClick={onShoot}
        disabled={!canShoot}
      >
        Shoot
      </button>
      
      <button 
        className="control-btn end-turn-btn"
        onClick={onEndTurn}
        disabled={movesRemaining <= 0}
      >
        End Turn ({movesRemaining} moves left)
      </button>
    </div>
  );
};

export default GameControls;

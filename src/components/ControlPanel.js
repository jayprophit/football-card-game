import React from 'react';
import PropTypes from 'prop-types';

const ControlPanel = ({ onStartGame, onResetGame }) => {
  return (
    <div className="control-panel">
      <button onClick={onStartGame}>Start Game</button>
      <button onClick={onResetGame}>Reset Game</button>
    </div>
  );
};

ControlPanel.propTypes = {
  onStartGame: PropTypes.func.isRequired,
  onResetGame: PropTypes.func.isRequired
};

export default ControlPanel;
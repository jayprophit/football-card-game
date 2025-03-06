import React from 'react';

const GameStateInfo = ({ gameState }) => (
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

export default GameStateInfo;

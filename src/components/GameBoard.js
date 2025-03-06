import React from 'react';
import PropTypes from 'prop-types';
import Square from './Square';
import PlayerCard from './PlayerCard';

const GameBoard = ({ squares, players }) => {
  return (
    <div className="game-board">
      <div className="squares">
        {squares.map((square, index) => (
          <Square key={index} value={square} />
        ))}
      </div>
      <div className="players">
        {players.map((player, index) => (
          <PlayerCard key={index} player={player} />
        ))}
      </div>
    </div>
  );
};

GameBoard.propTypes = {
  squares: PropTypes.arrayOf(PropTypes.string).isRequired,
  players: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string.isRequired,
      position: PropTypes.string.isRequired,
      team: PropTypes.string.isRequired
    })
  ).isRequired
};

export default GameBoard;
import React from 'react';
import PropTypes from 'prop-types';
import defaultPlayerImage from '../assets/default-player.png';

const PlayerCard = ({ player }) => {
  return (
    <div className="player-card">
      <img src={player.image || defaultPlayerImage} alt={`${player.name}'s avatar`} />
      <h2>{player.name}</h2>
      <p>Position: {player.position}</p>
      <p>Team: {player.team}</p>
    </div>
  );
};

PlayerCard.propTypes = {
  player: PropTypes.shape({
    image: PropTypes.string,
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired
  }).isRequired
};

export default PlayerCard;
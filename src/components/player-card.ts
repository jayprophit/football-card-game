import React from 'react';
import { Card, InjuryType } from '../models/GameModels';

interface PlayerCardProps {
  card: Card;
  hasBall: boolean;
  isCurrentTeam: boolean;
  zIndex?: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  card, 
  hasBall, 
  isCurrentTeam,
  zIndex = 0
}) => {
  const { player } = card;
  const teamColor = player.team.primaryColor;
  
  // Get position abbreviation
  const getPositionAbbr = (position: string): string => {
    return position.split(' ').map(word => word[0]).join('');
  };
  
  // Get card status indicators
  const getCardStatus = () => {
    const statuses = [];
    
    if (card.yellowCard) {
      statuses.push(
        <div key="yellow" className="card-status yellow-card" title="Yellow Card"></div>
      );
    }
    
    if (card.redCard) {
      statuses.push(
        <div key="red" className="card-status red-card" title="Red Card"></div>
      );
    }
    
    if (card.injury) {
      const injuryClass = 
        card.injury === InjuryType.MINOR ? 'minor-injury' :
        card.injury === InjuryType.SERIOUS ? 'serious-injury' : 'severe-injury';
      
      statuses.push(
        <div key="injury" className={`card-status ${injuryClass}`} title={card.injury}></div>
      );
    }
    
    return statuses;
  };
  
  return (
    <div 
      className={`card ${player.team === player.team ? 'home-team' : 'away-team'} ${isCurrentTeam ? 'current-team' : ''}`}
      style={{ 
        backgroundColor: teamColor,
        zIndex,
        opacity: card.redCard ? 0.5 : 1 // Fade out red-carded players
      }}
    >
      <div className="card-content">
        {player.avatarUrl ? (
          <img 
            src={player.avatarUrl} 
            alt={player.name} 
            className="player-image"
          />
        ) : (
          <div 
            className="player-image-placeholder"
            style={{ backgroundColor: player.team.secondaryColor }}
          >
            {getPositionAbbr(player.position)}
          </div>
        )}
        
        <div className="player-name">{player.name}</div>
        <div className="player-position">{getPositionAbbr(player.position)}</div>
        
        {/* Display ball indicator if this card has the ball */}
        {hasBall && (
          <div className="ball-indicator"></div>
        )}
        
        {/* Display card status indicators */}
        <div className="card-statuses">
          {getCardStatus()}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

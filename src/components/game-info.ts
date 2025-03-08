import React from 'react';
import { Team, Player } from '../models/GameModels';
import { GameActionType } from '../logic/engine/GameEngine';

interface GameInfoProps {
  homeTeam: Team;
  awayTeam: Team;
  score: [number, number];
  currentTeam: Team;
  movesRemaining: number;
  gameHistory: any[];
}

const GameInfo: React.FC<GameInfoProps> = ({
  homeTeam,
  awayTeam,
  score,
  currentTeam,
  movesRemaining,
  gameHistory
}) => {
  // Format the latest game events
  const latestEvents = gameHistory
    .slice(-5)
    .reverse()
    .map((action, index) => {
      let eventText = '';
      
      switch (action.type) {
        case GameActionType.MOVE:
          eventText = `${action.card.player.name} moved on the pitch`;
          break;
        case GameActionType.PASS:
          eventText = action.success
            ? `${action.card.player.name} passed to ${action.targetCard.player.name}`
            : `${action.card.player.name} failed to pass to ${action.targetCard.player.name}`;
          break;
        case GameActionType.SHOT:
          eventText = action.success
            ? `${action.card.player.name} took a shot!`
            : `${action.card.player.name}'s shot was saved/missed`;
          break;
        case GameActionType.GOAL:
          eventText = `GOAL! ${action.card.player.name} scored for ${action.card.player.team.name}!`;
          break;
        case GameActionType.FOUL:
          eventText = `${action.card.player.name} committed a foul on ${action.victim.player.name}`;
          if (action.yellowCard) {
            eventText += ' - Yellow Card';
          }
          if (action.redCard) {
            eventText += ' - Red Card';
          }
          break;
        case GameActionType.BALL_WON:
          eventText = `${action.card.player.name} won the ball`;
          break;
        case GameActionType.INTERCEPTION:
          eventText = `${action.card.player.name} intercepted the pass`;
          break;
        default:
          eventText = 'Game action';
      }
      
      return (
        <div key={index} className="game-event">
          {eventText}
        </div>
      );
    });
  
  return (
    <div className="game-info">
      <div className="score-header">
        <div className="team-info home-team-info">
          <div className="team-logo">
            {homeTeam.logoUrl && <img src={homeTeam.logoUrl} alt={homeTeam.name} />}
          </div>
          <div className="team-name">{homeTeam.name}</div>
        </div>
        
        <div className="score-display">
          <span className="score-value">{score[0]}</span>
          <span className="score-separator">-</span>
          <span className="score-value">{score[1]}</span>
        </div>
        
        <div className="team-info away-team-info">
          <div className="team-name">{awayTeam.name}</div>
          <div className="team-logo">
            {awayTeam.logoUrl && <img src={awayTeam.logoUrl} alt={awayTeam.name} />}
          </div>
        </div>
      </div>
      
      <div className="game-status">
        <div className="current-team">
          Current turn: <span style={{ color: currentTeam.primaryColor }}>{currentTeam.name}</span>
        </div>
        <div className="moves-counter">
          Moves remaining: {movesRemaining}
        </div>
      </div>
      
      <div className="game-events">
        <h3>Recent Events</h3>
        {latestEvents.length > 0 ? latestEvents : <div className="no-events">Game just started</div>}
      </div>
    </div>
  );
};

export default GameInfo;

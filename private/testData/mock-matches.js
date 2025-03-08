/**
 * Mock Matches Generator
 * 
 * Generates mock match data for testing and development.
 */

const { generateTestTeam } = require('./teamGenerator');
const { GameState, GameActionType } = require('../../src/logic/engine/GameEngine');

/**
 * Generate a mock match action
 * @param {object} homeTeam - Home team object
 * @param {object} awayTeam - Away team object
 * @param {number} minute - Match minute
 * @returns {object} - Mock match action
 */
function generateMockAction(homeTeam, awayTeam, minute) {
  const teams = [homeTeam, awayTeam];
  const actingTeamIndex = Math.floor(Math.random() * 2);
  const actingTeam = teams[actingTeamIndex];
  const opposingTeam = teams[1 - actingTeamIndex];
  
  // Random player from acting team
  const actingPlayer = actingTeam.players[Math.floor(Math.random() * actingTeam.players.length)];
  
  // Random action type weighted by likelihood
  const actionRandom = Math.random();
  let actionType;
  
  if (actionRandom < 0.6) {
    // Common actions: MOVE, PASS
    actionType = actionRandom < 0.3 ? GameActionType.MOVE : GameActionType.PASS;
  } else if (actionRandom < 0.8) {
    // Less common: SHOT, BALL_WON, INTERCEPTION
    actionType = [GameActionType.SHOT, GameActionType.BALL_WON, GameActionType.INTERCEPTION][Math.floor(Math.random() * 3)];
  } else if (actionRandom < 0.9) {
    // Uncommon: FOUL, CARD
    actionType = actionRandom < 0.85 ? GameActionType.FOUL : GameActionType.CARD;
  } else {
    // Rare: GOAL, INJURY
    actionType = actionRandom < 0.95 ? GameActionType.GOAL : GameActionType.INJURY;
  }
  
  // Generate action details based on type
  const action = {
    type: actionType,
    minute,
    team: actingTeam,
    player: actingPlayer,
    from: [Math.floor(Math.random() * 13), Math.floor(Math.random() * 9)],
    to: [Math.floor(Math.random() * 13), Math.floor(Math.random() * 9)]
  };
  
  // Add type-specific details
  switch (actionType) {
    case GameActionType.PASS:
    case GameActionType.SHOT:
      action.success = Math.random() > 0.3; // 70% chance of success
      
      if (actionType === GameActionType.PASS) {
        action.targetPlayer = actingTeam.players[Math.floor(Math.random() * actingTeam.players.length)];
      }
      break;
      
    case GameActionType.GOAL:
      action.score = [
        actingTeamIndex === 0 ? 1 : 0,
        actingTeamIndex === 1 ? 1 : 0
      ];
      break;
      
    case GameActionType.FOUL:
      action.victim = opposingTeam.players[Math.floor(Math.random() * opposingTeam.players.length)];
      action.yellowCard = Math.random() > 0.6;
      action.redCard = Math.random() > 0.9;
      break;
      
    case GameActionType.INJURY:
      action.victim = opposingTeam.players[Math.floor(Math.random() * opposingTeam.players.length)];
      action.severity = ['minor', 'serious', 'unable_to_continue'][Math.floor(Math.random() * 3)];
      break;
      
    case GameActionType.CARD:
      action.cardType = Math.random() > 0.8 ? 'red' : 'yellow';
      break;
      
    case GameActionType.BALL_WON:
    case GameActionType.INTERCEPTION:
      action.fromPlayer = opposingTeam.players[Math.floor(Math.random() * opposingTeam.players.length)];
      break;
  }
  
  return action;
}

/**
 * Generate a complete mock match
 * @param {object} homeTeam - Home team object (optional)
 * @param {object} awayTeam - Away team object (optional)
 * @param {number} actionsCount - Number of actions to generate
 * @returns {object} - Mock match data
 */
function generateMockMatch(homeTeam = null, awayTeam = null, actionsCount = 50) {
  // Generate teams if not provided
  const home = homeTeam || generateTestTeam('home_team', 'Home FC');
  const away = awayTeam || generateTestTeam('away_team', 'Away FC');
  
  // Generate match actions
  const actions = [];
  let homeScore = 0;
  let awayScore = 0;
  
  for (let i = 0; i < actionsCount; i++) {
    // Calculate match minute (0-90)
    const minute = Math.floor((i / actionsCount) * 90);
    
    // Generate action
    const action = generateMockAction(home, away, minute);
    
    // Update score if goal
    if (action.type === GameActionType.GOAL) {
      if (action.team === home) {
        homeScore++;
      } else {
        awayScore++;
      }
      
      action.score = [homeScore, awayScore];
    }
    
    actions.push(action);
  }
  
  // Create match object
  return {
    id: `match_${Date.now()}`,
    date: new Date(),
    homeTeam: home,
    awayTeam: away,
    finalScore: [homeScore, awayScore],
    actions,
    state: GameState.FULL_TIME
  };
}

/**
 * Generate multiple mock matches
 * @param {number} count - Number of matches to generate
 * @returns {Array} - Array of mock match objects
 */
function generateMultipleMockMatches(count = 5) {
  return Array(count).fill(null).map(() => generateMockMatch());
}

module.exports = {
  generateMockAction,
  generateMockMatch,
  generateMultipleMockMatches
};

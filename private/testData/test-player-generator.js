/**
 * Test Player Generator
 * 
 * Generates test players with random stats for development and testing.
 */

const { Position } = require('../../src/models/GameModels');

// Available first names for random generation
const firstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark',
  'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth', 'Kevin', 'Brian',
  'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan', 'Jacob',
  'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott',
  'Brandon', 'Benjamin', 'Samuel', 'Gregory', 'Alexander', 'Patrick', 'Frank',
  'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron', 'Jose', 'Adam', 'Nathan'
];

// Available last names for random generation
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
  'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin',
  'Thompson', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis',
  'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King', 'Wright',
  'Lopez', 'Hill', 'Scott', 'Green', 'Adams', 'Baker', 'Gonzalez', 'Nelson',
  'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell',
  'Parker', 'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris',
  'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy', 'Bailey', 'Rivera',
  'Cooper', 'Richardson', 'Cox', 'Howard', 'Ward', 'Torres', 'Peterson', 'Gray',
  'Ramirez', 'James', 'Watson', 'Brooks', 'Kelly', 'Sanders', 'Price', 'Bennett'
];

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random player name
 * @returns {string} - Random player name
 */
function generatePlayerName() {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

/**
 * Generate random player stats based on position
 * @param {string} position - Player position
 * @returns {object} - Random player stats
 */
function generatePlayerStats(position) {
  // Base stats with some randomness
  const baseStats = {
    pace: getRandomInt(60, 90),
    shooting: getRandomInt(60, 90),
    passing: getRandomInt(60, 90),
    dribbling: getRandomInt(60, 90),
    defending: getRandomInt(60, 90),
    physical: getRandomInt(60, 90)
  };
  
  // Adjust stats based on position
  switch (position) {
    case Position.GK:
      baseStats.defending = getRandomInt(80, 95);
      baseStats.physical = getRandomInt(75, 90);
      baseStats.shooting = getRandomInt(30, 50);
      break;
    case Position.CB:
    case Position.LB:
    case Position.RB:
      baseStats.defending = getRandomInt(75, 92);
      baseStats.physical = getRandomInt(75, 88);
      baseStats.passing = getRandomInt(65, 80);
      break;
    case Position.CDM:
      baseStats.defending = getRandomInt(75, 88);
      baseStats.passing = getRandomInt(75, 85);
      baseStats.physical = getRandomInt(75, 87);
      break;
    case Position.CM:
      baseStats.passing = getRandomInt(80, 92);
      baseStats.dribbling = getRandomInt(75, 88);
      break;
    case Position.CAM:
      baseStats.passing = getRandomInt(82, 94);
      baseStats.dribbling = getRandomInt(80, 92);
      baseStats.shooting = getRandomInt(75, 88);
      break;
    case Position.LW:
    case Position.RW:
      baseStats.pace = getRandomInt(85, 95);
      baseStats.dribbling = getRandomInt(82, 92);
      baseStats.shooting = getRandomInt(75, 87);
      break;
    case Position.ST:
    case Position.CF:
      baseStats.shooting = getRandomInt(85, 95);
      baseStats.physical = getRandomInt(75, 90);
      baseStats.pace = getRandomInt(75, 88);
      break;
  }
  
  return baseStats;
}

/**
 * Generate a complete test player
 * @param {string} teamId - Team ID
 * @param {number} index - Player index
 * @param {string} position - Player position
 * @param {object} team - Team object
 * @returns {object} - Test player object
 */
function generateTestPlayer(teamId, index, position, team) {
  const name = generatePlayerName();
  const stats = generatePlayerStats(position);
  
  return {
    id: `${teamId}_player_${index}`,
    name: name,
    position: position,
    team: team,
    stats: stats,
    avatarUrl: null
  };
}

/**
 * Generate a complete set of test players for a team
 * @param {string} teamId - Team ID
 * @param {Array} positions - Array of player positions
 * @param {object} team - Team object
 * @returns {Array} - Array of test players
 */
function generateTestTeamPlayers(teamId, positions, team) {
  return positions.map((position, index) => 
    generateTestPlayer(teamId, index, position, team)
  );
}

module.exports = {
  generatePlayerName,
  generatePlayerStats,
  generateTestPlayer,
  generateTestTeamPlayers
};

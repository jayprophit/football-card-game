/**
 * Test Team Generator
 * 
 * Generates test teams with random properties and players for development and testing.
 */

const { Position } = require('../../src/models/GameModels');
const { generateTestTeamPlayers } = require('./playerGenerator');

// Team name prefixes for random generation
const teamPrefixes = [
  'FC', 'United', 'City', 'Rovers', 'Athletic', 'Wanderers', 'Rangers',
  'Dynamo', 'Sporting', 'Real', 'Inter', 'Atlético', 'Olympique', 'Galatasaray'
];

// City/location names for random generation
const cityNames = [
  'London', 'Manchester', 'Liverpool', 'Madrid', 'Barcelona', 'Milan', 'Rome',
  'Paris', 'Berlin', 'Munich', 'Amsterdam', 'Brussels', 'Vienna', 'Lisbon',
  'Athens', 'Moscow', 'Kiev', 'Prague', 'Stockholm', 'Copenhagen', 'Oslo',
  'Helsinki', 'Zagreb', 'Belgrade', 'Sofia', 'Bucharest', 'Budapest', 'Warsaw',
  'Dublin', 'Edinburgh', 'Cardiff', 'Leeds', 'Newcastle', 'Birmingham', 'Bristol',
  'Glasgow', 'Sheffield', 'Lyon', 'Marseille', 'Seville', 'Valencia', 'Naples',
  'Turin', 'Florence', 'Dortmund', 'Frankfurt', 'Porto', 'Benfica', 'Ajax'
];

/**
 * Generate a random team name
 * @returns {string} - Random team name
 */
function generateTeamName() {
  // Decide whether to use "City Name + Team Prefix" or "Team Prefix + City Name"
  const usePrefix = Math.random() > 0.5;
  const cityName = cityNames[Math.floor(Math.random() * cityNames.length)];
  const prefix = teamPrefixes[Math.floor(Math.random() * teamPrefixes.length)];
  
  return usePrefix ? `${cityName} ${prefix}` : `${prefix} ${cityName}`;
}

/**
 * Generate a random color in hex format
 * @returns {string} - Random hex color
 */
function generateRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Generate player positions based on formation
 * @param {Array} formation - Team formation as [defenders, midfielders, forwards]
 * @returns {Array} - Array of player positions
 */
function generatePositionsFromFormation(formation) {
  const [defenders, midfielders, forwards] = formation;
  const positions = [Position.GK]; // Always start with a goalkeeper
  
  // Add defenders
  if (defenders === 3) {
    positions.push(Position.CB, Position.CB, Position.CB);
  } else if (defenders === 4) {
    positions.push(Position.LB, Position.CB, Position.CB, Position.RB);
  } else if (defenders === 5) {
    positions.push(Position.LB, Position.CB, Position.CB, Position.CB, Position.RB);
  }
  
  // Add midfielders
  if (midfielders === 3) {
    positions.push(Position.CDM, Position.CM, Position.CAM);
  } else if (midfielders === 4) {
    positions.push(Position.LM, Position.CM, Position.CM, Position.RM);
  } else if (midfielders === 5) {
    positions.push(Position.LM, Position.CDM, Position.CM, Position.CAM, Position.RM);
  }
  
  // Add forwards
  if (forwards === 1) {
    positions.push(Position.ST);
  } else if (forwards === 2) {
    positions.push(Position.ST, Position.ST);
  } else if (forwards === 3) {
    positions.push(Position.LW, Position.ST, Position.RW);
  }
  
  return positions;
}

/**
 * Generate a complete test team
 * @param {string} id - Team ID
 * @param {string} name - Team name
 * @param {Array} formation - Team formation
 * @param {string} primaryColor - Primary team color
 * @param {string} secondaryColor - Secondary team color
 * @returns {object} - Test team object
 */
function generateTestTeam(
  id = null,
  name = null,
  formation = null,
  primaryColor = null,
  secondaryColor = null
) {
  // Generate random values for null parameters
  const teamId = id || `team_${Math.floor(Math.random() * 1000)}`;
  const teamName = name || generateTeamName();
  const teamFormation = formation || [4, 3, 3]; // Default to 4-3-3
  const teamPrimaryColor = primaryColor || generateRandomColor();
  const teamSecondaryColor = secondaryColor || generateRandomColor();
  
  // Create team object
  const team = {
    id: teamId,
    name: teamName,
    formation: teamFormation,
    primaryColor: teamPrimaryColor,
    secondaryColor: teamSecondaryColor,
    logoUrl: null,
    players: []
  };
  
  // Generate positions based on formation
  const positions = generatePositionsFromFormation(teamFormation);
  
  // Generate players
  team.players = generateTestTeamPlayers(teamId, positions, team);
  
  return team;
}

/**
 * Generate multiple random test teams
 * @param {number} count - Number of teams to generate
 * @returns {Array} - Array of test team objects
 */
function generateMultipleTestTeams(count = 2) {
  return Array(count).fill(null).map((_, index) => 
    generateTestTeam(`team_${index}`)
  );
}

module.exports = {
  generateTeamName,
  generateRandomColor,
  generatePositionsFromFormation,
  generateTestTeam,
  generateMultipleTestTeams
};

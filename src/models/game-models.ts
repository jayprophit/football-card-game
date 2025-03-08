// Define player positions
export enum Position {
  GK = 'Goalkeeper',
  CB = 'Center Back',
  LB = 'Left Back',
  RB = 'Right Back',
  CDM = 'Defensive Midfielder',
  CM = 'Central Midfielder',
  CAM = 'Attacking Midfielder',
  LM = 'Left Midfielder',
  RM = 'Right Midfielder',
  LW = 'Left Winger',
  RW = 'Right Winger',
  ST = 'Striker',
  CF = 'Center Forward'
}

// Define foul types
export enum FoulType {
  SOFT = 'Soft Foul',
  HARD = 'Hard Foul',
  INJURY = 'Injury Foul'
}

// Define injury types
export enum InjuryType {
  MINOR = 'Minor Injury',
  SERIOUS = 'Serious Injury',
  UNABLE_TO_CONTINUE = 'Unable to Continue'
}

// Define the card class
export class Card {
  player: Player;
  yellowCard: boolean;
  redCard: boolean;
  injury: InjuryType | null;
  
  constructor(player: Player) {
    this.player = player;
    this.yellowCard = false;
    this.redCard = false;
    this.injury = null;
  }
}

// Define the player class
export class Player {
  id: string;
  name: string;
  position: Position;
  team: Team;
  card: Card;
  stats: PlayerStats;
  avatarUrl: string | null;
  
  constructor(
    id: string,
    name: string,
    position: Position,
    team: Team,
    stats: PlayerStats,
    avatarUrl: string | null = null
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.team = team;
    this.stats = stats;
    this.avatarUrl = avatarUrl;
    this.card = new Card(this);
  }
}

// Player statistics
export interface PlayerStats {
  pace: number;       // Speed and acceleration
  shooting: number;   // Shooting accuracy and power
  passing: number;    // Passing accuracy and vision
  dribbling: number;  // Ball control and agility
  defending: number;  // Tackling and interceptions
  physical: number;   // Strength and stamina
}

// Team formation type (e.g., 4-4-2, 4-3-3, etc.)
export type Formation = [number, number, number]; // [defenders, midfielders, forwards]

// Define the team class
export class Team {
  id: string;
  name: string;
  players: Player[];
  formation: Formation;
  primaryColor: string;
  secondaryColor: string;
  logoUrl: string | null;
  
  constructor(
    id: string,
    name: string,
    formation: Formation,
    primaryColor: string,
    secondaryColor: string,
    logoUrl: string | null = null
  ) {
    this.id = id;
    this.name = name;
    this.players = [];
    this.formation = formation;
    this.primaryColor = primaryColor;
    this.secondaryColor = secondaryColor;
    this.logoUrl = logoUrl;
  }
  
  // Add a player to the team
  addPlayer(player: Player): void {
    this.players.push(player);
  }
  
  // Get players by position
  getPlayersByPosition(position: Position): Player[] {
    return this.players.filter(player => player.position === position);
  }
  
  // Create standard team with default players
  static createStandardTeam(
    id: string,
    name: string,
    formation: Formation = [4, 3, 3],
    primaryColor: string = '#ff0000',
    secondaryColor: string = '#ffffff',
    logoUrl: string | null = null
  ): Team {
    const team = new Team(id, name, formation, primaryColor, secondaryColor, logoUrl);
    
    // Create default players for the team
    const playerPositions: Position[] = [
      Position.GK,
      Position.LB, Position.CB, Position.CB, Position.RB,
      Position.CDM, Position.CM, Position.CAM,
      Position.LW, Position.ST, Position.RW
    ];
    
    const defaultStats: PlayerStats = {
      pace: 75,
      shooting: 75,
      passing: 75,
      dribbling: 75,
      defending: 75,
      physical: 75
    };
    
    playerPositions.forEach((position, index) => {
      // Adjust stats based on position
      const stats = { ...defaultStats };
      
      switch (position) {
        case Position.GK:
          stats.defending = 85;
          stats.physical = 80;
          stats.shooting = 30;
          break;
        case Position.CB:
        case Position.LB:
        case Position.RB:
          stats.defending = 82;
          stats.physical = 78;
          stats.passing = 70;
          break;
        case Position.CDM:
          stats.defending = 80;
          stats.passing = 76;
          stats.physical = 77;
          break;
        case Position.CM:
          stats.passing = 82;
          stats.dribbling = 78;
          break;
        case Position.CAM:
          stats.passing = 84;
          stats.dribbling = 82;
          stats.shooting = 78;
          break;
        case Position.LW:
        case Position.RW:
          stats.pace = 85;
          stats.dribbling = 83;
          stats.shooting = 77;
          break;
        case Position.ST:
          stats.shooting = 85;
          stats.physical = 80;
          stats.pace = 78;
          break;
      }
      
      const player = new Player(
        `${id}_player_${index}`,
        `Player ${index + 1}`,
        position,
        team,
        stats
      );
      
      team.addPlayer(player);
    });
    
    return team;
  }
}

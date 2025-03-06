// Core Game Engine for FootballChess
// This file demonstrates the architecture of the game's core engine

// Game constants
const GRID_WIDTH = 20;
const GRID_HEIGHT = 10;
const GOAL_WIDTH = 3;
const MOVES_PER_TURN = 3;

// Movement patterns based on chess pieces
const MOVEMENT_PATTERNS = {
  // Goalkeeper moves like a King but restricted to the goal area
  GOALKEEPER: (x, y, team) => {
    const moves = [];
    const goalArea = team === 'home' 
      ? { minX: 0, maxX: 2, minY: 3, maxY: 6 } 
      : { minX: GRID_WIDTH - 3, maxX: GRID_WIDTH - 1, minY: 3, maxY: 6 };

    // Check all 8 surrounding squares
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        
        const newX = x + dx;
        const newY = y + dy;
        
        // Check if within goalkeeper's area
        if (newX >= goalArea.minX && newX <= goalArea.maxX && 
            newY >= goalArea.minY && newY <= goalArea.maxY) {
          moves.push({ x: newX, y: newY });
        }
      }
    }
    return moves;
  },
  
  // Defenders (Rook-like movement)
  DEFENDER_CB: (x, y) => {
    const moves = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // Up, down, left, right
    
    directions.forEach(([dx, dy]) => {
      for (let step = 1; step <= 4; step++) {
        const newX = x + (dx * step);
        const newY = y + (dy * step);
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          moves.push({ x: newX, y: newY });
        }
      }
    });
    
    return moves;
  },
  
  // Fullbacks (Bishop-like movement)
  DEFENDER_FB: (x, y) => {
    const moves = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]]; // Diagonals
    
    directions.forEach(([dx, dy]) => {
      for (let step = 1; step <= 4; step++) {
        const newX = x + (dx * step);
        const newY = y + (dy * step);
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          moves.push({ x: newX, y: newY });
        }
      }
    });
    
    return moves;
  },
  
  // Midfielders (Queen-like movement)
  MIDFIELDER: (x, y) => {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ]; // All 8 directions
    
    directions.forEach(([dx, dy]) => {
      for (let step = 1; step <= 3; step++) {
        const newX = x + (dx * step);
        const newY = y + (dy * step);
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          moves.push({ x: newX, y: newY });
        }
      }
    });
    
    return moves;
  },
  
  // Wingers (Knight + horizontal movement)
  WINGER: (x, y) => {
    const moves = [];
    
    // Knight moves
    const knightMoves = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    knightMoves.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
        moves.push({ x: newX, y: newY });
      }
    });
    
    // Additional horizontal moves
    [[-2, 0], [-1, 0], [1, 0], [2, 0]].forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      
      if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
        moves.push({ x: newX, y: newY });
      }
    });
    
    return moves;
  },
  
  // Strikers (Enhanced King movement)
  STRIKER: (x, y) => {
    const moves = [];
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];
    
    directions.forEach(([dx, dy]) => {
      for (let step = 1; step <= 2; step++) {
        const newX = x + (dx * step);
        const newY = y + (dy * step);
        
        if (newX >= 0 && newX < GRID_WIDTH && newY >= 0 && newY < GRID_HEIGHT) {
          moves.push({ x: newX, y: newY });
        }
      }
    });
    
    return moves;
  }
};

// Player class
class Player {
  constructor(id, position, x, y, rating, number, team, type) {
    this.id = id;
    this.position = position;
    this.x = x;
    this.y = y;
    this.rating = rating;
    this.number = number;
    this.team = team;
    this.type = type;
    this.hasBall = false;
    this.yellowCards = 0;
    this.redCard = false;
    this.injured = false;
    this.injuryType = null;
    this.avatarTexture = null;
  }
  
  getMovementPattern() {
    switch(this.type) {
      case 'goalkeeper':
        return MOVEMENT_PATTERNS.GOALKEEPER(this.x, this.y, this.team);
      case 'defender-cb':
        return MOVEMENT_PATTERNS.DEFENDER_CB(this.x, this.y);
      case 'defender-fb':
        return MOVEMENT_PATTERNS.DEFENDER_FB(this.x, this.y);
      case 'midfielder':
        return MOVEMENT_PATTERNS.MIDFIELDER(this.x, this.y);
      case 'winger':
        return MOVEMENT_PATTERNS.WINGER(this.x, this.y);
      case 'striker':
        return MOVEMENT_PATTERNS.STRIKER(this.x, this.y);
      default:
        return [];
    }
  }
  
  getValidMoves(gameState) {
    // Can't move if has red card
    if (this.redCard) return [];
    
    // Get basic movement pattern
    let moves = this.getMovementPattern();
    
    // Filter out squares occupied by teammates
    moves = moves.filter(move => {
      const teammatesAtDestination = gameState.players[this.team].filter(
        p => p.x === move.x && p.y === move.y && !p.redCard && p.id !== this.id
      );
      return teammatesAtDestination.length === 0;
    });
    
    return moves;
  }
  
  move(x, y) {
    this.x = x;
    this.y = y;
  }
  
  receiveYellowCard() {
    this.yellowCards += 1;
    if (this.yellowCards >= 2) {
      this.redCard = true;
    }
    return this.redCard;
  }
  
  receiveRedCard() {
    this.redCard = true;
    return true;
  }
  
  receiveInjury(severity) {
    this.injured = true;
    this.injuryType = severity;
    return severity;
  }
}

// Game state class
class GameState {
  constructor() {
    this.turn = 'home';
    this.phase = 'select';
    this.movesRemaining = MOVES_PER_TURN;
    this.selectedPlayer = null;
    this.homeScore = 0;
    this.awayScore = 0;
    this.matchTime = 0; // in minutes
    this.events = [];
    this.players = {
      home: this.createTeam('home'),
      away: this.createTeam('away')
    };
    this.ballPosition = { x: 10, y: 5 };
    
    // Initialize ball with center midfielder
    const centerMid = this.players.home.find(p => p.position === 'CAM');
    if (centerMid) {
      centerMid.hasBall = true;
      this.ballPosition.x = centerMid.x;
      this.ballPosition.y = centerMid.y;
    }
  }
  
  createTeam(teamSide) {
    const isHome = teamSide === 'home';
    
    // Base coordinates depend on side
    const defLine = isHome ? 2 : GRID_WIDTH - 3;
    const midLine = isHome ? 7 : GRID_WIDTH - 8;
    const attackLine = isHome ? 12 : GRID_WIDTH - 13;
    const goalKeeperX = isHome ? 0 : GRID_WIDTH - 1;
    
    const team = [
      // Goalkeeper
      new Player(`${teamSide}-gk`, 'GK', goalKeeperX, 5, 85 + Math.floor(Math.random() * 10), 1, teamSide, 'goalkeeper'),
      
      // Defenders
      new Player(`${teamSide}-cb1`, 'CB', defLine, 4, 80 + Math.floor(Math.random() * 10), 4, teamSide, 'defender-cb'),
      new Player(`${teamSide}-cb2`, 'CB', defLine, 6, 80 + Math.floor(Math.random() * 10), 5, teamSide, 'defender-cb'),
      new Player(`${teamSide}-lb`, 'LB', defLine, 2, 78 + Math.floor(Math.random() * 10), 3, teamSide, 'defender-fb'),
      new Player(`${teamSide}-rb`, 'RB', defLine, 8, 78 + Math.floor(Math.random() * 10), 2, teamSide, 'defender-fb'),
      
      // Midfielders
      new Player(`${teamSide}-cdm`, 'CDM', midLine - 2, 5, 82 + Math.floor(Math.random() * 10), 6, teamSide, 'midfielder'),
      new Player(`${teamSide}-cm`, 'CM', midLine, 5, 83 + Math.floor(Math.random() * 10), 8, teamSide, 'midfielder'),
      new Player(`${teamSide}-cam`, 'CAM', midLine + 2, 5, 85 + Math.floor(Math.random() * 10), 10, teamSide, 'midfielder'),
      
      // Wingers
      new Player(`${teamSide}-lw`, 'LW', attackLine - 2, 3, 83 + Math.floor(Math.random() * 10), 11, teamSide, 'winger'),
      new Player(`${teamSide}-rw`, 'RW', attackLine - 2, 7, 83 + Math.floor(Math.random() * 10), 7, teamSide, 'winger'),
      
      // Striker
      new Player(`${teamSide}-st`, 'ST', attackLine, 5, 87 + Math.floor(Math.random() * 10), 9, teamSide, 'striker')
    ];
    
    return team;
  }
  
  findBallOwner() {
    for (const team of ['home', 'away']) {
      const ballOwner = this.players[team].find(player => player.hasBall);
      if (ballOwner) return { player: ballOwner, team };
    }
    return null;
  }
  
  selectPlayer(playerId) {
    if (this.phase !== 'select' || this.movesRemaining <= 0) return false;
    
    const team = this.players.home.some(p => p.id === playerId) ? 'home' : 'away';
    
    // Can only select players from the current turn's team
    if (team !== this.turn) return false;
    
    const player = this.players[team].find(p => p.id === playerId);
    
    // Can't select players with red cards
    if (!player || player.redCard) return false;
    
    this.selectedPlayer = playerId;
    this.phase = 'move';
    
    return true;
  }
  
  movePlayer(x, y) {
    if (this.phase !== 'move' || !this.selectedPlayer) return false;
    
    const team = this.players.home.some(p => p.id === this.selectedPlayer) ? 'home' : 'away';
    const player = this.players[team].find(p => p.id === this.selectedPlayer);
    
    if (!player) return false;
    
    // Check if move is valid
    const validMoves = player.getValidMoves(this);
    const isValidMove = validMoves.some(move => move.x === x && move.y === y);
    
    if (!isValidMove) return false;
    
    // Handle ball movement if player has the ball
    const hasBall = player.hasBall;
    
    // Move the player
    player.move(x, y);
    
    if (hasBall) {
      // Move the ball with the player
      this.ballPosition.x = x;
      this.ballPosition.y = y;
      
      // Check for opponents at destination
      const opponentTeam = team === 'home' ? 'away' : 'home';
      const opponentsAtDestination = this.players[opponentTeam].filter(
        p => p.x === x && p.y === y && !p.redCard
      );
      
      // If there are opponents, check for possession change
      if (opponentsAtDestination.length > 0) {
        const teammatesAtDestination = this.players[team].filter(
          p => p.x === x && p.y === y && !p.redCard
        ).length;
        
        // Team with more players gets the ball
        if (opponentsAtDestination.length > teammatesAtDestination) {
          // Ball goes to an opponent
          player.hasBall = false;
          
          // Randomly select an opponent to get the ball
          const randomOpponent = opponentsAtDestination[
            Math.floor(Math.random() * opponentsAtDestination.length)
          ];
          randomOpponent.hasBall = true;
          
          // Add tackle event
          this.addEvent('tackle', {
            player: randomOpponent,
            team: opponentTeam
          });
        }
      }
      
      // Check for shot opportunity
      if ((team === 'home' && x >= GRID_WIDTH - 3) || 
          (team === 'away' && x <= 2)) {
        this.phase = 'shoot';
        return true;
      }
    } else {
      // Check if moving to where the ball is (loose ball)
      const ballOwner = this.findBallOwner();
      if (!ballOwner && x === this.ballPosition.x && y === this.ballPosition.y) {
        // Player picks up the loose ball
        player.hasBall = true;
        
        // Add event
        this.addEvent('pickup', {
          player: player,
          team: team
        });
      }
    }
    
    // Update game state
    this.selectedPlayer = null;
    this.phase = 'select';
    this.movesRemaining -= 1;
    
    // If no moves remaining, switch turns
    if (this.movesRemaining <= 0) {
      this.endTurn();
    }
    
    return true;
  }
  
  passToPlayer(targetPlayerId) {
    if (this.phase !== 'select' || this.movesRemaining <= 0) return false;
    
    const passingTeam = this.turn;
    const passer = this.findBallOwner()?.player;
    
    if (!passer || passer.team !== passingTeam) return false;
    
    const receiver = this.players[passingTeam].find(p => p.id === targetPlayerId);
    
    if (!receiver || receiver.redCard || receiver.id === passer.id) return false;
    
    // Calculate pass success probability
    const distance = Math.sqrt(
      Math.pow(receiver.x - passer.x, 2) + 
      Math.pow(receiver.y - passer.y, 2)
    );
    
    // Count opponents in passing lane
    const opponentTeam = passingTeam === 'home' ? 'away' : 'home';
    const opponentsInLane = this.countOpponentsInPassingLane(passer, receiver, opponentTeam);
    
    // Calculate success probability based on distance and opponents
    let successProbability = 0.9 - (distance * 0.03) - (opponentsInLane * 0.15);
    successProbability = Math.min(0.95, Math.max(0.1, successProbability));
    
    // Determine if pass is successful
    const isSuccessful = Math.random() < successProbability;
    
    if (isSuccessful) {
      // Successful pass
      passer.hasBall = false;
      receiver.hasBall = true;
      
      // Update ball position
      this.ballPosition.x = receiver.x;
      this.ballPosition.y = receiver.y;
      
      // Add pass event
      this.addEvent('pass', {
        passer: passer,
        receiver: receiver,
        team: passingTeam
      });
    } else {
      // Failed pass
      passer.hasBall = false;
      
      // Calculate interception point (midway between passer and receiver)
      const interceptionX = Math.floor((passer.x + receiver.x) / 2);
      const interceptionY = Math.floor((passer.y + receiver.y) / 2);
      
      // Check if there's an opponent at the interception point
      const interceptor = this.players[opponentTeam].find(p => 
        p.x === interceptionX && p.y === interceptionY && !p.redCard
      );
      
      if (interceptor) {
        // Opponent intercepts the ball
        interceptor.hasBall = true;
        
        // Update ball position
        this.ballPosition.x = interceptor.x;
        this.ballPosition.y = interceptor.y;
        
        // Add interception event
        this.addEvent('interception', {
          player: interceptor,
          team: opponentTeam
        });
      } else {
        // Ball goes loose
        this.ballPosition.x = interceptionX;
        this.ballPosition.y = interceptionY;
        
        // Add loose ball event
        this.addEvent('looseBall', {
          x: interceptionX,
          y: interceptionY
        });
      }
    }
    
    // Update game state
    this.movesRemaining -= 1;
    
    // If no moves remaining, switch turns
    if (this.movesRemaining <= 0) {
      this.endTurn();
    }
    
    return true;
  }
  
  shoot() {
    if (this.phase !== 'shoot') return false;
    
    const shootingTeam = this.turn;
    const shooter = this.findBallOwner()?.player;
    
    if (!shooter || shooter.team !== shootingTeam) return false;
    
    // Check if in shooting range (near goal)
    const isInRange = (shootingTeam === 'home' && shooter.x >= GRID_WIDTH - 5) || 
                     (shootingTeam === 'away' && shooter.x <= 4);
    
    if (!isInRange) {
      this.phase = 'select';
      return false;
    }
    
    // Calculate shot success probability
    const opposingTeam = shootingTeam === 'home' ? 'away' : 'home';
    
    // Find goalkeeper
    const goalkeeper = this.players[opposingTeam].find(p => p.position === 'GK');
    const goalkeeperRating = goalkeeper ? goalkeeper.rating : 80;
    
    // Count defenders in the area
    const defenseX = shootingTeam === 'home' 
      ? [GRID_WIDTH - 3, GRID_WIDTH - 2, GRID_WIDTH - 1] 
      : [0, 1, 2];
      
    const defenders = this.players[opposingTeam].filter(p => 
      defenseX.includes(p.x) && 
      p.y >= 3 && p.y <= 7 && 
      !p.redCard && 
      p.position !== 'GK'
    );
    
    const defenderCount = defenders.length;
    
    // Calculate distance from center of goal
    const goalY = 5;
    const distanceFromCenter = Math.abs(shooter.y - goalY);
    
    // Base shot success probability
    let successProbability = (shooter.rating - goalkeeperRating + 10) / 100;
    
    // Adjust for defenders (each defender reduces probability)
    successProbability -= (defenderCount * 0.07);
    
    // Adjust for position (shots from center are more likely)
    successProbability -= (distanceFromCenter * 0.04);
    
    // Ensure probability is between 0.1 and 0.9
    successProbability = Math.min(0.9, Math.max(0.1, successProbability));
    
    // Determine if shot is successful
    const isGoal = Math.random() < successProbability;
    
    if (isGoal) {
      // Goal scored!
      if (shootingTeam === 'home') {
        this.homeScore += 1;
      } else {
        this.awayScore += 1;
      }
      
      // Add goal event
      this.addEvent('goal', {
        player: shooter,
        team: shootingTeam
      });
      
      // Reset for kickoff
      this.resetForKickoff(opposingTeam);
    } else {
      // Shot saved or missed
      shooter.hasBall = false;
      
      if (goalkeeper && Math.random() < 0.7) {
        // Goalkeeper saves
        goalkeeper.hasBall = true;
        this.ballPosition.x = goalkeeper.x;
        this.ballPosition.y = goalkeeper.y;
        
        // Add save event
        this.addEvent('save', {
          player: goalkeeper,
          team: opposingTeam
        });
      } else {
        // Shot missed, goal kick
        this.addEvent('miss', {
          player: shooter,
          team: shootingTeam
        });
        
        // Reset for goal kick
        this.resetForGoalKick(opposingTeam);
      }
    }
    
    // End turn after shot
    this.phase = 'select';
    this.endTurn();
    
    return true;
  }
  
  countOpponentsInPassingLane(passer, receiver, opponentTeam) {
    let count = 0;
    
    // Define the passing lane as a rectangle between passer and receiver
    const minX = Math.min(passer.x, receiver.x);
    const maxX = Math.max(passer.x, receiver.x);
    const minY = Math.min(passer.y, receiver.y);
    const maxY = Math.max(passer.y, receiver.y);
    
    // Expand lane slightly to account for nearby opponents
    const expandedMinX = Math.max(0, minX - 1);
    const expandedMaxX = Math.min(GRID_WIDTH - 1, maxX + 1);
    const expandedMinY = Math.max(0, minY - 1);
    const expandedMaxY = Math.min(GRID_HEIGHT - 1, maxY + 1);
    
    // Count opponents in the expanded rectangle
    this.players[opponentTeam].forEach(opponent => {
      if (!opponent.redCard &&
          opponent.x >= expandedMinX && opponent.x <= expandedMaxX &&
          opponent.y >= expandedMinY && opponent.y <= expandedMaxY) {
        count++;
      }
    });
    
    return count;
  }
  
  resetForKickoff(kickingTeam) {
    // Reset player positions to default formation
    this.players = {
      home: this.createTeam('home'),
      away: this.createTeam('away')
    };
    
    // Give ball to the center midfielder of the kicking team
    const kickingMid = this.players[kickingTeam].find(p => p.position === 'CAM' || p.position === 'CM');
    if (kickingMid) {
      kickingMid.hasBall = true;
      kickingMid.x = 10;
      kickingMid.y = 5;
      
      // Update ball position
      this.ballPosition.x = 10;
      this.ballPosition.y = 5;
    }
    
    // Reset game state
    this.phase = 'select';
    this.selectedPlayer = null;
  }
  
  resetForGoalKick(kickingTeam) {
    // Give ball to the goalkeeper
    const goalkeeper = this.players[kickingTeam].find(p => p.position === 'GK');
    if (goalkeeper) {
      // Clear ball possession from all players
      for (const team of ['home', 'away']) {
        this.players[team].forEach(p => {
          p.hasBall = false;
        });
      }
      
      // Give ball to goalkeeper
      goalkeeper.hasBall = true;
      
      // Update ball position
      this.ballPosition.x = goalkeeper.x;
      this.ballPosition.y = goalkeeper.y;
    }
    
    // Reset game state
    this.phase = 'select';
    this.selectedPlayer = null;
  }
  
  commitFoul(defenderPlayerId, attackerPlayerId, foulType) {
    const defenderTeam = this.players.home.some(p => p.id === defenderPlayerId) ? 'home' : 'away';
    const attackerTeam = defenderTeam === 'home' ? 'away' : 'home';
    
    const defender = this.players[defenderTeam].find(p => p.id === defenderPlayerId);
    const attacker = this.players[attackerTeam].find(p => p.id === attackerPlayerId);
    
    if (!defender || !attacker) return false;
    
    // Check if in scoring position
    const inScoringPosition = (attackerTeam === 'home' && attacker.x >= GRID_WIDTH - 5) || 
                              (attackerTeam === 'away' && attacker.x <= 4);
    
    let cardResult = null;
    let injuryResult = null;
    
    switch(foulType) {
      case 'soft':
        // Warning or yellow card
        if (inScoringPosition) {
          cardResult = defender.receiveYellowCard() ? 'red' : 'yellow';
        } else {
          // 30% chance of yellow card for soft foul
          if (Math.random() < 0.3) {
            cardResult = defender.receiveYellowCard() ? 'red' : 'yellow';
          } else {
            cardResult = 'warning';
          }
        }
        break;
        
      case 'hard':
        // Yellow or red card
        if (inScoringPosition) {
          cardResult = 'red';
          defender.receiveRedCard();
        } else {
          cardResult = defender.receiveYellowCard() ? 'red' : 'yellow';
        }
        
        // Check for injury (20% chance)
        if (Math.random() < 0.2) {
          const injurySeverity = Math.random() < 0.7 ? 'minor' : 'serious';
          injuryResult = attacker.receiveInjury(injurySeverity);
        }
        break;
        
      case 'injury':
        // Always red card
        cardResult = 'red';
        defender.receiveRedCard();
        
        // Determine injury severity
        const severity = Math.random() < 0.4 ? 'minor' : 
                         Math.random() < 0.8 ? 'serious' : 'unable-to-continue';
        injuryResult = attacker.receiveInjury(severity);
        
        // If unable to continue, remove from pitch
        if (severity === 'unable-to-continue') {
          // If player had the ball, ball goes loose
          if (attacker.hasBall) {
            attacker.hasBall = false;
            this.ballPosition = { x: attacker.x, y: attacker.y };
          }
          
          // In a real game, a substitution would happen
          // For simplicity, we just mark the player as red-carded too
          attacker.redCard = true;
        }
        break;
    }
    
    // Add foul event
    this.addEvent('foul', {
      defender,
      attacker,
      foulType,
      cardResult,
      injuryResult
    });
    
    // After a foul, the attacking team gets the ball at the location of the foul
    // Unless it's in the penalty area, which would be a penalty kick
    const inPenaltyArea = (attackerTeam === 'home' && attacker.x >= GRID_WIDTH - 3) || 
                           (attackerTeam === 'away' && attacker.x <= 2);
    
    if (inPenaltyArea) {
      // Set up for penalty kick
      this.setupPenaltyKick(attackerTeam, attacker);
    } else {
      // Free kick at location of foul
      this.setupFreeKick(attackerTeam, attacker);
    }
    
    return true;
  }
  
  setupPenaltyKick(attackingTeam, taker) {
    // Clear ball possession
    for (const team of ['home', 'away']) {
      this.players[team].forEach(p => {
        p.hasBall = false;
      });
    }
    
    // Position the penalty taker
    const penaltySpotX = attackingTeam === 'home' ? GRID_WIDTH - 2 : 1;
    taker.x = penaltySpotX;
    taker.y = 5; // Center of goal
    taker.hasBall = true;
    
    // Update ball position
    this.ballPosition.x = taker.x;
    this.ballPosition.y = taker.y;
    
    // Set game state for penalty
    this.phase = 'penalty';
    this.selectedPlayer = taker.id;
    this.addEvent('penaltyKick', {
      player: taker,
      team: attackingTeam
    });
  }
  
  setupFreeKick(attackingTeam, taker) {
    // Clear ball possession
    for (const team of ['home', 'away']) {
      this.players[team].forEach(p => {
        p.hasBall = false;
      });
    }
    
    // Give ball to the taker
    taker.hasBall = true;
    
    // Update ball position
    this.ballPosition.x = taker.x;
    this.ballPosition.y = taker.y;
    
    // Set game state for free kick
    this.phase = 'freekick';
    this.selectedPlayer = taker.id;
    this.addEvent('freeKick', {
      player: taker,
      team: attackingTeam
    });
  }
  
  addEvent(type, data) {
    const event = {
      type,
      time: this.matchTime,
      ...data
    };
    
    this.events.push(event);
    return event;
  }
  
  endTurn() {
    // Switch turn
    this.turn = this.turn === 'home' ? 'away' : 'home';
    
    // Advance match time (3 minutes per turn)
    this.matchTime += 3;
    
    // Check if match is over (90 minutes)
    if (this.matchTime >= 90) {
      this.phase = 'gameOver';
      return;
    }
    
    // Reset moves
    this.movesRemaining = MOVES_PER_TURN;
    this.phase = 'select';
    this.selectedPlayer = null;
  }
  
  checkForInjuries() {
    // Randomly check for non-foul related injuries (fatigue, etc.)
    for (const team of ['home', 'away']) {
      this.players[team].forEach(player => {
        // 1% chance of random injury per player per turn
        if (!player.injured && !player.redCard && Math.random() < 0.01) {
          // Determine severity (80% minor, 20% serious)
          const severity = Math.random() < 0.8 ? 'minor' : 'serious';
          player.receiveInjury(severity);
          
          // Add injury event
          this.addEvent('randomInjury', {
            player,
            team,
            severity
          });
        }
      });
    }
  }
}
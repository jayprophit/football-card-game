import { Player, Position, Team, Card, FoulType, InjuryType } from '../../models/GameModels';

// Types for the game engine
export interface Square {
  cards: Card[];
  hasBall?: boolean;
}

export enum GameState {
  KICKOFF,
  IN_PROGRESS,
  HALF_TIME,
  FULL_TIME,
  GOAL_SCORED,
  FOUL,
}

export enum GameActionType {
  MOVE,
  PASS,
  SHOT,
  GOAL,
  FOUL,
  CARD,
  INJURY,
  BALL_WON,
  BALL_CONTESTED,
  INTERCEPTION,
}

export interface GameAction {
  type: GameActionType;
  card: Card | null;
  from: [number, number];
  to: [number, number];
  success?: boolean;
  targetCard?: Card;
  victim?: Card;
  foulType?: FoulType;
  yellowCard?: boolean;
  redCard?: boolean;
  position?: [number, number];
}

export class GameEngine {
  private board: Square[][];
  private teams: [Team, Team];
  private currentTeamIndex: number;
  private movesRemaining: number;
  private ballPosition: [number, number] | null;
  private selectedCard: Card | null;
  private validMoves: [number, number][];
  private gameHistory: GameAction[];
  private gameState: GameState;
  private score: [number, number]; // [home, away]

  constructor(homeTeam: Team, awayTeam: Team) {
    // Initialize 13x9 board (standard football pitch divided into squares)
    this.board = Array(9).fill(null).map(() => Array(13).fill(null).map(() => ({ cards: [] })));
    this.teams = [homeTeam, awayTeam];
    this.currentTeamIndex = 0; // Home team starts
    this.movesRemaining = 3;
    this.ballPosition = [6, 4]; // Middle of the field
    this.selectedCard = null;
    this.validMoves = [];
    this.gameHistory = [];
    this.gameState = GameState.KICKOFF;
    this.score = [0, 0]; // [home, away]
    
    // Place players on the board in formation
    this.setupInitialPositions();
  }

  private setupInitialPositions(): void {
    // Home team setup (bottom half)
    this.placeTeamFormation(this.teams[0], true);
    
    // Away team setup (top half)
    this.placeTeamFormation(this.teams[1], false);
    
    // Place the ball in the center
    this.board[4][6].hasBall = true;
  }

  private placeTeamFormation(team: Team, isHomeTeam: boolean): void {
    const formation = team.formation;
    const yOffset = isHomeTeam ? 5 : 0; // Home team starts in bottom half
    
    // Place goalkeeper
    const goalkeeperY = isHomeTeam ? 8 : 0;
    this.addCardToSquare(team.players.find(p => p.position === Position.GK)!.card, 6, goalkeeperY);
    
    // Place defenders
    const defRow = isHomeTeam ? 7 : 1;
    const defenders = team.players.filter(p => 
      p.position === Position.CB || 
      p.position === Position.LB || 
      p.position === Position.RB
    );
    
    // Place midfielders
    const midRow = isHomeTeam ? 6 : 2;
    const midfielders = team.players.filter(p => 
      p.position === Position.CM || 
      p.position === Position.CDM || 
      p.position === Position.CAM || 
      p.position === Position.LM || 
      p.position === Position.RM
    );
    
    // Place forwards
    const attRow = isHomeTeam ? 5 : 3;
    const forwards = team.players.filter(p => 
      p.position === Position.ST || 
      p.position === Position.CF || 
      p.position === Position.LW || 
      p.position === Position.RW
    );
    
    // Distribute players across the width based on formation
    this.distributePlayers(defenders, defRow, formation[0]);
    this.distributePlayers(midfielders, midRow, formation[1]);
    this.distributePlayers(forwards, attRow, formation[2]);
  }
  
  private distributePlayers(players: Player[], row: number, count: number): void {
    const width = 13;
    const spacing = width / (count + 1);
    
    for (let i = 0; i < count; i++) {
      if (i < players.length) {
        const col = Math.floor(spacing * (i + 1));
        this.addCardToSquare(players[i].card, col, row);
      }
    }
  }
  
  private addCardToSquare(card: Card, x: number, y: number): void {
    if (y >= 0 && y < 9 && x >= 0 && x < 13) {
      this.board[y][x].cards.push(card);
    }
  }
  
  // Get valid moves for a card based on its position
  public getValidMoves(card: Card, currentX: number, currentY: number): [number, number][] {
    const position = card.player.position;
    const moves: [number, number][] = [];
    
    // Base movement patterns based on chess pieces
    switch (position) {
      case Position.GK: // Goalkeeper moves like a king but limited to 3 goal squares
        this.addMovesIfValid(moves, currentX, currentY, [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1],           [0, 1],
          [1, -1],  [1, 0],  [1, 1]
        ], card);
        
        // Filter to only goal area
        return moves.filter(([x, y]) => {
          const isHomeGoal = y === 8 && (x >= 5 && x <= 7);
          const isAwayGoal = y === 0 && (x >= 5 && x <= 7);
          return isHomeGoal || isAwayGoal;
        });
        
      case Position.CB: // Center Back moves like a rook (orthogonal)
      case Position.LB: // Left Back moves like a rook
      case Position.RB: // Right Back moves like a rook
        for (let i = 1; i <= 2; i++) { // Limited range of 2 squares
          this.addMovesIfValid(moves, currentX, currentY, [
            [0, -i], [-i, 0], [i, 0], [0, i]
          ], card);
        }
        return moves;
        
      case Position.CDM: // Defensive Midfielder moves like a bishop (diagonal)
      case Position.CM: // Central Midfielder moves like a bishop + orthogonal (1 square)
        // Bishop moves (diagonal)
        for (let i = 1; i <= 2; i++) {
          this.addMovesIfValid(moves, currentX, currentY, [
            [-i, -i], [-i, i], [i, -i], [i, i]
          ], card);
        }
        
        // For CM add orthogonal moves (1 square)
        if (position === Position.CM) {
          this.addMovesIfValid(moves, currentX, currentY, [
            [0, -1], [-1, 0], [1, 0], [0, 1]
          ], card);
        }
        return moves;
        
      case Position.CAM: // Attacking Midfielder moves like a queen but limited range
        for (let i = 1; i <= 2; i++) {
          this.addMovesIfValid(moves, currentX, currentY, [
            [-i, -i], [-i, 0], [-i, i],
            [0, -i],           [0, i],
            [i, -i],  [i, 0],  [i, i]
          ], card);
        }
        return moves;
        
      case Position.LM: // Left Midfielder moves like knight + 1 square orthogonal
      case Position.RM: // Right Midfielder moves like knight + 1 square orthogonal
        // Knight moves
        this.addMovesIfValid(moves, currentX, currentY, [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ], card);
        
        // Add orthogonal moves (1 square)
        this.addMovesIfValid(moves, currentX, currentY, [
          [0, -1], [-1, 0], [1, 0], [0, 1]
        ], card);
        return moves;
        
      case Position.LW: // Left Winger moves like a knight + diagonal (2 squares)
      case Position.RW: // Right Winger moves like a knight + diagonal (2 squares)
        // Knight moves
        this.addMovesIfValid(moves, currentX, currentY, [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ], card);
        
        // Add diagonal moves (up to 2 squares)
        for (let i = 1; i <= 2; i++) {
          this.addMovesIfValid(moves, currentX, currentY, [
            [-i, -i], [-i, i], [i, -i], [i, i]
          ], card);
        }
        return moves;
        
      case Position.ST: // Striker moves like a queen with limited range (2 squares)
      case Position.CF: // Center Forward moves like a queen with limited range (2 squares)
        for (let i = 1; i <= 2; i++) {
          this.addMovesIfValid(moves, currentX, currentY, [
            [-i, -i], [-i, 0], [-i, i],
            [0, -i],           [0, i],
            [i, -i],  [i, 0],  [i, i]
          ], card);
        }
        
        // Special shooting ability near goal
        const opponentGoalY = card.player.team === this.teams[0] ? 0 : 8;
        if (Math.abs(currentY - opponentGoalY) <= 3) {
          // Add shooting moves to goal squares
          const goalX = [5, 6, 7];
          for (const x of goalX) {
            moves.push([x, opponentGoalY]);
          }
        }
        
        return moves;
      
      default:
        return [];
    }
  }
  
  private addMovesIfValid(
    moves: [number, number][], 
    currentX: number, 
    currentY: number, 
    directions: [number, number][],
    card: Card
  ): void {
    for (const [dx, dy] of directions) {
      const newX = currentX + dx;
      const newY = currentY + dy;
      
      // Check board boundaries
      if (newX >= 0 && newX < 13 && newY >= 0 && newY < 9) {
        // Add valid move
        moves.push([newX, newY]);
      }
    }
  }
  
  // Handle card selection
  public selectCard(x: number, y: number): boolean {
    const square = this.board[y][x];
    if (square.cards.length === 0) {
      return false;
    }
    
    // Find the top card of the current team
    const currentTeam = this.teams[this.currentTeamIndex];
    const cardOfCurrentTeam = square.cards.find(c => c.player.team === currentTeam);
    
    if (!cardOfCurrentTeam) {
      return false; // No card of current team on this square
    }
    
    this.selectedCard = cardOfCurrentTeam;
    this.validMoves = this.getValidMoves(cardOfCurrentTeam, x, y);
    
    return true;
  }
  
  // Move selected card
  public moveCard(targetX: number, targetY: number): boolean {
    if (!this.selectedCard || this.movesRemaining <= 0) {
      return false;
    }
    
    // Find the current position of the selected card
    let currentX = -1, currentY = -1;
    outerLoop: for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 13; x++) {
        if (this.board[y][x].cards.includes(this.selectedCard)) {
          currentX = x;
          currentY = y;
          break outerLoop;
        }
      }
    }
    
    if (currentX === -1 || currentY === -1) {
      return false; // Card not found on board
    }
    
    // Check if the move is valid
    if (!this.validMoves.some(([x, y]) => x === targetX && y === targetY)) {
      return false; // Invalid move
    }
    
    // Handle ball movement if the card has the ball
    const hasBall = this.ballPosition && 
                   this.ballPosition[0] === currentX && 
                   this.ballPosition[1] === currentY;
    
    // Remove card from current square
    const currentSquare = this.board[currentY][currentX];
    const cardIndex = currentSquare.cards.indexOf(this.selectedCard);
    if (cardIndex !== -1) {
      currentSquare.cards.splice(cardIndex, 1);
    }
    
    // Add card to target square
    const targetSquare = this.board[targetY][targetX];
    targetSquare.cards.push(this.selectedCard);
    
    // Move the ball if the card had it
    if (hasBall) {
      this.ballPosition = [targetX, targetY];
    }
    
    // Check for collision (multiple cards on same square)
    if (targetSquare.cards.length > 1) {
      this.handleSquareCollision(targetX, targetY);
    }
    
    // Record the move in history
    this.gameHistory.push({
      type: GameActionType.MOVE,
      card: this.selectedCard,
      from: [currentX, currentY],
      to: [targetX, targetY]
    });
    
    // Update game state
    this.movesRemaining--;
    if (this.movesRemaining <= 0) {
      this.switchTeams();
    }
    
    // Check for goal
    this.checkForGoal(targetX, targetY);
    
    // Reset selection
    this.selectedCard = null;
    this.validMoves = [];
    
    return true;
  }
  
  // Check for goal
  private checkForGoal(x: number, y: number): void {
    // No goal possible without a ball
    if (!this.ballPosition || this.ballPosition[0] !== x || this.ballPosition[1] !== y) {
      return;
    }
    
    // Check if position is in a goal square
    const isHomeGoal = y === 8 && (x >= 5 && x <= 7);
    const isAwayGoal = y === 0 && (x >= 5 && x <= 7);
    
    if (!isHomeGoal && !isAwayGoal) {
      return;
    }
    
    // Determine which team scored
    const scoringTeamIndex = isAwayGoal ? 0 : 1; // Home team scores in away goal and vice versa
    
    // Check if ball carrier is from the scoring team
    const square = this.board[y][x];
    const ballCarrier = square.cards.find(card => card.player.team === this.teams[scoringTeamIndex]);
    
    if (!ballCarrier) {
      return; // No carrier from the scoring team
    }
    
    // Update score
    this.score[scoringTeamIndex]++;
    
    // Record goal
    this.gameHistory.push({
      type: GameActionType.GOAL,
      card: ballCarrier,
      from: this.ballPosition,
      to: [x, y]
    });
    
    // Reset game state for kickoff
    this.gameState = GameState.GOAL_SCORED;
    this.resetPositionsAfterGoal();
  }
  
  // Reset positions after a goal
  private resetPositionsAfterGoal(): void {
    // Clear the board
    this.board = Array(9).fill(null).map(() => Array(13).fill(null).map(() => ({ cards: [] })));
    
    // Place players in kickoff formation
    this.setupInitialPositions();
    
    // Give ball to the team that conceded
    this.currentTeamIndex = this.currentTeamIndex === 0 ? 1 : 0;
    this.movesRemaining = 3;
  }
  
  // Switch teams after moves are exhausted
  private switchTeams(): void {
    this.currentTeamIndex = this.currentTeamIndex === 0 ? 1 : 0;
    this.movesRemaining = 3;
  }
  
  // Shoot the ball at the goal
  public shootBall(fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Check if the from square has the ball
    if (!this.ballPosition || 
        this.ballPosition[0] !== fromX || 
        this.ballPosition[1] !== fromY) {
      return false;
    }
    
    const fromSquare = this.board[fromY][fromX];
    
    // Check if there's at least one card from current team on the square
    const currentTeam = this.teams[this.currentTeamIndex];
    const shooterCards = fromSquare.cards.filter(c => c.player.team === currentTeam);
    
    if (shooterCards.length === 0) {
      return false;
    }
    
    // Check if target is a goal square
    const isHomeGoal = toY === 8 && (toX >= 5 && toX <= 7);
    const isAwayGoal = toY === 0 && (toX >= 5 && toX <= 7);
    
    if (!isHomeGoal && !isAwayGoal) {
      return false; // Not a goal square
    }
    
    // Check if it's the opponent's goal
    const isOpponentGoal = (currentTeam === this.teams[0] && isAwayGoal) || 
                          (currentTeam === this.teams[1] && isHomeGoal);
    
    if (!isOpponentGoal) {
      return false; // Can't shoot at own goal
    }
    
    // Calculate distance for shot difficulty
    const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    
    // Shot success probability
    let successProbability = 0.8 - (distance / 20.0);
    
    // Adjust based on cards in the way (defenders)
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 13; x++) {
        // Skip source square
        if (x === fromX && y === fromY) {
          continue;
        }
        
        // Check if this square is in the shooting lane
        if (this.isInPassingLane(fromX, fromY, toX, toY, x, y)) {
          const square = this.board[y][x];
          const defenderCards = square.cards.filter(c => c.player.team !== currentTeam);
          
          // Each defender reduces success probability
          successProbability -= 0.15 * defenderCards.length;
        }
      }
    }
    
    // Check for goalkeeper
    const goalSquare = this.board[toY][toX];
    const goalkeepers = goalSquare.cards.filter(c => 
      c.player.team !== currentTeam && c.player.position === Position.GK
    );
    
    // Goalkeeper significantly reduces success probability
    if (goalkeepers.length > 0) {
      successProbability -= 0.3;
    }
    
    // Clamp probability
    successProbability = Math.max(0.05, Math.min(0.95, successProbability));
    
    // Determine if shot is successful
    const isSuccessful = Math.random() < successProbability;
    
    // Record the shot
    this.gameHistory.push({
      type: GameActionType.SHOT,
      card: shooterCards[0],
      from: [fromX, fromY],
      to: [toX, toY],
      success: isSuccessful
    });
    
    if (isSuccessful) {
      // Move the ball to the goal square
      this.ballPosition = [toX, toY];
      
      // Check for goal
      this.checkForGoal(toX, toY);
    } else {
      // Shot is saved or missed
      if (goalkeepers.length > 0 && Math.random() < 0.7) {
        // Goalkeeper saves and holds the ball
        this.ballPosition = [toX, toY];
      } else {
        // Ball goes out for a goal kick or corner (simplified: just give to goalkeeper)
        const defendingTeamIndex = currentTeam === this.teams[0] ? 1 : 0;
        const defendingTeam = this.teams[defendingTeamIndex];
        
        // Find goalkeeper position
        for (let y = 0; y < 9; y++) {
          for (let x = 0; x < 13; x++) {
            const square = this.board[y][x];
            const gk = square.cards.find(c => 
              c.player.team === defendingTeam && c.player.position === Position.GK
            );
            
            if (gk) {
              this.ballPosition = [x, y];
              break;
            }
          }
        }
      }
    }
    
    // Consume all remaining moves
    this.movesRemaining = 0;
    this.switchTeams();
    
    return true;
  }
  
  // Pass the ball to another card
  public passBall(fromX: number, fromY: number, toX: number, toY: number): boolean {
    // Check if the from square has the ball
    if (!this.ballPosition || 
        this.ballPosition[0] !== fromX || 
        this.ballPosition[1] !== fromY) {
      return false;
    }
    
    const fromSquare = this.board[fromY][fromX];
    const toSquare = this.board[toY][toX];
    
    // Check if there's at least one card from current team on both squares
    const currentTeam = this.teams[this.currentTeamIndex];
    const fromTeamCards = fromSquare.cards.filter(c => c.player.team === currentTeam);
    const toTeamCards = toSquare.cards.filter(c => c.player.team === currentTeam);
    
    if (fromTeamCards.length === 0 || toTeamCards.length === 0) {
      return false;
    }
    
    // Calculate distance for pass difficulty
    const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
    
    // Passing success probability
    let successProbability = 1.0 - (distance / 15.0);
    
    // Adjust based on opponent cards in the way
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 13; x++) {
        // Skip source and target squares
        if ((x === fromX && y === fromY) || (x === toX && y === toY)) {
          continue;
        }
        
        // Check if this square is in the passing lane
        if (this.isInPassingLane(fromX, fromY, toX, toY, x, y)) {
          const square = this.board[y][x];
          const opponentCards = square.cards.filter(c => c.player.team !== currentTeam);
          
          // Each opponent card reduces success probability
          successProbability -= 0.1 * opponentCards.length;
        }
      }
    }
    
    // Clamp probability
    successProbability = Math.max(0.1, Math.min(0.9, successProbability));
    
    // Determine if pass is successful
    const isSuccessful = Math.random() < successProbability;
    
    if (isSuccessful) {
      // Move the ball to the target square
      this.ballPosition = [toX, toY];
      
      // Record the action
      this.gameHistory.push({
        type: GameActionType.PASS,
        card: fromTeamCards[0],
        targetCard: toTeamCards[0],
        from: [fromX, fromY],
        to: [toX, toY],
        success: true
      });
    } else {
      // Ball is lost - it stays at the from position or intercepted
      this.gameHistory.push({
        type: GameActionType.PASS,
        card: fromTeamCards[0],
        targetCard: toTeamCards[0],
        from: [fromX, fromY],
        to: [toX, toY],
        success: false
      });
      
      // Check for interception
      const interceptionProbability = 0.5;
      if (Math.random() < interceptionProbability) {
        // Find a square in the passing lane with opponent cards
        for (let y = 0; y < 9; y++) {
          for (let x = 0; x < 13; x++) {
            if (this.isInPassingLane(fromX, fromY, toX, toY, x, y)) {
              const square = this.board[y][x];
              const opponentCards = square.cards.filter(c => c.player.team !== currentTeam);
              
              if (opponentCards.length > 0) {
                // Interception
                this.ballPosition = [x, y];
                this.gameHistory.push({
                  type: GameActionType.INTERCEPTION,
                  card: opponentCards[0],
                  from: [fromX, fromY],
                  to: [x, y]
                });
                break;
              }
            }
          }
        }
      }
    }
    
    // Consume a move
    this.movesRemaining--;
    if (this.movesRemaining <= 0) {
      this.switchTeams();
    }
    
    return true;
  }
  
  // Check if a square is in the passing lane between two points
  private isInPassingLane(fromX: number, fromY: number, toX: number, toY: number, x: number, y: number): boolean {
    // Simple check: is the point close to the line segment between from and to?
    const distanceFromLine = this.pointToLineDistance(
      fromX, fromY, toX, toY, x, y
    );
    
    return distanceFromLine < 0.8; // Threshold for "in the passing lane"
  }
  
  // Calculate the distance from a point to a line segment
  private pointToLineDistance(x1: number, y1: number, x2: number, y2: number, x0: number, y0: number): number {
    const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    
    if (lineLength === 0) {
      return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
    }
    
    // Calculate the normalized projection
    const t = ((x0 - x1) * (x2 - x1) + (y0 - y1) * (y2 - y1)) / (lineLength * lineLength);
    
    // Clamp t to the range [0, 1]
    const tClamped = Math.max(0, Math.min(1, t));
    
    // Find the closest point on the line segment
    const projectionX = x1 + tClamped * (x2 - x1);
    const projectionY = y1 + tClamped * (y2 - y1);
    
    // Return the distance from the point to the projection
    return Math.sqrt(Math.pow(x0 - projectionX, 2) + Math.pow(y0 - projectionY, 2));
  }
  
  // Public accessor methods
  public getBoard(): Square[][] {
    return this.board;
  }
  
  public getBallPosition(): [number, number] | null {
    return this.ballPosition;
  }
  
  public getCurrentTeam(): Team {
    return this.teams[this.currentTeamIndex];
  }
  
  public getMovesRemaining(): number {
    return this.movesRemaining;
  }
  
  public getScore(): [number, number] {
    return this.score;
  }
  
  public getGameState(): GameState {
    return this.gameState;
  }
  
  public getGameHistory(): GameAction[] {
    return [...this.gameHistory];
  }
  
  public getSelectedCard(): Card | null {
    return this.selectedCard;
  }
  
  public getValidMoves(): [number, number][] {
    return [...this.validMoves];
  }
}
  
  // Handle collision when multiple cards are on the same square
  private handleSquareCollision(x: number, y: number): void {
    const square = this.board[y][x];
    
    // Count cards from each team
    const homeTeamCards = square.cards.filter(c => c.player.team === this.teams[0]);
    const awayTeamCards = square.cards.filter(c => c.player.team === this.teams[1]);
    
    // Check for ball possession
    if (this.ballPosition && this.ballPosition[0] === x && this.ballPosition[1] === y) {
      // Team with more cards gets the ball
      if (homeTeamCards.length > awayTeamCards.length) {
        // Home team wins ball
        this.gameHistory.push({
          type: GameActionType.BALL_WON,
          card: homeTeamCards[0],
          from: [x, y],
          to: [x, y]
        });
      } else if (awayTeamCards.length > homeTeamCards.length) {
        // Away team wins ball
        this.gameHistory.push({
          type: GameActionType.BALL_WON,
          card: awayTeamCards[0],
          from: [x, y],
          to: [x, y]
        });
      } else {
        // Equal number of cards - ball is contested
        this.gameHistory.push({
          type: GameActionType.BALL_CONTESTED,
          card: null,
          from: [x, y],
          to: [x, y]
        });
      }
    }
    
    // Check for foul (random chance based on the number of cards)
    if (Math.random() < 0.2 * (homeTeamCards.length + awayTeamCards.length - 1)) {
      this.handleFoul(x, y);
    }
  }
  
  // Handle fouls
  private handleFoul(x: number, y: number): void {
    const square = this.board[y][x];
    
    // Randomly select a card that commits the foul and a card that is fouled
    const allCards = [...square.cards];
    const foulCommitter = allCards[Math.floor(Math.random() * allCards.length)];
    
    // Remove the committer from potential victims
    const victims = allCards.filter(c => c.player.team !== foulCommitter.player.team);
    
    if (victims.length === 0) {
      return; // No one to foul
    }
    
    const victim = victims[Math.floor(Math.random() * victims.length)];
    
    // Determine foul severity
    let foulType: FoulType;
    const foulRandom = Math.random();
    
    if (foulRandom < 0.6) {
      foulType = FoulType.SOFT;
    } else if (foulRandom < 0.9) {
      foulType = FoulType.HARD;
    } else {
      foulType = FoulType.INJURY;
    }
    
    // Determine card punishment
    let isYellowCard = false;
    let isRedCard = false;
    
    // Check if it's in scoring position (within 3 squares of goal)
    const inScoringPosition = Math.abs(y - (foulCommitter.player.team === this.teams[0] ? 0 : 8)) <= 3;
    
    switch (foulType) {
      case FoulType.SOFT:
        isYellowCard = inScoringPosition || Math.random() < 0.3;
        break;
      case FoulType.HARD:
        isYellowCard = !inScoringPosition || Math.random() < 0.7;
        isRedCard = inScoringPosition || Math.random() < 0.3;
        break;
      case FoulType.INJURY:
        isRedCard = true;
        break;
    }
    
    // Apply card punishment
    if (isRedCard) {
      foulCommitter.redCard = true;
      // Remove the card from the board
      const cardIndex = square.cards.indexOf(foulCommitter);
      if (cardIndex !== -1) {
        square.cards.splice(cardIndex, 1);
      }
    } else if (isYellowCard) {
      if (foulCommitter.yellowCard) {
        // Second yellow becomes red
        foulCommitter.redCard = true;
        // Remove the card from the board
        const cardIndex = square.cards.indexOf(foulCommitter);
        if (cardIndex !== -1) {
          square.cards.splice(cardIndex, 1);
        }
      } else {
        foulCommitter.yellowCard = true;
      }
    }
    
    // Handle injury if applicable
    if (foulType === FoulType.INJURY) {
      let injuryType: InjuryType;
      const injuryRandom = Math.random();
      
      if (injuryRandom < 0.5) {
        injuryType = InjuryType.MINOR;
      } else if (injuryRandom < 0.8) {
        injuryType = InjuryType.SERIOUS;
      } else {
        injuryType = InjuryType.UNABLE_TO_CONTINUE;
      }
      
      // Apply injury effects
      victim.injury = injuryType;
      
      // For serious or unable to continue injuries, there's a chance to remove player
      if (injuryType === InjuryType.UNABLE_TO_CONTINUE || 
          (injuryType === InjuryType.SERIOUS && Math.random() < 0.5)) {
        // Remove player from the board
        const victimIndex = square.cards.indexOf(victim);
        if (victimIndex !== -1) {
          square.cards.splice(victimIndex, 1);
        }
      }
    }
    
    // Record the foul in history
    this.gameHistory.push({
      type: GameActionType.FOUL,
      card: foulCommitter,
      victim: victim,
      foulType: foulType,
      yellowCard: isYellowCard,
      redCard: isRedCard,
      position: [x, y]
    });
  }
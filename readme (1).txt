# Football Card Game

A strategic football card game that combines chess-like movements with football (soccer) gameplay mechanics. Players control football cards on a grid-based field, using strategic movements, passes, and shots to score goals against their opponent.

## Features

- **Chess-Like Movement**: Each football position has unique movement patterns based on chess pieces
- **Team Management**: Create and customize teams with different formations, colors, and players
- **Player Customization**: Upload your own player photos using your device's camera
- **Realistic Football Mechanics**: Passing, shooting, fouls, cards, and injuries
- **Cross-Platform**: Works on web, mobile, and desktop devices

## Game Rules

### Basic Rules

1. The game is played on a 13x9 grid representing a football pitch
2. Each team starts with 11 player cards placed in their formation
3. Teams take turns, with 3 moves per turn
4. The ball can be passed between teammates or moved with a player
5. The goal is to score by moving the ball to the opponent's goal area
6. The goalkeeper defends 3 goal squares
7. The team with the most goals at the end of the game wins

### Card Movement

Each position has a unique movement pattern based on chess pieces:

- **Goalkeeper (GK)**: Moves like a King but limited to the goal area
- **Defenders (CB, LB, RB)**: Move like Rooks (orthogonal) with a range of 2 squares
- **Defensive Midfielder (CDM)**: Moves like a Bishop (diagonal) with a range of 2 squares
- **Central Midfielder (CM)**: Combines Bishop and orthogonal movements with a limited range
- **Attacking Midfielder (CAM)**: Moves like a Queen with a limited range
- **Wingers (LW, RW)**: Move like Knights plus diagonal movement
- **Strikers (ST, CF)**: Move like Queens with limited range and special shooting ability

### Ball Possession

- Multiple cards can occupy the same square
- The team with more cards on a square wins the ball
- When cards from both teams are equal, the ball is contested

### Fouls and Cards

- Soft Foul: Warning or yellow card if in scoring position
- Hard Foul: Yellow or red card if in scoring position
- Injury Foul: Red card, with the fouled player becoming injured

### Injuries

- Minor: Player continues normally
- Serious: Player may need to be removed from the pitch
- Unable to Continue: Player is removed from the game

## Technology Stack

- React
- TypeScript
- CSS
- Parcel bundler

## Installation and Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/football-card-game.git
   cd football-card-game
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm start
   ```

4. Build for production:
   ```
   npm run build
   ```

## Development with Docker

This project includes Docker and DevContainer configurations for consistent development environments:

1. Make sure you have Docker and VS Code with Remote Containers extension installed
2. Open the project folder in VS Code
3. Click on the green button in the bottom-left corner and select "Reopen in Container"
4. VS Code will build the container and set up the development environment

## Testing

Run the test suite:
```
npm test
```

## License

MIT License

## Acknowledgements

- Inspired by traditional football games like EA FC (formerly FIFA) and eFootball (formerly PES)
- Uses chess movement patterns as the foundation for strategic gameplay

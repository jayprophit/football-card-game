# FootballChess - Strategic Card Game

A tactical football card game that merges chess-like movement mechanics with football strategy. Players control football player cards on a grid-based field, using strategic movements, passes, and shots to score goals against their opponents.

## 🎮 Game Overview

FootballChess is a turn-based strategy game where:

- Each player controls a team of football player cards.
- Cards move on a grid similar to chess pieces, with movement patterns based on their field position.
- Players take turns making up to 3 moves to outmaneuver their opponents.
- The objective is to maintain possession of the ball and score goals.
- Features an innovative foul and injury system that affects gameplay.
- Collect and build your own custom teams and players.

## 🚀 Features

- **Chess-like Gameplay**: Each position has unique movement patterns inspired by chess pieces:
  - **Goalkeeper (GK)**: Moves like a King (1 square any direction, limited to the goal area).
  - **Defenders (CB, LB, RB)**: Move like Rooks (orthogonal) with a limited range.
  - **Defensive Midfielder (CDM)**: Moves like a Knight (L-shape jumps) or a Bishop (diagonal, limited range).
  - **Central Midfielder (CM)**: Moves like a Queen (any direction, but with a range limit).
  - **Attacking Midfielder (CAM)**: Moves like a Queen with limited range.
  - **Wingers (LW, RW)**: Move like Knights with diagonal options.
  - **Strikers (ST, CF)**: Move like Rooks with extended range and special shooting abilities.

- **Card Collection & Customization**:
  - Collect, upgrade, and customize player cards.
  - Rarity levels: Common, Rare, Epic, Legendary.
  - Player-specific attributes: Pace, Shooting, Passing, etc.
  - Special abilities based on real football skills.
  - Upload custom player photos using your device's camera.

- **Multiple Game Modes**:
  - Quick Match: Jump into a game with default teams.
  - Ranked Match: Compete for ELO and climb the leaderboards.
  - Tournament Mode: Participate in structured competitions.
  - Season Mode: Play through a season with your custom team.
  - Practice Mode: Learn game mechanics against AI.

- **Dynamic Game Elements**:
  - Ball possession mechanics based on team control.
  - Foul and card system (yellow/red) affecting player availability.
  - Injury system with different severity levels.
  - Formation strategies and tactical choices.

- **Online Multiplayer**:
  - Real-time matchmaking based on skill level.
  - ELO rating system for competitive play.
  - Friend challenges and private matches.
  - Chat system for in-game communication.

- **Cross-Platform Support**:
  - Works on web, mobile, and desktop devices.

## 🏆 Game Rules

### Basic Rules

1. The game is played on a **13x9** grid representing a football pitch.
2. Each team starts with **11 player cards** placed in their formation.
3. Teams take turns, with **3 moves per turn**.
4. The ball can be passed between teammates or moved with a player.
5. The goal is to score by moving the ball to the opponent's goal area.
6. The goalkeeper defends **3 goal squares**.
7. The team with the most goals at the end of the game wins.

### Ball Possession

- Multiple cards can occupy the same square.
- The team with more cards on a square wins the ball.
- When cards from both teams are equal, the ball is contested.

### Fouls and Cards

- **Soft Foul**: Warning or yellow card if in a scoring position.
- **Hard Foul**: Yellow or red card if in a scoring position.
- **Injury Foul**: Red card, with the fouled player becoming injured.

### Injuries

- **Minor**: Player continues normally.
- **Serious**: Player may need to be removed from the pitch.
- **Unable to Continue**: Player is removed from the game.

## 🛠️ Technology Stack

- **Frontend**: React.js / TypeScript with responsive design.
- **Backend**: Node.js with Express.
- **Database**: MongoDB for user data, cards, and match history.
- **Real-time Communication**: Socket.io for live matches and chat.
- **Authentication**: JWT-based user authentication.
- **Storage**: AWS S3 for image uploads and custom player cards.
- **Payment Processing**: Stripe integration for in-app purchases.
- **Build Tools**: Parcel bundler.

## 📋 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/footballchess.git
cd footballchess
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development servers:
```bash
npm run dev
```

5. Visit `http://localhost:3000` to view the app.

### Deployment

```bash
npm run build
npm start
```

## 🐳 Development with Docker

1. Ensure you have Docker and VS Code with the Remote Containers extension installed.
2. Open the project folder in VS Code.
3. Click on the green button in the bottom-left corner and select "Reopen in Container."
4. VS Code will build the container and set up the development environment.

## 🧩 Project Structure

```
footballchess/
├── src/                  # Main source code
│   ├── assets/           # SVG assets and graphics
│   ├── components/       # React components
│   ├── pages/            # Page components
│   ├── styles/           # CSS styles
│   ├── utils/            # Game logic and helpers
│   └── data/             # Data files
├── public/               # Static files
├── server/               # Backend server code
│   ├── controllers/      # API controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── config/           # Server configuration
└── docs/                 # Documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Link: [https://github.com/yourusername/footballchess](https://github.com/yourusername/footballchess)


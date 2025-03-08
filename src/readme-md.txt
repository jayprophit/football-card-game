# FootballChess

A tactical card game that combines football strategy with chess-like gameplay. Players use football player cards with unique movement patterns based on their positions to score goals against their opponents.

## 🎮 Game Overview

FootballChess is a turn-based strategy game where:

- Each player controls a team of football player cards
- Cards move on a grid like chess pieces, with movement patterns based on their field position
- Players take turns making up to 3 moves to outmaneuver their opponents
- The objective is to maintain possession of the ball and score goals
- Features an innovative foul and injury system that affects gameplay
- Collect and build your own custom teams and players

## 🚀 Features

- **Chess-like Gameplay**: Each position has unique movement patterns inspired by chess pieces
  - GK (Goalkeeper): Moves like a King (1 square any direction)
  - CB (Center Back): Moves like a Rook (horizontal and vertical)
  - LB/RB (Fullbacks): Moves like a Bishop (diagonal) with horizontal options
  - CDM (Defensive Mid): Moves like a Knight (L-shape jumps)
  - CM/CAM (Midfielders): Moves like a Queen (any direction, limited range)
  - LW/RW (Wingers): Moves like a Knight with special horizontal options
  - ST/CF (Strikers): Moves like a Rook with extended range and diagonal options

- **Card Collection System**: Collect, upgrade, and customize player cards
  - Rarity levels (Common, Rare, Epic, Legendary)
  - Player-specific attributes (Pace, Shooting, Passing, etc.)
  - Special abilities based on real player skills
  - Create custom players with your own photos

- **Multiple Game Modes**:
  - Quick Match: Jump into a game with default teams
  - Ranked Match: Compete for ELO and climb the leaderboards
  - Tournament Mode: Participate in structured competitions
  - Season Mode: Play through a season with your custom team
  - Practice Mode: Learn the game mechanics against AI

- **Dynamic Game Elements**:
  - Ball possession mechanics
  - Cards system (yellow/red) affecting player availability
  - Injury system with different severity levels
  - Formation strategies and tactical choices

- **Online Multiplayer**: Play against friends or random opponents
  - Real-time matchmaking based on skill level
  - ELO rating system for competitive play
  - Friend challenges and private matches
  - Chat system for in-game communication

- **Monetization Options**:
  - Card pack purchases
  - Season Pass for premium rewards
  - Subscription tiers with various benefits
  - Cosmetic upgrades for cards and stadiums

## 🛠️ Technology Stack

- **Frontend**: React.js with responsive design for web, mobile, and desktop
- **Backend**: Node.js with Express
- **Database**: MongoDB for user data, cards, and match history
- **Real-time Communication**: Socket.io for live matches and chat
- **Authentication**: JWT-based user authentication
- **Storage**: AWS S3 for image uploads and custom player cards
- **Payment Processing**: Stripe integration for in-app purchases

## 📋 Installation

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
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Set up environment variables:
```bash
# Copy the example .env file
cp .env.example .env

# Edit the .env file with your configuration
```

4. Start the development servers:
```bash
# Start both frontend and backend in development mode
npm run dev
```

5. Visit `http://localhost:3000` to view the app.

## 📱 Deployment

### Web Build

```bash
# Build the React client
cd client
npm run build
cd ..

# Start the production server
npm start
```

### Mobile Build

```bash
# For iOS
npx cap add ios
npx cap open ios

# For Android
npx cap add android
npx cap open android
```

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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Project Link: [https://github.com/yourusername/footballchess](https://github.com/yourusername/footballchess)
// FootballChess Project Structure

// Web Version (React)
/footballchess-web/
  ├── public/
  │   ├── index.html
  │   ├── favicon.ico
  │   └── assets/
  │       ├── pitch-background.jpg
  │       ├── football.svg
  │       └── player-avatars/
  │           └── default-player.png
  │
  ├── src/
  │   ├── index.js
  │   ├── App.js
  │   ├── styles.css
  │   ├── components/
  │   │   ├── GameBoard.js        // The main game board grid
  │   │   ├── PlayerCard.js       // Individual player cards
  │   │   ├── ControlPanel.js     // Game controls & score display
  │   │   ├── GamePhaseOverlay.js // Half-time & full-time overlays
  │   │   └── GameLog.js          // Match events log
  │   │
  │   ├── game/
  │   │   ├── GameEngine.js       // Core game logic
  │   │   ├── MovementPatterns.js // Implementation of chess-like movements
  │   │   ├── FoulSystem.js       // Yellow/red card & injury system
  │   │   └── Utils.js            // Helper functions
  │   │
  │   └── data/
  │       ├── teams.js            // Pre-defined teams data
  │       └── initialPositions.js // Starting positions for kickoff
  │
  └── package.json                // Dependencies and scripts

// Mobile Version (React Native)
/footballchess-mobile/
  ├── assets/
  │   ├── icon.png
  │   ├── splash.png
  │   └── default-player.png
  │
  ├── src/
  │   ├── components/
  │   │   ├── GameBoard.js
  │   │   ├── PlayerCard.js
  │   │   ├── ControlPanel.js
  │   │   ├── GamePhaseOverlay.js
  │   │   ├── GameLog.js
  │   │   └── PlayerPhotoCapture.js  // Camera component for player photos
  │   │
  │   ├── game/
  │   │   ├── GameEngine.js
  │   │   ├── MovementPatterns.js
  │   │   ├── FoulSystem.js
  │   │   └── Utils.js
  │   │
  │   ├── data/
  │   │   ├── teams.js
  │   │   └── initialPositions.js
  │   │
  │   ├── screens/
  │   │   ├── HomeScreen.js
  │   │   ├── GameScreen.js
  │   │   ├── TeamSelectScreen.js
  │   │   └── SettingsScreen.js
  │   │
  │   └── styles/
  │       ├── colors.js
  │       └── globalStyles.js
  │
  ├── App.js
  └── package.json

// Desktop Version (Electron)
/footballchess-desktop/
  ├── public/
  │   └── electron.js             // Main process file
  │
  ├── src/
  │   ├── ...                     // Same structure as web version
  │   └── electron-specific/
  │       ├── ipc-handlers.js     // Inter-process communication
  │       ├── menu.js             // Desktop application menu
  │       └── storage.js          // Local file system storage
  │
  └── package.json

// Shared Core Game Logic
/footballchess-core/
  ├── src/
  │   ├── engine/
  │   │   ├── GameState.js        // Game state and operations
  │   │   ├── MovementPatterns.js // Chess piece movement rules
  │   │   ├── BallPhysics.js      // Ball movement and possession
  │   │   ├── FoulSystem.js       // Fouls, cards and injuries
  │   │   └── AI.js               // Basic AI for single player
  │   │
  │   ├── types/
  │   │   ├── Player.js           // Player type definitions
  │   │   ├── Team.js             // Team type definitions
  │   │   └── index.js            // Type exports
  │   │
  │   └── utils/
  │       ├── boardUtils.js       // Board coordinate helpers
  │       └── gameUtils.js        // Game state helpers
  │
  └── package.json

// Game Rules Documentation
/docs/
  ├── rules.md                    // Complete game rules
  ├── movement-patterns.md        // Chess piece movement illustrations
  ├── positions.md                // Football positions explanation
  └── screenshots/                // Game screenshots for documentation

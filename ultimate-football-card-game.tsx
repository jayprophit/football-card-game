import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Card Type Definitions
const CARD_TYPES = {
  GOALKEEPER: {
    name: 'Goalkeeper',
    description: 'Defensive specialist with limited movement',
    movementType: 'King-like',
    specialAbility: 'Goal Line Defense',
    color: '#3B82F6', // Blue
    stats: {
      defense: 90,
      positioning: 85,
      specialAbilityStrength: 75
    },
    movementRules: {
      maxSquares: 1,
      directions: ['horizontal', 'vertical', 'diagonal']
    }
  },
  DEFENDER: {
    name: 'Defender',
    description: 'Tactical blocking and positioning',
    movementType: 'Rook-like',
    specialAbility: 'Tactical Block',
    color: '#10B981', // Green
    stats: {
      defense: 85,
      tackling: 80,
      specialAbilityStrength: 70
    },
    movementRules: {
      maxSquares: 3,
      directions: ['horizontal', 'vertical']
    }
  },
  MIDFIELDER: {
    name: 'Midfielder',
    description: 'Playmaker with complex movement',
    movementType: 'Knight-like',
    specialAbility: 'Field Vision',
    color: '#F59E0B', // Yellow
    stats: {
      passing: 85,
      vision: 80,
      specialAbilityStrength: 85
    },
    movementRules: {
      maxSquares: 2,
      directions: ['L-shape', 'diagonal jumps']
    }
  },
  FORWARD: {
    name: 'Forward',
    description: 'Offensive specialist with aggressive movement',
    movementType: 'Bishop-like',
    specialAbility: 'Precision Shot',
    color: '#EF4444', // Red
    stats: {
      shooting: 90,
      speed: 85,
      specialAbilityStrength: 90
    },
    movementRules: {
      maxSquares: 3,
      directions: ['diagonal']
    }
  }
};

// Game Modes
const GAME_MODES = {
  MANUAL: {
    name: 'Manual Play',
    description: 'Direct control of card placement',
    icon: '🎮'
  },
  AUTO: {
    name: 'AI Play',
    description: 'AI-driven gameplay',
    icon: '🤖'
  }
};

// Rendering Modes
const RENDERING_MODES = {
  TWO_D: {
    name: '2D Mode',
    description: 'Classic card-based view',
    icon: '🃏'
  },
  THREE_D: {
    name: '3D Mode',
    description: 'Immersive stadium environment',
    icon: '🏟️'
  }
};

const UltimateFootballCardGame = () => {
  // Game State Management
  const [gameBoard, setGameBoard] = useState(
    Array(16).fill().map(() => Array(8).fill(null))
  );
  const [selectedCard, setSelectedCard] = useState(null);
  const [gameMode, setGameMode] = useState('MANUAL');
  const [renderMode, setRenderMode] = useState('THREE_D');
  const [gameState, setGameState] = useState({
    currentTeam: 'HOME',
    movesRemaining: 3,
    ballPossession: null
  });

  // 3D Rendering References
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Initialize 3D Scene
  useEffect(() => {
    if (renderMode !== 'THREE_D') return;

    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 10, 20);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue background
    rendererRef.current = renderer;

    // Mount renderer
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Stadium Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x228B22, // Grass green
      side: THREE.DoubleSide 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    scene.add(ground);

    // Animate Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [renderMode]);

  // Initialize Game Board
  useEffect(() => {
    const newBoard = Array(16).fill().map(() => Array(8).fill(null));
    
    // Initial card placement
    Object.keys(CARD_TYPES).forEach((cardType, index) => {
      // Home team (bottom of the board)
      newBoard[0][index * 2] = {
        type: cardType,
        team: 'HOME',
        ...CARD_TYPES[cardType]
      };
      
      // Away team (top of the board)
      newBoard[15][index * 2] = {
        type: cardType,
        team: 'AWAY',
        ...CARD_TYPES[cardType]
      };
    });

    setGameBoard(newBoard);
  }, []);

  // Card Movement Logic
  const moveCard = (selected, targetRow, targetCol) => {
    const { card, rowIndex, colIndex } = selected;
    const newBoard = [...gameBoard];

    // Validate move based on card's movement rules
    const isValidMove = validateMove(card, rowIndex, targetRow, colIndex, targetCol);

    if (isValidMove) {
      // Move the card
      newBoard[targetRow][targetCol] = card;
      newBoard[rowIndex][colIndex] = null;

      // Update game state
      setGameBoard(newBoard);
      updateGameState(card, targetRow, targetCol);
    }
  };

  // Move Validation
  const validateMove = (card, fromRow, toRow, fromCol, toCol) => {
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    // Check movement based on card type
    switch (card.movementType) {
      case 'King-like':
        return rowDiff <= 1 && colDiff <= 1;
      case 'Rook-like':
        return (rowDiff === 0 || colDiff === 0) && 
               rowDiff + colDiff <= card.movementRules.maxSquares;
      case 'Knight-like':
        return (rowDiff === 2 && colDiff === 1) || 
               (rowDiff === 1 && colDiff === 2);
      case 'Bishop-like':
        return rowDiff === colDiff && 
               rowDiff <= card.movementRules.maxSquares;
      default:
        return false;
    }
  };

  // Update Game State
  const updateGameState = (movedCard, toRow, toCol) => {
    const newGameState = { ...gameState };
    
    // Reduce remaining moves
    newGameState.movesRemaining--;

    // Determine ball possession
    if (!newGameState.ballPossession) {
      newGameState.ballPossession = movedCard;
    }

    // Switch teams if moves are exhausted
    if (newGameState.movesRemaining === 0) {
      newGameState.currentTeam = 
        newGameState.currentTeam === 'HOME' ? 'AWAY' : 'HOME';
      newGameState.movesRemaining = 3;
    }

    setGameState(newGameState);
  };

  // Handle Card Selection
  const handleCardSelection = (card, rowIndex, colIndex) => {
    if (selectedCard) {
      // Attempt to move the card
      moveCard(selectedCard, rowIndex, colIndex);
      setSelectedCard(null);
    } else {
      // Select the card
      setSelectedCard({ card, rowIndex, colIndex });
    }
  };

  // Render Game Board
  const renderGameBoard = () => (
    <div className="grid grid-cols-8 gap-1">
      {gameBoard.map((row, rowIndex) => 
        row.map((cell, colIndex) => (
          <div 
            key={`${rowIndex}-${colIndex}`}
            className={`
              w-12 h-12 border 
              ${rowIndex < 4 ? 'bg-blue-100' : 
                rowIndex < 8 ? 'bg-green-100' : 
                rowIndex < 12 ? 'bg-yellow-100' : 'bg-red-100'}
              flex items-center justify-center
              cursor-pointer
              hover:bg-opacity-50
            `}
            onClick={() => cell 
              ? handleCardSelection(cell, rowIndex, colIndex)
              : selectedCard 
                ? moveCard(selectedCard, rowIndex, colIndex)
                : null
            }
          >
            {cell && (
              <div 
                className={`
                  w-10 h-10 rounded-full 
                  flex items-center justify-center
                  text-white text-xs
                `}
                style={{ backgroundColor: cell.color }}
              >
                {cell.name.charAt(0)}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  // Render Mode and Game Mode Selectors
  const renderModeSelectors = () => (
    <div className="flex space-x-4 mb-4">
      {/* Rendering Mode Selector */}
      <div>
        <h3 className="font-bold mb-2">Rendering Mode</h3>
        <div className="flex space-x-2">
          {Object.entries(RENDERING_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setRenderMode(key)}
              className={`
                p-2 rounded 
                ${renderMode === key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'}
              `}
            >
              <span className="text-2xl">{mode.icon}</span>
              <p className="text-xs">{mode.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Game Mode Selector */}
      <div>
        <h3 className="font-bold mb-2">Game Mode</h3>
        <div className="flex space-x-2">
          {Object.entries(GAME_MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setGameMode(key)}
              className={`
                p-2 rounded 
                ${gameMode === key 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200'}
              `}
            >
              <span className="text-2xl">{mode.icon}</span>
              <p className="text-xs">{mode.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Render Game State Information
  const renderGameStateInfo = () => (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-bold mb-2">Game State</h3>
      <p>Current Team: {gameState.currentTeam}</p>
      <p>Moves Remaining: {gameState.movesRemaining}</p>
      <p>
        Ball Possession: 
        {gameState.ballPossession 
          ? gameState.ballPossession.name 
          : 'Unassigned'}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Ultimate Football Card Chess Game
      </h1>

      {/* Mode Selectors */}
      {renderModeSelectors()}

      {/* 3D Rendering Container (if 3D mode is selected) */}
      {renderMode === 'THREE_D' && (
        <div 
          ref={mountRef} 
          className="w-full h-64 mb-4"
        />
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {/* Game Board */}
        <div className="md:col-span-2">
          {renderGameBoard()}
        </div>

        {/* Sidebar */}
        <div>
          {renderGameStateInfo()}
        </div>
      </div>
    </div>
  );
};

export default UltimateFootballCardGame;

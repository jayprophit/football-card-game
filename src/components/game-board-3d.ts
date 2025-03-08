import React, { useState, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture, Text, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GameEngine, GameState, GameActionType, Square } from '../logic/engine/GameEngine';
import { Team, Player, Position, Card } from '../models/GameModels';
import { gsap } from 'gsap';
import PlayerCard3D from './PlayerCard3D';
import GameControls from './GameControls';
import GameInfo from './GameInfo';

interface GameBoardProps {
  homeTeam: Team;
  awayTeam: Team;
}

// Football pitch component with 3D rendering
const FootballPitch = ({ board, onSquareClick, selectedPosition, validMoves, ballPosition }: any) => {
  const pitchWidth = 13;
  const pitchHeight = 9;
  const gridRef = useRef<THREE.Group>(null);
  
  // Load textures
  const textures = useTexture({
    grass: '/images/fields/grass_texture.jpg',
    lines: '/images/fields/field_lines.png',
  });
  
  // Setup textures
  useMemo(() => {
    textures.grass.wrapS = textures.grass.wrapT = THREE.RepeatWrapping;
    textures.grass.repeat.set(5, 5);
    textures.grass.anisotropy = 16;
  }, [textures]);
  
  return (
    <group ref={gridRef}>
      {/* Main pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pitchWidth / 2 - 0.5, -0.01, pitchHeight / 2 - 0.5]}>
        <planeGeometry args={[pitchWidth, pitchHeight]} />
        <meshStandardMaterial map={textures.grass} />
      </mesh>
      
      {/* Field lines overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pitchWidth / 2 - 0.5, 0, pitchHeight / 2 - 0.5]}>
        <planeGeometry args={[pitchWidth, pitchHeight]} />
        <meshStandardMaterial 
          map={textures.lines} 
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Grid squares */}
      {board.map((row: any, y: number) => 
        row.map((square: any, x: number) => {
          const isSelected = selectedPosition && selectedPosition[0] === x && selectedPosition[1] === y;
          const isValidMove = validMoves.some(([vx, vy]: [number, number]) => vx === x && vy === y);
          const hasBall = ballPosition && ballPosition[0] === x && ballPosition[1] === y;
          const isGoalArea = (y === 0 || y === 8) && (x >= 5 && x <= 7);
          
          return (
            <group key={`square-${x}-${y}`} position={[x, 0, y]}>
              {/* Interactive square */}
              <mesh 
                position={[0, 0.01, 0]} 
                rotation={[-Math.PI / 2, 0, 0]}
                onClick={() => onSquareClick(x, y)}
              >
                <planeGeometry args={[0.95, 0.95]} />
                <meshStandardMaterial 
                  color={
                    isSelected ? '#ffeb3b' : 
                    isValidMove ? '#81c784' : 
                    isGoalArea ? '#5c6bc0' : 
                    'transparent'
                  }
                  transparent={!isSelected && !isValidMove && !isGoalArea}
                  opacity={isSelected ? 0.5 : isValidMove ? 0.4 : isGoalArea ? 0.3 : 0}
                />
              </mesh>
              
              {/* Ball */}
              {hasBall && square.cards.length === 0 && (
                <Ball position={[0, 0.2, 0]} />
              )}
            </group>
          );
        })
      )}
      
      {/* Goal posts */}
      <GoalPosts isHome={true} />
      <GoalPosts isHome={false} />
    </group>
  );
};

// Ball component
const Ball = ({ position }: { position: [number, number, number] }) => {
  const ballRef = useRef<THREE.Mesh>(null);
  
  // Animation of the ball
  useFrame(({ clock }) => {
    if (ballRef.current) {
      ballRef.current.rotation.y = clock.getElapsedTime() * 2;
      // Make the ball bounce slightly
      ballRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 5) * 0.05;
    }
  });
  
  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="white" />
      {/* Ball pattern (black pentagons) */}
      <group>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[0, 0, 0]} rotation={[
            i % 2 ? Math.PI/3 : 0, 
            i * Math.PI/3, 
            i % 3 ? Math.PI/4 : -Math.PI/4
          ]}>
            <cylinderGeometry args={[0.06, 0.06, 0.01, 5]} />
            <meshStandardMaterial color="black" />
          </mesh>
        ))}
      </group>
    </mesh>
  );
};

// Goal posts component
const GoalPosts = ({ isHome }: { isHome: boolean }) => {
  const z = isHome ? 8.3 : -0.3;
  
  return (
    <group position={[6, 0, z]}>
      {/* Crossbar */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.2, 0.05, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Posts */}
      <mesh position={[-1.1, 0.25, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.1, 0.25, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Net (simplified) */}
      <mesh position={[0, 0.25, isHome ? -0.2 : 0.2]} rotation={[Math.PI/2, 0, 0]}>
        <planeGeometry args={[2.2, 0.4]} />
        <meshStandardMaterial 
          color="white" 
          transparent={true} 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

// Camera controller
const CameraController = ({ initial = false }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>();
  
  React.useEffect(() => {
    if (initial && controlsRef.current) {
      // Set initial camera position
      camera.position.set(6, 9, 13);
      camera.lookAt(6, 0, 4);
      controlsRef.current.target.set(6, 0, 4);
      controlsRef.current.update();
    }
  }, [camera, initial]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      minPolarAngle={Math.PI/6}
      maxPolarAngle={Math.PI/2.5}
      minDistance={5}
      maxDistance={20}
    />
  );
};

// Main Game Board component
const GameBoard3D: React.FC<GameBoardProps> = ({ homeTeam, awayTeam }) => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [board, setBoard] = useState<Square[][]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [ballPosition, setBallPosition] = useState<[number, number] | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team>(homeTeam);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  
  // Initialize game
  React.useEffect(() => {
    const engine = new GameEngine(homeTeam, awayTeam);
    setGameEngine(engine);
    updateGameState(engine);
    setCameraInitialized(true);
  }, [homeTeam, awayTeam]);
  
  // Update game state from engine
  const updateGameState = (engine: GameEngine) => {
    setBoard(engine.getBoard());
    setBallPosition(engine.getBallPosition());
    setCurrentTeam(engine.getCurrentTeam());
    setGameHistory(engine.getGameHistory());
    setScore(engine.getScore());
    
    // Clear selections when switching teams
    setSelectedPosition(null);
    setValidMoves([]);
  };
  
  // Handle square click
  const handleSquareClick = (x: number, y: number) => {
    if (!gameEngine) return;
    
    if (selectedPosition) {
      // If a square is already selected, try to move to the clicked square
      const [selectedX, selectedY] = selectedPosition;
      
      // Check if the clicked square is a valid move
      const isValidMove = validMoves.some(([vx, vy]) => vx === x && vy === y);
      
      if (isValidMove) {
        // Move the selected card to the clicked square
        gameEngine.moveCard(x, y);
        updateGameState(gameEngine);
      } else if (x === selectedX && y === selectedY) {
        // Clicking on the same square deselects it
        setSelectedPosition(null);
        setValidMoves([]);
      } else {
        // If clicking on an invalid square, try to select it instead
        selectSquare(x, y);
      }
    } else {
      // If no square is selected, try to select the clicked square
      selectSquare(x, y);
    }
  };
  
  // Select a square
  const selectSquare = (x: number, y: number) => {
    if (!gameEngine) return;
    
    if (gameEngine.selectCard(x, y)) {
      setSelectedPosition([x, y]);
      setValidMoves(gameEngine.getValidMoves());
    }
  };
  
  // Handle passing the ball
  const handlePassBall = (toX: number, toY: number) => {
    if (!gameEngine || !selectedPosition || !ballPosition) return;
    
    const [fromX, fromY] = ballPosition;
    if (gameEngine.passBall(fromX, fromY, toX, toY)) {
      updateGameState(gameEngine);
    }
  };
  
  // Handle shooting
  const handleShoot = (toX: number, toY: number) => {
    if (!gameEngine || !selectedPosition || !ballPosition) return;
    
    const [fromX, fromY] = ballPosition;
    if (gameEngine.shootBall(fromX, fromY, toX, toY)) {
      updateGameState(gameEngine);
    }
  };
  
  // End turn manually
  const handleEndTurn = () => {
    if (!gameEngine) return;
    
    // Reset remaining moves to trigger team switch
    while (gameEngine.getMovesRemaining() > 0) {
      gameEngine.moveCard(selectedPosition?.[0] || 0, selectedPosition?.[1] || 0); // This will fail but decrement moves
    }
    
    updateGameState(gameEngine);
  };
  
  return (
    <div className="game-container-3d">
      <GameInfo 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        score={score}
        currentTeam={currentTeam}
        movesRemaining={gameEngine?.getMovesRemaining() || 0}
        gameHistory={gameHistory}
      />
      
      <div className="game-board-3d">
        <Canvas shadows>
          <CameraController initial={cameraInitialized} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 15, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          <Suspense fallback={null}>
            <FootballPitch 
              board={board}
              onSquareClick={handleSquareClick}
              selectedPosition={selectedPosition}
              validMoves={validMoves}
              ballPosition={ballPosition}
            />
            
            {/* Player cards as 3D objects */}
            {board.map((row, y) =>
              row.map((square, x) =>
                square.cards.map((card, index) => {
                  const hasBall = ballPosition && 
                               ballPosition[0] === x && 
                               ballPosition[1] === y;
                  
                  return (
                    <PlayerCard3D
                      key={`${card.player.id}-${index}`}
                      card={card}
                      position={[x, 0, y]}
                      hasBall={hasBall}
                      isCurrentTeam={card.player.team === currentTeam}
                      zIndex={index}
                    />
                  );
                })
              )
            )}
          </Suspense>
        </Canvas>
      </div>
      
      <GameControls
        onEndTurn={handleEndTurn}
        onPass={() => {/* Show pass UI */}}
        onShoot={() => {/* Show shoot UI */}}
        canPass={!!ballPosition && currentTeam === gameEngine?.getCurrentTeam()}
        canShoot={!!ballPosition && currentTeam === gameEngine?.getCurrentTeam()}
        movesRemaining={gameEngine?.getMovesRemaining() || 0}
      />
    </div>
  );
};

export default GameBoard3D;

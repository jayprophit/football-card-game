import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html, useProgress, Float } from '@react-three/drei';
import { GameEngine, GameState, GameActionType, Square } from '../logic/engine/GameEngine';
import { Team, Player, Position, Card } from '../models/GameModels';
import GameEnvironment3D, { WeatherType, StadiumType } from './GameEnvironment3D';
import PlayerModel3D, { PlayerAnimation } from './PlayerModel3D';
import { CrowdSections } from './StadiumSpectators';
import GameEffect, { EffectType, EffectManager } from './GameEffects';
import GroundEffects, { GroundType } from './GroundEffects';
import '../styles/clash-style.css';

// Loading component to show while assets load
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="clash-loading-screen">
        <div className="clash-loading-logo">
          <img src="/images/ui/logo.svg" alt="Football Card Game" />
        </div>
        <div className="clash-loading-bar-container">
          <div className="clash-loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="clash-loading-text">Loading Game Assets... {Math.round(progress)}%</div>
      </div>
    </Html>
  );
}

// Clash-style game board component
interface ClashGameBoardProps {
  homeTeam: Team;
  awayTeam: Team;
}

const ClashGameBoard: React.FC<ClashGameBoardProps> = ({ homeTeam, awayTeam }) => {
  // Game state
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [board, setBoard] = useState<Square[][]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [ballPosition, setBallPosition] = useState<[number, number, number] | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team>(homeTeam);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [movesRemaining, setMovesRemaining] = useState<number>(3);
  
  // Environment state
  const [weatherType, setWeatherType] = useState<WeatherType>(WeatherType.SUNNY);
  const [stadiumType, setStadiumType] = useState<StadiumType>(StadiumType.OUTDOOR_GRASS);
  const [timeOfDay, setTimeOfDay] = useState<number>(15); // 3 PM default
  const [gameDuration, setGameDuration] = useState<number>(0); // in seconds
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation state
  const [playerAnimations, setPlayerAnimations] = useState<{[key: string]: PlayerAnimation}>({});
  const [playerMovements, setPlayerMovements] = useState<{[key: string]: [number, number, number]}>({});
  const [isMovingBall, setIsMovingBall] = useState(false);
  const [movingBallTarget, setMovingBallTarget] = useState<[number, number, number] | null>(null);
  
  // Special effects
  const [gameEffects, setGameEffects] = useState<any[]>([]);
  const [showGoalCelebration, setShowGoalCelebration] = useState(false);
  const [cameraInitialized, setCameraInitialized] = useState(false);
  
  // Game UI state
  const [showPassOptions, setShowPassOptions] = useState(false);
  const [showShootOptions, setShowShootOptions] = useState(false);
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [upgradeablePlayer, setUpgradeablePlayer] = useState<Card | null>(null);
  
  // Game logs
  const [gameLogs, setGameLogs] = useState<string[]>([]);
  
  // Initialize game
  useEffect(() => {
    const engine = new GameEngine(homeTeam, awayTeam);
    setGameEngine(engine);
    updateGameState(engine);
    setCameraInitialized(true);
    
    // Randomize weather and time of day
    setWeatherType(getRandomWeather());
    setStadiumType(getRandomStadium());
    setTimeOfDay(Math.floor(Math.random() * 24));
    
    // Start game timer
    gameTimerRef.current = setInterval(() => {
      setGameDuration(prev => prev + 1);
    }, 1000);
    
    // Add initial game log
    addGameLog("Game started! It's kickoff time!");
    
    return () => {
      // Clear timer on unmount
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, [homeTeam, awayTeam]);
  
  // Add a game log entry
  const addGameLog = (message: string) => {
    setGameLogs(prev => [message, ...prev].slice(0, 5));
  };
  
  // Get random weather
  const getRandomWeather = (): WeatherType => {
    const weathers = [
      WeatherType.SUNNY, 
      WeatherType.CLOUDY, 
      WeatherType.RAINY, 
      WeatherType.FOGGY,
      WeatherType.NIGHT
    ];
    
    return weathers[Math.floor(Math.random() * weathers.length)];
  };
  
  // Get random stadium
  const getRandomStadium = (): StadiumType => {
    const stadiums = [
      StadiumType.OUTDOOR_GRASS,
      StadiumType.OUTDOOR_ASTROTURF,
      StadiumType.OUTDOOR_MUD,
      StadiumType.INDOOR_PROFESSIONAL
    ];
    
    return stadiums[Math.floor(Math.random() * stadiums.length)];
  };
  
  // Map stadium type to ground type
  const getGroundType = (): GroundType => {
    switch (stadiumType) {
      case StadiumType.OUTDOOR_GRASS:
        return GroundType.GRASS;
      case StadiumType.OUTDOOR_ASTROTURF:
        return GroundType.ASTROTURF;
      case StadiumType.OUTDOOR_MUD:
        return GroundType.MUD;
      case StadiumType.INDOOR_PROFESSIONAL:
      case StadiumType.INDOOR_TRAINING:
        return GroundType.ASTROTURF;
      default:
        return GroundType.GRASS;
    }
  };
  
  // Update game state from engine
  const updateGameState = (engine: GameEngine) => {
    setBoard(engine.getBoard());
    
    // Convert 2D ball position to 3D
    const engineBallPos = engine.getBallPosition();
    if (engineBallPos) {
      const [x, y] = engineBallPos;
      setBallPosition([x, 0.2, y]);
    } else {
      setBallPosition(null);
    }
    
    setCurrentTeam(engine.getCurrentTeam());
    setMovesRemaining(engine.getMovesRemaining());
    
    // Check for goal scored
    const newHistory = engine.getGameHistory();
    const newScore = engine.getScore();
    
    // If score changed, trigger celebration
    if (
      newScore[0] !== score[0] || 
      newScore[1] !== score[1]
    ) {
      // Show goal celebration
      setShowGoalCelebration(true);
      
      // Find which players to animate for celebration
      const lastAction = newHistory[newHistory.length - 1];
      if (lastAction && lastAction.type === GameActionType.GOAL && lastAction.card) {
        // Celebrate for the scorer and some teammates
        const scoringTeam = lastAction.card.player.team;
        const scoringTeamPlayers = getAllPlayers().filter(
          player => player.player.team === scoringTeam
        );
        
        const animations: {[key: string]: PlayerAnimation} = {};
        
        // Scorer celebrates
        animations[lastAction.card.player.id] = PlayerAnimation.CELEBRATING;
        
        // Some teammates celebrate too
        scoringTeamPlayers.slice(0, 3).forEach(player => {
          animations[player.player.id] = PlayerAnimation.CELEBRATING;
        });
        
        // Some opponents defeated
        const opposingTeamPlayers = getAllPlayers().filter(
          player => player.player.team !== scoringTeam
        );
        
        opposingTeamPlayers.slice(0, 3).forEach(player => {
          animations[player.player.id] = PlayerAnimation.DEFEATED;
        });
        
        setPlayerAnimations(animations);
        
        // Add special effect
        addEffect(
          EffectType.GOAL,
          [0, 1, 0],
          scoringTeam === homeTeam ? homeTeam.primaryColor : awayTeam.primaryColor,
          `GOAL! ${lastAction.card.player.name} scores!`
        );
        
        // Add game log
        addGameLog(`GOAL! ${lastAction.card.player.name} scores for ${scoringTeam.name}!`);
        
        // Reset animations after celebration
        setTimeout(() => {
          setPlayerAnimations({});
          setShowGoalCelebration(false);
        }, 5000);
        
        // Randomly trigger player upgrade opportunity after goals
        if (Math.random() < 0.3) {
          // Pick a random player from scoring team for potential upgrade
          setTimeout(() => {
            const randomPlayer = scoringTeamPlayers[Math.floor(Math.random() * scoringTeamPlayers.length)];
            setUpgradeablePlayer(randomPlayer);
            setShowUpgradePanel(true);
            
            // Add special effect above the player
            const playerPos = findPlayerPosition(randomPlayer);
            if (playerPos) {
              addEffect(
                EffectType.UPGRADE,
                playerPos,
                scoringTeam.primaryColor,
                "Upgrade Available!"
              );
            }
          }, 6000);
        }
      }
    }
    
    // Process other game events
    if (newHistory.length > gameHistory.length) {
      const newActions = newHistory.slice(gameHistory.length);
      
      newActions.forEach(action => {
        processGameAction(action);
      });
    }
    
    setGameHistory(newHistory);
    setScore(newScore);
    
    // Clear selections when switching teams
    setSelectedPosition(null);
    setValidMoves([]);
  };
  
  // Find a player's position on the field
  const findPlayerPosition = (card: Card): [number, number, number] | null => {
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        if (board[y][x].cards.includes(card)) {
          return [x, 0.5, y];
        }
      }
    }
    return null;
  };
  
  // Process game action for effects and logs
  const processGameAction = (action: any) => {
    switch (action.type) {
      case GameActionType.FOUL:
        // Add foul effect
        if (action.position) {
          const [x, y] = action.position;
          
          // Add special effect for tackle
          addEffect(
            EffectType.TACKLE,
            [x, 0.5, y],
            action.card.player.team.primaryColor,
            "Tackle!"
          );
          
          // Add game log
          addGameLog(`${action.card.player.name} tackles ${action.victim.player.name}!`);
          
          // If it's a card, also add card effect
          if (action.yellowCard || action.redCard) {
            setTimeout(() => {
              addEffect(
                EffectType.CARD,
                [x, 0.5, y],
                action.card.player.team.primaryColor,
                action.redCard ? "Red Card!" : "Yellow Card!"
              );
              
              // Add game log
              addGameLog(
                `${action.redCard ? "RED" : "YELLOW"} card shown to ${action.card.player.name}!`
              );
            }, 1500);
          }
          
          // If it's an injury, add injury effect
          if (action.foulType === "INJURY") {
            setTimeout(() => {
              addEffect(
                EffectType.INJURY,
                [x, 0.5, y],
                action.victim.player.team.primaryColor,
                "Injury!"
              );
              
              // Add game log
              addGameLog(`${action.victim.player.name} is injured!`);
            }, 2500);
          }
        }
        break;
        
      case GameActionType.SHOT:
        // For shots that aren't goals
        if (!action.success) {
          const [fromX, fromY] = action.from;
          const [toX, toY] = action.to;
          
          // Add near miss effect
          addEffect(
            EffectType.NEAR_MISS,
            [toX, 0.5, toY],
            action.card.player.team.primaryColor,
            "Close!"
          );
          
          // Add game log
          addGameLog(`${action.card.player.name} shoots but misses!`);
        }
        break;
        
      case GameActionType.PASS:
        // Successful passes don't need special effects
        if (action.success) {
          // Add game log for significant passes
          if (Math.random() < 0.3) {
            addGameLog(
              `${action.card.player.name} passes to ${action.targetCard.player.name}!`
            );
          }
        } else {
          // Failed passes might get a log
          if (Math.random() < 0.5) {
            addGameLog(`${action.card.player.name} misplaces the pass!`);
          }
        }
        break;
        
      case GameActionType.INTERCEPTION:
        // Interceptions get a log
        addGameLog(`${action.card.player.name} intercepts the pass!`);
        break;
        
      case GameActionType.BALL_WON:
        // Ball winning might get a log
        if (Math.random() < 0.3) {
          addGameLog(`${action.card.player.name} wins the ball!`);
        }
        break;
    }
  };
  
  // Add a special effect
  const addEffect = (
    type: EffectType,
    position: [number, number, number],
    teamColor?: string,
    message?: string
  ) => {
    const newEffect = {
      id: `effect_${Date.now()}_${Math.random()}`,
      type,
      position,
      teamColor,
      message
    };
    
    setGameEffects(prev => [...prev, newEffect]);
  };
  
  // Handle effect completion
  const handleEffectComplete = (id: string) => {
    setGameEffects(prev => prev.filter(effect => effect.id !== id));
  };
  
  // Get all players from the board
  const getAllPlayers = (): Card[] => {
    const players: Card[] = [];
    
    board.forEach(row => {
      row.forEach(square => {
        square.cards.forEach(card => {
          if (!players.find(p => p.player.id === card.player.id)) {
            players.push(card);
          }
        });
      });
    });
    
    return players;
  };
  
  // Handle square click
  const handleSquareClick = (x: number, y: number) => {
    if (!gameEngine || showGoalCelebration) return;
    
    if (selectedPosition) {
      // If a square is already selected, try to move to the clicked square
      const [selectedX, selectedY] = selectedPosition;
      
      // Check if the clicked square is a valid move
      const isValidMove = validMoves.some(([vx, vy]) => vx === x && vy === y);
      
      if (isValidMove) {
        // Find the card at the selected position
        const selectedSquare = board[selectedY][selectedX];
        const selectedCard = selectedSquare.cards.find(c => c.player.team === currentTeam);
        
        if (selectedCard) {
          // Set animation and movement for the card
          setPlayerAnimations({
            ...playerAnimations,
            [selectedCard.player.id]: PlayerAnimation.RUNNING
          });
          
          setPlayerMovements({
            ...playerMovements,
            [selectedCard.player.id]: [x, 0, y]
          });
          
          // If the card has the ball, animate ball movement too
          const hasBall = ballPosition && 
                         ballPosition[0] === selectedX && 
                         ballPosition[2] === selectedY;
          
          if (hasBall) {
            setIsMovingBall(true);
            setMovingBallTarget([x, 0.2, y]);
          }
          
          // Add game log
          if (Math.random() < 0.3) {
            addGameLog(`${selectedCard.player.name} moves into position.`);
          }
          
          // After animation completes, update the game state
          setTimeout(() => {
            gameEngine.moveCard(x, y);
            updateGameState(gameEngine);
            
            // Clear animations
            const newAnimations = { ...playerAnimations };
            delete newAnimations[selectedCard.player.id];
            setPlayerAnimations(newAnimations);
            
            // Clear movements
            const newMovements = { ...playerMovements };
            delete newMovements[selectedCard.player.id];
            setPlayerMovements(newMovements);
            
            setIsMovingBall(false);
            setMovingBallTarget(null);
          }, 600); // Match the movement animation duration
        }
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
      
      // Play selection sound
      // playSound('select.mp3');
    }
  };
  
  // Handle passing the ball
  const handlePassBall = (fromX: number, fromY: number, toX: number, toY: number) => {
    if (!gameEngine || !ballPosition) return;
    
    // Find the card that has the ball
    const fromSquare = board[fromY][fromX];
    const fromCard = fromSquare.cards.find(c => c.player.team === currentTeam);
    
    // Find the card receiving the ball
    const toSquare = board[toY][toX];
    const toCard = toSquare.cards.find(c => c.player.team === currentTeam);
    
    if (fromCard && toCard) {
      // Animate the passing player
      setPlayerAnimations({
        ...playerAnimations,
        [fromCard.player.id]: PlayerAnimation.PASSING
      });
      
      // Animate the ball
      setIsMovingBall(true);
      setMovingBallTarget([toX, 0.2, toY]);
      
      // Add game log
      addGameLog(`${fromCard.player.name} passes to ${toCard.player.name}!`);
      
      // After animation completes, update the game state
      setTimeout(() => {
        if (gameEngine.passBall(fromX, fromY, toX, toY)) {
          updateGameState(gameEngine);
        }
        
        // Clear animations
        const newAnimations = { ...playerAnimations };
        delete newAnimations[fromCard.player.id];
        setPlayerAnimations(newAnimations);
        
        setIsMovingBall(false);
        setMovingBallTarget(null);
        setShowPassOptions(false);
      }, 600);
    }
  };
  
  // Handle shooting
  const handleShoot = (fromX: number, fromY: number, toX: number, toY: number) => {
    if (!gameEngine || !ballPosition) return;
    
    // Find the card that has the ball
    const fromSquare = board[fromY][fromX];
    const fromCard = fromSquare.cards.find(c => c.player.team === currentTeam);
    
    if (fromCard) {
      // Animate the shooting player
      setPlayerAnimations({
        ...playerAnimations,
        [fromCard.player.id]: PlayerAnimation.KICKING
      });
      
      // Animate the ball
      setIsMovingBall(true);
      setMovingBallTarget([toX, 0.2, toY]);
      
      // Add game log
      addGameLog(`${fromCard.player.name} shoots at goal!`);
      
      // After animation completes, update the game state
      setTimeout(() => {
        if (gameEngine.shootBall(fromX, fromY, toX, toY)) {
          updateGameState(gameEngine);
        }
        
        // Clear animations
        const newAnimations = { ...playerAnimations };
        delete newAnimations[fromCard.player.id];
        setPlayerAnimations(newAnimations);
        
        setIsMovingBall(false);
        setMovingBallTarget(null);
        setShowShootOptions(false);
      }, 600);
    }
  };
  
  // End turn manually
  const handleEndTurn = () => {
    if (!gameEngine) return;
    
    // Add game log
    addGameLog(`${currentTeam.name} ends their turn.`);
    
    // Reset remaining moves to trigger team switch
    while (gameEngine.getMovesRemaining() > 0) {
      gameEngine.moveCard(selectedPosition?.[0] || 0, selectedPosition?.[1] || 0); // This will fail but decrement moves
    }
    
    updateGameState(gameEngine);
  };
  
  // Change stadium
  const handleChangeStadium = () => {
    setStadiumType(getRandomStadium());
    addGameLog(`Match venue changed! Welcome to the new stadium!`);
  };
  
  // Change weather
  const handleChangeWeather = () => {
    setWeatherType(getRandomWeather());
    addGameLog(`Weather conditions are changing!`);
  };
  
  // Toggle time of day
  const handleChangeTimeOfDay = () => {
    const newTime = (timeOfDay + 4) % 24;
    setTimeOfDay(newTime);
    addGameLog(`Time passes and it's now ${newTime}:00.`);
  };
  
  // Convert 2D grid position to 3D world position
  const gridToWorldPos = (x: number, y: number, height: number = 0): [number, number, number] => {
    // Center the grid on the origin, with each grid cell being 1x1 units
    return [x - 6, height, y - 4];
  };
  
  // Create pass UI
  const handleShowPassOptions = () => {
    if (!ballPosition || !gameEngine) return;
    
    setShowPassOptions(true);
    setShowShootOptions(false);
  };
  
  // Create shoot UI
  const handleShowShootOptions = () => {
    if (!ballPosition || !gameEngine) return;
    
    setShowShootOptions(true);
    setShowPassOptions(false);
  };
  
  // Handle pass selection
  const handlePassSelection = (toX: number, toY: number) => {
    if (!ballPosition || !gameEngine) return;
    
    const [bx, _, bz] = ballPosition;
    handlePassBall(Math.round(bx), Math.round(bz), toX, toY);
  };
  
  // Handle shoot selection
  const handleShootSelection = (toX: number, toY: number) => {
    if (!ballPosition || !gameEngine) return;
    
    const [bx, _, bz] = ballPosition;
    handleShoot(Math.round(bx), Math.round(bz), toX, toY);
  };
  
  // Handle player upgrade
  const handleUpgradePlayer = (upgradeType: string) => {
    if (!upgradeablePlayer) return;
    
    // Apply upgrade based on type
    // In a real implementation, this would update player stats
    addGameLog(`${upgradeablePlayer.player.name} upgraded with ${upgradeType}!`);
    
    // Close upgrade panel
    setShowUpgradePanel(false);
    setUpgradeablePlayer(null);
  };
  
  // Format match time (MM:SS)
  const formatGameTime = () => {
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="clash-game-container">
      {/* Clash-style header */}
      <div className="clash-header">
        <h1>Football Card Game</h1>
        <div className="clash-resources">
          <div className="resource-item">
            <img src="/images/ui/clock.svg" alt="Time" />
            {formatGameTime()}
          </div>
        </div>
      </div>
      
      {/* Score display */}
      <div className="clash-score-display">
        <div className="clash-score-panel">
          <div className="clash-team">
            <div className="clash-team-logo" style={{ backgroundColor: homeTeam.primaryColor }}>
              <span>{homeTeam.name.charAt(0)}</span>
            </div>
            <span>{homeTeam.name}</span>
          </div>
          
          <div className="clash-score">{score[0]}</div>
          <div className="clash-vs">-</div>
          <div className="clash-score">{score[1]}</div>
          
          <div className="clash-team">
            <span>{awayTeam.name}</span>
            <div className="clash-team-logo" style={{ backgroundColor: awayTeam.primaryColor }}>
              <span>{awayTeam.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3D Game board */}
      <div className="clash-game-board-3d">
        <Canvas shadows>
          <PerspectiveCamera makeDefault fov={45} />
          <OrbitControls 
            enableRotate={true}
            enablePan={true}
            enableZoom={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={8}
            maxDistance={25}
            target={[0, 0, 0]}
            makeDefault
          />
          
          {/* Environment and stadium */}
          <Suspense fallback={<Loader />}>
            <GameEnvironment3D 
              weatherType={weatherType}
              stadiumType={stadiumType}
              timeOfDay={timeOfDay}
            />
            
            {/* Spectators */}
            <CrowdSections 
              stadiumType={stadiumType}
              teamColors={[homeTeam.primaryColor, awayTeam.primaryColor]}
              homeScore={score[0]}
              awayScore={score[1]}
              stadiumSize="medium"
              crowdDensity={0.8}
            />
            
            {/* Ground effects (grass, mud, etc.) */}
            <GroundEffects
              groundType={getGroundType()}
              size={[13, 9]}
              position={[0, 0, 0]}
              weatherType={weatherType}
              gameDuration={gameDuration}
            />
          </Suspense>
          
          {/* Playing field */}
          <group position={[-6.5, 0, -4.5]}>
            {/* Grid squares for interaction */}
            {board.map((row, y) =>
              row.map((square, x) => {
                const isSelected = selectedPosition && selectedPosition[0] === x && selectedPosition[1] === y;
                const isValidMove = validMoves.some(([vx, vy]) => vx === x && vy === y);
                const isGoalArea = (y === 0 || y === 8) && (x >= 5 && x <= 7);
                
                // Convert to 3D coordinates
                const [wx, wy, wz] = gridToWorldPos(x, y, 0.01);
                
                return (
                  <mesh
                    key={`square-${x}-${y}`}
                    position={[wx, wy, wz]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    onClick={() => handleSquareClick(x, y)}
                  >
                    <planeGeometry args={[0.9, 0.9]} />
                    <meshStandardMaterial
                      color={
                        isSelected ? '#ffb142' : 
                        isValidMove ? '#2ecc71' : 
                        isGoalArea ? '#3498db' : 
                        'white'
                      }
                      transparent={true}
                      opacity={
                        isSelected ? 0.5 : 
                        isValidMove ? 0.4 : 
                        isGoalArea ? 0.3 : 
                        0.1
                      }
                    />
                    
                    {/* Show Clash of Clans style selection indicator */}
                    {isSelected && (
                      <group position={[0, 0.05, 0]}>
                        <mesh>
                          <ringGeometry args={[0.4, 0.45, 32]} />
                          <meshBasicMaterial color="#ffb142" />
                        </mesh>
                        <mesh position={[0, 0.01, 0]}>
                          <ringGeometry args={[0.3, 0.35, 32]} />
                          <meshBasicMaterial color="#f39c12" />
                        </mesh>
                      </group>
                    )}
                    
                    {/* Show Clash of Clans style move indicator */}
                    {isValidMove && (
                      <mesh position={[0, 0.03, 0]}>
                        <planeGeometry args={[0.5, 0.5]} />
                        <meshBasicMaterial 
                          color="#2ecc71" 
                          transparent={true} 
                          opacity={0.6}
                        />
                      </mesh>
                    )}
                    
                    {/* Show pass option indicator */}
                    {showPassOptions && square.cards.some(c => c.player.team === currentTeam) && (
                      <group 
                        position={[0, 0.03, 0]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePassSelection(x, y);
                        }}
                      >
                        <mesh>
                          <ringGeometry args={[0.3, 0.4, 32]} />
                          <meshBasicMaterial color="#3498db" />
                        </mesh>
                        <mesh position={[0, 0.01, 0]}>
                          <boxGeometry args={[0.15, 0.02, 0.15]} />
                          <meshBasicMaterial color="#3498db" />
                        </mesh>
                      </group>
                    )}
                    
                    {/* Show shoot option indicator */}
                    {showShootOptions && isGoalArea && (
                      <group
                        position={[0, 0.03, 0]}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShootSelection(x, y);
                        }}
                      >
                        <mesh>
                          <ringGeometry args={[0.3, 0.4, 32]} />
                          <meshBasicMaterial color="#e74c3c" />
                        </mesh>
                        <mesh position={[0, 0.01, 0]}>
                          <boxGeometry args={[0.15, 0.02, 0.15]} />
                          <meshBasicMaterial color="#e74c3c" />
                        </mesh>
                      </group>
                    )}
                  </mesh>
                );
              })
            )}
            
            {/* Special effects */}
            <EffectManager 
              effects={gameEffects}
              onEffectComplete={handleEffectComplete}
            />
            
            {/* Players */}
            {board.map((row, y) =>
              row.map((square, x) =>
                square.cards.map((card, index) => {
                  // Convert to 3D world position
                  const [wx, wy, wz] = gridToWorldPos(x, y, 0);
                  
                  // Check if player has the ball
                  const hasBall = ballPosition && 
                               Math.round(ballPosition[0]) === x && 
                               Math.round(ballPosition[2]) === y &&
                               !isMovingBall;
                  
                  // Get player's animation state
                  const animation = playerAnimations[card.player.id] || PlayerAnimation.IDLE;
                  
                  // Get player's movement target
                  const targetPosition = playerMovements[card.player.id] ? 
                    gridToWorldPos(
                      playerMovements[card.player.id][0],
                      playerMovements[card.player.id][2],
                      0
                    ) : undefined;
                  
                  return (
                    <Suspense key={`${card.player.id}-${index}`} fallback={null}>
                      <PlayerModel3D
                        card={card}
                        position={[wx, wy, wz]}
                        hasBall={hasBall}
                        isCurrentTeam={card.player.team === currentTeam}
                        zIndex={index}
                        animation={animation}
                        targetPosition={targetPosition}
                        onAnimationComplete={() => {
                          // Clear animation when complete
                          const newAnimations = { ...playerAnimations };
                          delete newAnimations[card.player.id];
                          setPlayerAnimations(newAnimations);
                        }}
                      />
                    </Suspense>
                  );
                })
              )
            )}
            
            {/* Ball */}
            {ballPosition && !isMovingBall && (
              <group position={ballPosition}>
                <mesh castShadow>
                  <sphereGeometry args={[0.15, 32, 32]} />
                  <meshStandardMaterial color="white" roughness={0.3} />
                  
                  {/* Ball pattern */}
                  <mesh>
                    <icosahedronGeometry args={[0.151, 0]} />
                    <meshBasicMaterial color="black" wireframe opacity={0.7} transparent />
                  </mesh>
                </mesh>
              </group>
            )}
            
            {/* Moving ball */}
            {isMovingBall && ballPosition && movingBallTarget && (
              <Float 
                speed={5}
                rotationIntensity={2}
                floatIntensity={2}
                position={ballPosition}
              >
                <mesh castShadow>
                  <sphereGeometry args={[0.15, 32, 32]} />
                  <meshStandardMaterial color="white" roughness={0.3} />
                  
                  {/* Ball pattern */}
                  <mesh>
                    <icosahedronGeometry args={[0.151, 0]} />
                    <meshBasicMaterial color="black" wireframe opacity={0.7} transparent />
                  </mesh>
                </mesh>
              </Float>
            )}
          </group>
        </Canvas>
        
        {/* Game info overlay */}
        <div className="clash-game-info">
          <div><strong>Current Team:</strong> {currentTeam.name}</div>
          <div><strong>Moves:</strong> {movesRemaining}</div>
          <div><strong>Weather:</strong> {weatherType}</div>
          <div><strong>Stadium:</strong> {stadiumType.replace('_', ' ')}</div>
        </div>
        
        {/* Game log */}
        <div className="clash-game-log">
          <div><strong>Match Events</strong></div>
          {gameLogs.map((log, index) => (
            <div key={index} className="clash-log-entry">{log}</div>
          ))}
        </div>
        
        {/* UI overlay for mobile-friendly controls */}
        <div className="clash-environment-controls">
          <button className="clash-env-btn" onClick={handleChangeStadium}>
            🏟️
          </button>
          <button className="clash-env-btn" onClick={handleChangeWeather}>
            🌤️
          </button>
          <button className="clash-env-btn" onClick={handleChangeTimeOfDay}>
            🕒
          </button>
        </div>
      </div>
      
      {/* Game controls */}
      <div className="clash-controls">
        <button 
          className="clash-btn"
          onClick={handleEndTurn}
          disabled={movesRemaining <= 0}
        >
          End Turn ({movesRemaining})
        </button>
        
        <button 
          className="clash-btn primary"
          onClick={handleShowPassOptions}
          disabled={!ballPosition || currentTeam !== gameEngine?.getCurrentTeam()}
        >
          Pass Ball
        </button>
        
        <button 
          className="clash-btn danger"
          onClick={handleShowShootOptions}
          disabled={!ballPosition || currentTeam !== gameEngine?.getCurrentTeam()}
        >
          Shoot
        </button>
      </div>
      
      {/* Goal celebration overlay */}
      {showGoalCelebration && (
        <div className="clash-goal-celebration">
          <div className="clash-goal-text">GOAL!</div>
          <div className="clash-goal-team">
            {score[0] > score[1] ? homeTeam.name : awayTeam.name} takes the lead!
          </div>
        </div>
      )}
      
      {/* Upgrade panel */}
      {showUpgradePanel && upgradeablePlayer && (
        <div className="clash-upgrade-panel">
          <div className="clash-upgrade-header">
            Upgrade {upgradeablePlayer.player.name}
          </div>
          <div className="clash-upgrade-options">
            <div 
              className="clash-upgrade-option"
              onClick={() => handleUpgradePlayer('Speed Boost')}
            >
              <div className="clash-upgrade-icon">⚡</div>
              <div className="clash-upgrade-name">Speed Boost</div>
            </div>
            
            <div 
              className="clash-upgrade-option"
              onClick={() => handleUpgradePlayer('Power Shot')}
            >
              <div className="clash-upgrade-icon">🔥</div>
              <div className="clash-upgrade-name">Power Shot</div>
            </div>
            
            <div 
              className="clash-upgrade-option"
              onClick={() => handleUpgradePlayer('Master Passer')}
            >
              <div className="clash-upgrade-icon">🎯</div>
              <div className="clash-upgrade-name">Master Passer</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClashGameBoard;

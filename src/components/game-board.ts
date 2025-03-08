import React, { useState, useEffect } from 'react';
import { GameEngine, GameState, GameActionType, Square } from '../logic/engine/GameEngine';
import { Team, Player, Position, Card } from '../models/GameModels';
import PlayerCard from './PlayerCard';
import GameControls from './GameControls';
import GameInfo from './GameInfo';

interface GameBoardProps {
  homeTeam: Team;
  awayTeam: Team;
}

const GameBoard: React.FC<GameBoardProps> = ({ homeTeam, awayTeam }) => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [board, setBoard] = useState<Square[][]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [validMoves, setValidMoves] = useState<[number, number][]>([]);
  const [ballPosition, setBallPosition] = useState<[number, number] | null>(null);
  const [currentTeam, setCurrentTeam] = useState<Team>(homeTeam);
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [score, setScore] = useState<[number, number]>([0, 0]);
  
  // Initialize game
  useEffect(() => {
    const engine = new GameEngine(homeTeam, awayTeam);
    setGameEngine(engine);
    updateGameState(engine);
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
  
  // Select a square
  const selectSquare = (x: number, y: number) => {
    if (!gameEngine) return;
    
    if (gameEngine.selectCard(x, y)) {
      setSelectedPosition([x, y]);
      setValidMoves(gameEngine.getValidMoves());
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
  
  // Render the game board
  return (
    <div className="game-container">
      <GameInfo 
        homeTeam={homeTeam}
        awayTeam={awayTeam}
        score={score}
        currentTeam={currentTeam}
        movesRemaining={gameEngine?.getMovesRemaining() || 0}
        gameHistory={gameHistory}
      />
      
      <div className="game-board">
        {board.map((row, y) => (
          row.map((square, x) => {
            const isSelected = selectedPosition && selectedPosition[0] === x && selectedPosition[1] === y;
            const isValidMove = validMoves.some(([vx, vy]) => vx === x && vy === y);
            const hasBall = ballPosition && ballPosition[0] === x && ballPosition[1] === y;
            
            // Check if square is a goal area
            const isGoalArea = (y === 0 || y === 8) && (x >= 5 && x <= 7);
            
            return (
              <div 
                key={`${x}-${y}`} 
                className={`square ${isSelected ? 'selected' : ''} ${isValidMove ? 'valid-move' : ''} ${isGoalArea ? 'goal-area' : ''}`}
                onClick={() => handleSquareClick(x, y)}
              >
                {square.cards.map((card, index) => (
                  <PlayerCard 
                    key={`${card.player.id}-${index}`} 
                    card={card} 
                    hasBall={hasBall} 
                    isCurrentTeam={card.player.team === currentTeam}
                    zIndex={index}
                  />
                ))}
                {hasBall && square.cards.length === 0 && (
                  <div className="ball"></div>
                )}
              </div>
            );
          })
        ))}
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

export default GameBoard;

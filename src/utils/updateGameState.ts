export const updateGameState = (gameState, movedCard) => {
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

  return newGameState;
};

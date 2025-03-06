export const generatePossibleMoves = (player, allPlayers) => {
  const { col, row, movementPattern } = player;
  const possibleMoves = [];
  
  // Apply movement reduction from injuries
  const moveReduction = player.movementReduction || 0;
  
  // Generate moves based on chess piece pattern
  switch (movementPattern) {
    case 'king': // Goalkeeper
      // Same logic as web implementation
      for (let dCol = -1; dCol <= 1; dCol++) {
        for (let dRow = -1; dRow <= 1; dRow++) {
          if (dCol === 0 && dRow === 0) continue;
          
          const newCol = col + dCol;
          const newRow = row + dRow;
          
          if (isInBounds(newCol, newRow)) {
            possibleMoves.push({ col: newCol, row: newRow });
          }
        }
      }
      
      // Special goalkeeper diving move
      if (player.position === 'GK') {
        const ballOwner = allPlayers.find(p => p.hasBall);
        if (ballOwner && isInShootingRange(ballOwner)) {
          if (isInBounds(col, row - 2)) possibleMoves.push({ col, row: row - 2 });
          if (isInBounds(col, row + 2)) possibleMoves.push({ col, row: row + 2 });
        }
      }
      break;
      
    case 'rook': // Defenders and Strikers
      // Same logic as web implementation
      const rookRange = player.position.includes('B') ? 3 : 4;
      const adjustedRookRange = Math.max(1, rookRange - moveReduction);
      
      for (let dir = 0; dir < 4; dir++) {
        const dCol = dir === 0 ? 1 : dir === 1 ? -1 : 0;
        const dRow = dir === 2 ? 1 : dir === 3 ? -1 : 0;
        
        for (let i = 1; i <= adjustedRookRange; i++) {
          const newCol = col + (dCol * i);
          const newRow = row + (dRow * i);
          
          if (isInBounds(newCol, newRow)) {
            possibleMoves.push({ col: newCol, row: newRow });
          } else {
            break;
          }
        }
      }
      
      // Striker special move
      if (player.position === 'ST') {
        for (let dCol = -1; dCol <= 1; dCol += 2) {
          for (let dRow = -1; dRow <= 1; dRow += 2) {
            const newCol = col + dCol;
            const newRow = row + dRow;
            
            if (isInBounds(newCol, newRow)) {
              possibleMoves.push({ col: newCol, row: newRow });
            }
          }
        }
      }
      break;
      
    // Other cases (bishop, knight, queen) follow same pattern as web implementation
    case 'bishop':
      // Full backs logic
      break;
      
    case 'knight':
      // Wingers and DMs logic
      break;
      
    case 'queen':
      // Midfielders logic
      break;
  }
  
  return possibleMoves;
};

export const isInBounds = (col, row) => {
  return col >= 0 && col < 20 && row >= 0 && row < 10;
};

export const isInShootingRange = (player) => {
  // Same logic as web implementation
  if (player.team === 'home') {
    return player.col >= 16;
  } else {
    return player.col <= 3;
  }
};

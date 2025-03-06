export const validateMove = (card, fromRow, toRow, fromCol, toCol) => {
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

/**
 * Movement Patterns for Different Positions
 * 
 * This file defines the chess-like movement patterns for different player positions:
 * - GK (Goalkeeper): King-like movement (1 square in any direction)
 * - CB (Center Back): Rook-like movement (horizontal and vertical)
 * - LB/RB (Fullbacks): Bishop-like movement (diagonal) + horizontal
 * - CDM (Defensive Mid): Knight-like movement (L-shape)
 * - CM/CAM (Midfielders): Queen-like movement (any direction, limited range)
 * - LW/RW (Wingers): Knight-like movement + extended horizontal
 * - ST/CF (Strikers): Rook-like movement with extended range + limited diagonal
 */

// Direction vectors for different movement types
const DIRECTIONS = {
  // Horizontal and vertical directions (rook)
  ORTHOGONAL: [
    { dx: 1, dy: 0 },  // Right
    { dx: -1, dy: 0 }, // Left
    { dx: 0, dy: 1 },  // Down
    { dx: 0, dy: -1 }  // Up
  ],
  
  // Diagonal directions (bishop)
  DIAGONAL: [
    { dx: 1, dy: 1 },   // Down-right
    { dx: 1, dy: -1 },  // Up-right
    { dx: -1, dy: 1 },  // Down-left
    { dx: -1, dy: -1 }  // Up-left
  ],
  
  // All directions (queen/king)
  ALL: [
    { dx: 1, dy: 0 },   // Right
    { dx: -1, dy: 0 },  // Left
    { dx: 0, dy: 1 },   // Down
    { dx: 0, dy: -1 },  // Up
    { dx: 1, dy: 1 },   // Down-right
    { dx: 1, dy: -1 },  // Up-right
    { dx: -1, dy: 1 },  // Down-left
    { dx: -1, dy: -1 }  // Up-left
  ],
  
  // Knight's L-shape moves
  KNIGHT: [
    { dx: 2, dy: 1 },   // Right-down
    { dx: 2, dy: -1 },  // Right-up
    { dx: -2, dy: 1 },  // Left-down
    { dx: -2, dy: -1 }, // Left-up
    { dx: 1, dy: 2 },   // Down-right
    { dx: 1, dy: -2 },  // Up-right
    { dx: -1, dy: 2 },  // Down-left
    { dx: -1, dy: -2 }  // Up-left
  ]
};

// Movement patterns by position
const MOVEMENT_PATTERNS = {
  // Goalkeeper: King-like movement (1 square in any direction)
  GK: {
    description: "Moves 1 square in any direction (special ability: can move 2 squares laterally when saving)",
    directions: DIRECTIONS.ALL,
    range: 1,
    specialMoves: [
      { dx: 0, dy: -2 }, // Diving left (extended move)
      { dx: 0, dy: 2 }   // Diving right (extended move)
    ]
  },
  
  // Defenders: Rook-like movement (horizontal and vertical)
  CB: {
    description: "Moves up to 3 squares horizontally and vertically",
    directions: DIRECTIONS.ORTHOGONAL,
    range: 3
  },
  
  // Full Backs: Bishop-like movement (diagonal) with horizontal addition
  LB: {
    description: "Moves up to 3 squares diagonally, plus 1 square horizontally",
    directions: DIRECTIONS.DIAGONAL,
    range: 3,
    specialMoves: [
      { dx: 1, dy: 0 },  // Right
      { dx: -1, dy: 0 }  // Left
    ]
  },
  
  RB: {
    description: "Moves up to 3 squares diagonally, plus 1 square horizontally",
    directions: DIRECTIONS.DIAGONAL,
    range: 3,
    specialMoves: [
      { dx: 1, dy: 0 },  // Right
      { dx: -1, dy: 0 }  // Left
    ]
  },
  
  // Defensive Midfielder: Knight-like movement (L-shape)
  CDM: {
    description: "Moves in L-shapes (2+1 pattern, can jump over other players)",
    directions: DIRECTIONS.KNIGHT,
    range: 1, // Only one L-movement
    specialMoves: [
      { dx: 1, dy: 0 },   // Right
      { dx: -1, dy: 0 },  // Left
      { dx: 0, dy: 1 },   // Down
      { dx: 0, dy: -1 }   // Up
    ]
  },
  
  // Central Midfielders: Queen-like movement (any direction, limited range)
  CM: {
    description: "Moves up to 2 squares in any direction",
    directions: DIRECTIONS.ALL,
    range: 2
  },
  
  CAM: {
    description: "Moves up to 3 squares in any direction",
    directions: DIRECTIONS.ALL,
    range: 3
  },
  
  // Wingers: Knight-like movement + extended horizontal
  LW: {
    description: "Moves in L-shapes plus up to 2 squares horizontally",
    directions: DIRECTIONS.KNIGHT,
    range: 1, // Only one L-movement
    specialMoves: [
      { dx: 2, dy: 0 },  // Extended right
      { dx: -2, dy: 0 }  // Extended left
    ]
  },
  
  RW: {
    description: "Moves in L-shapes plus up to 2 squares horizontally",
    directions: DIRECTIONS.KNIGHT,
    range: 1, // Only one L-movement
    specialMoves: [
      { dx: 2, dy: 0 },  // Extended right
      { dx: -2, dy: 0 }  // Extended left
    ]
  },
  
  // Strikers: Rook-like movement with extended range + limited diagonal
  ST: {
    description: "Moves up to 4 squares horizontally and vertically, plus 1 square diagonally",
    directions: DIRECTIONS.ORTHOGONAL,
    range: 4,
    specialMoves: [
      { dx: 1, dy: 1 },   // Down-right
      { dx: 1, dy: -1 },  // Up-right
      { dx: -1, dy: 1 },  // Down-left
      { dx: -1, dy: -1 }  // Up-left
    ]
  },
  
  CF: {
    description: "Moves up to 4 squares horizontally and vertically, plus 1 square diagonally",
    directions: DIRECTIONS.ORTHOGONAL,
    range: 4,
    specialMoves: [
      { dx: 1, dy: 1 },   // Down-right
      { dx: 1, dy: -1 },  // Up-right
      { dx: -1, dy: 1 },  // Down-left
      { dx: -1, dy: -1 }  // Up-left
    ]
  }
};

/**
 * Get the movement pattern for a given position
 * @param {String} position The player's position code (GK, CB, etc.)
 * @returns {Object} Movement pattern object with directions, range, and specialMoves
 */
export function getMovementPattern(position) {
  // If position has a specific pattern, return it
  if (MOVEMENT_PATTERNS[position]) {
    return MOVEMENT_PATTERNS[position];
  }
  
  // For any unrecognized position, use a default pattern
  return {
    description: "Moves up to 2 squares in any direction",
    directions: DIRECTIONS.ALL,
    range: 2
  };
}

/**
 * Get a human-readable description of a position's movement pattern
 * @param {String} position The player's position code
 * @returns {String} Description of movement pattern
 */
export function getMovementDescription(position) {
  const pattern = getMovementPattern(position);
  return pattern.description;
}

/**
 * Check if a move from one position to another is valid for the given movement pattern
 * @param {Number} fromCol Starting column
 * @param {Number} fromRow Starting row
 * @param {Number} toCol Target column
 * @param {Number} toRow Target row
 * @param {String} position Player position
 * @returns {Boolean} True if the move is valid
 */
export function isValidMove(fromCol, fromRow, toCol, toRow, position) {
  const pattern = getMovementPattern(position);
  const dx = toCol - fromCol;
  const dy = toRow - fromRow;
  
  // Check regular directions
  for (const dir of pattern.directions) {
    // Check if the move matches this direction with the allowed range
    for (let i = 1; i <= pattern.range; i++) {
      if (dx === dir.dx * i && dy === dir.dy * i) {
        return true;
      }
    }
  }
  
  // Check special moves
  if (pattern.specialMoves) {
    for (const move of pattern.specialMoves) {
      if (dx === move.dx && dy === move.dy) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Map chess piece types to football positions for easier understanding
 * @param {String} position Football position (GK, CB, etc.)
 * @returns {String} Equivalent chess piece (king, queen, etc.)
 */
export function getChessPieceType(position) {
  const chessMappings = {
    GK: 'king',
    CB: 'rook',
    LB: 'bishop',
    RB: 'bishop',
    CDM: 'knight',
    CM: 'queen',
    CAM: 'queen',
    LW: 'knight',
    RW: 'knight',
    ST: 'rook',
    CF: 'rook'
  };
  
  return chessMappings[position] || 'queen';
}

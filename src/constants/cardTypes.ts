export const CARD_TYPES = {
  King: {
    name: 'King',
    color: 'red',
    movementType: 'King-like',
    movementRules: {
      maxSquares: 1
    }
  },
  Rook: {
    name: 'Rook',
    color: 'blue',
    movementType: 'Rook-like',
    movementRules: {
      maxSquares: 8
    }
  },
  Knight: {
    name: 'Knight',
    color: 'green',
    movementType: 'Knight-like',
    movementRules: {
      maxSquares: 3
    }
  },
  Bishop: {
    name: 'Bishop',
    color: 'yellow',
    movementType: 'Bishop-like',
    movementRules: {
      maxSquares: 8
    }
  },
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

const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
  homePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  awayPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  homeTeam: {
    type: String,
    default: 'Custom Team'
  },
  awayTeam: {
    type: String,
    default: 'Custom Team'
  },
  score: {
    home: {
      type: Number,
      default: 0
    },
    away: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'half_time', 'completed', 'abandoned'],
    default: 'scheduled'
  },
  gameState: {
    type: String, // JSON string of the current game state
    required: true
  },
  events: {
    type: [{
      minute: Number,
      type: {
        type: String,
        enum: ['goal', 'yellow_card', 'red_card', 'injury', 'substitution', 'half_time', 'full_time']
      },
      player: String,
      team: {
        type: String,
        enum: ['home', 'away']
      },
      details: mongoose.Schema.Types.Mixed
    }],
    default: []
  },
  stats: {
    possession: {
      home: {
        type: Number,
        default: 50
      },
      away: {
        type: Number,
        default: 50
      }
    },
    shots: {
      home: {
        type: Number,
        default: 0
      },
      away: {
        type: Number,
        default: 0
      }
    },
    shotsOnTarget: {
      home: {
        type: Number,
        default: 0
      },
      away: {
        type: Number,
        default: 0
      }
    },
    fouls: {
      home: {
        type: Number,
        default: 0
      },
      away: {
        type: Number,
        default: 0
      }
    },
    yellowCards: {
      home: {
        type: Number,
        default: 0
      },
      away: {
        type: Number,
        default: 0
      }
    },
    redCards: {
      home: {
        type: Number,
        default: 0
      },
      away: {
        type: Number,
        default: 0
      }
    }
  },
  chat: {
    type: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      username: String,
      message: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  },
  eloChange: {
    home: {
      type: Number,
      default: 0
    },
    away: {
      type: Number,
      default: 0
    }
  },
  matchType: {
    type: String,
    enum: ['friendly', 'ranked', 'tournament'],
    default: 'ranked'
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    default: null
  },
  startedAt: {
    type: Date,
    default: null
  },
  lastMoveAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate ELO change based on match result
MatchSchema.methods.calculateEloChange = async function() {
  // Only calculate if match is completed
  if (this.status !== 'completed') return;
  
  try {
    // Get both players with their current ELO
    const homeUser = await mongoose.model('User').findById(this.homePlayer);
    const awayUser = await mongoose.model('User').findById(this.awayPlayer);
    
    if (!homeUser || !awayUser) {
      console.error('Could not find users to calculate ELO change');
      return;
    }
    
    const homeElo = homeUser.elo;
    const awayElo = awayUser.elo;
    
    // Determine match result
    let homeResult, awayResult;
    if (this.score.home > this.score.away) {
      homeResult = 1; // Home win
      awayResult = 0; // Away loss
    } else if (this.score.home < this.score.away) {
      homeResult = 0; // Home loss
      awayResult = 1; // Away win
    } else {
      homeResult = 0.5; // Draw
      awayResult = 0.5; // Draw
    }
    
    // Calculate expected scores
    const exponent = (awayElo - homeElo) / 400;
    const homeExpected = 1 / (1 + Math.pow(10, exponent));
    const awayExpected = 1 - homeExpected;
    
    // Calculate ELO change
    const kFactor = 32; // K-factor determines how much the rating changes
    
    const homeChange = Math.round(kFactor * (homeResult - homeExpected));
    const awayChange = Math.round(kFactor * (awayResult - awayExpected));
    
    // Save ELO changes to match
    this.eloChange.home = homeChange;
    this.eloChange.away = awayChange;
    
    // Update player ELO ratings
    homeUser.elo += homeChange;
    awayUser.elo += awayChange;
    
    // Update player statistics
    homeUser.statistics.gamesPlayed += 1;
    awayUser.statistics.gamesPlayed += 1;
    
    if (homeResult === 1) {
      homeUser.statistics.wins += 1;
      awayUser.statistics.losses += 1;
    } else if (awayResult === 1) {
      homeUser.statistics.losses += 1;
      awayUser.statistics.wins += 1;
    } else {
      homeUser.statistics.draws += 1;
      awayUser.statistics.draws += 1;
    }
    
    homeUser.statistics.goalsScored += this.score.home;
    homeUser.statistics.goalsConceded += this.score.away;
    awayUser.statistics.goalsScored += this.score.away;
    awayUser.statistics.goalsConceded += this.score.home;
    
    // Save user updates
    await homeUser.save();
    await awayUser.save();
    
    return { homeChange, awayChange };
  } catch (error) {
    console.error('Error calculating ELO change:', error);
    throw error;
  }
};

// Award coins and XP to players based on match
MatchSchema.methods.awardRewards = async function() {
  if (this.status !== 'completed') return;
  
  try {
    const homeUser = await mongoose.model('User').findById(this.homePlayer);
    const awayUser = await mongoose.model('User').findById(this.awayPlayer);
    
    if (!homeUser || !awayUser) {
      console.error('Could not find users to award rewards');
      return;
    }
    
    // Base rewards
    const baseCoins = 100;
    const baseXP = 50;
    
    // Win bonuses
    const winCoinsBonus = 50;
    const winXPBonus = 25;
    
    // Goal bonuses
    const goalCoinsBonus = 10;
    const goalXPBonus = 5;
    
    // Calculate rewards
    let homeCoins = baseCoins;
    let homeXP = baseXP;
    let awayCoins = baseCoins;
    let awayXP = baseXP;
    
    // Add win bonuses
    if (this.score.home > this.score.away) {
      homeCoins += winCoinsBonus;
      homeXP += winXPBonus;
    } else if (this.score.home < this.score.away) {
      awayCoins += winCoinsBonus;
      awayXP += winXPBonus;
    }
    
    // Add goal bonuses
    homeCoins += this.score.home * goalCoinsBonus;
    homeXP += this.score.home * goalXPBonus;
    awayCoins += this.score.away * goalCoinsBonus;
    awayXP += this.score.away * goalXPBonus;
    
    // Apply subscription multipliers if they have active subscriptions
    if (homeUser.subscription && homeUser.subscription.active) {
      const multiplier = getSubscriptionMultiplier(homeUser.subscription.plan);
      homeCoins = Math.round(homeCoins * multiplier);
      homeXP = Math.round(homeXP * multiplier);
    }
    
    if (awayUser.subscription && awayUser.subscription.active) {
      const multiplier = getSubscriptionMultiplier(awayUser.subscription.plan);
      awayCoins = Math.round(awayCoins * multiplier);
      awayXP = Math.round(awayXP * multiplier);
    }
    
    // Award coins and XP
    homeUser.coins += homeCoins;
    homeUser.experience += homeXP;
    awayUser.coins += awayCoins;
    awayUser.experience += awayXP;
    
    // Update levels if needed
    homeUser.updateLevel();
    awayUser.updateLevel();
    
    // Save changes
    await homeUser.save();
    await awayUser.save();
    
    return {
      home: { coins: homeCoins, xp: homeXP },
      away: { coins: awayCoins, xp: awayXP }
    };
  } catch (error) {
    console.error('Error awarding rewards:', error);
    throw error;
  }
};

// Helper function to get XP and coin multiplier based on subscription plan
function getSubscriptionMultiplier(plan) {
  switch (plan) {
    case 'bronze':
      return 1.1; // 10% bonus
    case 'silver':
      return 1.25; // 25% bonus
    case 'gold':
      return 1.5; // 50% bonus
    default:
      return 1; // No bonus
  }
}

module.exports = mongoose.model('Match', MatchSchema);

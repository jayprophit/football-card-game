const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  experience: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  elo: {
    type: Number,
    default: 1000
  },
  coins: {
    type: Number,
    default: 500
  },
  gems: {
    type: Number,
    default: 50
  },
  collection: {
    type: [{
      playerId: {
        type: String,
        required: true
      },
      acquired: {
        type: Date,
        default: Date.now
      },
      favorite: {
        type: Boolean,
        default: false
      }
    }],
    default: []
  },
  teams: {
    type: [{
      name: String,
      formation: String,
      players: [String] // Array of player IDs
    }],
    default: []
  },
  statistics: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    goalsScored: { type: Number, default: 0 },
    goalsConceded: { type: Number, default: 0 }
  },
  subscription: {
    type: {
      plan: String,
      startDate: Date,
      endDate: Date,
      active: Boolean
    },
    default: null
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT token
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, username: this.username, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate rank based on ELO
UserSchema.methods.getRank = function() {
  const elo = this.elo;
  
  if (elo < 800) return 'Bronze IV';
  if (elo < 900) return 'Bronze III';
  if (elo < 1000) return 'Bronze II';
  if (elo < 1100) return 'Bronze I';
  if (elo < 1200) return 'Silver IV';
  if (elo < 1300) return 'Silver III';
  if (elo < 1400) return 'Silver II';
  if (elo < 1500) return 'Silver I';
  if (elo < 1600) return 'Gold IV';
  if (elo < 1700) return 'Gold III';
  if (elo < 1800) return 'Gold II';
  if (elo < 1900) return 'Gold I';
  if (elo < 2000) return 'Platinum IV';
  if (elo < 2100) return 'Platinum III';
  if (elo < 2200) return 'Platinum II';
  if (elo < 2300) return 'Platinum I';
  if (elo < 2400) return 'Diamond IV';
  if (elo < 2500) return 'Diamond III';
  if (elo < 2600) return 'Diamond II';
  if (elo < 2700) return 'Diamond I';
  return 'Champion';
};

// Calculate XP needed for next level
UserSchema.methods.getNextLevelXP = function() {
  // Formula: 100 * (level ^ 1.5)
  return Math.round(100 * Math.pow(this.level, 1.5));
};

// Update level based on experience
UserSchema.methods.updateLevel = function() {
  let level = 1;
  let tempExp = this.experience;
  
  while (tempExp >= this.getNextLevelXP()) {
    tempExp -= this.getNextLevelXP();
    level++;
  }
  
  this.level = level;
};

module.exports = mongoose.model('User', UserSchema);

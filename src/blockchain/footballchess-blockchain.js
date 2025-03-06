// FootballChess Blockchain Integration and User Management System
// Handles KYC, rewards, and age-appropriate access to blockchain features

import Web3 from 'web3';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Configuration
const config = {
  minimumKycAge: 18,
  rewardRates: {
    winGame: 10,
    scoredGoal: 2,
    cleanSheet: 5,
    tournamentWin: 50
  },
  underage: {
    stakingYield: 0.08, // 8% annual yield for underage rewards
    compoundingFrequency: 'daily'
  },
  contracts: {
    rewardsToken: '0x...',  // Would be actual contract address in production
    nftCollection: '0x...'   // Would be actual contract address in production
  }
};

/**
 * User Account System
 */
class UserAccount {
  constructor() {
    this.users = new Map();  // In production, this would be a database
  }
  
  // Register a new user
  async registerUser(username, email, password, dateOfBirth) {
    // Check if username already exists
    if (this.users.has(username)) {
      throw new Error('Username already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Calculate age
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    // Create user object
    const user = {
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      age,
      isKycVerified: false,
      kycDocuments: [],
      createdAt: new Date(),
      walletAddress: null,
      rewards: {
        available: 0,
        locked: 0,
        history: []
      },
      gameStats: {
        gamesPlayed: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsScored: 0,
        goalsConceded: 0
      },
      nfts: []
    };
    
    // Store user
    this.users.set(username, user);
    
    return {
      username,
      email,
      age,
      isUnderage: age < config.minimumKycAge,
      createdAt: user.createdAt
    };
  }
  
  // Authenticate user
  async loginUser(username, password) {
    const user = this.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        username: user.username, 
        email: user.email,
        isUnderage: user.age < config.minimumKycAge,
        isKycVerified: user.isKycVerified
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return { token, user: this.getSafeUserData(user) };
  }
  
  // Get user data without sensitive information
  getSafeUserData(user) {
    return {
      username: user.username,
      email: user.email,
      age: user.age,
      isUnderage: user.age < config.minimumKycAge,
      isKycVerified: user.isKycVerified,
      createdAt: user.createdAt,
      walletAddress: user.walletAddress,
      rewards: {
        available: user.rewards.available,
        locked: user.rewards.locked
      },
      gameStats: user.gameStats,
      nftCount: user.nfts.length
    };
  }
  
  // Update user KYC status
  async verifyKyc(username, documents) {
    const user = this.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real implementation, this would call an external KYC service
    // For this example, we'll just simulate verification
    
    // Store KYC documents
    user.kycDocuments = documents;
    
    // Check age from date of birth
    if (user.age >= config.minimumKycAge) {
      user.isKycVerified = true;
      
      // If user has locked rewards, unlock them
      if (user.rewards.locked > 0) {
        this.unlockUnderage(username);
      }
      
      return { verified: true, message: 'KYC verification successful' };
    } else {
      return { 
        verified: false, 
        message: 'User is underage. Rewards will be locked until age requirement is met.',
        unlocksAt: this.calculateUnlockDate(user.dateOfBirth)
      };
    }
  }
  
  // Calculate when underage user's rewards will unlock
  calculateUnlockDate(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const unlockDate = new Date(birthDate);
    unlockDate.setFullYear(birthDate.getFullYear() + config.minimumKycAge);
    return unlockDate;
  }
  
  // Connect wallet address to user account
  async connectWallet(username, walletAddress) {
    const user = this.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if KYC is required
    if (user.age >= config.minimumKycAge && !user.isKycVerified) {
      throw new Error('KYC verification required before connecting wallet');
    }
    
    // Store wallet address
    user.walletAddress = walletAddress;
    
    return { connected: true, walletAddress };
  }
}

/**
 * Rewards System
 */
class RewardsSystem {
  constructor(userAccount) {
    this.userAccount = userAccount;
    this.rewardsContract = null; // Would be initialized with actual contract in production
  }
  
  // Initialize blockchain connection
  async initialize() {
    // In production, this would connect to actual blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Initialize contracts
    this.rewardsContract = new ethers.Contract(
      config.contracts.rewardsToken,
      RewardsTokenABI, // This would be imported from a file
      wallet
    );
  }
  
  // Award rewards to user
  async awardRewards(username, amount, reason) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Record reward in history
    const rewardRecord = {
      amount,
      reason,
      timestamp: new Date(),
      status: 'awarded'
    };
    
    user.rewards.history.push(rewardRecord);
    
    // Handle rewards based on age and KYC status
    if (user.age < config.minimumKycAge) {
      // For underage users, lock rewards
      user.rewards.locked += amount;
      rewardRecord.status = 'locked';
      
      // Apply auto-staking for growth
      this.autoStakeUnderageRewards(username);
      
      return {
        locked: true,
        amount,
        totalLocked: user.rewards.locked,
        unlocksAt: this.userAccount.calculateUnlockDate(user.dateOfBirth)
      };
    } else if (!user.isKycVerified) {
      // For adult users without KYC, also lock rewards but prompt for KYC
      user.rewards.locked += amount;
      rewardRecord.status = 'locked-pending-kyc';
      
      return {
        locked: true,
        amount,
        totalLocked: user.rewards.locked,
        message: 'Complete KYC to unlock rewards'
      };
    } else {
      // For KYC verified users, make rewards available immediately
      user.rewards.available += amount;
      rewardRecord.status = 'available';
      
      // If user has connected wallet, transfer rewards to blockchain
      if (user.walletAddress) {
        await this.transferRewardsToBlockchain(username, amount);
      }
      
      return {
        locked: false,
        amount,
        totalAvailable: user.rewards.available
      };
    }
  }
  
  // Auto-stake underage user rewards for growth
  autoStakeUnderageRewards(username) {
    const user = this.userAccount.users.get(username);
    
    if (!user || user.age >= config.minimumKycAge) {
      return;
    }
    
    // Set up a simulated staking program for underage rewards
    // In a real implementation, this would be a scheduled task
    
    // Calculate time until user reaches minimum age
    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    const unlockDate = new Date(birthDate);
    unlockDate.setFullYear(birthDate.getFullYear() + config.minimumKycAge);
    
    const yearsUntilUnlock = (unlockDate - today) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Calculate compound interest (simplified)
    const principal = user.rewards.locked;
    const rate = config.underage.stakingYield;
    const compoundedAmount = principal * Math.pow((1 + rate), yearsUntilUnlock);
    
    // Store projected value
    user.rewards.projectedValue = compoundedAmount;
    
    return {
      currentLocked: principal,
      projectedValue: compoundedAmount,
      unlockDate,
      yield: rate * 100 + '%'
    };
  }
  
  // Unlock rewards when user meets age requirement
  async unlockUnderage(username) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user meets age requirement
    if (user.age < config.minimumKycAge || !user.isKycVerified) {
      throw new Error('User does not meet requirements to unlock rewards');
    }
    
    // Get projected value (with growth)
    const projectedValue = user.rewards.projectedValue || user.rewards.locked;
    
    // Move locked rewards to available
    user.rewards.available += projectedValue;
    const unlockedAmount = projectedValue;
    user.rewards.locked = 0;
    user.rewards.projectedValue = 0;
    
    // Record in history
    user.rewards.history.push({
      amount: unlockedAmount,
      reason: 'Age restriction lifted',
      timestamp: new Date(),
      status: 'unlocked'
    });
    
    // If user has connected wallet, transfer rewards to blockchain
    if (user.walletAddress) {
      await this.transferRewardsToBlockchain(username, unlockedAmount);
    }
    
    return {
      unlocked: true,
      amount: unlockedAmount,
      totalAvailable: user.rewards.available
    };
  }
  
  // Transfer rewards to blockchain wallet
  async transferRewardsToBlockchain(username, amount) {
    const user = this.userAccount.users.get(username);
    
    if (!user || !user.walletAddress) {
      throw new Error('User not found or wallet not connected');
    }
    
    // In production, this would interact with actual blockchain
    try {
      // Simulate blockchain transaction
      const txHash = 'SIMULATED_TX_' + Math.random().toString(36).substring(2, 15);
      
      // Record transaction
      user.rewards.history.push({
        amount,
        reason: 'Transfer to blockchain wallet',
        timestamp: new Date(),
        status: 'transferred',
        txHash
      });
      
      return {
        success: true,
        txHash,
        amount
      };
    } catch (error) {
      console.error('Blockchain transfer error:', error);
      throw new Error('Failed to transfer rewards to blockchain');
    }
  }
  
  // Get reward balance
  getRewardBalance(username) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      available: user.rewards.available,
      locked: user.rewards.locked,
      projectedValue: user.rewards.projectedValue || user.rewards.locked,
      isUnderage: user.age < config.minimumKycAge,
      isKycVerified: user.isKycVerified,
      unlocksAt: user.age < config.minimumKycAge ? 
        this.userAccount.calculateUnlockDate(user.dateOfBirth) : null
    };
  }
}

/**
 * NFT System
 */
class NFTSystem {
  constructor(userAccount, rewardsSystem) {
    this.userAccount = userAccount;
    this.rewardsSystem = rewardsSystem;
    this.nftContract = null; // Would be initialized with actual contract in production
  }
  
  // Initialize blockchain connection
  async initialize() {
    // In production, this would connect to actual blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Initialize contracts
    this.nftContract = new ethers.Contract(
      config.contracts.nftCollection,
      NFTCollectionABI, // This would be imported from a file
      wallet
    );
  }
  
  // Mint NFT for player card
  async mintPlayerCard(username, playerData) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // NFT metadata
    const metadata = {
      name: `${playerData.position} #${playerData.number}`,
      description: `FootballChess Player Card - ${playerData.position}`,
      image: playerData.image || `https://footballchess.com/generated/player_${playerData.position}_${playerData.number}.png`,
      attributes: [
        { trait_type: 'Position', value: playerData.position },
        { trait_type: 'Rating', value: playerData.rating },
        { trait_type: 'Number', value: playerData.number },
        { trait_type: 'Movement Type', value: playerData.movementType }
      ]
    };
    
    // Handle based on age and KYC status
    if (user.age < config.minimumKycAge) {
      // For underage users, store NFT data but don't mint on blockchain yet
      const nftData = {
        id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        metadata,
        createdAt: new Date(),
        status: 'pending-age',
        unlocksAt: this.userAccount.calculateUnlockDate(user.dateOfBirth)
      };
      
      user.nfts.push(nftData);
      
      return {
        minted: false,
        status: 'pending-age',
        message: 'NFT will be minted when age requirement is met',
        nftData
      };
    } else if (!user.isKycVerified) {
      // For adult users without KYC, store NFT data but don't mint yet
      const nftData = {
        id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        metadata,
        createdAt: new Date(),
        status: 'pending-kyc'
      };
      
      user.nfts.push(nftData);
      
      return {
        minted: false,
        status: 'pending-kyc',
        message: 'Complete KYC to mint NFT on blockchain',
        nftData
      };
    } else if (!user.walletAddress) {
      // User is verified but hasn't connected wallet
      const nftData = {
        id: `pending-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        metadata,
        createdAt: new Date(),
        status: 'pending-wallet'
      };
      
      user.nfts.push(nftData);
      
      return {
        minted: false,
        status: 'pending-wallet',
        message: 'Connect wallet to mint NFT on blockchain',
        nftData
      };
    } else {
      // User is verified and has wallet - mint NFT on blockchain
      try {
        // In production, this would actually mint on blockchain
        const tokenId = Date.now(); // Simulated token ID
        const txHash = 'SIMULATED_NFT_TX_' + Math.random().toString(36).substring(2, 15);
        
        const nftData = {
          tokenId,
          metadata,
          txHash,
          createdAt: new Date(),
          status: 'minted'
        };
        
        user.nfts.push(nftData);
        
        return {
          minted: true,
          tokenId,
          txHash,
          metadata
        };
      } catch (error) {
        console.error('NFT minting error:', error);
        throw new Error('Failed to mint NFT on blockchain');
      }
    }
  }
  
  // Process pending NFTs when user meets requirements
  async processPendingNFTs(username) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user meets requirements
    if (user.age < config.minimumKycAge || !user.isKycVerified || !user.walletAddress) {
      throw new Error('User does not meet requirements to mint NFTs');
    }
    
    const pendingNFTs = user.nfts.filter(nft => 
      nft.status === 'pending-age' || 
      nft.status === 'pending-kyc' || 
      nft.status === 'pending-wallet'
    );
    
    const results = [];
    
    // Process each pending NFT
    for (const nft of pendingNFTs) {
      try {
        // In production, this would actually mint on blockchain
        const tokenId = Date.now() + results.length; // Simulated token ID
        const txHash = 'SIMULATED_NFT_TX_' + Math.random().toString(36).substring(2, 15);
        
        // Update NFT status
        nft.status = 'minted';
        nft.tokenId = tokenId;
        nft.txHash = txHash;
        nft.mintedAt = new Date();
        
        results.push({
          minted: true,
          original_id: nft.id,
          tokenId,
          txHash,
          metadata: nft.metadata
        });
      } catch (error) {
        console.error('NFT minting error:', error);
        results.push({
          minted: false,
          original_id: nft.id,
          error: error.message
        });
      }
    }
    
    return {
      processed: results.length,
      successful: results.filter(r => r.minted).length,
      failed: results.filter(r => !r.minted).length,
      details: results
    };
  }
  
  // Get user's NFTs
  getUserNFTs(username) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      total: user.nfts.length,
      minted: user.nfts.filter(nft => nft.status === 'minted').length,
      pending: user.nfts.filter(nft => nft.status !== 'minted').length,
      nfts: user.nfts
    };
  }
}

/**
 * Age Verification System
 */
class AgeVerificationSystem {
  constructor(userAccount) {
    this.userAccount = userAccount;
  }
  
  // Verify user's age
  verifyAge(username, documentType, documentData) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real implementation, this would call an age verification service
    // For this example, we'll simulate verification
    
    // Record verification attempt
    user.ageVerificationAttempts = user.ageVerificationAttempts || [];
    user.ageVerificationAttempts.push({
      documentType,
      timestamp: new Date(),
      success: true // Simulated success
    });
    
    return {
      verified: true,
      age: user.age,
      isUnderage: user.age < config.minimumKycAge
    };
  }
  
  // Check if user needs age verification for feature
  checkFeatureAccess(username, feature) {
    const user = this.userAccount.users.get(username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Define feature requirements
    const featureRequirements = {
      'gameplay': { // Basic gameplay
        requiresAge: false,
        minimumAge: 0
      },
      'chat': { // In-game chat
        requiresAge: true,
        minimumAge: 13
      },
      'rewards': { // Earning rewards
        requiresAge: false,
        minimumAge: 0
      },
      'blockchain': { // Blockchain features
        requiresAge: true,
        minimumAge: config.minimumKycAge,
        requiresKyc: true
      },
      'marketplace': { // Marketplace
        requiresAge: true,
        minimumAge: config.minimumKycAge,
        requiresKyc: true
      }
    };
    
    const requirements = featureRequirements[feature] || { requiresAge: true, minimumAge: 18, requiresKyc: true };
    
    // Check if user meets requirements
    const meetsAgeRequirement = !requirements.requiresAge || user.age >= requirements.minimumAge;
    const meetsKycRequirement = !requirements.requiresKyc || user.isKycVerified;
    
    return {
      hasAccess: meetsAgeRequirement && meetsKycRequirement,
      meetsAgeRequirement,
      meetsKycRequirement,
      minimumAge: requirements.requiresAge ? requirements.minimumAge : null,
      requiresKyc: requirements.requiresKyc
    };
  }
}

// Export the classes
export {
  UserAccount,
  RewardsSystem,
  NFTSystem,
  AgeVerificationSystem
};

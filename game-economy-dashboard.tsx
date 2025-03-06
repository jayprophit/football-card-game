import React, { useState, useEffect } from 'react';

// Token and Asset Configurations
const TOKEN_TYPES = {
  UTILITY: {
    name: 'Utility Token',
    symbol: 'PLAY',
    description: 'Used for in-game transactions and upgrades',
    icon: '🎮'
  },
  GOVERNANCE: {
    name: 'Governance Token',
    symbol: 'GOV',
    description: 'Voting rights and ecosystem decisions',
    icon: '🗳️'
  },
  REWARD: {
    name: 'Reward Token',
    symbol: 'RWD',
    description: 'Performance and achievement rewards',
    icon: '🏆'
  }
};

// NFT Rarity Levels
const NFT_RARITIES = {
  COMMON: {
    name: 'Common',
    color: 'text-gray-500',
    multiplier: 1
  },
  RARE: {
    name: 'Rare',
    color: 'text-green-500',
    multiplier: 2
  },
  EPIC: {
    name: 'Epic',
    color: 'text-blue-500',
    multiplier: 5
  },
  LEGENDARY: {
    name: 'Legendary',
    color: 'text-yellow-500',
    multiplier: 10
  }
};

// Simulate Economic Activities
const generateEconomicSimulation = () => {
  return {
    totalValueLocked: Math.floor(Math.random() * 1000000),
    marketCap: Math.floor(Math.random() * 50000000),
    dailyVolume: Math.floor(Math.random() * 5000000),
    stakingAPY: (Math.random() * 50).toFixed(2)
  };
};

// Generate NFT Collection
const generateNFTCollection = () => {
  return Array(10).fill(null).map(() => ({
    id: `NFT-${Math.random().toString(36).substr(2, 9)}`,
    name: `Player Card ${Math.floor(Math.random() * 1000)}`,
    rarity: Object.keys(NFT_RARITIES)[
      Math.floor(Math.random() * Object.keys(NFT_RARITIES).length)
    ],
    value: Math.floor(Math.random() * 10000)
  }));
};

const GameEconomyDashboard = () => {
  // State Management
  const [tokenBalances, setTokenBalances] = useState({
    PLAY: Math.floor(Math.random() * 10000),
    GOV: Math.floor(Math.random() * 5000),
    RWD: Math.floor(Math.random() * 7500)
  });

  const [economicData, setEconomicData] = useState(null);
  const [nftCollection, setNFTCollection] = useState([]);
  const [stakingPools, setStakingPools] = useState([
    {
      name: 'Utility Token Pool',
      apy: (Math.random() * 30).toFixed(2),
      totalStaked: Math.floor(Math.random() * 500000)
    },
    {
      name: 'Governance Token Pool',
      apy: (Math.random() * 25).toFixed(2),
      totalStaked: Math.floor(Math.random() * 250000)
    }
  ]);

  // Initialize Economic Simulation
  useEffect(() => {
    // Initial economic data generation
    setEconomicData(generateEconomicSimulation());
    setNFTCollection(generateNFTCollection());

    // Set up periodic economic updates
    const economicInterval = setInterval(() => {
      setEconomicData(generateEconomicSimulation());
    }, 30000);

    return () => clearInterval(economicInterval);
  }, []);

  // Simulate Token Transfer
  const transferTokens = (fromToken, toToken, amount) => {
    if (tokenBalances[fromToken] >= amount) {
      const newBalances = {...tokenBalances};
      newBalances[fromToken] -= amount;
      newBalances[toToken] += amount;
      setTokenBalances(newBalances);
    } else {
      alert('Insufficient balance for transfer');
    }
  };

  // Simulate Staking Action
  const stakeTokens = (poolName, amount) => {
    const poolIndex = stakingPools.findIndex(pool => pool.name === poolName);
    if (poolIndex !== -1) {
      const newStakingPools = [...stakingPools];
      newStakingPools[poolIndex].totalStaked += amount;
      setStakingPools(newStakingPools);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Game Economy Dashboard
      </h1>

      {/* Token Balances */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {Object.entries(TOKEN_TYPES).map(([key, token]) => (
          <div 
            key={key} 
            className="bg-gray-100 p-4 rounded"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{token.icon}</span>
              <h2 className="font-bold">{token.name}</h2>
            </div>
            <p className="text-sm mb-2">{token.description}</p>
            <div className="flex justify-between items-center">
              <p className="font-semibold">
                Balance: {tokenBalances[key]} {token.symbol}
              </p>
              <div className="flex space-x-1">
                {Object.keys(TOKEN_TYPES)
                  .filter(t => t !== key)
                  .map(targetToken => (
                    <button
                      key={targetToken}
                      onClick={() => transferTokens(key, targetToken, 100)}
                      className="bg-blue-500 text-white p-1 rounded text-xs"
                    >
                      Transfer to {TOKEN_TYPES[targetToken].symbol}
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Economic Overview */}
      {economicData && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold text-xl mb-2">Economic Metrics</h2>
          <div className="grid md:grid-cols-4 gap-2">
            <div>
              <p className="font-semibold">Total Value Locked</p>
              <p>${economicData.totalValueLocked.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Market Cap</p>
              <p>${economicData.marketCap.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Daily Volume</p>
              <p>${economicData.dailyVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Staking APY</p>
              <p>{economicData.stakingAPY}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Staking Pools */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Staking Pools</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {stakingPools.map((pool) => (
            <div 
              key={pool.name} 
              className="bg-gray-100 p-4 rounded"
            >
              <h3 className="font-bold mb-2">{pool.name}</h3>
              <p>APY: {pool.apy}%</p>
              <p>Total Staked: ${pool.totalStaked.toLocaleString()}</p>
              <button
                onClick={() => stakeTokens(pool.name, 1000)}
                className="mt-2 bg-green-500 text-white p-2 rounded"
              >
                Stake 1000 Tokens
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* NFT Collection */}
      <div>
        <h2 className="font-bold text-xl mb-2">NFT Collection</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {nftCollection.map((nft) => {
            const rarity = NFT_RARITIES[nft.rarity];
            return (
              <div 
                key={nft.id} 
                className={`
                  border rounded p-4 
                  ${rarity.color} 
                  bg-white shadow-lg
                `}
              >
                <h3 className="font-bold">{nft.name}</h3>
                <p>Rarity: {rarity.name}</p>
                <p>Value: ${nft.value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GameEconomyDashboard;

import React, { useState, useEffect } from 'react';

// Simulated Card Rarity Types
const CARD_RARITIES = {
  COMMON: {
    name: 'Common',
    color: 'text-gray-500',
    mintProbability: 0.6,
    baseValue: 10
  },
  RARE: {
    name: 'Rare',
    color: 'text-green-500',
    mintProbability: 0.3,
    baseValue: 50
  },
  EPIC: {
    name: 'Epic',
    color: 'text-blue-500',
    mintProbability: 0.08,
    baseValue: 200
  },
  LEGENDARY: {
    name: 'Legendary',
    color: 'text-yellow-500',
    mintProbability: 0.02,
    baseValue: 1000
  }
};

// Simulated Proof Mechanism Types
const PROOF_MECHANISMS = [
  'Proof of Contribution',
  'Proof of Reputation',
  'Proof of Identity',
  'Proof of Transaction History'
];

const NFTCardMarketplace = () => {
  const [playerCards, setPlayerCards] = useState([]);
  const [selectedProofMechanism, setSelectedProofMechanism] = useState(null);
  const [wallet, setWallet] = useState({
    balance: 1000,
    nftTokens: 0
  });

  // Generate Initial Player Cards
  const generatePlayerCards = () => {
    const newCards = [];
    for (let i = 0; i < 10; i++) {
      newCards.push(generateNFTCard());
    }
    setPlayerCards(newCards);
  };

  // Generate Individual NFT Card
  const generateNFTCard = () => {
    // Determine card rarity based on probability
    const rarityRoll = Math.random();
    let selectedRarity = CARD_RARITIES.COMMON;

    if (rarityRoll > 0.9) selectedRarity = CARD_RARITIES.LEGENDARY;
    else if (rarityRoll > 0.7) selectedRarity = CARD_RARITIES.EPIC;
    else if (rarityRoll > 0.4) selectedRarity = CARD_RARITIES.RARE;

    return {
      id: `NFT-${Math.random().toString(36).substr(2, 9)}`,
      name: `Player ${Math.floor(Math.random() * 1000)}`,
      rarity: selectedRarity,
      value: calculateCardValue(selectedRarity),
      specialAbilities: generateSpecialAbilities()
    };
  };

  // Calculate Card Value
  const calculateCardValue = (rarity) => {
    const baseValue = rarity.baseValue;
    const variability = Math.random() * 0.2; // 20% variation
    return Math.round(baseValue * (1 + variability));
  };

  // Generate Special Abilities
  const generateSpecialAbilities = () => {
    const possibleAbilities = [
      'Speed Boost', 'Tactical Vision', 'Power Shot',
      'Defensive Wall', 'Precision Pass'
    ];
    const abilityCount = Math.floor(Math.random() * 3) + 1;
    return possibleAbilities
      .sort(() => 0.5 - Math.random())
      .slice(0, abilityCount);
  };

  // Mint New NFT Card
  const mintNFTCard = () => {
    const newCard = generateNFTCard();
    
    // Check wallet balance
    if (wallet.balance >= newCard.value) {
      setPlayerCards([...playerCards, newCard]);
      setWallet(prev => ({
        balance: prev.balance - newCard.value,
        nftTokens: prev.nftTokens + 1
      }));
    } else {
      alert('Insufficient balance to mint new card!');
    }
  };

  // Apply Proof Mechanism
  const applyProofMechanism = (mechanism) => {
    setSelectedProofMechanism(mechanism);
    
    // Simulate proof mechanism benefits
    const benefitMultiplier = mechanism === 'Proof of Reputation' ? 1.5 :
                               mechanism === 'Proof of Contribution' ? 1.3 :
                               1;
    
    const upgradedCards = playerCards.map(card => ({
      ...card,
      value: Math.round(card.value * benefitMultiplier)
    }));

    setPlayerCards(upgradedCards);
  };

  // Initialize on component mount
  useEffect(() => {
    generatePlayerCards();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Football Card NFT Marketplace
      </h1>

      {/* Wallet Information */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold">Wallet Details</h2>
        <p>Balance: ${wallet.balance}</p>
        <p>NFT Tokens: {wallet.nftTokens}</p>
      </div>

      {/* Proof Mechanism Selection */}
      <div className="mb-4">
        <h2 className="font-bold mb-2">Select Proof Mechanism</h2>
        <div className="flex space-x-2">
          {PROOF_MECHANISMS.map((mechanism) => (
            <button
              key={mechanism}
              onClick={() => applyProofMechanism(mechanism)}
              className={`
                p-2 rounded 
                ${selectedProofMechanism === mechanism 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'}
              `}
            >
              {mechanism}
            </button>
          ))}
        </div>
      </div>

      {/* Mint New Card Button */}
      <button
        onClick={mintNFTCard}
        className="bg-green-500 text-white p-2 rounded mb-4"
      >
        Mint New NFT Card
      </button>

      {/* NFT Card Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {playerCards.map((card) => (
          <div 
            key={card.id} 
            className={`
              border rounded p-4 
              ${card.rarity.color} 
              bg-white shadow-lg
            `}
          >
            <h3 className="font-bold">{card.name}</h3>
            <p>Rarity: {card.rarity.name}</p>
            <p>Value: ${card.value}</p>
            <div>
              <h4 className="font-semibold mt-2">Special Abilities:</h4>
              <ul className="list-disc pl-5">
                {card.specialAbilities.map((ability) => (
                  <li key={ability}>{ability}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTCardMarketplace;

import React, { useState } from 'react';

const StoreInterface = () => {
  const [activeTab, setActiveTab] = useState('premium');
  const [currency, setCurrency] = useState({
    coins: 2450,
    gems: 185
  });
  
  // Store tabs
  const tabs = [
    { id: 'premium', label: 'PREMIUM' },
    { id: 'packs', label: 'CARD PACKS' },
    { id: 'cosmetics', label: 'COSMETICS' },
    { id: 'boosters', label: 'BOOSTERS' },
    { id: 'stadiums', label: 'STADIUMS' }
  ];
  
  // Store items by category
  const storeItems = {
    premium: [
      {
        id: 'season_pass',
        name: 'Season Pass',
        description: 'Unlock premium content with the Season Pass!',
        features: [
          'Exclusive card designs', 
          'Bonus daily rewards', 
          'Premium tournaments'
        ],
        price: { amount: 9.99, type: 'real' },
        image: '/api/placeholder/180/90'
      },
      {
        id: 'bronze_tier',
        name: 'Bronze Subscription',
        tier: 'bronze',
        description: 'Basic tier with essential benefits',
        features: [
          'Ad-Free Experience',
          'Daily Bonus: 50 Coins',
          'Bonus XP: +10%'
        ],
        price: { amount: 2.99, type: 'real', period: 'month' },
        image: '/api/placeholder/60/60'
      },
      {
        id: 'silver_tier',
        name: 'Silver Subscription',
        tier: 'silver',
        description: 'Mid-tier with enhanced benefits',
        features: [
          'Ad-Free Experience',
          'Daily Bonus: 150 Coins',
          'Bonus XP: +25%',
          'Premium Tournaments'
        ],
        price: { amount: 5.99, type: 'real', period: 'month' },
        image: '/api/placeholder/60/60'
      },
      {
        id: 'gold_tier',
        name: 'Gold Subscription',
        tier: 'gold',
        description: 'Our best value subscription',
        features: [
          'Ad-Free Experience',
          'Daily Bonus: 300 Coins',
          'Bonus XP: +50%',
          'Premium Tournaments',
          'Exclusive Cards'
        ],
        popular: true,
        price: { amount: 9.99, type: 'real', period: 'month' },
        image: '/api/placeholder/60/60'
      }
    ],
    packs: [
      {
        id: 'bronze_pack',
        name: 'Bronze Pack',
        description: '3 Players, 1 Rare',
        price: { amount: 500, type: 'coins' },
        image: '/api/placeholder/120/140'
      },
      {
        id: 'silver_pack',
        name: 'Silver Pack',
        description: '6 Players, 3 Rares',
        price: { amount: 1000, type: 'coins' },
        image: '/api/placeholder/120/140'
      },
      {
        id: 'gold_pack',
        name: 'Gold Pack',
        description: '12 Players, 6 Rares, 1 Guaranteed 82+',
        price: { amount: 2000, type: 'coins' },
        image: '/api/placeholder/120/140'
      },
      {
        id: 'premium_pack',
        name: 'Premium Pack',
        description: '12 Players, All Rare',
        price: { amount: 50, type: 'gems' },
        image: '/api/placeholder/120/140'
      },
      {
        id: 'mega_pack',
        name: 'Mega Pack',
        description: '30 Players, 18 Rares, 3 Guaranteed 85+',
        price: { amount: 150, type: 'gems' },
        image: '/api/placeholder/120/140'
      }
    ],
    cosmetics: [
      {
        id: 'classic_kit',
        name: 'Classic Kit',
        description: 'Retro team design',
        price: { amount: 300, type: 'coins' },
        image: '/api/placeholder/120/80'
      },
      {
        id: 'gold_card_frame',
        name: 'Gold Card Frame',
        description: 'Premium card design with gold accents',
        price: { amount: 30, type: 'gems' },
        image: '/api/placeholder/100/140'
      },
      {
        id: 'animated_badge',
        name: 'Animated Team Badge',
        description: 'Special animated badge for your team',
        price: { amount: 75, type: 'gems' },
        image: '/api/placeholder/80/80'
      }
    ],
    boosters: [
      {
        id: 'xp_booster',
        name: 'XP Booster',
        description: '+50% XP for 10 matches',
        price: { amount: 300, type: 'coins' },
        image: '/api/placeholder/80/80'
      },
      {
        id: 'coin_booster',
        name: 'Coin Booster',
        description: '+30% coins from matches for 1 week',
        price: { amount: 800, type: 'coins' },
        image: '/api/placeholder/80/80'
      },
      {
        id: 'training_boost',
        name: 'Training Boost',
        description: 'Improve player attributes faster for 3 days',
        price: { amount: 25, type: 'gems' },
        image: '/api/placeholder/80/80'
      }
    ],
    stadiums: [
      {
        id: 'basic_stadium',
        name: 'Basic Stadium',
        description: 'Standard stadium with good atmosphere',
        price: { amount: 1000, type: 'coins' },
        image: '/api/placeholder/160/90'
      },
      {
        id: 'premium_stadium',
        name: 'Premium Stadium',
        description: 'High-capacity stadium with enhanced graphics',
        price: { amount: 40, type: 'gems' },
        image: '/api/placeholder/160/90'
      },
      {
        id: 'legendary_stadium',
        name: 'Legendary Stadium',
        description: 'World-class venue with special crowd effects',
        price: { amount: 100, type: 'gems' },
        image: '/api/placeholder/160/90'
      }
    ]
  };
  
  // Handle purchase
  const handlePurchase = (item) => {
    if (item.price.type === 'real') {
      alert(`Processing payment of $${item.price.amount} for ${item.name}`);
      // In a real app, this would integrate with a payment processor
    } else if (item.price.type === 'coins') {
      if (currency.coins >= item.price.amount) {
        setCurrency({
          ...currency,
          coins: currency.coins - item.price.amount
        });
        alert(`Purchased ${item.name} for ${item.price.amount} coins!`);
      } else {
        alert('Not enough coins!');
      }
    } else if (item.price.type === 'gems') {
      if (currency.gems >= item.price.amount) {
        setCurrency({
          ...currency,
          gems: currency.gems - item.price.amount
        });
        alert(`Purchased ${item.name} for ${item.price.amount} gems!`);
      } else {
        alert('Not enough gems!');
      }
    }
  };
  
  // Format price display
  const formatPrice = (price) => {
    if (price.type === 'real') {
      return `$${price.amount}${price.period ? `/${price.period}` : ''}`;
    } else if (price.type === 'coins') {
      return `${price.amount} Coins`;
    } else if (price.type === 'gems') {
      return `${price.amount} Gems`;
    }
    return '';
  };
  
  // Render current tab content
  const renderTabContent = () => {
    const items = storeItems[activeTab] || [];
    
    if (activeTab === 'premium') {
      return (
        <div className="premium-content">
          <div className="season-pass">
            <div className="season-pass-info">
              <h3>{storeItems.premium[0].name}</h3>
              <p>{storeItems.premium[0].description}</p>
              <ul className="feature-list">
                {storeItems.premium[0].features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="season-pass-image">
              <img src={storeItems.premium[0].image} alt="Season Pass" />
            </div>
            <button 
              className="buy-button premium-button"
              onClick={() => handlePurchase(storeItems.premium[0])}
            >
              BUY {formatPrice(storeItems.premium[0].price)}
            </button>
          </div>
          
          <h3 className="section-title">Subscription Tiers</h3>
          <div className="subscription-tiers">
            {storeItems.premium.slice(1).map(tier => (
              <div key={tier.id} className={`tier-card ${tier.tier} ${tier.popular ? 'popular' : ''}`}>
                {tier.popular && <div className="popular-tag">MOST POPULAR</div>}
                <div className="tier-header">
                  <h4>{tier.name}</h4>
                </div>
                <div className="tier-icon">
                  <img src={tier.image} alt={tier.name} />
                </div>
                <ul className="tier-features">
                  {tier.features.map((feature, index) => (
                    <li key={index} className={index >= tier.features.length - 2 ? 'highlight' : ''}>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className="buy-button tier-button"
                  onClick={() => handlePurchase(tier)}
                >
                  {formatPrice(tier.price)}
                </button>
              </div>
            ))}
          </div>
          
          <div className="special-offer">
            <p>INTRODUCTORY OFFER: First month 50% off! Limited time only.</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="store-grid">
        {items.map(item => (
          <div key={item.id} className="store-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="item-info">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <div className="item-price">
                <div className={`price-badge ${item.price.type}`}>
                  {formatPrice(item.price)}
                </div>
              </div>
              <button 
                className="buy-button"
                onClick={() => handlePurchase(item)}
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="store-interface">
      <div className="store-header">
        <h2>FOOTBALL CHESS STORE</h2>
        <div className="currency-display">
          <div className="currency coins">
            <div className="currency-icon">
              <span>$</span>
            </div>
            <span className="currency-amount">{currency.coins.toLocaleString()}</span>
          </div>
          <div className="currency gems">
            <div className="currency-icon">
              <span>♦</span>
            </div>
            <span className="currency-amount">{currency.gems.toLocaleString()}</span>
          </div>
          <button className="add-currency">+</button>
        </div>
      </div>
      
      <div className="store-navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="store-content">
        {renderTabContent()}
      </div>
      
      <style jsx>{`
        .store-interface {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #f5f7fa;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .store-header {
          background: linear-gradient(to right, #0D47A1, #1A237E);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        h2 {
          margin: 0;
          font-size: 24px;
        }
        
        .currency-display {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .currency {
          display: flex;
          align-items: center;
          background-color: rgba(0,0,0,0.3);
          border-radius: 20px;
          padding: 5px 15px;
        }
        
        .currency-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
          font-weight: bold;
        }
        
        .coins .currency-icon {
          background-color: #FFC107;
          color: #000;
        }
        
        .gems .currency-icon {
          background-color: #00BCD4;
          color: #fff;
        }
        
        .currency-amount {
          font-weight: bold;
        }
        
        .add-currency {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: #4CAF50;
          color: white;
          border: none;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .store-navigation {
          display: flex;
          background-color: rgba(0,0,0,0.5);
          padding: 0 20px;
        }
        
        .nav-tab {
          padding: 15px 20px;
          background: none;
          border: none;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          position: relative;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .nav-tab:hover {
          opacity: 1;
        }
        
        .nav-tab.active {
          opacity: 1;
        }
        
        .nav-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background-color: #FFC107;
        }
        
        .store-content {
          padding: 30px;
        }
        
        .season-pass {
          background-color: white;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 30px;
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .season-pass-info {
          flex: 2;
          min-width: 300px;
        }
        
        .season-pass-image {
          flex: 1;
          min-width: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .season-pass-image img {
          max-width: 100%;
          border-radius: 8px;
        }
        
        .feature-list {
          list-style-type: none;
          padding-left: 0;
        }
        
        .feature-list li {
          padding: 5px 0;
          position: relative;
          padding-left: 25px;
        }
        
        .feature-list li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4CAF50;
          font-weight: bold;
        }
        
        .premium-button {
          position: absolute;
          bottom: 20px;
          right: 20px;
          background-color: #FFC107;
          color: #000;
          font-weight: bold;
        }
        
        .section-title {
          margin: 30px 0 20px;
          color: #333;
        }
        
        .subscription-tiers {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .tier-card {
          background-color: white;
          border-radius: 10px;
          padding: 20px;
          width: calc(33.333% - 20px);
          min-width: 250px;
          flex-grow: 1;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        
        .tier-card.bronze {
          border-top: 5px solid #D84315;
        }
        
        .tier-card.silver {
          border-top: 5px solid #9E9E9E;
        }
        
        .tier-card.gold {
          border-top: 5px solid #FFC107;
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .popular-tag {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #FFC107;
          color: #000;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .tier-header h4 {
          margin-top: 10px;
          text-align: center;
          font-size: 18px;
        }
        
        .tier-icon {
          display: flex;
          justify-content: center;
          margin: 20px 0;
        }
        
        .tier-features {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 30px;
          flex-grow: 1;
        }
        
        .tier-features li {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
          color: #666;
          position: relative;
          padding-left: 25px;
        }
        
        .tier-features li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #4CAF50;
        }
        
        .tier-features li.highlight {
          color: #000;
          font-weight: bold;
        }
        
        .tier-button {
          width: 100%;
        }
        
        .tier-card.bronze .tier-button {
          background-color: #D84315;
        }
        
        .tier-card.silver .tier-button {
          background-color: #9E9E9E;
        }
        
        .tier-card.gold .tier-button {
          background-color: #FFC107;
          color: #000;
        }
        
        .special-offer {
          background: linear-gradient(to right, #9C27B0, #7B1FA2);
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
        }
        
        .store-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .store-item {
          background-color: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        
        .store-item:hover {
          transform: translateY(-5px);
        }
        
        .item-image {
          height: 160px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
        }
        
        .item-image img {
          max-width: 100%;
          max-height: 100%;
        }
        
        .item-info {
          padding: 15px;
        }
        
        .item-info h3 {
          margin-top: 0;
          font-size: 18px;
        }
        
        .item-description {
          color: #666;
          font-size: 14px;
          min-height: 40px;
        }
        
        .item-price {
          margin: 15px 0;
        }
        
        .price-badge {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: bold;
          font-size: 14px;
        }
        
        .price-badge.real {
          background-color: #E0F7FA;
          color: #00838F;
        }
        
        .price-badge.coins {
          background-color: #FFF8E1;
          color: #FF8F00;
        }
        
        .price-badge.gems {
          background-color: #E1F5FE;
          color: #0277BD;
        }
        
        .buy-button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 5px;
          background-color: #4CAF50;
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .buy-button:hover {
          background-color: #388E3C;
        }
        
        @media (max-width: 768px) {
          .store-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .store-navigation {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          .tier-card {
            width: 100%;
          }
          
          .tier-card.gold {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default StoreInterface;

import React, { useState, useEffect } from 'react';

// Ecosystem Pillars
const ECOSYSTEM_PILLARS = [
  {
    id: 'GAME_MECHANICS',
    name: 'Game Mechanics',
    description: 'Strategic card-based gameplay with dynamic positioning',
    icon: '🎲',
    technologies: [
      'Positional Strategy',
      'Skill Progression',
      'Adaptive Difficulty'
    ]
  },
  {
    id: 'AI',
    name: 'Artificial Intelligence',
    description: 'Intelligent coaching and predictive performance modeling',
    icon: '🤖',
    technologies: [
      'Machine Learning',
      'Predictive Analytics',
      'Adaptive Matchmaking'
    ]
  },
  {
    id: 'BLOCKCHAIN',
    name: 'Blockchain Integration',
    description: 'Decentralized asset ownership and smart contract governance',
    icon: '⛓️',
    technologies: [
      'NFT Player Cards',
      'Smart Contracts',
      'Transparent Economics'
    ]
  },
  {
    id: 'ECONOMIC',
    name: 'Economic Ecosystem',
    description: 'Multi-token economy with skill-based value generation',
    icon: '💰',
    technologies: [
      'Utility Tokens',
      'Skill Monetization',
      'Decentralized Finance'
    ]
  },
  {
    id: 'SOCIAL',
    name: 'Social Interaction',
    description: 'Global multiplayer and community governance',
    icon: '🌐',
    technologies: [
      'Cross-Platform Multiplayer',
      'Community Collaboration',
      'Inclusive Communication'
    ]
  }
];

// Innovation Metrics Simulation
const generateInnovationMetrics = () => ({
  userEngagement: Math.floor(Math.random() * 100),
  technologicalInnovation: Math.floor(Math.random() * 100),
  economicActivity: Math.floor(Math.random() * 100),
  socialImpact: Math.floor(Math.random() * 100)
});

const EcosystemIntegrationDashboard = () => {
  // State Management
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [innovationMetrics, setInnovationMetrics] = useState(null);

  // Initialize Metrics
  useEffect(() => {
    // Generate initial metrics
    setInnovationMetrics(generateInnovationMetrics());

    // Simulate periodic metrics updates
    const metricsInterval = setInterval(() => {
      setInnovationMetrics(generateInnovationMetrics());
    }, 30000);

    return () => clearInterval(metricsInterval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Ecosystem Integration Dashboard
      </h1>

      {/* Innovation Metrics */}
      {innovationMetrics && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold text-xl mb-2">Innovation Metrics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">User Engagement</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${innovationMetrics.userEngagement}%`}}
                ></div>
              </div>
              <p className="text-center">{innovationMetrics.userEngagement}%</p>
            </div>
            <div>
              <p className="font-semibold">Technological Innovation</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{width: `${innovationMetrics.technologicalInnovation}%`}}
                ></div>
              </div>
              <p className="text-center">{innovationMetrics.technologicalInnovation}%</p>
            </div>
            <div>
              <p className="font-semibold">Economic Activity</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-yellow-600 h-2.5 rounded-full" 
                  style={{width: `${innovationMetrics.economicActivity}%`}}
                ></div>
              </div>
              <p className="text-center">{innovationMetrics.economicActivity}%</p>
            </div>
            <div>
              <p className="font-semibold">Social Impact</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{width: `${innovationMetrics.socialImpact}%`}}
                ></div>
              </div>
              <p className="text-center">{innovationMetrics.socialImpact}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Ecosystem Pillars */}
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ECOSYSTEM_PILLARS.map((pillar) => (
          <div 
            key={pillar.id}
            className={`
              border rounded p-4 
              ${selectedPillar === pillar.id 
                ? 'bg-blue-100 border-blue-500' 
                : 'bg-white'}
              hover:shadow-lg transition-all
              cursor-pointer
            `}
            onClick={() => setSelectedPillar(pillar.id)}
          >
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-2">{pillar.icon}</span>
              <h2 className="font-bold">{pillar.name}</h2>
            </div>
            <p className="text-sm mb-2">{pillar.description}</p>
            <div>
              <h3 className="font-semibold">Key Technologies:</h3>
              <ul className="list-disc pl-5 text-sm">
                {pillar.technologies.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Pillar View */}
      {selectedPillar && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-xl mb-2">
            {ECOSYSTEM_PILLARS.find(p => p.id === selectedPillar).name} Details
          </h2>
          <p>
            {ECOSYSTEM_PILLARS.find(p => p.id === selectedPillar).description}
          </p>
          <div className="mt-2">
            <h3 className="font-semibold">Detailed Technologies:</h3>
            <ul className="list-disc pl-5">
              {ECOSYSTEM_PILLARS.find(p => p.id === selectedPillar).technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcosystemIntegrationDashboard;

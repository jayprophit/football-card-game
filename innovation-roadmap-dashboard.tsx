import React, { useState, useEffect } from 'react';

// Innovation Phase Definitions
const INNOVATION_PHASES = [
  {
    id: 'FOUNDATION',
    name: 'Foundation Phase',
    duration: '0-12 Months',
    icon: '🏗️',
    objectives: [
      'Establish Core Gameplay',
      'Build Technical Infrastructure',
      'Initial Community Development',
      'Basic AI Integration'
    ],
    status: 'In Progress'
  },
  {
    id: 'ECOSYSTEM',
    name: 'Ecosystem Development',
    duration: '12-24 Months',
    icon: '🌐',
    objectives: [
      'Advanced AI Coaching',
      'Economic Complexity',
      'Social Feature Expansion',
      'Cross-Platform Synchronization'
    ],
    status: 'Planned'
  },
  {
    id: 'CONVERGENCE',
    name: 'Technological Convergence',
    duration: '24-36 Months',
    icon: '🚀',
    objectives: [
      'Augmented Reality Integration',
      'Quantum Computing Experiments',
      'Neuromorphic AI Development',
      'Decentralized Autonomous Structures'
    ],
    status: 'Future'
  },
  {
    id: 'TRANSFORMATION',
    name: 'Global Transformation',
    duration: '36-60 Months',
    icon: '🌍',
    objectives: [
      'Global Sports Strategy Platform',
      'Advanced Skill Ecosystem',
      'Technological Innovation Leadership',
      'Social Impact Demonstration'
    ],
    status: 'Visionary'
  }
];

// Technology Innovation Categories
const INNOVATION_CATEGORIES = [
  {
    name: 'Artificial Intelligence',
    technologies: [
      'Cognitive Coaching',
      'Emotional Intelligence',
      'Predictive Modeling',
      'Multi-Agent Simulation'
    ],
    progress: Math.random() * 100
  },
  {
    name: 'Blockchain',
    technologies: [
      'Decentralized Governance',
      'Dynamic Tokenomics',
      'Skill Credentials',
      'Transparent Economics'
    ],
    progress: Math.random() * 100
  },
  {
    name: 'Immersive Technologies',
    technologies: [
      'AR Training Environments',
      'Holographic Interactions',
      'Biometric Tracking',
      'Mixed Reality Simulation'
    ],
    progress: Math.random() * 100
  },
  {
    name: 'Quantum Computing',
    technologies: [
      'Strategic Modeling',
      'Complex Simulations',
      'Cryptographic Enhancements',
      'Probabilistic Algorithms'
    ],
    progress: Math.random() * 100
  }
];

const InnovationRoadmapDashboard = () => {
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [innovationCategories, setInnovationCategories] = useState(INNOVATION_CATEGORIES);

  // Simulate innovation progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      const updatedCategories = innovationCategories.map(category => ({
        ...category,
        progress: Math.min(100, category.progress + (Math.random() * 5))
      }));
      setInnovationCategories(updatedCategories);
    }, 30000);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Innovation Roadmap Dashboard
      </h1>

      {/* Innovation Phases */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Innovation Phases</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {INNOVATION_PHASES.map((phase) => (
            <div 
              key={phase.id}
              className={`
                border rounded p-4 
                ${selectedPhase === phase.id 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'bg-white'}
                hover:shadow-lg transition-all
                cursor-pointer
              `}
              onClick={() => setSelectedPhase(phase.id)}
            >
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">{phase.icon}</span>
                <h3 className="font-bold">{phase.name}</h3>
              </div>
              <p className="text-sm mb-2">{phase.duration}</p>
              <div className={`
                px-2 py-1 rounded text-xs font-semibold
                ${phase.status === 'In Progress' ? 'bg-green-200 text-green-800' :
                  phase.status === 'Planned' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'}
              `}>
                {phase.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Phase Details */}
      {selectedPhase && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-bold text-lg mb-2">
            {INNOVATION_PHASES.find(p => p.id === selectedPhase).name} Details
          </h3>
          <div>
            <h4 className="font-semibold">Key Objectives:</h4>
            <ul className="list-disc pl-5">
              {INNOVATION_PHASES.find(p => p.id === selectedPhase).objectives.map((obj, index) => (
                <li key={index}>{obj}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Innovation Categories */}
      <div>
        <h2 className="font-bold text-xl mb-2">Technology Innovation Tracking</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {innovationCategories.map((category, index) => (
            <div 
              key={index}
              className="bg-white border rounded p-4 shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{category.name}</h3>
                <span className="text-sm font-semibold">
                  {Math.round(category.progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`
                    h-2.5 rounded-full 
                    ${category.progress > 75 ? 'bg-green-500' : 
                      category.progress > 50 ? 'bg-yellow-500' : 'bg-red-500'}
                  `}
                  style={{width: `${category.progress}%`}}
                ></div>
              </div>
              <div className="mt-2">
                <h4 className="font-semibold">Key Technologies:</h4>
                <ul className="list-disc pl-5 text-sm">
                  {category.technologies.map((tech, techIndex) => (
                    <li key={techIndex}>{tech}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InnovationRoadmapDashboard;

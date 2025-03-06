import React, { useState, useEffect } from 'react';

// Quantum Research Domains
const QUANTUM_RESEARCH_DOMAINS = [
  {
    id: 'HARDWARE',
    name: 'Quantum Hardware',
    description: 'Advanced quantum computing physical architectures',
    icon: '🖥️',
    key_technologies: [
      'Superconducting Circuits',
      'Photonic Quantum Processing',
      'Topological Quantum Computing'
    ],
    maturityLevel: Math.random() * 100
  },
  {
    id: 'ALGORITHMS',
    name: 'Quantum Algorithms',
    description: 'Advanced computational approaches for quantum systems',
    icon: '🧮',
    key_technologies: [
      'Quantum Machine Learning',
      'Quantum Cryptography',
      'Optimization Algorithms'
    ],
    maturityLevel: Math.random() * 100
  },
  {
    id: 'APPLICATIONS',
    name: 'Practical Applications',
    description: 'Real-world quantum computing solutions',
    icon: '🌐',
    key_technologies: [
      'Scientific Modeling',
      'Financial Analysis',
      'AI Enhancement'
    ],
    maturityLevel: Math.random() * 100
  },
  {
    id: 'THEORY',
    name: 'Quantum Information Theory',
    description: 'Fundamental principles of quantum information',
    icon: '🔬',
    key_technologies: [
      'Quantum Shannon Theory',
      'Entanglement Dynamics',
      'Quantum Complexity'
    ],
    maturityLevel: Math.random() * 100
  }
];

// Simulate Research Progress
const simulateResearchProgress = () => {
  return {
    computationalComplexity: Math.random() * 100,
    quantumCoherence: Math.random() * 100,
    algorithmicInnovation: Math.random() * 100,
    ethicalConsiderations: Math.random() * 100
  };
};

const QuantumResearchExplorer = () => {
  // State Management
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [researchProgress, setResearchProgress] = useState(null);
  const [quantumSimulation, setQuantumSimulation] = useState({
    activeResearchProjects: [],
    globalCollaborations: 0,
    innovationIndex: 0
  });

  // Initialize Research Simulation
  useEffect(() => {
    // Initial research progress generation
    setResearchProgress(simulateResearchProgress());

    // Simulate quantum research ecosystem
    const researchInterval = setInterval(() => {
      // Generate active research projects
      const newResearchProjects = Array(Math.floor(Math.random() * 10) + 5)
        .fill(null)
        .map(() => ({
          id: `PROJECT-${Math.random().toString(36).substr(2, 9)}`,
          domain: QUANTUM_RESEARCH_DOMAINS[
            Math.floor(Math.random() * QUANTUM_RESEARCH_DOMAINS.length)
          ].name,
          progressPercentage: Math.random() * 100
        }));

      setQuantumSimulation({
        activeResearchProjects: newResearchProjects,
        globalCollaborations: Math.floor(Math.random() * 50),
        innovationIndex: Math.random() * 100
      });

      // Update research progress
      setResearchProgress(simulateResearchProgress());
    }, 10000);

    return () => clearInterval(researchInterval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Quantum Research and Innovation Explorer
      </h1>

      {/* Research Progress Metrics */}
      {researchProgress && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold text-xl mb-2">Quantum Research Metrics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Computational Complexity</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${researchProgress.computationalComplexity}%`}}
                ></div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Quantum Coherence</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{width: `${researchProgress.quantumCoherence}%`}}
                ></div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Algorithmic Innovation</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-yellow-600 h-2.5 rounded-full" 
                  style={{width: `${researchProgress.algorithmicInnovation}%`}}
                ></div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Ethical Considerations</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{width: `${researchProgress.ethicalConsiderations}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Research Domains */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {QUANTUM_RESEARCH_DOMAINS.map((domain) => (
          <div 
            key={domain.id}
            className={`
              border rounded p-4 
              ${selectedDomain === domain.id 
                ? 'bg-blue-100 border-blue-500' 
                : 'bg-white'}
              hover:shadow-lg transition-all
              cursor-pointer
            `}
            onClick={() => setSelectedDomain(domain.id)}
          >
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-2">{domain.icon}</span>
              <h2 className="font-bold">{domain.name}</h2>
            </div>
            <p className="text-sm mb-2">{domain.description}</p>
            <div>
              <p className="font-semibold">Maturity Level</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className={`
                    h-2.5 rounded-full 
                    ${domain.maturityLevel > 75 ? 'bg-green-500' : 
                      domain.maturityLevel > 50 ? 'bg-yellow-500' : 'bg-red-500'}
                  `}
                  style={{width: `${domain.maturityLevel}%`}}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quantum Research Simulation */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold text-xl mb-2">Global Quantum Research Ecosystem</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="font-semibold">Active Research Projects</p>
            <p>{quantumSimulation.activeResearchProjects.length}</p>
          </div>
          <div>
            <p className="font-semibold">Global Collaborations</p>
            <p>{quantumSimulation.globalCollaborations}</p>
          </div>
          <div>
            <p className="font-semibold">Innovation Index</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${quantumSimulation.innovationIndex}%`}}
              ></div>
            </div>
          </div>
        </div>

        {/* Active Research Projects */}
        <div>
          <h3 className="font-semibold mb-2">Current Research Projects</h3>
          <div className="grid md:grid-cols-3 gap-2">
            {quantumSimulation.activeResearchProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white p-2 rounded shadow-sm"
              >
                <p className="font-bold">{project.domain}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`
                      h-1.5 rounded-full 
                      ${project.progressPercentage > 75 ? 'bg-green-500' : 
                        project.progressPercentage > 50 ? 'bg-yellow-500' : 'bg-red-500'}
                    `}
                    style={{width: `${project.progressPercentage}%`}}
                  ></div>
                </div>
                <p className="text-sm mt-1">
                  Progress: {project.progressPercentage.toFixed(2)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumResearchExplorer;

export const QUANTUM_RESEARCH_DOMAINS = [
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

export const simulateResearchProgress = () => {
  return {
    computationalComplexity: Math.random() * 100,
    quantumCoherence: Math.random() * 100,
    algorithmicInnovation: Math.random() * 100,
    ethicalConsiderations: Math.random() * 100
  };
};
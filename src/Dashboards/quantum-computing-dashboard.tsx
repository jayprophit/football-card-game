import React, { useState, useEffect } from 'react';

// Quantum Principles Visualization
const QUANTUM_PRINCIPLES = [
  {
    id: 'UNCERTAINTY',
    name: 'Uncertainty Principle',
    description: 'Fundamental limit on precision of quantum measurements',
    icon: '🌊',
    key_concepts: [
      'Position-Momentum Duality',
      'Probabilistic Nature',
      'Quantum Measurement Constraints'
    ]
  },
  {
    id: 'ENTANGLEMENT',
    name: 'Quantum Entanglement',
    description: 'Non-local quantum state correlation',
    icon: '🔗',
    key_concepts: [
      'Instantaneous Information Transfer',
      'Correlated Quantum States',
      'Non-Classical Information Binding'
    ]
  },
  {
    id: 'SUPERPOSITION',
    name: 'Quantum Superposition',
    description: 'Simultaneous existence in multiple states',
    icon: '⚛️',
    key_concepts: [
      'Probabilistic State Representation',
      'Quantum State Overlapping',
      'Multiple Simultaneous Configurations'
    ]
  }
];

// Quantum Computational Simulation
const simulateQuantumState = () => {
  return {
    qubitCoherence: Math.random(),
    quantumEntropy: Math.random(),
    tunnelProbability: Math.random(),
    quantumPotential: Math.random() * 100
  };
};

const QuantumComputingDashboard = () => {
  // State Management
  const [selectedPrinciple, setSelectedPrinciple] = useState(null);
  const [quantumState, setQuantumState] = useState(null);
  const [quantumSimulation, setQuantumSimulation] = useState({
    processingStates: [],
    activeQubits: 0,
    quantumAlgorithm: 'Initializing'
  });

  // Initialize Quantum Simulation
  useEffect(() => {
    // Initial quantum state generation
    setQuantumState(simulateQuantumState());

    // Simulate quantum computational process
    const simulationInterval = setInterval(() => {
      // Generate quantum processing states
      const newProcessingStates = Array(Math.floor(Math.random() * 10) + 5)
        .fill(null)
        .map(() => ({
          id: `STATE-${Math.random().toString(36).substr(2, 9)}`,
          probability: Math.random(),
          energy: Math.random() * 100
        }));

      setQuantumSimulation({
        processingStates: newProcessingStates,
        activeQubits: Math.floor(Math.random() * 100),
        quantumAlgorithm: [
          'Shor\'s Algorithm',
          'Grover\'s Algorithm',
          'Quantum Fourier Transform',
          'Quantum Simulation'
        ][Math.floor(Math.random() * 4)]
      });

      // Update quantum state
      setQuantumState(simulateQuantumState());
    }, 5000);

    return () => clearInterval(simulationInterval);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Quantum Computing Visualization
      </h1>

      {/* Quantum State Metrics */}
      {quantumState && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold text-xl mb-2">Quantum State Metrics</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Qubit Coherence</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{width: `${quantumState.qubitCoherence * 100}%`}}
                ></div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Quantum Entropy</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{width: `${quantumState.quantumEntropy * 100}%`}}
                ></div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Tunneling Probability</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-yellow-600 h-2.5 rounded-full" 
                  style={{width: `${quantumState.tunnelProbability * 100}%`}}
                ></div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Quantum Potential</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{width: `${quantumState.quantumPotential}%`}}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Principles */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {QUANTUM_PRINCIPLES.map((principle) => (
          <div 
            key={principle.id}
            className={`
              border rounded p-4 
              ${selectedPrinciple === principle.id 
                ? 'bg-blue-100 border-blue-500' 
                : 'bg-white'}
              hover:shadow-lg transition-all
              cursor-pointer
            `}
            onClick={() => setSelectedPrinciple(principle.id)}
          >
            <div className="flex items-center mb-2">
              <span className="text-3xl mr-2">{principle.icon}</span>
              <h2 className="font-bold">{principle.name}</h2>
            </div>
            <p className="text-sm mb-2">{principle.description}</p>
            <div>
              <h3 className="font-semibold">Key Concepts:</h3>
              <ul className="list-disc pl-5 text-sm">
                {principle.key_concepts.map((concept, index) => (
                  <li key={index}>{concept}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Quantum Simulation */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold text-xl mb-2">Quantum Computational Simulation</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Active Qubits</p>
            <p>{quantumSimulation.activeQubits}</p>
          </div>
          <div>
            <p className="font-semibold">Current Algorithm</p>
            <p>{quantumSimulation.quantumAlgorithm}</p>
          </div>
          <div>
            <p className="font-semibold">Processing States</p>
            <p>{quantumSimulation.processingStates.length}</p>
          </div>
        </div>

        {/* Quantum Processing States */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Quantum Processing States</h3>
          <div className="grid grid-cols-5 gap-2">
            {quantumSimulation.processingStates.map((state) => (
              <div 
                key={state.id}
                className="bg-white p-2 rounded shadow-sm"
              >
                <p>Probability: {(state.probability * 100).toFixed(2)}%</p>
                <p>Energy: {state.energy.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumComputingDashboard;

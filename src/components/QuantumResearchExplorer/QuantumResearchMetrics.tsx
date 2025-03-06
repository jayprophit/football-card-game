import React from 'react';

const QuantumResearchMetrics = ({ researchProgress }) => {
  return (
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
  );
};

export default QuantumResearchMetrics;

import React from 'react';

const QuantumResearchSimulation = ({ quantumSimulation }) => {
  return (
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
  );
};

export default QuantumResearchSimulation;

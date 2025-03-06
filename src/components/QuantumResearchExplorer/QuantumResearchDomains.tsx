import React from 'react';

const QuantumResearchDomains = ({ domains, selectedDomain, setSelectedDomain }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {domains.map((domain) => (
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
  );
};

export default QuantumResearchDomains;

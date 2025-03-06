import { useState, useEffect } from 'react';
import { QUANTUM_RESEARCH_DOMAINS, simulateResearchProgress } from '../utils/simulateResearchProgress';

const useQuantumResearch = () => {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [researchProgress, setResearchProgress] = useState(null);
  const [quantumSimulation, setQuantumSimulation] = useState({
    activeResearchProjects: [],
    globalCollaborations: 0,
    innovationIndex: 0
  });

  useEffect(() => {
    setResearchProgress(simulateResearchProgress());

    const researchInterval = setInterval(() => {
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

      setResearchProgress(simulateResearchProgress());
    }, 10000);

    return () => clearInterval(researchInterval);
  }, []);

  return {
    selectedDomain,
    setSelectedDomain,
    researchProgress,
    quantumSimulation
  };
};

export default useQuantumResearch;

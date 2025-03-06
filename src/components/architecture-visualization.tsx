import React, { useState, useEffect } from 'react';

// System Components
const SYSTEM_COMPONENTS = {
  FRONTEND: {
    name: 'Frontend Services',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    icon: '💻'
  },
  BACKEND: {
    name: 'Backend Microservices',
    technologies: ['gRPC', 'Kafka', 'Kubernetes'],
    icon: '🔧'
  },
  BLOCKCHAIN: {
    name: 'Blockchain Layer',
    technologies: ['Ethereum', 'Smart Contracts', 'Web3'],
    icon: '⛓️'
  },
  AI_ML: {
    name: 'AI/Machine Learning',
    technologies: ['TensorFlow', 'PyTorch', 'MLflow'],
    icon: '🤖'
  },
  DATABASE: {
    name: 'Data Management',
    technologies: ['PostgreSQL', 'Redis', 'MongoDB'],
    icon: '💾'
  },
  SECURITY: {
    name: 'Security Framework',
    technologies: ['Zero-Knowledge Proof', 'Multi-Factor Auth', 'Compliance'],
    icon: '🛡️'
  }
};

// Performance Metrics Simulation
const generatePerformanceMetrics = () => ({
  responseTime: (Math.random() * 50 + 50).toFixed(2),
  concurrentUsers: Math.floor(Math.random() * 50000),
  systemHealth: Math.random() > 0.1 ? 'Healthy' : 'Warning',
  dataProcessingSpeed: (Math.random() * 1000).toFixed(2)
});

const ArchitectureVisualizationDashboard = () => {
  // State Management
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState({
    frontend: 'Deployed',
    backend: 'Deploying',
    blockchain: 'Synchronizing',
    aiML: 'Training',
    database: 'Operational',
    security: 'Monitoring'
  });

  // Initialize Performance Monitoring
  useEffect(() => {
    // Initial metrics generation
    setPerformanceMetrics(generatePerformanceMetrics());

    // Simulate periodic performance updates
    const metricsInterval = setInterval(() => {
      setPerformanceMetrics(generatePerformanceMetrics());
    }, 30000);

    return () => clearInterval(metricsInterval);
  }, []);

  // Simulate Component Deployment
  const deployComponent = (component) => {
    const newStatus = {...deploymentStatus};
    newStatus[component.toLowerCase()] = 'Deploying';
    setDeploymentStatus(newStatus);

    // Simulate deployment process
    setTimeout(() => {
      newStatus[component.toLowerCase()] = 'Deployed';
      setDeploymentStatus(newStatus);
    }, 5000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        System Architecture Dashboard
      </h1>

      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold text-xl mb-2">System Performance</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="font-semibold">Response Time</p>
              <p>{performanceMetrics.responseTime} ms</p>
            </div>
            <div>
              <p className="font-semibold">Concurrent Users</p>
              <p>{performanceMetrics.concurrentUsers}</p>
            </div>
            <div>
              <p className="font-semibold">System Health</p>
              <p className={
                performanceMetrics.systemHealth === 'Healthy' 
                  ? 'text-green-500' 
                  : 'text-red-500'
              }>
                {performanceMetrics.systemHealth}
              </p>
            </div>
            <div>
              <p className="font-semibold">Data Processing</p>
              <p>{performanceMetrics.dataProcessingSpeed} ops/sec</p>
            </div>
          </div>
        </div>
      )}

      {/* System Components */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(SYSTEM_COMPONENTS).map(([key, component]) => (
          <div 
            key={key}
            className={`
              border rounded p-4 
              ${selectedComponent === key 
                ? 'bg-blue-100 border-blue-500' 
                : 'bg-white'}
              hover:shadow-lg transition-all
            `}
            onClick={() => setSelectedComponent(key)}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{component.icon}</span>
              <h2 className="font-bold">{component.name}</h2>
            </div>
            
            {/* Technologies */}
            <div className="mb-2">
              <h3 className="font-semibold">Technologies:</h3>
              <ul className="list-disc pl-5">
                {component.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>

            {/* Deployment Status */}
            <div className="flex justify-between items-center">
              <p>
                Status: 
                <span className={`
                  ml-2
                  ${deploymentStatus[key.toLowerCase()] === 'Deployed' 
                    ? 'text-green-500' 
                    : deploymentStatus[key.toLowerCase()] === 'Deploying'
                      ? 'text-yellow-500'
                      : 'text-red-500'}
                `}>
                  {deploymentStatus[key.toLowerCase()]}
                </span>
              </p>
              <button
                onClick={() => deployComponent(key)}
                className="bg-blue-500 text-white p-1 rounded text-sm"
              >
                Deploy
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Component View */}
      {selectedComponent && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold text-xl mb-2">
            {SYSTEM_COMPONENTS[selectedComponent].name} Details
          </h2>
          <p>
            Deployment Status: 
            <span className={`
              ml-2
              ${deploymentStatus[selectedComponent.toLowerCase()] === 'Deployed' 
                ? 'text-green-500' 
                : deploymentStatus[selectedComponent.toLowerCase()] === 'Deploying'
                  ? 'text-yellow-500'
                  : 'text-red-500'}
            `}>
              {deploymentStatus[selectedComponent.toLowerCase()]}
            </span>
          </p>
          <div className="mt-2">
            <h3 className="font-semibold">Key Technologies:</h3>
            <ul className="list-disc pl-5">
              {SYSTEM_COMPONENTS[selectedComponent].technologies.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureVisualizationDashboard;

import React, { useState, useEffect } from 'react';

// Security Threat Levels
const THREAT_LEVELS = {
  LOW: {
    name: 'Low',
    color: 'text-green-500',
    severity: 1
  },
  MEDIUM: {
    name: 'Medium',
    color: 'text-yellow-500',
    severity: 2
  },
  HIGH: {
    name: 'High',
    color: 'text-orange-500',
    severity: 3
  },
  CRITICAL: {
    name: 'Critical',
    color: 'text-red-500',
    severity: 4
  }
};

// Simulated Security Events
const generateSecurityEvents = () => {
  const eventTypes = [
    'Potential Injection Attack',
    'Unauthorized Access Attempt',
    'Suspicious Network Traffic',
    'Endpoint Anomaly Detected',
    'Potential Data Exfiltration',
    'Blockchain Transaction Irregularity'
  ];

  return Array(10).fill(null).map(() => ({
    id: `EVENT-${Math.random().toString(36).substr(2, 9)}`,
    type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
    threatLevel: Object.values(THREAT_LEVELS)[
      Math.floor(Math.random() * Object.keys(THREAT_LEVELS).length)
    ]
  }));
};

// Simulated Vulnerability Scan
const performVulnerabilityScan = () => {
  const vulnerabilityTypes = [
    'Cross-Site Scripting (XSS)',
    'SQL Injection',
    'Broken Authentication',
    'Sensitive Data Exposure',
    'XML External Entity (XXE)',
    'Insecure Deserialization'
  ];

  return Array(5).fill(null).map(() => ({
    id: `VUL-${Math.random().toString(36).substr(2, 9)}`,
    type: vulnerabilityTypes[Math.floor(Math.random() * vulnerabilityTypes.length)],
    severity: Math.floor(Math.random() * 10) + 1
  }));
};

const SecurityDashboard = () => {
  const [securityEvents, setSecurityEvents] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [authenticationMethod, setAuthenticationMethod] = useState('Standard MFA');
  const [encryptionLevel, setEncryptionLevel] = useState('AES-256');

  // Simulate continuous security monitoring
  useEffect(() => {
    // Initial scan
    setSecurityEvents(generateSecurityEvents());
    setVulnerabilities(performVulnerabilityScan());

    // Set up periodic security checks
    const eventInterval = setInterval(() => {
      setSecurityEvents(generateSecurityEvents());
    }, 30000);

    const vulnerabilityInterval = setInterval(() => {
      setVulnerabilities(performVulnerabilityScan());
    }, 60000);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(eventInterval);
      clearInterval(vulnerabilityInterval);
    };
  }, []);

  // Simulate threat response
  const respondToThreat = (event) => {
    alert(`Responding to threat: ${event.type} at threat level ${event.threatLevel.name}`);
    // In a real scenario, this would trigger automated response mechanisms
  };

  // Simulate vulnerability mitigation
  const mitigateVulnerability = (vulnerability) => {
    alert(`Mitigating vulnerability: ${vulnerability.type} with severity ${vulnerability.severity}`);
    // In a real scenario, this would initiate patch or remediation process
  };

  // Authentication method selector
  const handleAuthMethodChange = (method) => {
    setAuthenticationMethod(method);
  };

  // Encryption level selector
  const handleEncryptionLevelChange = (level) => {
    setEncryptionLevel(level);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Cybersecurity Monitoring Dashboard
      </h1>

      {/* Security Configuration */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Authentication Method</h2>
          <div className="flex space-x-2">
            {['Standard MFA', 'Biometric', 'Hardware Token', 'Adaptive Auth'].map((method) => (
              <button
                key={method}
                onClick={() => handleAuthMethodChange(method)}
                className={`
                  p-2 rounded 
                  ${authenticationMethod === method 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white border'}
                `}
              >
                {method}
              </button>
            ))}
          </div>
          <p className="mt-2">Current: {authenticationMethod}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Encryption Level</h2>
          <div className="flex space-x-2">
            {['AES-256', 'Quantum-Resistant', 'Zero-Knowledge', 'Blockchain'].map((level) => (
              <button
                key={level}
                onClick={() => handleEncryptionLevelChange(level)}
                className={`
                  p-2 rounded 
                  ${encryptionLevel === level 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white border'}
                `}
              >
                {level}
              </button>
            ))}
          </div>
          <p className="mt-2">Current: {encryptionLevel}</p>
        </div>
      </div>

      {/* Security Events */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Security Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {securityEvents.map((event) => (
            <div 
              key={event.id} 
              className={`
                border rounded p-4 
                ${event.threatLevel.color} 
                bg-white shadow-lg
              `}
            >
              <h3 className="font-bold">{event.type}</h3>
              <p>Threat Level: {event.threatLevel.name}</p>
              <p>Timestamp: {event.timestamp.toLocaleString()}</p>
              <button
                onClick={() => respondToThreat(event)}
                className="mt-2 p-2 bg-blue-500 text-white rounded"
              >
                Respond to Threat
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerability Scan */}
      <div>
        <h2 className="font-bold text-xl mb-2">Vulnerability Scan</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vulnerabilities.map((vulnerability) => (
            <div 
              key={vulnerability.id} 
              className={`
                border rounded p-4 
                ${vulnerability.severity > 7 
                  ? 'bg-red-100 text-red-800' 
                  : vulnerability.severity > 4 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'}
              `}
            >
              <h3 className="font-bold">{vulnerability.type}</h3>
              <p>Severity: {vulnerability.severity}/10</p>
              <button
                onClick={() => mitigateVulnerability(vulnerability)}
                className="mt-2 p-2 bg-blue-500 text-white rounded"
              >
                Mitigate Vulnerability
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;

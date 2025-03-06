import React, { useState, useEffect } from 'react';

// Compliance Regulation Types
const COMPLIANCE_REGULATIONS = {
  GDPR: {
    name: 'GDPR',
    region: 'European Union',
    key_requirements: [
      'Consent Management',
      'Data Minimization',
      'Right to Erasure'
    ],
    color: 'text-blue-500'
  },
  CCPA: {
    name: 'CCPA',
    region: 'California, USA',
    key_requirements: [
      'Consumer Data Rights',
      'Opt-Out Mechanisms',
      'Data Sale Transparency'
    ],
    color: 'text-green-500'
  },
  HIPAA: {
    name: 'HIPAA',
    region: 'United States',
    key_requirements: [
      'Patient Data Protection',
      'Secure Data Transmission',
      'Access Controls'
    ],
    color: 'text-red-500'
  }
};

// Privacy Consent Management
const CONSENT_TYPES = [
  'Data Collection',
  'Marketing Communication',
  'Third-Party Sharing',
  'Analytics Usage',
  'Personalization'
];

const ComplianceManagementDashboard = () => {
  const [userConsents, setUserConsents] = useState({});
  const [complianceStatus, setComplianceStatus] = useState({});
  const [privacyScore, setPrivacyScore] = useState(0);
  const [activeRegulations, setActiveRegulations] = useState([]);

  // Initialize compliance monitoring
  useEffect(() => {
    // Simulate initial compliance assessment
    initializeComplianceStatus();
    generateUserConsents();
    calculatePrivacyScore();
  }, []);

  // Initialize compliance status for regulations
  const initializeComplianceStatus = () => {
    const initialStatus = {};
    Object.keys(COMPLIANCE_REGULATIONS).forEach(reg => {
      initialStatus[reg] = {
        compliant: Math.random() > 0.3,
        lastAssessment: new Date(),
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
      };
    });
    setComplianceStatus(initialStatus);
    
    // Determine active regulations based on current context
    const active = Object.keys(COMPLIANCE_REGULATIONS)
      .filter(() => Math.random() > 0.5);
    setActiveRegulations(active);
  };

  // Generate user consent states
  const generateUserConsents = () => {
    const consents = {};
    CONSENT_TYPES.forEach(type => {
      consents[type] = Math.random() > 0.5;
    });
    setUserConsents(consents);
  };

  // Calculate overall privacy score
  const calculatePrivacyScore = () => {
    const consentScore = Object.values(userConsents)
      .filter(consent => consent).length / CONSENT_TYPES.length;
    
    const complianceScore = Object.values(complianceStatus)
      .filter(status => status.compliant).length / 
      Object.keys(COMPLIANCE_REGULATIONS).length;
    
    const score = Math.round((consentScore + complianceScore) * 50);
    setPrivacyScore(score);
  };

  // Toggle user consent
  const toggleConsent = (type) => {
    const updatedConsents = {
      ...userConsents,
      [type]: !userConsents[type]
    };
    setUserConsents(updatedConsents);
    calculatePrivacyScore();
  };

  // Simulate compliance audit
  const performComplianceAudit = () => {
    const auditResults = {};
    Object.keys(COMPLIANCE_REGULATIONS).forEach(reg => {
      auditResults[reg] = {
        compliant: Math.random() > 0.3,
        lastAssessment: new Date(),
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
      };
    });
    setComplianceStatus(auditResults);
    calculatePrivacyScore();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Compliance and Privacy Management
      </h1>

      {/* Privacy Score */}
      <div className="mb-4 bg-gray-100 p-4 rounded">
        <h2 className="font-bold text-xl mb-2">Privacy Protection Score</h2>
        <div className="w-full bg-gray-200 rounded-full h-6">
          <div 
            className={`
              h-6 rounded-full text-center text-white 
              ${privacyScore > 75 ? 'bg-green-500' : 
                privacyScore > 50 ? 'bg-yellow-500' : 'bg-red-500'}
            `}
            style={{width: `${privacyScore}%`}}
          >
            {privacyScore}%
          </div>
        </div>
      </div>

      {/* Compliance Regulations */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Active Compliance Regulations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {activeRegulations.map(reg => {
            const regulation = COMPLIANCE_REGULATIONS[reg];
            const status = complianceStatus[reg];
            return (
              <div 
                key={reg} 
                className={`
                  border rounded p-4 
                  ${regulation.color} 
                  ${status.compliant ? 'bg-green-100' : 'bg-red-100'}
                `}
              >
                <h3 className="font-bold">{regulation.name}</h3>
                <p>Region: {regulation.region}</p>
                <div className="mt-2">
                  <h4 className="font-semibold">Key Requirements:</h4>
                  <ul className="list-disc pl-5">
                    {regulation.key_requirements.map(req => (
                      <li key={req}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p>Compliance Status: {status.compliant ? 'Compliant' : 'Non-Compliant'}</p>
                  <p>Risk Level: {status.riskLevel}</p>
                  <p>Last Assessment: {status.lastAssessment.toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Consent Management */}
      <div>
        <h2 className="font-bold text-xl mb-2">User Consent Preferences</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONSENT_TYPES.map(type => (
            <div 
              key={type} 
              className="border rounded p-4 bg-white shadow-lg"
            >
              <h3 className="font-bold">{type}</h3>
              <div className="flex items-center mt-2">
                <span className="mr-2">Consent:</span>
                <button
                  onClick={() => toggleConsent(type)}
                  className={`
                    p-2 rounded 
                    ${userConsents[type] ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                  `}
                >
                  {userConsents[type] ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Audit Action */}
      <div className="mt-4 text-center">
        <button
          onClick={performComplianceAudit}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Perform Compliance Audit
        </button>
      </div>
    </div>
  );
};

export default ComplianceManagementDashboard;

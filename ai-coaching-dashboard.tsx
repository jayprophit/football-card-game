import React, { useState, useEffect } from 'react';

// Skill Categories
const SKILL_CATEGORIES = {
  TACTICAL: {
    name: 'Tactical Intelligence',
    description: 'Strategic decision-making and game understanding',
    icon: '🧠'
  },
  TECHNICAL: {
    name: 'Technical Proficiency',
    description: 'Skill execution and precision',
    icon: '⚽'
  },
  PHYSICAL: {
    name: 'Physical Conditioning',
    description: 'Stamina, speed, and endurance',
    icon: '💪'
  },
  MENTAL: {
    name: 'Mental Resilience',
    description: 'Psychological strength and focus',
    icon: '🔬'
  }
};

// AI Coaching Recommendations Generator
const generateAICoachingRecommendations = (playerSkills) => {
  const recommendations = [];
  
  // Tactical Intelligence Recommendations
  if (playerSkills.tactical < 50) {
    recommendations.push({
      category: 'TACTICAL',
      suggestion: 'Improve positional awareness through video analysis',
      impact: 'High',
      difficulty: 'Medium'
    });
  }

  // Technical Proficiency Recommendations
  if (playerSkills.technical < 60) {
    recommendations.push({
      category: 'TECHNICAL',
      suggestion: 'Focus on precision passing drills',
      impact: 'High',
      difficulty: 'Low'
    });
  }

  // Physical Conditioning Recommendations
  if (playerSkills.physical < 55) {
    recommendations.push({
      category: 'PHYSICAL',
      suggestion: 'Implement high-intensity interval training',
      impact: 'Medium',
      difficulty: 'High'
    });
  }

  // Mental Resilience Recommendations
  if (playerSkills.mental < 45) {
    recommendations.push({
      category: 'MENTAL',
      suggestion: 'Practice mindfulness and concentration exercises',
      impact: 'High',
      difficulty: 'Low'
    });
  }

  return recommendations;
};

// Simulate Player Skill Progression
const simulateSkillProgression = (currentSkills) => {
  return {
    tactical: Math.min(100, currentSkills.tactical + Math.random() * 10),
    technical: Math.min(100, currentSkills.technical + Math.random() * 10),
    physical: Math.min(100, currentSkills.physical + Math.random() * 10),
    mental: Math.min(100, currentSkills.mental + Math.random() * 10)
  };
};

const AICoachingDashboard = () => {
  // State Management
  const [playerSkills, setPlayerSkills] = useState({
    tactical: Math.floor(Math.random() * 70),
    technical: Math.floor(Math.random() * 70),
    physical: Math.floor(Math.random() * 70),
    mental: Math.floor(Math.random() * 70)
  });

  const [aiRecommendations, setAIRecommendations] = useState([]);
  const [trainingHistory, setTrainingHistory] = useState([]);

  // Initialize AI Coaching on Component Mount
  useEffect(() => {
    // Generate initial recommendations
    const initialRecommendations = generateAICoachingRecommendations(playerSkills);
    setAIRecommendations(initialRecommendations);
  }, []);

  // Simulate Training Session
  const conductTrainingSession = () => {
    // Improve skills
    const updatedSkills = simulateSkillProgression(playerSkills);
    setPlayerSkills(updatedSkills);

    // Generate new recommendations
    const newRecommendations = generateAICoachingRecommendations(updatedSkills);
    setAIRecommendations(newRecommendations);

    // Log training session
    const trainingSession = {
      timestamp: new Date(),
      skillsBefore: playerSkills,
      skillsAfter: updatedSkills
    };
    setTrainingHistory([trainingSession, ...trainingHistory].slice(0, 5));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        AI-Powered Player Coaching Dashboard
      </h1>

      {/* Skill Breakdown */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {Object.entries(SKILL_CATEGORIES).map(([key, category]) => (
          <div 
            key={key}
            className="bg-gray-100 p-4 rounded"
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">{category.icon}</span>
              <h2 className="font-bold">{category.name}</h2>
            </div>
            <p className="text-sm mb-2">{category.description}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`
                  h-2.5 rounded-full 
                  ${playerSkills[key.toLowerCase()] > 70 ? 'bg-green-500' : 
                    playerSkills[key.toLowerCase()] > 50 ? 'bg-yellow-500' : 'bg-red-500'}
                `}
                style={{width: `${playerSkills[key.toLowerCase()]}%`}}
              ></div>
            </div>
            <p className="text-center mt-1">
              {Math.round(playerSkills[key.toLowerCase()])}%
            </p>
          </div>
        ))}
      </div>

      {/* AI Coaching Recommendations */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">AI Coaching Recommendations</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiRecommendations.map((recommendation, index) => {
            const category = SKILL_CATEGORIES[recommendation.category];
            return (
              <div 
                key={index}
                className={`
                  border rounded p-4
                  ${recommendation.impact === 'High' ? 'bg-red-100' : 
                    recommendation.impact === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'}
                `}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{category.icon}</span>
                  <h3 className="font-bold">{category.name}</h3>
                </div>
                <p>{recommendation.suggestion}</p>
                <div className="mt-2 flex justify-between">
                  <span>Impact: {recommendation.impact}</span>
                  <span>Difficulty: {recommendation.difficulty}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Training Actions */}
      <div className="flex justify-center mb-4">
        <button
          onClick={conductTrainingSession}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Conduct AI Training Session
        </button>
      </div>

      {/* Training History */}
      <div>
        <h2 className="font-bold text-xl mb-2">Training History</h2>
        {trainingHistory.map((session, index) => (
          <div 
            key={index} 
            className="bg-gray-100 p-4 rounded mb-2"
          >
            <p className="font-semibold">
              Training Session: {session.timestamp.toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <h3 className="font-bold">Skills Before</h3>
                {Object.entries(session.skillsBefore).map(([skill, value]) => (
                  <p key={skill}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}: {Math.round(value)}%
                  </p>
                ))}
              </div>
              <div>
                <h3 className="font-bold">Skills After</h3>
                {Object.entries(session.skillsAfter).map(([skill, value]) => (
                  <p key={skill}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}: {Math.round(value)}%
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AICoachingDashboard;

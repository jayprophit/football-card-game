import React from 'react';

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

const AIRecommendations = ({ aiRecommendations }) => (
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
);

export default AIRecommendations;
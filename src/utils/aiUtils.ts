export const generateAICoachingRecommendations = (playerSkills) => {
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

export const simulateSkillProgression = (currentSkills) => {
  return {
    tactical: Math.min(100, currentSkills.tactical + Math.random() * 10),
    technical: Math.min(100, currentSkills.technical + Math.random() * 10),
    physical: Math.min(100, currentSkills.physical + Math.random() * 10),
    mental: Math.min(100, currentSkills.mental + Math.random() * 10)
  };
};

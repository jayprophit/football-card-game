import React from 'react';

const TrainingHistory = ({ trainingHistory }) => (
  <div>
    <h2 className="font-bold text-xl mb-2">Training History</h2>
    {trainingHistory.map((session, index) => (
      <div key={index} className="bg-gray-100 p-4 rounded mb-2">
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
);

export default TrainingHistory;

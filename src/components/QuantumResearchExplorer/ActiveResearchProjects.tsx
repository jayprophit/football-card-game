import React from 'react';

const ActiveResearchProjects = ({ projects }) => {
  return (
    <div className="grid md:grid-cols-3 gap-2">
      {projects.map((project) => (
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
  );
};

export default ActiveResearchProjects;

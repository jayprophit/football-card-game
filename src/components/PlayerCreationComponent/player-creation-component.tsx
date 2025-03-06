import React, { useState, useRef } from 'react';

// Custom SVG Icons
const CameraIcon = ({ color = "black", size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const StarIcon = ({ color = "black", size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Skill Categories Icons as SVG
const PhysicalIcon = ({ color = "green", size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
  >
    <path d="M20.71 7.04c-.83-.83-2.18-.83-3.01 0l-1.74 1.74L6.85 4.18a1.51 1.51 0 0 0-2.12 0l-1.41 1.41a1.51 1.51 0 0 0 0 2.12l4.6 4.6-2.75 2.75c-.83.83-.83 2.18 0 3.01l5.66 5.66c.83.83 2.18.83 3.01 0l2.75-2.75 4.6 4.6a1.51 1.51 0 0 0 2.12 0l1.41-1.41a1.51 1.51 0 0 0 0-2.12l-4.6-4.6 1.74-1.74c.83-.83.83-2.18 0-3.01z" />
  </svg>
);

const TechnicalIcon = ({ color = "blue", size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
  >
    <path d="M17 11h-3V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4h3v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1z" />
  </svg>
);

const MentalIcon = ({ color = "purple", size = 24 }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={color}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
  </svg>
);

// Skill Categories
const SKILL_CATEGORIES = {
  PHYSICAL: {
    icon: <PhysicalIcon />,
    attributes: ['Speed', 'Stamina', 'Strength']
  },
  TECHNICAL: {
    icon: <TechnicalIcon />,
    attributes: ['Ball Control', 'Passing', 'Shooting']
  },
  MENTAL: {
    icon: <MentalIcon />,
    attributes: ['Vision', 'Composure', 'Tactical']
  }
};

// Genetic Potential Levels
const POTENTIAL_LEVELS = [
  { name: 'Novice', color: 'text-gray-500', multiplier: 1 },
  { name: 'Emerging', color: 'text-green-500', multiplier: 1.5 },
  { name: 'Professional', color: 'text-blue-500', multiplier: 2 },
  { name: 'Elite', color: 'text-purple-500', multiplier: 2.5 },
  { name: 'Legendary', color: 'text-yellow-500', multiplier: 3 }
];

const PlayerCreationComponent = () => {
  const [playerImage, setPlayerImage] = useState(null);
  const [skillAttributes, setSkillAttributes] = useState({
    physical: {},
    technical: {},
    mental: {}
  });
  const [playerName, setPlayerName] = useState('');
  const [geneticPotential, setGeneticPotential] = useState(POTENTIAL_LEVELS[0]);
  const fileInputRef = useRef(null);

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result);
        // Simulate AI analysis of uploaded image
        performAIImageAnalysis(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Simulate AI-powered image analysis
  const performAIImageAnalysis = (imageData) => {
    // Placeholder for AI analysis
    // In a real implementation, this would use machine learning to map 
    // physical characteristics to skill potentials
    const simulatedSkills = {
      physical: {
        Speed: Math.floor(Math.random() * 100),
        Stamina: Math.floor(Math.random() * 100),
        Strength: Math.floor(Math.random() * 100)
      },
      technical: {
        'Ball Control': Math.floor(Math.random() * 100),
        Passing: Math.floor(Math.random() * 100),
        Shooting: Math.floor(Math.random() * 100)
      },
      mental: {
        Vision: Math.floor(Math.random() * 100),
        Composure: Math.floor(Math.random() * 100),
        Tactical: Math.floor(Math.random() * 100)
      }
    };
    setSkillAttributes(simulatedSkills);
  };

  // Render skill attribute sliders
  const renderSkillAttributes = () => {
    return Object.entries(SKILL_CATEGORIES).map(([category, categoryData]) => (
      <div key={category} className="mb-4">
        <div className="flex items-center mb-2">
          {categoryData.icon}
          <h3 className="ml-2 font-bold capitalize">{category} Skills</h3>
        </div>
        {categoryData.attributes.map((attribute) => (
          <div key={attribute} className="flex items-center mb-1">
            <label className="w-32">{attribute}</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={skillAttributes[category.toLowerCase()]?.[attribute] || 50}
              onChange={(e) => {
                const newSkills = {...skillAttributes};
                newSkills[category.toLowerCase()][attribute] = parseInt(e.target.value);
                setSkillAttributes(newSkills);
              }}
              className="flex-grow mx-2"
            />
            <span>{skillAttributes[category.toLowerCase()]?.[attribute] || 50}</span>
          </div>
        ))}
      </div>
    ));
  };

  // Calculate overall player rating
  const calculateOverallRating = () => {
    const allSkills = [
      ...Object.values(skillAttributes.physical),
      ...Object.values(skillAttributes.technical),
      ...Object.values(skillAttributes.mental)
    ];
    const averageSkill = allSkills.reduce((a, b) => a + b, 0) / allSkills.length;
    return Math.round(averageSkill * geneticPotential.multiplier);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        <StarIcon className="inline mr-2" />
        AI-Powered Player Creation
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Upload Section */}
        <div className="border-2 border-dashed p-4 text-center">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          {playerImage ? (
            <img 
              src={playerImage} 
              alt="Player" 
              className="max-w-full h-auto mx-auto rounded-lg"
            />
          ) : (
            <div 
              onClick={() => fileInputRef.current.click()}
              className="cursor-pointer hover:bg-gray-100 p-4 border rounded"
            >
              <CameraIcon className="mx-auto mb-2" size={48} />
              <p>Click to Upload Player Photo</p>
            </div>
          )}
        </div>

        {/* Player Details Section */}
        <div>
          <div className="mb-4">
            <label className="block mb-2">Player Name</label>
            <input 
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Player Name"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Genetic Potential</label>
            <div className="flex space-x-2">
              {POTENTIAL_LEVELS.map((level) => (
                <button
                  key={level.name}
                  onClick={() => setGeneticPotential(level)}
                  className={`
                    flex-grow p-2 border rounded 
                    ${geneticPotential.name === level.name 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white ' + level.color
                    }
                  `}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>

          {renderSkillAttributes()}

          <div className="mt-4">
            <h3 className="font-bold">Overall Rating</h3>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-blue-600 h-4 rounded-full" 
                style={{width: `${calculateOverallRating()}%`}}
              ></div>
            </div>
            <p className="text-center">{calculateOverallRating()}/100</p>
          </div>

          <button 
            className="w-full mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Player
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerCreationComponent;

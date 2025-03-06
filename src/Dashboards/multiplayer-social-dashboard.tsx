import React, { useState, useEffect } from 'react';

// Player Status Types
const PLAYER_STATUS = {
  ONLINE: {
    name: 'Online',
    color: 'text-green-500',
    icon: '🟢'
  },
  AWAY: {
    name: 'Away',
    color: 'text-yellow-500',
    icon: '🟡'
  },
  BUSY: {
    name: 'Busy',
    color: 'text-red-500',
    icon: '🔴'
  },
  INVISIBLE: {
    name: 'Invisible',
    color: 'text-gray-500',
    icon: '⚫'
  }
};

// Match Types
const MATCH_TYPES = {
  RANKED: {
    name: 'Ranked Match',
    description: 'Competitive skill-based matching',
    icon: '🏆'
  },
  CASUAL: {
    name: 'Casual Match',
    description: 'Relaxed gameplay',
    icon: '🎮'
  },
  TOURNAMENT: {
    name: 'Tournament',
    description: 'Organized competitive event',
    icon: '🥇'
  }
};

// Generate Simulated Players
const generatePlayers = () => {
  return Array(20).fill(null).map(() => ({
    id: `PLAYER-${Math.random().toString(36).substr(2, 9)}`,
    name: `Player ${Math.floor(Math.random() * 1000)}`,
    status: Object.keys(PLAYER_STATUS)[
      Math.floor(Math.random() * Object.keys(PLAYER_STATUS).length)
    ],
    rank: Math.floor(Math.random() * 1000),
    skills: {
      tactical: Math.floor(Math.random() * 100),
      technical: Math.floor(Math.random() * 100),
      teamwork: Math.floor(Math.random() * 100)
    }
  }));
};

// Generate Simulated Matches
const generateMatches = () => {
  return Array(10).fill(null).map(() => ({
    id: `MATCH-${Math.random().toString(36).substr(2, 9)}`,
    type: Object.keys(MATCH_TYPES)[
      Math.floor(Math.random() * Object.keys(MATCH_TYPES).length)
    ],
    players: Math.floor(Math.random() * 10) + 2,
    avgSkillRating: Math.floor(Math.random() * 1000)
  }));
};

const MultiplayerSocialDashboard = () => {
  // State Management
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('ONLINE');
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Initialize Multiplayer Environment
  useEffect(() => {
    // Generate initial player and match data
    const initialPlayers = generatePlayers();
    const initialMatches = generateMatches();
    
    setPlayers(initialPlayers);
    setMatches(initialMatches);

    // Create user profile
    setUserProfile({
      id: `USER-${Math.random().toString(36).substr(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      status: 'ONLINE',
      rank: Math.floor(Math.random() * 500),
      skills: {
        tactical: Math.floor(Math.random() * 100),
        technical: Math.floor(Math.random() * 100),
        teamwork: Math.floor(Math.random() * 100)
      }
    });
  }, []);

  // Send Chat Message
  const sendChatMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: `MSG-${Math.random().toString(36).substr(2, 9)}`,
        sender: userProfile.name,
        text: newMessage,
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  // Update User Status
  const updateUserStatus = (status) => {
    setSelectedStatus(status);
    setUserProfile(prev => ({
      ...prev,
      status: status
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Multiplayer Social Dashboard
      </h1>

      {/* User Profile */}
      {userProfile && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-xl">{userProfile.name}</h2>
              <p>Rank: {userProfile.rank}</p>
            </div>
            
            {/* Status Selection */}
            <div>
              <h3 className="font-semibold mb-2">Set Status</h3>
              <div className="flex space-x-2">
                {Object.entries(PLAYER_STATUS).map(([key, status]) => (
                  <button
                    key={key}
                    onClick={() => updateUserStatus(key)}
                    className={`
                      p-2 rounded 
                      ${selectedStatus === key 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white border'}
                    `}
                  >
                    {status.icon} {status.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Overview */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Skills</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(userProfile.skills).map(([skill, value]) => (
                <div key={skill}>
                  <p className="capitalize">{skill}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{width: `${value}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Matches */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Active Matches</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => {
            const matchType = MATCH_TYPES[match.type];
            return (
              <div 
                key={match.id} 
                className="bg-white border rounded p-4 shadow-md"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{matchType.icon}</span>
                  <h3 className="font-bold">{matchType.name}</h3>
                </div>
                <p>{matchType.description}</p>
                <div className="mt-2 flex justify-between">
                  <span>Players: {match.players}</span>
                  <span>Avg Skill: {match.avgSkillRating}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Online Players */}
      <div className="mb-4">
        <h2 className="font-bold text-xl mb-2">Online Players</h2>
        <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-4">
          {players.map((player) => {
            const playerStatus = PLAYER_STATUS[player.status];
            return (
              <div 
                key={player.id} 
                className="bg-white border rounded p-4 shadow-md"
              >
                <div className="flex items-center mb-2">
                  <span className={`mr-2 ${playerStatus.color}`}>
                    {playerStatus.icon}
                  </span>
                  <h3 className="font-bold">{player.name}</h3>
                </div>
                <p>Rank: {player.rank}</p>
                <div className="mt-2">
                  <p>Tactical: {player.skills.tactical}</p>
                  <p>Technical: {player.skills.technical}</p>
                  <p>Teamwork: {player.skills.teamwork}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat System */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold text-xl mb-2">Global Chat</h2>
        <div className="h-64 overflow-y-auto mb-4 border p-2 bg-white">
          {chatMessages.map((message) => (
            <div 
              key={message.id} 
              className="mb-2 p-2 bg-gray-50 rounded"
            >
              <div className="flex justify-between">
                <span className="font-bold">{message.sender}</span>
                <span className="text-sm text-gray-500">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="flex">
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border rounded-l"
            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
          />
          <button
            onClick={sendChatMessage}
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerSocialDashboard;

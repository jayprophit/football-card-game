import React, { useState } from 'react';
import { Team, Formation, Player } from '../models/GameModels';

interface TeamSetupProps {
  team: Team;
  isHome: boolean;
  onUpdateTeam: (team: Team, isHome: boolean) => void;
  onPlayerImageUpload: (player: Player, isHome: boolean) => void;
}

const TeamSetup: React.FC<TeamSetupProps> = ({
  team,
  isHome,
  onUpdateTeam,
  onPlayerImageUpload
}) => {
  const [teamName, setTeamName] = useState<string>(team.name);
  const [primaryColor, setPrimaryColor] = useState<string>(team.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(team.secondaryColor);
  const [formation, setFormation] = useState<Formation>(team.formation);
  
  // Available formations
  const formations: { label: string, value: Formation }[] = [
    { label: '4-4-2', value: [4, 4, 2] },
    { label: '4-3-3', value: [4, 3, 3] },
    { label: '3-5-2', value: [3, 5, 2] },
    { label: '4-2-3-1', value: [4, 5, 1] },
    { label: '5-3-2', value: [5, 3, 2] },
  ];
  
  // Handle team updates
  const handleUpdateTeam = () => {
    const updatedTeam = { ...team };
    updatedTeam.name = teamName;
    updatedTeam.primaryColor = primaryColor;
    updatedTeam.secondaryColor = secondaryColor;
    updatedTeam.formation = formation;
    
    onUpdateTeam(updatedTeam, isHome);
  };
  
  // When any team property changes, update the team
  React.useEffect(() => {
    handleUpdateTeam();
  }, [teamName, primaryColor, secondaryColor, formation]);
  
  return (
    <div className="team-setup" style={{ borderColor: primaryColor }}>
      <h2>{isHome ? 'Home Team' : 'Away Team'}</h2>
      
      <div className="team-settings">
        <div className="setting">
          <label>Team Name:</label>
          <input 
            type="text" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
          />
        </div>
        
        <div className="setting">
          <label>Primary Color:</label>
          <input 
            type="color" 
            value={primaryColor} 
            onChange={(e) => setPrimaryColor(e.target.value)} 
          />
        </div>
        
        <div className="setting">
          <label>Secondary Color:</label>
          <input 
            type="color" 
            value={secondaryColor} 
            onChange={(e) => setSecondaryColor(e.target.value)} 
          />
        </div>
        
        <div className="setting">
          <label>Formation:</label>
          <select 
            value={formations.findIndex(f => 
              f.value[0] === formation[0] && 
              f.value[1] === formation[1] && 
              f.value[2] === formation[2]
            )}
            onChange={(e) => setFormation(formations[parseInt(e.target.value)].value)}
          >
            {formations.map((f, index) => (
              <option key={index} value={index}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="team-players">
        <h3>Players</h3>
        <div className="players-grid">
          {team.players.map((player) => (
            <div key={player.id} className="player-item">
              <div className="player-avatar">
                {player.avatarUrl ? (
                  <img src={player.avatarUrl} alt={player.name} />
                ) : (
                  <div 
                    className="avatar-placeholder"
                    style={{ backgroundColor: team.secondaryColor, color: team.primaryColor }}
                  >
                    {player.name.substring(0, 1)}
                  </div>
                )}
                <button 
                  className="upload-btn"
                  onClick={() => onPlayerImageUpload(player, isHome)}
                >
                  📷
                </button>
              </div>
              <div className="player-info">
                <input 
                  type="text" 
                  value={player.name} 
                  onChange={(e) => {
                    player.name = e.target.value;
                    handleUpdateTeam();
                  }}
                />
                <div className="player-position">{player.position}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamSetup;

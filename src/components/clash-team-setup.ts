import React, { useState } from 'react';
import { Team, Formation, Player, Position } from '../models/GameModels';

interface ClashTeamSetupProps {
  team: Team;
  isHome: boolean;
  onUpdateTeam: (team: Team, isHome: boolean) => void;
  onPlayerImageUpload: (player: Player, isHome: boolean) => void;
}

const ClashTeamSetup: React.FC<ClashTeamSetupProps> = ({
  team,
  isHome,
  onUpdateTeam,
  onPlayerImageUpload
}) => {
  const [teamName, setTeamName] = useState<string>(team.name);
  const [primaryColor, setPrimaryColor] = useState<string>(team.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(team.secondaryColor);
  const [formation, setFormation] = useState<Formation>(team.formation);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [activeColorType, setActiveColorType] = useState<'primary' | 'secondary'>('primary');
  const [showFormationSelector, setShowFormationSelector] = useState<boolean>(false);
  
  // Available formations
  const formations: { label: string, value: Formation }[] = [
    { label: '4-4-2', value: [4, 4, 2] },
    { label: '4-3-3', value: [4, 3, 3] },
    { label: '3-5-2', value: [3, 5, 2] },
    { label: '4-2-3-1', value: [4, 5, 1] },
    { label: '5-3-2', value: [5, 3, 2] },
  ];
  
  // Predefined colors for Clash style
  const presetColors = [
    '#f44336', // Red
    '#e91e63', // Pink
    '#9c27b0', // Purple
    '#673ab7', // Deep Purple
    '#3f51b5', // Indigo
    '#2196f3', // Blue
    '#03a9f4', // Light Blue
    '#00bcd4', // Cyan
    '#009688', // Teal
    '#4caf50', // Green
    '#8bc34a', // Light Green
    '#cddc39', // Lime
    '#ffeb3b', // Yellow
    '#ffc107', // Amber
    '#ff9800', // Orange
    '#ff5722', // Deep Orange
    '#795548', // Brown
    '#607d8b', // Blue Grey
    '#000000', // Black
    '#ffffff', // White
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
  
  // Toggle color picker
  const handleToggleColorPicker = (type: 'primary' | 'secondary') => {
    setActiveColorType(type);
    setShowColorPicker(!showColorPicker);
    setShowFormationSelector(false);
  };
  
  // Toggle formation selector
  const handleToggleFormationSelector = () => {
    setShowFormationSelector(!showFormationSelector);
    setShowColorPicker(false);
  };
  
  // Handle color selection
  const handleColorSelect = (color: string) => {
    if (activeColorType === 'primary') {
      setPrimaryColor(color);
    } else {
      setSecondaryColor(color);
    }
    setShowColorPicker(false);
  };
  
  // Handle formation selection
  const handleFormationSelect = (formation: Formation) => {
    setFormation(formation);
    setShowFormationSelector(false);
  };
  
  // Group players by position type
  const groupPlayersByPositionType = () => {
    const groups = {
      goalkeepers: team.players.filter(p => p.position === Position.GK),
      defenders: team.players.filter(p => 
        p.position === Position.CB || 
        p.position === Position.LB || 
        p.position === Position.RB
      ),
      midfielders: team.players.filter(p => 
        p.position === Position.CM || 
        p.position === Position.CDM || 
        p.position === Position.CAM || 
        p.position === Position.LM || 
        p.position === Position.RM
      ),
      forwards: team.players.filter(p => 
        p.position === Position.ST || 
        p.position === Position.CF || 
        p.position === Position.LW || 
        p.position === Position.RW
      )
    };
    
    return groups;
  };
  
  // Get position group label
  const getPositionGroupLabel = (position: Position): string => {
    if (position === Position.GK) return 'GK';
    if ([Position.CB, Position.LB, Position.RB].includes(position)) return 'DEF';
    if ([Position.CM, Position.CDM, Position.CAM, Position.LM, Position.RM].includes(position)) return 'MID';
    return 'FWD';
  };
  
  // Calculate player level based on stats
  const calculatePlayerLevel = (player: Player): number => {
    const stats = player.stats;
    const avgStat = (
      stats.pace + 
      stats.shooting + 
      stats.passing + 
      stats.dribbling + 
      stats.defending + 
      stats.physical
    ) / 6;
    
    return Math.floor(avgStat / 10) + 1; // Level 1-10 based on stats
  };
  
  // Render color picker
  const renderColorPicker = () => {
    if (!showColorPicker) return null;
    
    return (
      <div className="clash-color-picker">
        <div className="clash-color-picker-header">
          Select {activeColorType} color
        </div>
        <div className="clash-color-grid">
          {presetColors.map((color, index) => (
            <div 
              key={index}
              className="clash-color-option"
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            >
              {(activeColorType === 'primary' && color === primaryColor) || 
               (activeColorType === 'secondary' && color === secondaryColor) ? (
                <div className="clash-color-selected">✓</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render formation selector
  const renderFormationSelector = () => {
    if (!showFormationSelector) return null;
    
    return (
      <div className="clash-formation-selector">
        <div className="clash-formation-header">
          Select Formation
        </div>
        <div className="clash-formation-options">
          {formations.map((form, index) => {
            const isSelected = form.value[0] === formation[0] && 
                           form.value[1] === formation[1] && 
                           form.value[2] === formation[2];
            
            return (
              <div 
                key={index}
                className={`clash-formation-option ${isSelected ? 'clash-selected' : ''}`}
                onClick={() => handleFormationSelect(form.value)}
              >
                <div className="clash-formation-name">{form.label}</div>
                <div className="clash-formation-display">
                  <div className="clash-formation-row">{form.value[0] + ' DEF'}</div>
                  <div className="clash-formation-row">{form.value[1] + ' MID'}</div>
                  <div className="clash-formation-row">{form.value[2] + ' FWD'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  const playerGroups = groupPlayersByPositionType();
  
  return (
    <div className="clash-team-setup" style={{ borderColor: primaryColor }}>
      <div className="clash-team-header" style={{ backgroundColor: primaryColor }}>
        <div className="clash-team-badge" style={{ backgroundColor: secondaryColor }}>
          {teamName.charAt(0)}
        </div>
        <div className="clash-team-name-input">
          <input 
            type="text" 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            placeholder="Team Name"
          />
        </div>
      </div>
      
      <div className="clash-team-settings">
        <div className="clash-setting-group">
          <div className="clash-setting-label">Team Colors</div>
          <div className="clash-color-settings">
            <button 
              className="clash-color-btn" 
              style={{ backgroundColor: primaryColor }}
              onClick={() => handleToggleColorPicker('primary')}
            >
              Primary
            </button>
            <button 
              className="clash-color-btn" 
              style={{ backgroundColor: secondaryColor }}
              onClick={() => handleToggleColorPicker('secondary')}
            >
              Secondary
            </button>
          </div>
        </div>
        
        <div className="clash-setting-group">
          <div className="clash-setting-label">Formation</div>
          <button 
            className="clash-formation-btn"
            onClick={handleToggleFormationSelector}
          >
            {`${formation[0]}-${formation[1]}-${formation[2]}`}
          </button>
        </div>
        
        {renderColorPicker()}
        {renderFormationSelector()}
      </div>
      
      <div className="clash-player-roster">
        <div className="clash-roster-header">Team Roster</div>
        
        {/* Goalkeepers */}
        <div className="clash-position-group">
          <div className="clash-position-header">Goalkeepers</div>
          <div className="clash-players-grid">
            {playerGroups.goalkeepers.map((player) => (
              <div key={player.id} className="clash-player-card">
                <div 
                  className="clash-player-avatar"
                  onClick={() => onPlayerImageUpload(player, isHome)}
                  style={{ 
                    backgroundColor: player.team.secondaryColor,
                    borderColor: player.team.primaryColor
                  }}
                >
                  {player.avatarUrl ? (
                    <img src={player.avatarUrl} alt={player.name} />
                  ) : (
                    <span>{player.name.charAt(0)}</span>
                  )}
                  <div className="clash-card-level">{calculatePlayerLevel(player)}</div>
                </div>
                <div className="clash-player-details">
                  <input 
                    type="text" 
                    value={player.name} 
                    onChange={(e) => {
                      player.name = e.target.value;
                      handleUpdateTeam();
                    }}
                    className="clash-player-name"
                  />
                  <div className="clash-player-position">
                    <span className="clash-position-badge">GK</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Other position groups */}
        {['defenders', 'midfielders', 'forwards'].map((group) => (
          <div key={group} className="clash-position-group">
            <div className="clash-position-header">
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </div>
            <div className="clash-players-grid">
              {playerGroups[group as keyof typeof playerGroups].map((player) => (
                <div key={player.id} className="clash-player-card">
                  <div 
                    className="clash-player-avatar"
                    onClick={() => onPlayerImageUpload(player, isHome)}
                    style={{ 
                      backgroundColor: player.team.secondaryColor,
                      borderColor: player.team.primaryColor
                    }}
                  >
                    {player.avatarUrl ? (
                      <img src={player.avatarUrl} alt={player.name} />
                    ) : (
                      <span>{player.name.charAt(0)}</span>
                    )}
                    <div className="clash-card-level">{calculatePlayerLevel(player)}</div>
                  </div>
                  <div className="clash-player-details">
                    <input 
                      type="text" 
                      value={player.name} 
                      onChange={(e) => {
                        player.name = e.target.value;
                        handleUpdateTeam();
                      }}
                      className="clash-player-name"
                    />
                    <div className="clash-player-position">
                      <span className="clash-position-badge">
                        {getPositionGroupLabel(player.position)}
                      </span>
                      <span className="clash-position-name">
                        {player.position.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClashTeamSetup;

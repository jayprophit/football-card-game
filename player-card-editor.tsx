import React, { useState } from 'react';

const PlayerCardEditor = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [position, setPosition] = useState('ST');
  const [teamColors, setTeamColors] = useState({
    primary: '#1565C0',
    secondary: '#BBDEFB'
  });
  const [attributes, setAttributes] = useState({
    pace: 70,
    shooting: 70,
    passing: 70,
    dribbling: 70,
    defending: 70,
    physical: 70
  });
  const [movementPattern, setMovementPattern] = useState('rook');
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // Available positions
  const positions = [
    { value: 'GK', label: 'Goalkeeper', movement: 'king' },
    { value: 'CB', label: 'Center Back', movement: 'rook' },
    { value: 'LB', label: 'Left Back', movement: 'bishop' },
    { value: 'RB', label: 'Right Back', movement: 'bishop' },
    { value: 'CDM', label: 'Defensive Midfielder', movement: 'knight' },
    { value: 'CM', label: 'Central Midfielder', movement: 'queen' },
    { value: 'CAM', label: 'Attacking Midfielder', movement: 'queen' },
    { value: 'LM', label: 'Left Midfielder', movement: 'knight' },
    { value: 'RM', label: 'Right Midfielder', movement: 'knight' },
    { value: 'LW', label: 'Left Winger', movement: 'knight' },
    { value: 'RW', label: 'Right Winger', movement: 'knight' },
    { value: 'ST', label: 'Striker', movement: 'rook' },
    { value: 'CF', label: 'Center Forward', movement: 'rook' }
  ];
  
  // Movement patterns explanation
  const movementPatterns = {
    king: "Moves 1 square in any direction (goalkeeper special ability: can move 2 squares when saving)",
    queen: "Moves up to 2 squares in any direction (horizontal, vertical, diagonal)",
    rook: "Moves up to 3-4 squares horizontally and vertically",
    bishop: "Moves up to 3 squares diagonally (fullbacks also get 1 horizontal move)",
    knight: "Moves in L-shapes (2+1 pattern, can jump over other players)"
  };
  
  // Calculate overall rating based on attributes and position
  const calculateOverall = () => {
    const weights = {
      GK: { pace: 0.2, shooting: 0, passing: 0.2, dribbling: 0.1, defending: 0.8, physical: 0.7 },
      CB: { pace: 0.3, shooting: 0.1, passing: 0.3, dribbling: 0.2, defending: 0.9, physical: 0.8 },
      LB: { pace: 0.7, shooting: 0.2, passing: 0.5, dribbling: 0.5, defending: 0.7, physical: 0.6 },
      RB: { pace: 0.7, shooting: 0.2, passing: 0.5, dribbling: 0.5, defending: 0.7, physical: 0.6 },
      CDM: { pace: 0.5, shooting: 0.3, passing: 0.7, dribbling: 0.5, defending: 0.8, physical: 0.7 },
      CM: { pace: 0.5, shooting: 0.5, passing: 0.9, dribbling: 0.7, defending: 0.5, physical: 0.6 },
      CAM: { pace: 0.6, shooting: 0.7, passing: 0.9, dribbling: 0.8, defending: 0.3, physical: 0.5 },
      LM: { pace: 0.8, shooting: 0.5, passing: 0.7, dribbling: 0.7, defending: 0.4, physical: 0.5 },
      RM: { pace: 0.8, shooting: 0.5, passing: 0.7, dribbling: 0.7, defending: 0.4, physical: 0.5 },
      LW: { pace: 0.9, shooting: 0.8, passing: 0.6, dribbling: 0.9, defending: 0.2, physical: 0.5 },
      RW: { pace: 0.9, shooting: 0.8, passing: 0.6, dribbling: 0.9, defending: 0.2, physical: 0.5 },
      ST: { pace: 0.8, shooting: 0.9, passing: 0.4, dribbling: 0.7, defending: 0.1, physical: 0.8 },
      CF: { pace: 0.7, shooting: 0.8, passing: 0.6, dribbling: 0.8, defending: 0.2, physical: 0.7 }
    };
    
    const posWeights = weights[position];
    let overall = 0;
    
    if (posWeights) {
      overall = (
        attributes.pace * posWeights.pace +
        attributes.shooting * posWeights.shooting +
        attributes.passing * posWeights.passing +
        attributes.dribbling * posWeights.dribbling +
        attributes.defending * posWeights.defending +
        attributes.physical * posWeights.physical
      ) / Object.values(posWeights).reduce((a, b) => a + b, 0);
    } else {
      // Default calculation if position not found
      overall = Object.values(attributes).reduce((a, b) => a + b, 0) / Object.values(attributes).length;
    }
    
    return Math.round(overall);
  };
  
  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle attribute change
  const handleAttributeChange = (attr, value) => {
    setAttributes(prev => ({
      ...prev,
      [attr]: parseInt(value)
    }));
  };
  
  // Handle position change
  const handlePositionChange = (e) => {
    const pos = e.target.value;
    setPosition(pos);
    
    // Update movement pattern based on position
    const positionData = positions.find(p => p.value === pos);
    if (positionData) {
      setMovementPattern(positionData.movement);
    }
  };
  
  // Handle team color change
  const handleColorChange = (type, color) => {
    setTeamColors(prev => ({
      ...prev,
      [type]: color
    }));
  };
  
  // Reset form
  const handleReset = () => {
    setPlayerName('');
    setPlayerNumber('');
    setPosition('ST');
    setTeamColors({
      primary: '#1565C0',
      secondary: '#BBDEFB'
    });
    setAttributes({
      pace: 70,
      shooting: 70,
      passing: 70,
      dribbling: 70,
      defending: 70,
      physical: 70
    });
    setMovementPattern('rook');
    setPhotoPreview(null);
  };
  
  // Save card
  const handleSave = () => {
    // In a real implementation, this would save the card to the user's collection
    alert('Player card saved to your collection!');
  };
  
  return (
    <div className="player-card-editor">
      <h2>Custom Player Card Creator</h2>
      
      <div className="editor-container">
        <div className="editor-form">
          <div className="form-section">
            <h3>Player Information</h3>
            <div className="form-group">
              <label htmlFor="playerName">Player Name</label>
              <input
                type="text"
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name"
                maxLength="20"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="playerNumber">Player Number</label>
              <input
                type="number"
                id="playerNumber"
                value={playerNumber}
                onChange={(e) => setPlayerNumber(e.target.value)}
                placeholder="1-99"
                min="1"
                max="99"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="position">Position</label>
              <select
                id="position"
                value={position}
                onChange={handlePositionChange}
              >
                {positions.map(pos => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label} ({pos.value})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Player Attributes</h3>
            {Object.entries(attributes).map(([attr, value]) => (
              <div className="attribute-slider" key={attr}>
                <label htmlFor={attr}>
                  {attr.charAt(0).toUpperCase() + attr.slice(1)}
                </label>
                <input
                  type="range"
                  id={attr}
                  min="1"
                  max="99"
                  value={value}
                  onChange={(e) => handleAttributeChange(attr, e.target.value)}
                />
                <span className="attribute-value">{value}</span>
              </div>
            ))}
          </div>
          
          <div className="form-section">
            <h3>Card Appearance</h3>
            <div className="form-group">
              <label htmlFor="primaryColor">Primary Color</label>
              <input
                type="color"
                id="primaryColor"
                value={teamColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="secondaryColor">Secondary Color</label>
              <input
                type="color"
                id="secondaryColor"
                value={teamColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="playerPhoto">Player Photo</label>
              <input
                type="file"
                id="playerPhoto"
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <small>Upload your own photo to create a custom player card</small>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="btn reset" onClick={handleReset}>Reset</button>
            <button className="btn save" onClick={handleSave}>Save Card</button>
          </div>
        </div>
        
        <div className="card-preview">
          <h3>Card Preview</h3>
          <div className="player-card" style={{backgroundColor: teamColors.primary}}>
            <div className="card-header" style={{backgroundColor: teamColors.secondary}}>
              <div className="position-badge">{position}</div>
              <div className="rating-badge">{calculateOverall()}</div>
            </div>
            
            <div className="player-image">
              {photoPreview ? (
                <img src={photoPreview} alt="Player" />
              ) : (
                <div className="photo-placeholder">
                  <span>TAP TO ADD PHOTO</span>
                </div>
              )}
            </div>
            
            <div className="player-info">
              <div className="player-name">{playerName || "PLAYER NAME"}</div>
              <div className="player-number">{playerNumber || "#"}</div>
            </div>
            
            <div className="player-attributes">
              <div className="attribute">
                <span className="attribute-label">PAC</span>
                <span className="attribute-value">{attributes.pace}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">SHO</span>
                <span className="attribute-value">{attributes.shooting}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">PAS</span>
                <span className="attribute-value">{attributes.passing}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">DRI</span>
                <span className="attribute-value">{attributes.dribbling}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">DEF</span>
                <span className="attribute-value">{attributes.defending}</span>
              </div>
              <div className="attribute">
                <span className="attribute-label">PHY</span>
                <span className="attribute-value">{attributes.physical}</span>
              </div>
            </div>
            
            <div className="movement-pattern">
              <div className="pattern-label">Movement Pattern:</div>
              <div className="pattern-value">{movementPattern.toUpperCase()}</div>
              <div className="pattern-description">{movementPatterns[movementPattern]}</div>
            </div>
          </div>
          
          <div className="movement-visualization">
            <h4>Movement Visualization</h4>
            <div className="mini-grid">
              {/* Simple grid showing movement pattern */}
              {Array(5).fill().map((_, row) => (
                <div key={`row-${row}`} className="grid-row">
                  {Array(5).fill().map((_, col) => {
                    const isCenter = row === 2 && col === 2;
                    let isMovable = false;
                    
                    // Determine movable squares based on pattern
                    if (movementPattern === 'king') {
                      isMovable = Math.abs(row-2) <= 1 && Math.abs(col-2) <= 1 && !isCenter;
                    } else if (movementPattern === 'queen') {
                      const distance = Math.max(Math.abs(row-2), Math.abs(col-2));
                      isMovable = distance <= 2 && distance > 0;
                    } else if (movementPattern === 'rook') {
                      isMovable = (row === 2 || col === 2) && !isCenter && 
                                 Math.abs(row-2) <= 3 && Math.abs(col-2) <= 3;
                    } else if (movementPattern === 'bishop') {
                      isMovable = Math.abs(row-2) === Math.abs(col-2) && !isCenter &&
                                 Math.abs(row-2) <= 3;
                    } else if (movementPattern === 'knight') {
                      isMovable = (Math.abs(row-2) === 2 && Math.abs(col-2) === 1) || 
                                 (Math.abs(row-2) === 1 && Math.abs(col-2) === 2);
                    }
                    
                    return (
                      <div 
                        key={`cell-${row}-${col}`} 
                        className={`grid-cell ${isCenter ? 'center' : ''} ${isMovable ? 'movable' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .player-card-editor {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        h2 {
          text-align: center;
          color: #1976d2;
          margin-bottom: 30px;
        }
        
        .editor-container {
          display: flex;
          gap: 30px;
        }
        
        .editor-form {
          flex: 1;
        }
        
        .form-section {
          background-color: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 15px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 10px;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #555;
        }
        
        input[type="text"],
        input[type="number"],
        select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .attribute-slider {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .attribute-slider label {
          width: 100px;
          margin-bottom: 0;
        }
        
        input[type="range"] {
          flex: 1;
          margin: 0 10px;
        }
        
        .attribute-value {
          width: 30px;
          text-align: right;
          font-weight: 600;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .btn.reset {
          background-color: #e0e0e0;
          color: #333;
        }
        
        .btn.save {
          background-color: #4caf50;
          color: white;
        }
        
        .btn.reset:hover {
          background-color: #d0d0d0;
        }
        
        .btn.save:hover {
          background-color: #43a047;
        }
        
        .card-preview {
          width: 350px;
        }
        
        .player-card {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          margin-bottom: 20px;
        }
        
        .card-header {
          padding: 10px;
          position: relative;
          height: 40px;
        }
        
        .position-badge, .rating-badge {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: #ffc107;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          position: absolute;
          top: 10px;
        }
        
        .position-badge {
          left: 10px;
        }
        
        .rating-badge {
          right: 10px;
          font-size: 18px;
        }
        
        .player-image {
          height: 200px;
          background-color: #f0f0f0;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .player-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .photo-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #e0e0e0;
          color: #666;
          font-weight: bold;
          text-align: center;
        }
        
        .player-info {
          padding: 15px;
          text-align: center;
          color: white;
        }
        
        .player-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .player-number {
          font-size: 16px;
        }
        
        .player-attributes {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          padding: 10px;
          background-color: rgba(255,255,255,0.1);
        }
        
        .attribute {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          color: white;
        }
        
        .attribute-label {
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .movement-pattern {
          padding: 15px;
          background-color: rgba(0,0,0,0.1);
          color: white;
          font-size: 12px;
        }
        
        .pattern-label {
          font-weight: bold;
          margin-bottom: 4px;
        }
        
        .pattern-value {
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .pattern-description {
          font-style: italic;
          line-height: 1.4;
        }
        
        .movement-visualization {
          background-color: white;
          border-radius: 8px;
          padding: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        h4 {
          margin-top: 0;
          margin-bottom: 15px;
          color: #333;
        }
        
        .mini-grid {
          width: 100%;
          margin: 0 auto;
        }
        
        .grid-row {
          display: flex;
        }
        
        .grid-cell {
          width: 30px;
          height: 30px;
          border: 1px solid #ccc;
          box-sizing: border-box;
        }
        
        .grid-cell.center {
          background-color: #1976d2;
        }
        
        .grid-cell.movable {
          background-color: #bbdefb;
        }
        
        @media (max-width: 768px) {
          .editor-container {
            flex-direction: column;
          }
          
          .card-preview {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default PlayerCardEditor;

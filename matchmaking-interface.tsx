import React, { useState, useEffect } from 'react';

const MatchmakingInterface = () => {
  const [matchmakingState, setMatchmakingState] = useState('initial'); // initial, searching, found
  const [searchTime, setSearchTime] = useState(0);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(32);
  const [matchSettings, setMatchSettings] = useState({
    region: 'europe',
    mode: 'ranked',
    timeControl: '3min'
  });
  const [playerElo, setPlayerElo] = useState(1245);
  
  // Regions with ping times
  const regions = [
    { id: 'europe', name: 'Europe', ping: 15 },
    { id: 'namerica', name: 'North America', ping: 80 },
    { id: 'asia', name: 'Asia', ping: 150 },
    { id: 'samerica', name: 'South America', ping: 120 },
    { id: 'oceania', name: 'Oceania', ping: 200 }
  ];
  
  // Game modes
  const gameModes = [
    { id: 'ranked', name: 'Ranked' },
    { id: 'casual', name: 'Casual' },
    { id: 'tournament', name: 'Tournament', locked: true }
  ];
  
  // Time control options
  const timeControls = [
    { id: '1min', name: '1 Min Per Turn' },
    { id: '3min', name: '3 Min Per Turn' },
    { id: '5min', name: '5 Min Per Turn' },
    { id: 'unlimited', name: 'Unlimited' }
  ];
  
  // Recent players
  const recentPlayers = [
    { id: 1, name: 'FootballKing92', elo: 1398, initials: 'JD', color: '#E53935' },
    { id: 2, name: 'SoccerTactician', elo: 1289, initials: 'MS', color: '#43A047' },
    { id: 3, name: 'MidnightStriker', elo: 1175, initials: 'AK', color: '#FFC107' }
  ];
  
  // Daily stats
  const dailyStats = {
    matches: 12,
    wins: 8,
    losses: 4,
    winRate: 67
  };
  
  // Start searching for a match
  const startMatchmaking = () => {
    setMatchmakingState('searching');
    setSearchTime(0);
    
    // Simulate finding a match after a random period
    const matchTimer = setTimeout(() => {
      setMatchmakingState('found');
    }, Math.random() * 5000 + 5000); // 5-10 seconds
    
    // Clean up on unmount
    return () => clearTimeout(matchTimer);
  };
  
  // Cancel matchmaking
  const cancelMatchmaking = () => {
    setMatchmakingState('initial');
    setSearchTime(0);
  };
  
  // Update search timer
  useEffect(() => {
    let interval;
    
    if (matchmakingState === 'searching') {
      interval = setInterval(() => {
        setSearchTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [matchmakingState]);
  
  // Update region setting
  const handleRegionChange = (regionId) => {
    setMatchSettings(prev => ({
      ...prev,
      region: regionId
    }));
  };
  
  // Update game mode setting
  const handleModeChange = (modeId) => {
    const mode = gameModes.find(m => m.id === modeId);
    if (mode && !mode.locked) {
      setMatchSettings(prev => ({
        ...prev,
        mode: modeId
      }));
    }
  };
  
  // Update time control setting
  const handleTimeControlChange = (timeControlId) => {
    setMatchSettings(prev => ({
      ...prev,
      timeControl: timeControlId
    }));
  };
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Accept match
  const acceptMatch = () => {
    alert('Match accepted! Proceeding to game setup...');
    // This would redirect to the game setup screen in a real app
  };
  
  return (
    <div className="matchmaking-interface">
      <div className="matchmaking-header">
        <h2>ONLINE MATCHMAKING</h2>
        <div className="player-rank">
          <div className="rank-badge">
            <span>★</span>
          </div>
          <span className="rank-name">SILVER II</span>
        </div>
      </div>
      
      <div className="matchmaking-content">
        <div className="options-panel">
          <div className="panel-section">
            <h3>MATCH OPTIONS</h3>
            
            <div className="option-group">
              <label>Region:</label>
              <div className="option-selector">
                {regions.map(region => (
                  <button
                    key={region.id}
                    className={`option-button ${matchSettings.region === region.id ? 'active' : ''}`}
                    onClick={() => handleRegionChange(region.id)}
                  >
                    {region.name}
                    <span className="ping-indicator">
                      {region.ping}ms
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="option-group">
              <label>Mode:</label>
              <div className="option-selector">
                {gameModes.map(mode => (
                  <button
                    key={mode.id}
                    className={`option-button ${matchSettings.mode === mode.id ? 'active' : ''} ${mode.locked ? 'locked' : ''}`}
                    onClick={() => handleModeChange(mode.id)}
                    disabled={mode.locked}
                  >
                    {mode.name}
                    {mode.locked && <span className="lock-icon">🔒</span>}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="option-group">
              <label>Time Control:</label>
              <div className="option-selector">
                {timeControls.map(timeControl => (
                  <button
                    key={timeControl.id}
                    className={`option-button ${matchSettings.timeControl === timeControl.id ? 'active' : ''}`}
                    onClick={() => handleTimeControlChange(timeControl.id)}
                  >
                    {timeControl.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="panel-section">
            <h3>RECENT PLAYERS</h3>
            <div className="recent-players-list">
              {recentPlayers.map(player => (
                <div key={player.id} className="player-card">
                  <div className="player-avatar" style={{ backgroundColor: player.color }}>
                    {player.initials}
                  </div>
                  <div className="player-info">
                    <div className="player-name">{player.name}</div>
                    <div className="player-elo">{player.elo} ELO</div>
                  </div>
                  <button className="challenge-button">Challenge</button>
                </div>
              ))}
            </div>
            <button className="friends-button">
              All Friends
            </button>
          </div>
        </div>
        
        <div className="matchmaking-visual">
          {matchmakingState === 'initial' ? (
            <>
              <div className="player-profile">
                <div className="profile-circle">
                  <div className="avatar">YOU</div>
                  <div className="elo">{playerElo} ELO</div>
                </div>
              </div>
              <button className="find-match-button" onClick={startMatchmaking}>
                FIND MATCH
              </button>
              <div className="matchmaking-stats">
                <div className="stat-row">
                  <span>Today's matches:</span>
                  <span>{dailyStats.matches}</span>
                </div>
                <div className="stat-row">
                  <span>Wins:</span>
                  <span>{dailyStats.wins}</span>
                </div>
                <div className="stat-row">
                  <span>Losses:</span>
                  <span>{dailyStats.losses}</span>
                </div>
                <div className="stat-row">
                  <span>Win rate:</span>
                  <span>{dailyStats.winRate}%</span>
                </div>
              </div>
            </>
          ) : matchmakingState === 'searching' ? (
            <>
              <div className="searching-animation">
                <div className="player-profile searching">
                  <div className="search-rings">
                    <div className="ring ring1"></div>
                    <div className="ring ring2"></div>
                    <div className="ring ring3"></div>
                  </div>
                  <div className="profile-circle">
                    <div className="avatar">YOU</div>
                    <div className="elo">{playerElo} ELO</div>
                  </div>
                </div>
                <div className="searching-text">
                  <h3>SEARCHING FOR OPPONENT</h3>
                  <div className="waiting-dots">
                    <span className="dot dot1">.</span>
                    <span className="dot dot2">.</span>
                    <span className="dot dot3">.</span>
                  </div>
                </div>
                <div className="search-info">
                  <div>Search time: {formatTime(searchTime)}</div>
                  <div>Estimated wait: {formatTime(estimatedWaitTime)}</div>
                </div>
                <button className="cancel-button" onClick={cancelMatchmaking}>
                  CANCEL
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="match-found-container">
                <h3>MATCH FOUND!</h3>
                <div className="players-matched">
                  <div className="player-card">
                    <div className="player-avatar">YOU</div>
                    <div className="player-info">
                      <div className="player-name">Your Team</div>
                      <div className="player-elo">{playerElo} ELO</div>
                    </div>
                  </div>
                  <div className="vs-indicator">VS</div>
                  <div className="player-card">
                    <div className="player-avatar" style={{ backgroundColor: '#2196F3' }}>OP</div>
                    <div className="player-info">
                      <div className="player-name">TacticalGenius</div>
                      <div className="player-elo">1263 ELO</div>
                    </div>
                  </div>
                </div>
                <div className="accept-match-container">
                  <div className="accept-countdown">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#4CAF50" strokeWidth="8"
                              strokeDasharray="283" strokeDashoffset="70" />
                    </svg>
                    <span className="countdown-number">15</span>
                  </div>
                  <button className="accept-button" onClick={acceptMatch}>
                    ACCEPT
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .matchmaking-interface {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          background-color: #1A237E;
          background: linear-gradient(to bottom, #0D47A1, #1A237E);
          color: white;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          overflow: hidden;
        }
        
        .matchmaking-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(0,0,0,0.3);
        }
        
        h2, h3 {
          margin: 0;
        }
        
        .player-rank {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(0,0,0,0.5);
          padding: 8px 15px;
          border-radius: 20px;
        }
        
        .rank-badge {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          background-color: #FFC107;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000;
          font-weight: bold;
        }
        
        .rank-name {
          font-weight: bold;
        }
        
        .matchmaking-content {
          display: flex;
          padding: 30px;
          gap: 30px;
        }
        
        .options-panel {
          width: 350px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .panel-section {
          background-color: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 20px;
        }
        
        .panel-section h3 {
          margin-bottom: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          padding-bottom: 10px;
        }
        
        .option-group {
          margin-bottom: 20px;
        }
        
        .option-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: bold;
          color: #BBDEFB;
        }
        
        .option-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .option-button {
          padding: 10px 15px;
          background-color: rgba(255,255,255,0.1);
          border: none;
          border-radius: 5px;
          color: white;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .option-button:hover {
          background-color: rgba(255,255,255,0.2);
        }
        
        .option-button.active {
          background-color: #1976D2;
          font-weight: bold;
        }
        
        .option-button.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .ping-indicator {
          font-size: 12px;
          color: #81D4FA;
        }
        
        .recent-players-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .player-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background-color: rgba(255,255,255,0.1);
          border-radius: 5px;
        }
        
        .player-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        
        .player-info {
          flex-grow: 1;
        }
        
        .player-name {
          font-weight: bold;
          font-size: 14px;
        }
        
        .player-elo {
          font-size: 12px;
          color: #81D4FA;
        }
        
        .challenge-button {
          background-color: rgba(255,255,255,0.1);
          border: none;
          border-radius: 3px;
          color: white;
          padding: 5px 8px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .challenge-button:hover {
          background-color: rgba(255,255,255,0.2);
        }
        
        .friends-button {
          width: 100%;
          padding: 10px;
          background-color: rgba(255,255,255,0.1);
          border: none;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          font-weight: bold;
        }
        
        .friends-button:hover {
          background-color: rgba(255,255,255,0.2);
        }
        
        .matchmaking-visual {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          min-height: 400px;
          position: relative;
        }
        
        .player-profile {
          margin-bottom: 30px;
        }
        
        .profile-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #1976D2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(25, 118, 210, 0.5);
        }
        
        .avatar {
          font-weight: bold;
          font-size: 24px;
        }
        
        .elo {
          font-size: 14px;
          opacity: 0.8;
        }
        
        .find-match-button {
          padding: 15px 40px;
          background-color: #4CAF50;
          border: none;
          border-radius: 25px;
          color: white;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
          margin-bottom: 30px;
          transition: transform 0.2s;
        }
        
        .find-match-button:hover {
          transform: scale(1.05);
        }
        
        .matchmaking-stats {
          width: 100%;
          max-width: 300px;
          background-color: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 15px;
        }
        
        .stat-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
        }
        
        .searching-animation {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .player-profile.searching {
          position: relative;
        }
        
        .search-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 2px solid #64B5F6;
          opacity: 0.7;
          transform: translate(-50%, -50%);
        }
        
        .ring1 {
          width: 150px;
          height: 150px;
          animation: pulse 2s infinite;
        }
        
        .ring2 {
          width: 200px;
          height: 200px;
          animation: pulse 2s infinite 0.3s;
        }
        
        .ring3 {
          width: 250px;
          height: 250px;
          animation: pulse 2s infinite 0.6s;
        }
        
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.7;
          }
          50% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.7;
          }
        }
        
        .searching-text {
          margin: 30px 0 20px;
        }
        
        .waiting-dots {
          height: 30px;
          display: flex;
          justify-content: center;
          gap: 5px;
        }
        
        .dot {
          font-size: 40px;
          line-height: 20px;
        }
        
        .dot1 {
          animation: fade 1.5s infinite;
        }
        
        .dot2 {
          animation: fade 1.5s infinite 0.5s;
        }
        
        .dot3 {
          animation: fade 1.5s infinite 1s;
        }
        
        @keyframes fade {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        
        .search-info {
          margin-bottom: 30px;
          color: #81D4FA;
          font-size: 14px;
        }
        
        .cancel-button {
          padding: 12px 30px;
          background-color: #F44336;
          border: none;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
        
        .match-found-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: popup 0.3s;
        }
        
        @keyframes popup {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .match-found-container h3 {
          color: #4CAF50;
          margin-bottom: 20px;
          font-size: 24px;
        }
        
        .players-matched {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }
        
        .vs-indicator {
          font-weight: bold;
          font-size: 18px;
          color: #FFC107;
        }
        
        .accept-match-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }
        
        .accept-countdown {
          width: 80px;
          height: 80px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .accept-countdown svg {
          position: absolute;
          transform: rotate(-90deg);
        }
        
        .countdown-number {
          font-size: 24px;
          font-weight: bold;
        }
        
        .accept-button {
          padding: 12px 40px;
          background-color: #4CAF50;
          border: none;
          border-radius: 20px;
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
        }
        
        @media (max-width: 950px) {
          .matchmaking-content {
            flex-direction: column;
          }
          
          .options-panel {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MatchmakingInterface;

import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import { Team, Formation } from './models/GameModels';
import TeamSetup from './components/TeamSetup';
import CameraUpload from './components/CameraUpload';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [showCameraUpload, setShowCameraUpload] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  
  // Create default teams on first load
  useEffect(() => {
    // Create default home team
    const defaultHomeTeam = Team.createStandardTeam(
      'home',
      'Home FC',
      [4, 3, 3],
      '#ff0000',
      '#ffffff'
    );
    
    // Create default away team
    const defaultAwayTeam = Team.createStandardTeam(
      'away',
      'Away FC',
      [4, 4, 2],
      '#0000ff',
      '#ffffff'
    );
    
    setHomeTeam(defaultHomeTeam);
    setAwayTeam(defaultAwayTeam);
  }, []);
  
  // Start the game
  const handleStartGame = () => {
    if (homeTeam && awayTeam) {
      setGameStarted(true);
    }
  };
  
  // Update team settings
  const handleUpdateTeam = (team: Team, isHome: boolean) => {
    if (isHome) {
      setHomeTeam(team);
    } else {
      setAwayTeam(team);
    }
  };
  
  // Open camera upload for a specific player
  const handlePlayerImageUpload = (player: any, isHome: boolean) => {
    setSelectedPlayer({ player, isHome });
    setShowCameraUpload(true);
  };
  
  // Handle image captured from camera
  const handleImageCaptured = (imageUrl: string) => {
    if (selectedPlayer) {
      const { player, isHome } = selectedPlayer;
      
      // Update player's avatar URL
      player.avatarUrl = imageUrl;
      
      // Update the team
      if (isHome && homeTeam) {
        const updatedTeam = { ...homeTeam };
        setHomeTeam(updatedTeam);
      } else if (!isHome && awayTeam) {
        const updatedTeam = { ...awayTeam };
        setAwayTeam(updatedTeam);
      }
      
      // Close camera upload
      setShowCameraUpload(false);
      setSelectedPlayer(null);
    }
  };
  
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Football Card Game</h1>
      </header>
      
      <main>
        {gameStarted && homeTeam && awayTeam ? (
          <GameBoard homeTeam={homeTeam} awayTeam={awayTeam} />
        ) : (
          <div className="setup-container">
            <div className="teams-setup">
              {homeTeam && (
                <TeamSetup 
                  team={homeTeam} 
                  isHome={true}
                  onUpdateTeam={handleUpdateTeam}
                  onPlayerImageUpload={handlePlayerImageUpload}
                />
              )}
              
              {awayTeam && (
                <TeamSetup 
                  team={awayTeam} 
                  isHome={false}
                  onUpdateTeam={handleUpdateTeam}
                  onPlayerImageUpload={handlePlayerImageUpload}
                />
              )}
            </div>
            
            <button 
              className="start-game-btn"
              onClick={handleStartGame}
              disabled={!homeTeam || !awayTeam}
            >
              Start Game
            </button>
          </div>
        )}
      </main>
      
      {/* Camera upload modal */}
      {showCameraUpload && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CameraUpload 
              onImageCaptured={handleImageCaptured}
              onCancel={() => {
                setShowCameraUpload(false);
                setSelectedPlayer(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

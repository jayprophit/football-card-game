import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import GameBoard3D from './components/GameBoard3D';
import ClashGameBoard from './components/ClashGameBoard';
import { Team, Formation } from './models/GameModels';
import TeamSetup from './components/TeamSetup';
import ClashTeamSetup from './components/ClashTeamSetup';
import CameraUpload from './components/CameraUpload';
import './styles/global.css';
import './styles/clash-style.css';

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [showCameraUpload, setShowCameraUpload] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [use3DView, setUse3DView] = useState<boolean>(false);
  const [useClashStyle, setUseClashStyle] = useState<boolean>(true); // Default to Clash style
  const [loading3DAssets, setLoading3DAssets] = useState<boolean>(false);
  const [showMainMenu, setShowMainMenu] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  
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
      // Show loading screen first
      setShowLoading(true);
      
      // Simulate loading time
      setTimeout(() => {
        setShowLoading(false);
        setGameStarted(true);
        setShowMainMenu(false);
      }, 2000);
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
  
  // Toggle between 2D and 3D views
  const toggleView = () => {
    if (!use3DView) {
      // Show loading indicator when switching to 3D
      setLoading3DAssets(true);
      // Set a timeout to simulate loading 3D assets
      setTimeout(() => {
        setUse3DView(true);
        setLoading3DAssets(false);
      }, 1500);
    } else {
      setUse3DView(false);
    }
  };
  
  // Toggle between regular and Clash styles
  const toggleClashStyle = () => {
    setUseClashStyle(!useClashStyle);
  };
  
  // Return to main menu
  const handleReturnToMenu = () => {
    setGameStarted(false);
    setShowMainMenu(true);
  };
  
  // Render main menu
  const renderMainMenu = () => {
    return (
      <div className={useClashStyle ? "clash-main-menu" : "main-menu"}>
        <div className={useClashStyle ? "clash-logo" : "logo"}>
          <img src="/images/ui/logo.svg" alt="Football Card Game" />
        </div>
        
        <div className={useClashStyle ? "clash-menu-buttons" : "menu-buttons"}>
          <button 
            className={useClashStyle ? "clash-btn primary" : "start-game-btn"}
            onClick={() => setShowMainMenu(false)}
          >
            Play Game
          </button>
          
          <button 
            className={useClashStyle ? "clash-btn" : "settings-btn"}
            onClick={toggleClashStyle}
          >
            {useClashStyle ? "Switch to Classic Mode" : "Switch to Clash Mode"}
          </button>
        </div>
        
        <div className={useClashStyle ? "clash-footer" : "footer"}>
          <p>© 2025 Football Card Game • All Rights Reserved</p>
        </div>
      </div>
    );
  };
  
  // Render team setup
  const renderTeamSetup = () => {
    if (useClashStyle) {
      return (
        <div className="clash-setup-container">
          <div className="clash-header">
            <h1>Team Setup</h1>
            <button className="clash-btn" onClick={handleReturnToMenu}>
              Back
            </button>
          </div>
          
          <div className="clash-teams-setup">
            {homeTeam && (
              <ClashTeamSetup 
                team={homeTeam} 
                isHome={true}
                onUpdateTeam={handleUpdateTeam}
                onPlayerImageUpload={handlePlayerImageUpload}
              />
            )}
            
            {awayTeam && (
              <ClashTeamSetup 
                team={awayTeam} 
                isHome={false}
                onUpdateTeam={handleUpdateTeam}
                onPlayerImageUpload={handlePlayerImageUpload}
              />
            )}
          </div>
          
          <button 
            className="clash-btn primary clash-start-game-btn"
            onClick={handleStartGame}
            disabled={!homeTeam || !awayTeam}
          >
            Start Match
          </button>
        </div>
      );
    } else {
      return (
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
          
          <button 
            className="back-btn"
            onClick={handleReturnToMenu}
          >
            Back to Menu
          </button>
        </div>
      );
    }
  };
  
  // Render game board based on selected style and view
  const renderGameBoard = () => {
    if (!homeTeam || !awayTeam) return null;
    
    if (useClashStyle) {
      return (
        <>
          <ClashGameBoard homeTeam={homeTeam} awayTeam={awayTeam} />
          <button 
            className="clash-back-btn"
            onClick={handleReturnToMenu}
          >
            Exit Match
          </button>
        </>
      );
    } else {
      return (
        <>
          {use3DView ? (
            <GameBoard3D homeTeam={homeTeam} awayTeam={awayTeam} />
          ) : (
            <GameBoard homeTeam={homeTeam} awayTeam={awayTeam} />
          )}
          
          <button 
            className={`view-3d-button ${use3DView ? 'active' : ''}`}
            onClick={toggleView}
          >
            {use3DView ? 'Switch to 2D View' : 'Switch to 3D View'}
          </button>
          
          <button 
            className="back-btn"
            onClick={handleReturnToMenu}
          >
            Back to Menu
          </button>
        </>
      );
    }
  };
  
  // Render loading screen
  const renderLoading = () => {
    return (
      <div className={useClashStyle ? "clash-loading-screen" : "loading-overlay"}>
        {useClashStyle ? (
          <>
            <div className="clash-loading-logo">
              <img src="/images/ui/logo.svg" alt="Football Card Game" />
            </div>
            <div className="clash-loading-bar-container">
              <div className="clash-loading-bar"></div>
            </div>
            <div className="clash-loading-text">Preparing match...</div>
          </>
        ) : (
          <div className="loading-spinner"></div>
        )}
      </div>
    );
  };
  
  return (
    <div className={useClashStyle ? "clash-app-container" : "app-container"}>
      <main>
        {showLoading && renderLoading()}
        
        {showMainMenu ? (
          renderMainMenu()
        ) : gameStarted ? (
          renderGameBoard()
        ) : (
          renderTeamSetup()
        )}
      </main>
      
      {/* Camera upload modal */}
      {showCameraUpload && (
        <div className={useClashStyle ? "clash-modal-overlay" : "modal-overlay"}>
          <div className={useClashStyle ? "clash-modal-content" : "modal-content"}>
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
      
      {/* Loading 3D assets overlay */}
      {loading3DAssets && (
        <div className="loading-overlay">
          <div className="loading-textures">
            <h3>Loading 3D Assets</h3>
            <p>Preparing the pitch...</p>
            <div className="loading-textures-progress">
              <div className="loading-progress-bar" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

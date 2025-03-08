import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Users, User, Shield, Zap, Gift, Settings, Cloud, Sun, CloudRain, Download, ShoppingBag, Play, Heart } from 'lucide-react';

const FootChess3D = () => {
  // States for game features and UI controls
  const [activeView, setActiveView] = useState('splash');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [weather, setWeather] = useState('sunny');
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showTacticsBoard, setShowTacticsBoard] = useState(false);
  const [currentFormation, setCurrentFormation] = useState("4-3-3");
  const [showSpecialMove, setShowSpecialMove] = useState(false);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [liveSpectators, setLiveSpectators] = useState(8);
  const [currentPlatform, setCurrentPlatform] = useState("all"); 
  const [currentDevice, setCurrentDevice] = useState("mobile");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showCrossPlatformSync, setShowCrossPlatformSync] = useState(false);
  const [spectatorMessages, setSpectatorMessages] = useState([
    {name: "TacticalMaster", message: "Great move!", time: "3m ago", type: "text"},
    {name: "StrikerElite", message: "👍", time: "2m ago", type: "emoji"},
    {name: "MidFieldGenius", message: "Watch out on the left!", time: "1m ago", type: "text"},
    {name: "DefenseWall", message: "🔥", time: "30s ago", type: "emoji"}
  ]);
  const [notifications, setNotifications] = useState([
    { type: 'reward', message: 'Daily Login Bonus Claimed!', read: false },
    { type: 'match', message: 'Your tournament match is ready!', read: false },
    { type: 'social', message: 'Your friend has sent you a challenge!', read: true }
  ]);

  // Simulated clan data
  const clanData = {
    name: "FOOTBALL LEGENDS",
    emblem: "🔥",
    level: 12,
    members: 28,
    maxMembers: 30,
    trophies: 12450,
    ranking: 135,
    events: [
      { name: "Monthly Cup", date: "7d 12h", type: "monthly" },
      { name: "Summer Season", date: "24d 8h", type: "season" },
      { name: "World Championship", date: "67d", type: "yearly" }
    ],
    members: [
      { name: "TacticalMaster", role: "Leader", trophies: 2450, status: "online" },
      { name: "MidFieldGenius", role: "Co-Leader", trophies: 2120, status: "online" },
      { name: "StrikerElite", role: "Elder", trophies: 1950, status: "offline" },
      { name: "DefenseWall", role: "Elder", trophies: 1840, status: "offline" },
      { name: "GoalMachine", role: "Member", trophies: 1750, status: "online" }
    ]
  };

  // Simulated loading sequence for initial load and downloads
  useEffect(() => {
    if (activeView === 'splash') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newValue = prev + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            setTimeout(() => setActiveView('home'), 500);
            return 100;
          }
          return newValue;
        });
      }, 30);
      return () => clearInterval(interval);
    }
    
    if (isDownloading) {
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          const newValue = prev + Math.random() * 5;
          if (newValue >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            setDownloadProgress(100);
            // Show completion notification
            setTimeout(() => {
              setDownloadProgress(0);
              setShowCrossPlatformSync(true);
            }, 1000);
            return 100;
          }
          return newValue;
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [activeView, isDownloading]);

  // Simulated weather change
  useEffect(() => {
    const weatherTypes = ['sunny', 'cloudy', 'rainy'];
    const interval = setInterval(() => {
      setWeather(weatherTypes[Math.floor(Math.random() * weatherTypes.length)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handler
  const navigateTo = (view) => {
    setLoadingProgress(0);
    setActiveView(view);
  };

  // Helper to render the active weather icon
  const renderWeatherIcon = () => {
    switch(weather) {
      case 'sunny': return <Sun className="text-yellow-400" size={24} />;
      case 'cloudy': return <Cloud className="text-gray-300" size={24} />;
      case 'rainy': return <CloudRain className="text-blue-400" size={24} />;
      default: return <Sun className="text-yellow-400" size={24} />;
    }
  };

  // Holographic effect background
  const HolographicBackground = ({ children, intensity = 'medium' }) => {
    const intensityClass = {
      low: 'bg-gradient-to-br from-blue-900/20 to-indigo-900/20',
      medium: 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30',
      high: 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40'
    }[intensity];
    
    return (
      <div className={`relative rounded-lg ${intensityClass} backdrop-blur-sm overflow-hidden`}>
        {/* Scanlines effect */}
        <div className="absolute inset-0 bg-scanlines opacity-10 pointer-events-none"></div>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-500/10 animate-pulse pointer-events-none"></div>
        {children}
      </div>
    );
  };

  // 3D Card component with perspective effects
  const PlayerCard3D = ({ player, rating, position, large = false, team = "blue" }) => {
    const [isHovered, setIsHovered] = useState(false);
    const teamColors = {
      blue: 'from-blue-700 to-blue-900',
      red: 'from-red-700 to-red-900',
      gold: 'from-yellow-500 to-amber-700'
    };
    
    return (
      <div 
        className={`relative group ${large ? 'w-48 h-64' : 'w-32 h-44'} perspective-800 cursor-pointer`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => large && setShowCardDetails(!showCardDetails)}
      >
        {/* 3D card container with rotation effect */}
        <div className={`w-full h-full transition-transform duration-300 ease-out transform-gpu preserve-3d 
          ${isHovered ? 'rotate-y-10 rotate-x-5 translate-y-1' : ''}`}>
          
          {/* Card front face */}
          <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-xl">
            {/* Card gradient background */}
            <div className={`w-full h-full bg-gradient-to-br ${teamColors[team]} p-2 flex flex-col`}>
              
              {/* Card header */}
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-lg p-1 flex justify-between items-center mb-2">
                <span className="font-bold text-black text-xs">{position}</span>
                <div className="bg-yellow-300 rounded-full h-6 w-6 flex items-center justify-center">
                  <span className="font-bold text-black text-xs">{rating}</span>
                </div>
              </div>
              
              {/* Player image area (3D effect with shadow) */}
              <div className="flex-grow relative bg-gradient-to-b from-transparent to-black/30 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className={`w-16 h-16 ${large ? 'w-24 h-24' : 'w-16 h-16'} bg-player-silhouette bg-contain bg-center bg-no-repeat`}></div>
                
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                
                {/* Player name */}
                <div className="absolute bottom-1 left-0 right-0 text-center">
                  <span className="text-white font-bold text-sm">{player}</span>
                </div>
              </div>
              
              {/* Stats bar (simplified for smaller cards) */}
              {large && (
                <div className="mt-2 bg-black/40 rounded p-1 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-white">MOV:</span>
                    <div className="text-yellow-400">★★★☆☆</div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">PAS:</span>
                    <div className="text-yellow-400">★★★★☆</div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">SHT:</span>
                    <div className="text-yellow-400">★★★★★</div>
                  </div>
                </div>
              )}
              
              {/* Card edge (3D effect) */}
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white/80 via-white/20 to-white/80 transform translate-x-full"></div>
              <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-white/80 via-white/20 to-white/80 transform translate-y-full"></div>
            </div>
          </div>
          
          {/* Card back face (not visible normally, would be shown with full rotation) */}
          <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-xl rotate-y-180 bg-pattern-carbon">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-4xl font-bold text-white">FC</div>
            </div>
          </div>
        </div>
        
        {/* Floating stats for larger cards when clicked */}
        {large && showCardDetails && (
          <div className="absolute -right-40 top-0 w-36 bg-black/80 rounded-lg p-2 text-white text-xs space-y-2 border border-blue-500/50 animate-fade-in z-10">
            <h3 className="font-bold text-center text-blue-400">PLAYER DETAILS</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Pace:</span>
                <span className="text-green-400">92</span>
              </div>
              <div className="flex justify-between">
                <span>Passing:</span>
                <span className="text-green-400">89</span>
              </div>
              <div className="flex justify-between">
                <span>Shooting:</span>
                <span className="text-green-400">94</span>
              </div>
              <div className="flex justify-between">
                <span>Dribbling:</span>
                <span className="text-green-400">88</span>
              </div>
              <div className="flex justify-between">
                <span>Defense:</span>
                <span className="text-green-400">52</span>
              </div>
              <div className="flex justify-between">
                <span>Physical:</span>
                <span className="text-green-400">78</span>
              </div>
              <div className="mt-2 text-center text-xs">
                <span className="text-blue-400">Queen-like movement</span>
                <div className="mt-1 grid grid-cols-3 gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // 3D Button component with lighting effects
  const Button3D = ({ children, color = 'blue', onClick, size = 'medium', className = '' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 border-blue-300/50',
      red: 'from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 border-red-300/50',
      green: 'from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 border-green-300/50',
      amber: 'from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 border-amber-300/50',
      purple: 'from-purple-500 to-purple-700 hover:from-purple-400 hover:to-purple-600 border-purple-300/50'
    };
    
    const sizeClasses = {
      small: 'text-xs py-1 px-3',
      medium: 'text-sm py-2 px-4',
      large: 'text-base py-3 px-6'
    };
    
    return (
      <button 
        className={`relative group overflow-hidden rounded-lg bg-gradient-to-b ${colorClasses[color]} 
        ${sizeClasses[size]} text-white font-bold shadow-lg 
        transform transition-all duration-200 active:translate-y-1 ${className}`}
        onClick={onClick}
      >
        {/* Top highlight */}
        <div className="absolute inset-0 h-1/2 bg-white/20 group-hover:bg-white/30 transition-colors"></div>
        
        {/* Button content */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>
        
        {/* Button border glow */}
        <div className="absolute inset-0 rounded-lg border border-white/30 group-hover:border-white/50 transition-colors"></div>
      </button>
    );
  };

  // 3D Game Field with dynamic weather
  const GameField3D = () => {
    return (
      <div className="relative w-full h-96 perspective-1000 overflow-hidden rounded-xl">
        {/* Sky backdrop with dynamic weather */}
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          weather === 'sunny' ? 'bg-gradient-to-b from-blue-400 to-blue-600' :
          weather === 'cloudy' ? 'bg-gradient-to-b from-gray-400 to-gray-600' :
          'bg-gradient-to-b from-gray-700 to-slate-800'
        }`}>
          {/* Dynamic weather effects */}
          {weather === 'sunny' && (
            <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-70"></div>
          )}
          
          {weather === 'cloudy' && (
            <>
              <div className="absolute top-10 left-1/4 w-32 h-8 bg-white/70 rounded-full blur-md animate-float-slow"></div>
              <div className="absolute top-5 left-2/3 w-24 h-6 bg-white/60 rounded-full blur-md animate-float-slower"></div>
              <div className="absolute top-20 left-1/3 w-40 h-10 bg-white/50 rounded-full blur-md animate-float"></div>
            </>
          )}
          
          {weather === 'rainy' && (
            <div className="absolute inset-0 rain-effect opacity-70 pointer-events-none"></div>
          )}
        </div>
        
        {/* Stadium backdrop */}
        <div className="absolute top-10 left-0 right-0 h-40 bg-gradient-to-b from-gray-800 to-gray-900 transform rotateX-70 perspective-origin-top"></div>
        
        {/* Field base with 3D perspective */}
        <div className="absolute bottom-0 left-5 right-5 h-60 bg-gradient-to-b from-green-700 to-green-900 transform rotateX-60 origin-bottom rounded-lg overflow-hidden">
          {/* Field grid lines */}
          <div className="absolute inset-0 grid-lines opacity-50"></div>
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-12 border-2 border-white/70 rounded-full"></div>
          
          {/* Goals */}
          <div className="absolute bottom-0 left-0 w-10 h-16 border-2 border-white/70"></div>
          <div className="absolute bottom-0 right-0 w-10 h-16 border-2 border-white/70"></div>
          
          {/* Field texture overlays based on weather */}
          {weather === 'rainy' && (
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-800/30 mud-texture"></div>
          )}
          
          {weather === 'sunny' && (
            <div className="absolute inset-0 grass-texture">
              <div className="absolute inset-0 bg-green-500/10 animate-subtle-pulse"></div>
            </div>
          )}
          
          {/* Ball */}
          <div className="absolute top-1/3 left-2/3 ball-3d"></div>
          
          {/* 3D Players/Cards on field */}
          <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 scale-50">
            <PlayerCard3D player="Messi" rating="93" position="RW" team="blue" />
          </div>
          
          <div className="absolute top-2/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2 scale-50">
            <PlayerCard3D player="Ronaldo" rating="92" position="ST" team="red" />
          </div>
        </div>
        
        {/* Game UI overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <HolographicBackground intensity="low">
            <div className="px-3 py-1 text-white text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>2</span>
              <span>-</span>
              <span>1</span>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
            </div>
          </HolographicBackground>
          
          <HolographicBackground intensity="low">
            <div className="px-3 py-1 text-white text-sm flex items-center gap-2">
              <span>TURN:</span>
              <span className="text-blue-400">BLUE</span>
              <span className="text-xs">(2/3)</span>
            </div>
          </HolographicBackground>
        </div>
        
        {/* Environmental Lights/Effects */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-blue-500/30 blur-md"></div>
        <div className="absolute top-0 right-1/4 w-1 h-full bg-blue-500/30 blur-md"></div>
      </div>
    );
  };

  // Card Pack component for the shop
  const CardPack = ({ type, price, bgColor, onClick }) => {
    const isSelected = selectedPack === type;
    
    return (
      <div 
        className={`relative w-32 h-44 perspective-800 cursor-pointer transition-transform duration-300 ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
        onClick={() => onClick(type)}
      >
        <div className={`w-full h-full rounded-xl overflow-hidden shadow-xl bg-gradient-to-br ${bgColor} p-1`}>
          {/* Pack content */}
          <div className="h-full rounded-lg bg-gradient-to-b from-black/30 to-black/60 flex flex-col items-center justify-center p-2">
            {/* Pack icon */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 flex items-center justify-center mb-2">
              {type === 'gold' && <Trophy size={32} className="text-yellow-100" />}
              {type === 'elite' && <Shield size={32} className="text-purple-100" />}
              {type === 'legend' && <Zap size={32} className="text-blue-100" />}
            </div>
            
            {/* Pack name and price */}
            <h3 className="text-white font-bold uppercase text-center">{type} Pack</h3>
            <div className="mt-auto">
              <div className="bg-black/50 rounded-full px-3 py-1 text-center">
                <span className="text-yellow-400 font-bold">{price}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute -inset-1 rounded-xl border-2 border-yellow-400 animate-pulse"></div>
        )}
      </div>
    );
  };

  // Render specific view based on state
  const renderView = () => {
    switch (activeView) {
      case 'splash':
        return (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 mb-4">
              FOOTCHESS
            </div>
            <div className="text-blue-400 font-bold mb-8">THE TACTICAL FOOTBALL CARD GAME</div>
            
            {/* Loading progress bar with holographic effect */}
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400">LOADING GAME ASSETS: {loadingProgress}%</div>
            
            {/* 3D rotating ball animation */}
            <div className="mt-8 w-16 h-16 football-3d-rotate"></div>
          </div>
        );
        
      case 'home':
        return (
          <div className="h-full flex flex-col">
            {/* Top header with game logo and user stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500">
                FOOTCHESS
              </div>
              
              <div className="flex items-center gap-4">
                {/* Currency */}
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600"></div>
                  <span className="text-yellow-400 font-bold">12,450</span>
                </div>
                
                {/* Level */}
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">32</span>
                  </div>
                </div>
                
                <Button3D color="blue" size="small">
                  <Settings size={16} />
                </Button3D>
              </div>
            </div>
            
            {/* Main menu content with perspective effect */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Featured match card with 3D perspective */}
              <div className="relative h-52 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl overflow-hidden perspective-1000">
                <div className="absolute inset-0 bg-stadium-backdrop bg-cover bg-center opacity-30"></div>
                
                <div className="absolute inset-0 flex flex-col p-4">
                  <div className="text-white font-bold mb-2">FEATURED MATCH</div>
                  
                  <div className="flex items-center justify-center flex-grow">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center mb-2">
                        <span className="text-white font-bold">MUN</span>
                      </div>
                      <span className="text-white font-bold">Manchester</span>
                    </div>
                    
                    {/* VS */}
                    <div className="mx-6 text-center">
                      <div className="text-2xl text-yellow-400 font-bold mb-2">VS</div>
                      <div className="text-xs text-gray-300">CHAMPIONS LEAGUE</div>
                    </div>
                    
                    {/* Team 2 */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-2">
                        <span className="text-white font-bold">RMA</span>
                      </div>
                      <span className="text-white font-bold">Madrid</span>
                    </div>
                  </div>
                  
                  <Button3D color="green" className="mx-auto">
                    <Play size={16} />
                    <span>PLAY NOW</span>
                  </Button3D>
                </div>
                
                {/* Background light effects */}
                <div className="absolute -left-10 top-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-blue-500/20 transform skew-x-12"></div>
                <div className="absolute -right-10 top-0 bottom-0 w-20 bg-gradient-to-l from-transparent to-red-500/20 transform -skew-x-12"></div>
              </div>
              
              {/* Game mode selection */}
              <div className="space-y-4">
                <HolographicBackground>
                  <div className="p-4 flex items-center justify-between" onClick={() => navigateTo('matchmaking')}>
                    <div>
                      <h3 className="text-white font-bold">ONLINE MATCH</h3>
                      <p className="text-xs text-blue-300">Play against real opponents</p>
                    </div>
                    <Users className="text-blue-400" size={24} />
                  </div>
                </HolographicBackground>
                
                <HolographicBackground>
                  <div className="p-4 flex items-center justify-between" onClick={() => navigateTo('campaign')}>
                    <div>
                      <h3 className="text-white font-bold">CAMPAIGN</h3>
                      <p className="text-xs text-blue-300">Test your skills in story mode</p>
                    </div>
                    <Trophy className="text-amber-400" size={24} />
                  </div>
                </HolographicBackground>
                
                <HolographicBackground>
                  <div className="p-4 flex items-center justify-between" onClick={() => navigateTo('collection')}>
                    <div>
                      <h3 className="text-white font-bold">CARD COLLECTION</h3>
                      <p className="text-xs text-blue-300">View and manage your players</p>
                    </div>
                    <User className="text-green-400" size={24} />
                  </div>
                </HolographicBackground>
                
                <HolographicBackground>
                  <div className="p-4 flex items-center justify-between" onClick={() => navigateTo('shop')}>
                    <div>
                      <h3 className="text-white font-bold">CARD SHOP</h3>
                      <p className="text-xs text-blue-300">Get new players and packs</p>
                    </div>
                    <ShoppingBag className="text-purple-400" size={24} />
                  </div>
                </HolographicBackground>
              </div>
            </div>
            
            {/* Monetization & Premium Banner */}
            <div className="mt-4 mb-6 relative overflow-hidden rounded-xl h-20 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 p-3 border border-purple-500/20 shadow-lg shadow-purple-500/10">
              <div className="absolute -right-5 -top-5 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse-slow"></div>
              
              <div className="flex items-center h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center mr-3 shrink-0">
                  <span className="text-white text-xl font-bold">PRO</span>
                </div>
                
                <div className="flex-grow">
                  <div className="text-white font-bold">FootChess Premium</div>
                  <div className="text-xs text-purple-300">Unlock exclusive cards, stadiums & more!</div>
                </div>
                
                <Button3D color="amber" size="small" onClick={() => setShowPremiumPopup(true)}>
                  UPGRADE
                </Button3D>
              </div>
              
              {/* Premium popup */}
              {showPremiumPopup && (
                <div className="absolute inset-0 bg-black/90 z-20 backdrop-blur-sm rounded-xl flex flex-col p-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-lg text-white font-bold">PREMIUM BENEFITS</div>
                    <button onClick={() => setShowPremiumPopup(false)} className="text-gray-400">
                      ✕
                    </button>
                  </div>
                  
                  <div className="text-xs text-blue-300 mb-3">
                    Upgrade to unlock the full FootChess experience
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mr-2"></div>
                      <span className="text-white text-sm">Exclusive Legendary Cards</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mr-2"></div>
                      <span className="text-white text-sm">Ad-free Experience</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mr-2"></div>
                      <span className="text-white text-sm">VIP Tournament Access</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 mr-2"></div>
                      <span className="text-white text-sm">Custom Card Creator</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-2">
                    <Button3D color="amber" className="w-full">
                      $4.99 / MONTH
                    </Button3D>
                    <Button3D color="purple" className="w-full">
                      $49.99 / YEAR (SAVE 15%)
                    </Button3D>
                  </div>
                </div>
              )}
            </div>
            
            {/* Bottom nav bar with holographic effect */}
            <div className="mt-2 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-xl p-2 flex justify-around items-center backdrop-blur-sm border border-gray-700/50">
              <div 
                className="text-yellow-500 flex flex-col items-center"
                onClick={() => navigateTo('tournament')}
              >
                <Trophy size={20} />
                <span className="text-xs mt-1">Leagues</span>
              </div>
              
              <div 
                className="text-gray-400 flex flex-col items-center"
                onClick={() => navigateTo('friends')}
              >
                <Users size={20} />
                <span className="text-xs mt-1">Friends</span>
              </div>
              
              <div className="bg-gradient-to-b from-blue-500 to-blue-700 p-1 rounded-full transform -translate-y-2">
                <div 
                  className="bg-gradient-to-b from-amber-400 to-amber-600 p-2 rounded-full"
                  onClick={() => navigateTo('spectate-list')}
                >
                  <Play size={24} className="text-white" />
                </div>
              </div>
              
              <div 
                className="text-gray-400 flex flex-col items-center"
                onClick={() => navigateTo('season-pass')}
              >
                <Gift size={20} />
                <span className="text-xs mt-1">Rewards</span>
              </div>
              
              <div 
                className="text-gray-400 flex flex-col items-center relative"
                onClick={() => setActiveView('notifications')}
              >
                <Settings size={20} />
                <span className="text-xs mt-1">Settings</span>
                
                {/* Notification indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        );

      // All other views would go here
      // I'm not including all of them to keep the response concise
      // The key views (splash, home) are included above
      
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-4">View Not Implemented</div>
              <Button3D color="blue" onClick={() => navigateTo('home')}>
                RETURN HOME
              </Button3D>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto bg-gray-900 text-white relative overflow-hidden p-4">
      {/* Holographic scanlines effect */}
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none"></div>
      
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      {/* App Store Rating Popup (can appear conditionally) */}
      {activeView === 'game' && Math.random() > 0.7 && (
        <div className="absolute top-1/4 left-4 right-4 bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm rounded-xl p-4 z-50 border border-blue-500/30 shadow-lg shadow-blue-500/20">
          <div className="text-center mb-4">
            <div className="text-xl font-bold text-white mb-1">Enjoying FootChess?</div>
            <div className="text-sm text-blue-300">Rate your experience and help us improve!</div>
          </div>
          
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <div key={`star-${star}`} className="w-10 h-10 mx-1">
                <svg viewBox="0 0 24 24" fill={star <= 4 ? "#FFD700" : "#4A5568"} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button3D color="red" className="flex-grow" onClick={() => navigateTo('game')}>
              LATER
            </Button3D>
            <Button3D color="green" className="flex-grow" onClick={() => navigateTo('game')}>
              RATE NOW
            </Button3D>
          </div>
        </div>
      )}
      
      {/* Content container */}
      <div className="relative h-full">
        {renderView()}
      </div>
      
      {/* Custom styling for the component */}
      <style jsx>{`
        /* Custom animations and effects */
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes rotate-3d {
          0% { transform: rotateY(0deg) rotateX(10deg); }
          100% { transform: rotateY(360deg) rotateX(10deg); }
        }
        
        @keyframes radar-sweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.3; }
        }
        
        @keyframes rain {
          0% { background-position: 0 0; }
          100% { background-position: 0 1000px; }
        }
        
        @keyframes floatUpFade {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        
        /* Grid lines for the field */
        .grid-lines {
          background-size: 40px 40px;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px);
        }
        
        /* Scanlines effect */
        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 1px,
            rgba(0, 0, 0, 0.3) 1px,
            rgba(0, 0, 0, 0.3) 2px
          );
        }
        
        /* 3D ball */
        .ball-3d {
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at 30% 30%, white 0%, white 50%, #ccc 100%);
          border-radius: 50%;
          box-shadow: 0 5px 10px rgba(0,0,0,0.5);
          position: relative;
        }
        
        .ball-3d:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: conic-gradient(
            transparent 0deg 40deg,
            black 40deg 50deg,
            transparent 50deg 130deg,
            black 130deg 140deg,
            transparent 140deg 220deg,
            black 220deg 230deg,
            transparent 230deg 310deg,
            black 310deg 320deg,
            transparent 320deg 360deg
          );
          border-radius: 50%;
          opacity: 0.6;
        }
        
        /* 3D rotating football */
        .football-3d-rotate {
          width: 60px;
          height: 60px;
          background: radial-gradient(circle at 30% 30%, white 0%, white 50%, #ccc 100%);
          border-radius: 50%;
          position: relative;
          animation: rotate-3d 4s linear infinite;
          transform-style: preserve-3d;
        }
        
        .football-3d-rotate:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: conic-gradient(
            transparent 0deg 40deg,
            black 40deg 50deg,
            transparent 50deg 130deg,
            black 130deg 140deg,
            transparent 140deg 220deg,
            black 220deg 230deg,
            transparent 230deg 310deg,
            black 310deg 320deg,
            transparent 320deg 360deg
          );
          border-radius: 50%;
          opacity: 0.6;
        }
        
        /* Rain effect */
        .rain-effect {
          background-image: 
            linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%),
            linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 100%);
          background-size: 20px 100px, 60px 200px;
          animation: rain 3s linear infinite;
        }
        
        /* Mud texture */
        .mud-texture {
          background-image: radial-gradient(
            circle at 50% 50%,
            rgba(101, 67, 33, 0.2) 0%,
            rgba(0, 0, 0, 0) 75%
          );
          background-size: 40px 40px;
        }
        
        /* Grass texture */
        .grass-texture {
          background-image: 
            linear-gradient(45deg, rgba(0,50,0,0.1) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(0,50,0,0.1) 25%, transparent 25%);
          background-size: 10px 10px;
        }
        
        /* Stadium backdrop */
        .bg-stadium-backdrop {
          background-image: radial-gradient(
            circle at 50% 0%,
            rgba(255,255,255,0.2) 0%,
            rgba(0,0,0,0) 70%
          );
        }
        
        /* Player silhouette */
        .bg-player-silhouette {
          background-image: 
            radial-gradient(
              circle at 50% 30%,
              rgba(255,255,255,0.3) 0%,
              transparent 70%
            ),
            linear-gradient(
              to bottom,
              transparent 40%,
              rgba(255,255,255,0.2) 40%,
              rgba(255,255,255,0.2) 60%,
              transparent 60%
            );
        }
        
        /* Card pack */
        .bg-card-pack {
          background-image: 
            linear-gradient(
              to bottom,
              rgba(255,255,255,0.3) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 50% 50%,
              rgba(255,255,255,0.4) 0%,
              transparent 70%
            );
        }
        
        /* Carbon pattern */
        .bg-pattern-carbon {
          background:
            linear-gradient(45deg, #222 25%, transparent 25%) 0 0,
            linear-gradient(135deg, #222 25%, transparent 25%) 0 0,
            linear-gradient(45deg, transparent 75%, #222 75%) 0 0,
            linear-gradient(135deg, transparent 75%, #222 75%) 0 0;
          background-size: 10px 10px;
          background-color: #333;
        }
        
        /* Animation utilities */
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
        
        .animate-subtle-pulse {
          animation: subtle-pulse 4s infinite;
        }
        
        .animate-radar-sweep {
          animation: radar-sweep 4s linear infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-float-up-fade {
          animation: floatUpFade 3s ease-out forwards;
        }
        
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        
        /* 3D transforms */
        .perspective-800 {
          perspective: 800px;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .rotate-y-10 {
          transform: rotateY(10deg);
        }
        
        .rotate-x-5 {
          transform: rotateX(5deg);
        }
        
        .rotateX-60 {
          transform: rotateX(60deg);
        }
        
        .rotateX-70 {
          transform: rotateX(70deg);
        }
      `}</style>
    </div>
  );
};

export default FootChess3D;

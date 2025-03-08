import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Users, User, Shield, Zap, Gift, Settings, Cloud, Sun, CloudRain, Download, ShoppingBag, Play, Heart } from 'lucide-react';

const FootChess3D = () => {
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
  const [currentPlatform, setCurrentPlatform] = useState("all"); // "ios", "android", "web", "all"
  const [currentDevice, setCurrentDevice] = useState("mobile"); // "mobile", "tablet", "desktop"
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
                
                {/* Settings */}
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
            
            {/* Bottom nav bar with holographic effect */}
            <div className="mt-6 bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-gray-900/80 rounded-xl p-2 flex justify-around items-center backdrop-blur-sm border border-gray-700/50">
              <div className="text-yellow-500 flex flex-col items-center">
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
              
              <div className="text-gray-400 flex flex-col items-center">
                <Gift size={20} />
                <span className="text-xs mt-1">Rewards</span>
              </div>
              
              <div className="text-gray-400 flex flex-col items-center">
                <Settings size={20} />
                <span className="text-xs mt-1">Settings</span>
              </div>
            </div>
          </div>
        );
        
      case 'matchmaking':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">ONLINE MATCHMAKING</h1>
            </div>
            
            {/* Main content */}
            <div className="flex-grow flex flex-col items-center justify-center p-4">
              {/* Holographic radar animation */}
              <div className="relative w-56 h-56 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 animate-ping"></div>
                
                {/* Radar sweep animation */}
                <div className="absolute inset-0 origin-center animate-radar-sweep">
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-blue-500 to-transparent"></div>
                </div>
                
                {/* Potential opponent indicators */}
                <div className="absolute w-4 h-4 rounded-full bg-green-500 top-1/4 right-1/4 animate-pulse"></div>
                <div className="absolute w-4 h-4 rounded-full bg-yellow-500 bottom-1/3 left-1/5 animate-pulse"></div>
                <div className="absolute w-4 h-4 rounded-full bg-red-500 top-1/2 left-1/3 animate-pulse"></div>
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-700 to-blue-900 border-2 border-blue-400 flex items-center justify-center">
                    <Users size={32} className="text-blue-200" />
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">SEARCHING FOR OPPONENTS</h2>
                <p className="text-sm text-blue-400">Looking for players at your skill level...</p>
              </div>
              
              {/* Match settings */}
              <HolographicBackground intensity="low">
                <div className="p-4 w-72">
                  <h3 className="text-white font-bold mb-2 text-center">MATCH SETTINGS</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Skill Level:</span>
                      <span className="text-blue-400 text-sm font-bold">LEGEND (Level 32)</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Match Type:</span>
                      <span className="text-blue-400 text-sm font-bold">RANKED</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Weather:</span>
                      <div className="flex items-center gap-1 text-sm">
                        {renderWeatherIcon()}
                        <span className="text-blue-400 font-bold capitalize">{weather}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button3D color="red" className="w-full">
                    CANCEL MATCHMAKING
                  </Button3D>
                </div>
              </HolographicBackground>
            </div>
          </div>
        );
        
      case 'game':
        return (
          <div className="h-full flex flex-col">
            {/* Game header */}
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => navigateTo('home')}>
                <ChevronLeft size={20} className="text-gray-400" />
              </button>
              
              <div className="flex items-center">
                {/* Team 1 */}
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">B</span>
                  </div>
                  <span className="text-white font-bold mx-1">2</span>
                </div>
                
                <span className="text-gray-400 mx-1">vs</span>
                
                {/* Team 2 */}
                <div className="flex items-center">
                  <span className="text-white font-bold mx-1">1</span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">R</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Weather indicator */}
                {renderWeatherIcon()}
                
                {/* Game time */}
                <span className="text-yellow-400 text-sm font-bold">75'</span>
              </div>
            </div>
            
            {/* 3D Game Field */}
            <GameField3D />
            
            {/* Game controls */}
            <div className="mt-2 flex justify-between">
              <div className="flex gap-2">
                <Button3D color="blue" size="small">
                  PASS
                </Button3D>
                <Button3D color="red" size="small">
                  SHOOT
                </Button3D>
                <Button3D color="amber" size="small">
                  SKILL
                </Button3D>
              </div>
              
              <Button3D color="green" size="small">
                END TURN (2/3)
              </Button3D>
            </div>
            
            {/* Player cards hand */}
            <div className="mt-4">
              <div className="text-sm text-gray-400 mb-1">YOUR TEAM</div>
              <div className="flex justify-between gap-2 overflow-x-auto py-2">
                <PlayerCard3D player="Messi" rating="93" position="RW" />
                <PlayerCard3D player="De Bruyne" rating="91" position="CM" />
                <PlayerCard3D player="Mbappé" rating="91" position="ST" />
                <PlayerCard3D player="Van Dijk" rating="89" position="CB" />
                <PlayerCard3D player="Neuer" rating="88" position="GK" />
              </div>
            </div>
          </div>
        );
        
      case 'collection':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">MY COLLECTION</h1>
            </div>
            
            {/* Filters and sorting */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              <Button3D color="blue" size="small" className="whitespace-nowrap">
                ALL PLAYERS
              </Button3D>
              <Button3D color="green" size="small" className="whitespace-nowrap">
                ATTACKERS
              </Button3D>
              <Button3D color="amber" size="small" className="whitespace-nowrap">
                MIDFIELDERS
              </Button3D>
              <Button3D color="purple" size="small" className="whitespace-nowrap">
                DEFENDERS
              </Button3D>
              <Button3D color="red" size="small" className="whitespace-nowrap">
                GOALKEEPERS
              </Button3D>
            </div>
            
            {/* Card collection grid */}
            <div className="flex-grow grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto p-2">
              <PlayerCard3D player="Messi" rating="93" position="RW" large={true} />
              <PlayerCard3D player="Ronaldo" rating="92" position="ST" large={true} team="red" />
              <PlayerCard3D player="Mbappé" rating="91" position="ST" large={true} />
              <PlayerCard3D player="De Bruyne" rating="91" position="CM" large={true} />
              <PlayerCard3D player="Neuer" rating="89" position="GK" large={true} team="red" />
              <PlayerCard3D player="Kane" rating="90" position="ST" large={true} team="red" />
              <PlayerCard3D player="Salah" rating="89" position="RW" large={true} />
              <PlayerCard3D player="Van Dijk" rating="89" position="CB" large={true} />
            </div>
          </div>
        );
        
      case 'shop':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <button className="mr-2" onClick={() => navigateTo('home')}>
                  <ChevronLeft size={24} className="text-gray-400" />
                </button>
                <h1 className="text-xl font-bold text-white">CARD SHOP</h1>
              </div>
              
              {/* Currency display */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-600"></div>
                  <span className="text-yellow-400 font-bold">12,450</span>
                </div>
                
                <Button3D color="green" size="small">
                  <span>+</span>
                </Button3D>
              </div>
            </div>
            
            {/* Featured offers */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-2">FEATURED OFFERS</h2>
              <div className="relative h-32 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-pulse-slow"></div>
                
                <div className="absolute inset-0 flex items-center p-4">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-20 h-24 bg-card-pack bg-cover bg-center rounded-lg border-2 border-purple-500/50 shadow-lg shadow-purple-500/20"></div>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-white font-bold text-lg mb-1">PREMIUM TEAM BUNDLE</div>
                    <div className="text-purple-300 text-sm mb-2">Get 5 Elite players + 10 Gold cards</div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-400 line-through text-sm mr-2">15,000</span>
                        <span className="text-yellow-400 font-bold">9,999</span>
                      </div>
                      
                      <Button3D color="purple" size="small">
                        BUY NOW
                      </Button3D>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card packs */}
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-2">CARD PACKS</h2>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <CardPack 
                  type="gold" 
                  price="2,500" 
                  bgColor="from-yellow-600 to-amber-800" 
                  onClick={setSelectedPack} 
                />
                <CardPack 
                  type="elite" 
                  price="5,000" 
                  bgColor="from-purple-600 to-purple-900" 
                  onClick={setSelectedPack} 
                />
                <CardPack 
                  type="legend" 
                  price="10,000" 
                  bgColor="from-blue-600 to-blue-900" 
                  onClick={setSelectedPack} 
                />
              </div>
            </div>
            
            {/* Selected pack details */}
            {selectedPack && (
              <HolographicBackground>
                <div className="p-4">
                  <h3 className="text-white font-bold capitalize mb-2">{selectedPack} Pack Details</h3>
                  
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-card-pack bg-cover bg-center rounded-lg border border-blue-500/50"></div>
                    
                    <div className="flex-grow">
                      <p className="text-sm text-blue-300 mb-2">
                        {selectedPack === 'gold' && 'Contains 5 player cards with at least 1 guaranteed 80+ player.'}
                        {selectedPack === 'elite' && 'Contains 5 player cards with at least 1 guaranteed 85+ player.'}
                        {selectedPack === 'legend' && 'Contains 5 player cards with at least 1 guaranteed 90+ player.'}
                      </p>
                      
                      <Button3D color="green" className="w-full">
                        BUY FOR {selectedPack === 'gold' ? '2,500' : selectedPack === 'elite' ? '5,000' : '10,000'}
                      </Button3D>
                    </div>
                  </div>
                </div>
              </HolographicBackground>
            )}
            
            {/* Special offers */}
            <div className="mt-auto">
              <h2 className="text-lg font-bold text-white mb-2">SPECIAL OFFERS</h2>
              <div className="grid grid-cols-2 gap-4">
                <HolographicBackground intensity="low">
                  <div className="p-3 flex items-center">
                    <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                      <Download size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Starter Bundle</div>
                      <div className="text-xs text-green-400">$4.99</div>
                    </div>
                  </div>
                </HolographicBackground>
                
                <HolographicBackground intensity="low">
                  <div className="p-3 flex items-center">
                    <div className="mr-3 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                      <Heart size={16} className="text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Weekly Pass</div>
                      <div className="text-xs text-purple-400">$2.99</div>
                    </div>
                  </div>
                </HolographicBackground>
              </div>
            </div>
          </div>
        );
        
      case 'tactics':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('collection')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">TACTICS BOARD</h1>
              
              <div className="ml-auto flex items-center gap-2">
                <Button3D color="amber" size="small" onClick={() => setCurrentFormation("4-3-3")}>
                  4-3-3
                </Button3D>
                <Button3D color="blue" size="small" onClick={() => setCurrentFormation("4-4-2")}>
                  4-4-2
                </Button3D>
                <Button3D color="green" size="small" onClick={() => setCurrentFormation("3-5-2")}>
                  3-5-2
                </Button3D>
              </div>
            </div>
            
            {/* Tactics board with 3D field and player positions */}
            <div className="relative w-full h-96 perspective-1000 overflow-hidden rounded-xl mb-4">
              {/* Field base with 3D perspective */}
              <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-green-900 transform rotateX-60 origin-bottom rounded-lg overflow-hidden">
                {/* Field grid lines */}
                <div className="absolute inset-0 grid-lines opacity-50"></div>
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-12 border-2 border-white/70 rounded-full"></div>
                
                {/* Goals */}
                <div className="absolute bottom-0 left-0 w-10 h-16 border-2 border-white/70"></div>
                <div className="absolute bottom-0 right-0 w-10 h-16 border-2 border-white/70"></div>
                
                {/* Player positions based on selected formation */}
                {currentFormation === "4-3-3" && (
                  <>
                    {/* Goalkeeper */}
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">GK</span>
                      </div>
                      <div className="text-white text-xs">Neuer</div>
                    </div>
                    
                    {/* Defenders */}
                    <div className="absolute bottom-20 left-1/4 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">LB</span>
                      </div>
                      <div className="text-white text-xs">Robertson</div>
                    </div>
                    <div className="absolute bottom-20 left-1/3 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">CB</span>
                      </div>
                      <div className="text-white text-xs">Van Dijk</div>
                    </div>
                    <div className="absolute bottom-20 right-1/3 transform translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">CB</span>
                      </div>
                      <div className="text-white text-xs">Dias</div>
                    </div>
                    <div className="absolute bottom-20 right-1/4 transform translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">RB</span>
                      </div>
                      <div className="text-white text-xs">Alexander-Arnold</div>
                    </div>
                    
                    {/* Midfielders */}
                    <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">CDM</span>
                      </div>
                      <div className="text-white text-xs">Rodri</div>
                    </div>
                    <div className="absolute bottom-50 left-1/3 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1 relative">
                        <span className="text-white text-xs font-bold">CM</span>
                        {/* Special move indicator */}
                        <div className="absolute -right-1 -top-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-black text-xs font-bold">S</span>
                        </div>
                      </div>
                      <div className="text-white text-xs">De Bruyne</div>
                    </div>
                    <div className="absolute bottom-50 right-1/3 transform translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">CM</span>
                      </div>
                      <div className="text-white text-xs">Modric</div>
                    </div>
                    
                    {/* Forwards */}
                    <div className="absolute bottom-70 left-1/4 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">LW</span>
                      </div>
                      <div className="text-white text-xs">Mané</div>
                    </div>
                    <div className="absolute bottom-80 left-1/2 transform -translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">ST</span>
                      </div>
                      <div className="text-white text-xs">Mbappé</div>
                    </div>
                    <div className="absolute bottom-70 right-1/4 transform translate-x-1/2 scale-75 flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mb-1">
                        <span className="text-white text-xs font-bold">RW</span>
                      </div>
                      <div className="text-white text-xs">Messi</div>
                    </div>
                  </>
                )}
                
                {currentFormation === "4-4-2" && (
                  <>
                    {/* Simplified 4-4-2 formation player positions */}
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 scale-75">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">GK</span>
                      </div>
                    </div>
                    
                    {/* Defenders */}
                    {[1,2,3,4].map((i, index) => (
                      <div key={`def-${i}`} className="absolute bottom-20" style={{
                        left: `${20 + index * 20}%`,
                        transform: 'scale(0.75)'
                      }}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">D</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Midfielders */}
                    {[1,2,3,4].map((i, index) => (
                      <div key={`mid-${i}`} className="absolute bottom-50" style={{
                        left: `${20 + index * 20}%`,
                        transform: 'scale(0.75)'
                      }}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">M</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Forwards */}
                    <div className="absolute bottom-80 left-1/3 transform -translate-x-1/2 scale-75">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                    </div>
                    <div className="absolute bottom-80 right-1/3 transform translate-x-1/2 scale-75">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                    </div>
                  </>
                )}
                
                {currentFormation === "3-5-2" && (
                  <>
                    {/* Simplified 3-5-2 formation player positions */}
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 scale-75">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">GK</span>
                      </div>
                    </div>
                    
                    {/* Defenders */}
                    {[1,2,3].map((i, index) => (
                      <div key={`def-${i}`} className="absolute bottom-20" style={{
                        left: `${25 + index * 25}%`,
                        transform: 'scale(0.75)'
                      }}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">D</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Midfielders */}
                    {[1,2,3,4,5].map((i, index) => (
                      <div key={`mid-${i}`} className="absolute bottom-50" style={{
                        left: `${16 + index * 17}%`,
                        transform: 'scale(0.75)'
                      }}>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">M</span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Forwards */}
                    <div className="absolute bottom-80 left-1/3 transform -translate-x-1/2 scale-75">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                    </div>
                    <div className="absolute bottom-80 right-1/3 transform translate-x-1/2 scale-75">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">F</span>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Special move visualization (when clicked on De Bruyne) */}
                {showSpecialMove && (
                  <div className="absolute bottom-50 left-1/3 transform -translate-x-1/2">
                    <div className="relative">
                      {/* Movement pattern visualization */}
                      <svg width="200" height="200" viewBox="0 0 200 200" className="absolute -left-100 -top-100">
                        {/* Queen-like movement lines */}
                        <line x1="100" y1="100" x2="100" y2="20" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="180" y2="20" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="180" y2="100" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="180" y2="180" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="100" y2="180" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="20" y2="180" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="20" y2="100" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        <line x1="100" y1="100" x2="20" y2="20" stroke="#FFD700" strokeWidth="2" strokeDasharray="5,3" />
                        
                        {/* Destination points */}
                        <circle cx="100" cy="20" r="5" fill="#FFD700" />
                        <circle cx="180" cy="20" r="5" fill="#FFD700" />
                        <circle cx="180" cy="100" r="5" fill="#FFD700" />
                        <circle cx="180" cy="180" r="5" fill="#FFD700" />
                        <circle cx="100" cy="180" r="5" fill="#FFD700" />
                        <circle cx="20" cy="180" r="5" fill="#FFD700" />
                        <circle cx="20" cy="100" r="5" fill="#FFD700" />
                        <circle cx="20" cy="20" r="5" fill="#FFD700" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Movement guidelines overlay */}
              <div className="absolute top-4 left-4 right-4 bg-black/60 rounded-lg p-2">
                <h3 className="text-yellow-400 font-bold text-sm mb-1">POSITION MOVEMENT GUIDE</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-white">GK: King (1)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-white">DEF: Rook (4)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-white">MID: Queen (2)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-white">WNG: Knight (L)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-white">ST: Bishop (3)</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Position Details */}
            <HolographicBackground>
              <div className="p-4">
                <h3 className="text-white font-bold mb-2">PLAYER MOVEMENT PATTERNS</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-blue-400 font-bold text-sm mb-1">MIDFIELDERS (CM, CDM, CAM)</h4>
                    <p className="text-sm text-gray-300">Move like the Queen in chess, but limited to 2 squares maximum per turn. Can move in any direction (horizontal, vertical, diagonal).</p>
                    <div className="flex mt-2 gap-2">
                      <Button3D color="blue" size="small" onClick={() => setShowSpecialMove(!showSpecialMove)}>
                        {showSpecialMove ? 'HIDE PATTERN' : 'SHOW PATTERN'}
                      </Button3D>
                    </div>
                  </div>
                </div>
              </div>
            </HolographicBackground>
          </div>
        );
      
      case 'tournament':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">TOURNAMENTS</h1>
            </div>
            
            {/* Current League Status */}
            <div className="relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-4 mb-4">
              <div className="absolute top-0 right-0 m-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center border-4 border-amber-200">
                  <Trophy size={32} className="text-white" />
                </div>
              </div>
              
              <h2 className="text-white font-bold mb-1">CHAMPIONS LEAGUE</h2>
              <div className="text-sm text-blue-300 mb-4">DIVISION 3</div>
              
              <div className="flex items-center mb-4">
                <div className="flex-grow">
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '65%'}}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">1,254 points</span>
                    <span className="text-gray-400">2,000 points needed</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-white">
                  <div>Current Rank: <span className="text-yellow-400 font-bold">#1,245</span></div>
                  <div>Season Ends: <span className="text-yellow-400 font-bold">6d 12h</span></div>
                </div>
                
                <Button3D color="green">
                  PLAY MATCH
                </Button3D>
              </div>
            </div>
            
            {/* Tournament List */}
            <h2 className="text-lg font-bold text-white mb-2">ACTIVE TOURNAMENTS</h2>
            <div className="space-y-3 mb-4">
              <HolographicBackground intensity="low">
                <div className="p-3 flex items-center">
                  <div className="mr-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-white font-bold">Weekend League</div>
                    <div className="text-xs text-blue-300">Qualify for exclusive rewards</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-yellow-400 mb-1">5/20 Matches</div>
                    <Button3D color="blue" size="small">
                      PLAY
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3 flex items-center">
                  <div className="mr-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-white font-bold">El Clásico Cup</div>
                    <div className="text-xs text-blue-300">Special event tournament</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-green-400 mb-1">Starts in 2d</div>
                    <Button3D color="purple" size="small">
                      REGISTER
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
            </div>
            
            {/* Leaderboard Preview */}
            <h2 className="text-lg font-bold text-white mb-2">TOP PLAYERS</h2>
            <HolographicBackground>
              <div className="p-3">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2 px-2">
                  <div>Rank</div>
                  <div>Player</div>
                  <div>Division</div>
                  <div>Points</div>
                </div>
                
                {[1, 2, 3].map(rank => (
                  <div key={`rank-${rank}`} className="flex items-center justify-between p-2 border-b border-gray-700/50">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
                    }`}>
                      <span className="text-black font-bold text-xs">{rank}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 mr-2 flex items-center justify-center text-white text-xs font-bold">
                        {rank === 1 ? 'TS' : rank === 2 ? 'KT' : 'MR'}
                      </div>
                      <div className="text-white text-sm">
                        {rank === 1 ? 'TacticalMaster' : rank === 2 ? 'KingTiki' : 'MessiRonaldo'}
                      </div>
                    </div>
                    
                    <div className="text-blue-400 text-sm">Div {rank}</div>
                    
                    <div className="text-yellow-400 font-bold text-sm">
                      {rank === 1 ? '12,450' : rank === 2 ? '11,872' : '10,935'}
                    </div>
                  </div>
                ))}
                
                <div className="mt-3 flex justify-center">
                  <Button3D color="blue" size="small">
                    VIEW FULL LEADERBOARD
                  </Button3D>
                </div>
              </div>
            </HolographicBackground>
          </div>
        );
        
      case 'season-pass':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">SEASON PASS</h1>
              <div className="ml-auto">
                <Button3D color="amber">
                  UPGRADE TO PRO
                </Button3D>
              </div>
            </div>
            
            {/* Season progress */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-white font-bold">SEASON 4: ROAD TO GLORY</h2>
                <div className="text-yellow-400 text-sm font-bold">27d 12h left</div>
              </div>
              
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-xs font-bold mr-2">
                  22
                </div>
                <div className="flex-grow">
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-xs font-bold ml-2">
                  50
                </div>
              </div>
              
              <div className="text-center text-sm text-blue-300">
                Tier 22/50 - Unlock premium rewards by completing in-game challenges
              </div>
            </div>
            
            {/* Rewards track */}
            <div className="flex-grow overflow-y-auto">
              <h2 className="text-lg font-bold text-white mb-2">REWARDS TRACK</h2>
              
              <div className="relative pb-4">
                {/* Reward track line */}
                <div className="absolute left-8 top-8 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                
                {/* Reward tiers */}
                {[
                  {tier: 23, reward: "Gold Pack", type: "pack", color: "amber"},
                  {tier: 24, reward: "1,000 Coins", type: "currency", color: "yellow"},
                  {tier: 25, reward: "Rare Midfielder", type: "player", color: "blue"},
                  {tier: 26, reward: "Stadium Theme", type: "cosmetic", color: "purple"},
                  {tier: 27, reward: "Elite Pack", type: "pack", color: "red", premium: true}
                ].map((reward, index) => (
                  <div key={`reward-${index}`} className="flex items-start mb-4 relative">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center z-10 ${
                      reward.premium ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-2 border-yellow-300' : 
                      'bg-gradient-to-br from-blue-600 to-blue-900'
                    }`}>
                      <div className="text-white font-bold">{reward.tier}</div>
                    </div>
                    
                    <div className="ml-4 flex-grow">
                      <div className={`${reward.premium ? 'bg-gradient-to-br from-amber-800/50 to-amber-600/30' : 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40'} 
                        rounded-lg p-3 border ${reward.premium ? 'border-yellow-500/50' : 'border-blue-500/20'}`}>
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-lg mr-3 flex items-center justify-center bg-${reward.color}-500/50`}>
                            {reward.type === 'pack' && <Gift size={24} className="text-white" />}
                            {reward.type === 'currency' && <div className="text-yellow-300 text-xl font-bold">₿</div>}
                            {reward.type === 'player' && <User size={24} className="text-white" />}
                            {reward.type === 'cosmetic' && <Settings size={24} className="text-white" />}
                          </div>
                          
                          <div>
                            <div className="text-white font-bold">{reward.reward}</div>
                            <div className="text-xs text-blue-300">Tier {reward.tier} reward</div>
                          </div>
                          
                          {reward.premium && (
                            <div className="ml-auto bg-gradient-to-r from-yellow-400 to-amber-600 text-xs rounded-full px-2 py-1 text-black font-bold">
                              PRO
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'stadium':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">STADIUM CUSTOMIZATION</h1>
            </div>
            
            {/* Stadium preview */}
            <div className="relative w-full h-48 perspective-1000 overflow-hidden rounded-xl mb-4">
              {/* Sky backdrop with dynamic weather */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-600">
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-yellow-300 rounded-full blur-xl opacity-70"></div>
              </div>
              
              {/* Stadium structure */}
              <div className="absolute inset-0">
                {/* Field */}
                <div className="absolute bottom-0 left-10 right-10 h-20 bg-green-700 transform rotateX-60 origin-bottom"></div>
                
                {/* Stands */}
                <div className="absolute bottom-20 left-0 w-10 h-24 bg-gradient-to-t from-gray-800 to-gray-700 transform rotateY-45"></div>
                <div className="absolute bottom-20 right-0 w-10 h-24 bg-gradient-to-t from-gray-800 to-gray-700 transform -rotateY-45"></div>
                <div className="absolute bottom-20 left-10 right-10 h-6 bg-gradient-to-t from-gray-800 to-gray-700 transform rotateX-60 origin-bottom"></div>
                
                {/* Crowd */}
                <div className="absolute bottom-24 left-12 right-12 h-3 bg-gradient-to-r from-blue-500 to-blue-700 to-red-500 to-red-700 animate-pulse transform rotateX-60 origin-bottom"></div>
                
                {/* Stadium lights */}
                <div className="absolute top-10 left-20 w-2 h-20 bg-gray-300"></div>
                <div className="absolute top-8 left-20 w-6 h-2 bg-gray-300"></div>
                <div className="absolute top-10 right-20 w-2 h-20 bg-gray-300"></div>
                <div className="absolute top-8 right-20 w-6 h-2 bg-gray-300"></div>
                
                {/* Light beams */}
                <div className="absolute top-8 left-20 w-20 h-40 bg-gradient-to-b from-yellow-100/30 to-transparent transform rotate-30 origin-top-left"></div>
                <div className="absolute top-8 right-20 w-20 h-40 bg-gradient-to-b from-yellow-100/30 to-transparent transform -rotate-30 origin-top-right"></div>
              </div>
              
              {/* Stadium name */}
              <div className="absolute top-2 left-0 right-0 text-center">
                <div className="inline-block bg-black/50 rounded-full px-4 py-1">
                  <span className="text-white font-bold">FOOT CHESS ARENA</span>
                </div>
              </div>
              
              {/* Customization indicators */}
              <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                <Button3D color="blue" size="small">
                  EDIT
                </Button3D>
                
                <Button3D color="green" size="small">
                  THEMES
                </Button3D>
              </div>
            </div>
            
            {/* Customization options */}
            <h2 className="text-lg font-bold text-white mb-2">STADIUM UPGRADES</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="text-white font-bold mb-1">Field Surface</div>
                  <div className="flex justify-between">
                    <div className="text-xs text-blue-300">Premium Grass</div>
                    <div className="text-xs text-green-400">Equipped</div>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="text-white font-bold mb-1">Crowd Chants</div>
                  <div className="flex justify-between">
                    <div className="text-xs text-blue-300">Classic</div>
                    <div className="text-xs text-yellow-400">Upgrade</div>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="text-white font-bold mb-1">Goal Celebration</div>
                  <div className="flex justify-between">
                    <div className="text-xs text-blue-300">Fireworks</div>
                    <div className="text-xs text-green-400">Equipped</div>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="text-white font-bold mb-1">Weather Effects</div>
                  <div className="flex justify-between">
                    <div className="text-xs text-blue-300">Dynamic</div>
                    <div className="text-xs text-yellow-400">Upgrade</div>
                  </div>
                </div>
              </HolographicBackground>
            </div>
            
            {/* Theme gallery */}
            <h2 className="text-lg font-bold text-white mb-2">STADIUM THEMES</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {["Classic", "Night Mode", "Retro", "Futuristic", "World Cup"].map((theme, index) => (
                <div key={`theme-${index}`} className="w-32 h-20 flex-shrink-0 relative rounded-lg overflow-hidden">
                  <div className={`absolute inset-0 ${
                    index === 0 ? 'bg-gradient-to-b from-blue-500 to-blue-700' :
                    index === 1 ? 'bg-gradient-to-b from-indigo-900 to-gray-900' :
                    index === 2 ? 'bg-gradient-to-b from-amber-500 to-amber-700 sepia brightness-75' :
                    index === 3 ? 'bg-gradient-to-b from-cyan-500 to-blue-900' :
                    'bg-gradient-to-b from-yellow-500 to-amber-700'
                  }`}></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white font-bold text-sm">{theme}</div>
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'tutorial':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">TUTORIAL</h1>
            </div>
            
            {/* Tutorial video/animation placeholder */}
            <div className="relative w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-4 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Play size={32} className="text-white" />
              </div>
              
              <div className="absolute bottom-2 left-2 right-2 flex items-center">
                <div className="flex-grow h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-blue-500 rounded-full"></div>
                </div>
                <div className="ml-2 text-xs text-white">1:25 / 4:30</div>
              </div>
            </div>
            
            {/* Tutorial steps */}
            <h2 className="text-lg font-bold text-white mb-2">GAMEPLAY BASICS</h2>
            <div className="space-y-3 overflow-y-auto flex-grow">
              <HolographicBackground>
                <div className="p-4">
                  <h3 className="text-blue-400 font-bold mb-2">1. CHESS-LIKE MOVEMENT</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Each player card moves like a specific chess piece. Goalkeeper moves like a King (1 square in any direction),
                    Defenders like Rooks (horizontal and vertical), Midfielders like Queens (any direction), Wingers like Knights (L-shape),
                    and Strikers like Bishops (diagonals).
                  </p>
                  
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {["GK", "DEF", "MID", "WNG", "ST"].map((pos, index) => (
                      <div key={`pos-${index}`} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-red-600' :
                          index === 1 ? 'bg-blue-600' :
                          index === 2 ? 'bg-green-600' :
                          index === 3 ? 'bg-yellow-600' :
                          'bg-purple-600'
                        } flex items-center justify-center mb-1`}>
                          <span className="text-white text-xs font-bold">{pos}</span>
                        </div>
                        <span className="text-white text-xs">{
                          index === 0 ? 'King' :
                          index === 1 ? 'Rook' :
                          index === 2 ? 'Queen' :
                          index === 3 ? 'Knight' :
                          'Bishop'
                        }</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button3D color="blue" size="small" className="w-full">
                    PRACTICE MOVEMENT
                  </Button3D>
                </div>
              </HolographicBackground>
              
              <HolographicBackground>
                <div className="p-4">
                  <h3 className="text-blue-400 font-bold mb-2">2. BALL POSSESSION</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    The ball possession is determined by the number of cards on a square. The team with more cards on a square
                    will win the ball. You can pass the ball between your players to maintain possession and advance toward the goal.
                  </p>
                  
                  <div className="relative w-full h-32 mb-3">
                    <div className="absolute inset-0 bg-green-800 rounded-lg"></div>
                    
                    {/* Visualization of ball possession */}
                    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B1</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 translate-x-4 translate-y-4">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">B2</span>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">R1</span>
                      </div>
                    </div>
                    
                    {/* Ball */}
                    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 translate-x-2 translate-y-2">
                      <div className="w-4 h-4 rounded-full bg-white border border-black"></div>
                    </div>
                    
                    {/* Explanation arrow */}
                    <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 rounded-lg p-1">
                      <span className="text-white text-xs">Blue team has 2 cards vs 1 red = Ball possession</span>
                    </div>
                  </div>
                  
                  <Button3D color="blue" size="small" className="w-full">
                    PRACTICE POSSESSION
                  </Button3D>
                </div>
              </HolographicBackground>
              
              <HolographicBackground>
                <div className="p-4">
                  <h3 className="text-blue-400 font-bold mb-2">3. SCORING & WINNING</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    To score a goal, you must move a player with the ball to one of the three goal squares and shoot.
                    Goalkeepers can save shots based on their rating. The team with the most goals at the end of the match wins.
                  </p>
                  
                  <div className="flex justify-center mb-3">
                    <div className="relative w-32 h-24">
                      <div className="absolute inset-0 bg-green-800 rounded-lg"></div>
                      
                      {/* Goal area */}
                      <div className="absolute top-1/4 bottom-1/4 left-0 w-4 border-2 border-white rounded-r-lg"></div>
                      
                      {/* Player with ball */}
                      <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center relative">
                          <span className="text-white text-xs font-bold">ST</span>
                          <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-white border border-black"></div>
                        </div>
                      </div>
                      
                      {/* Goalkeeper */}
                      <div className="absolute top-1/2 left-1/8 transform -translate-y-1/2">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">GK</span>
                        </div>
                      </div>
                      
                      {/* Shot trajectory */}
                      <svg className="absolute inset-0 w-full h-full" overflow="visible">
                        <path d="M 40,48 L 10,48" stroke="#FFFF00" strokeWidth="2" strokeDasharray="5,3" />
                        <circle cx="10" cy="48" r="4" fill="#FFFF00" />
                      </svg>
                    </div>
                  </div>
                  
                  <Button3D color="blue" size="small" className="w-full">
                    PRACTICE SHOOTING
                  </Button3D>
                </div>
              </HolographicBackground>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">NOTIFICATIONS</h1>
              <div className="ml-auto">
                <Button3D color="blue" size="small">
                  MARK ALL READ
                </Button3D>
              </div>
            </div>
            
            {/* Notifications list */}
            <div className="flex-grow overflow-y-auto space-y-3">
              {notifications.map((notification, index) => (
                <HolographicBackground key={`notif-${index}`} intensity={notification.read ? "low" : "medium"}>
                  <div className="p-3 flex items-start">
                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      notification.type === 'reward' ? 'bg-yellow-600' :
                      notification.type === 'match' ? 'bg-green-600' :
                      'bg-blue-600'
                    }`}>
                      {notification.type === 'reward' && <Gift size={20} className="text-white" />}
                      {notification.type === 'match' && <Trophy size={20} className="text-white" />}
                      {notification.type === 'social' && <Users size={20} className="text-white" />}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-white font-bold">{notification.message}</div>
                      <div className="text-xs text-blue-300 mt-1">1 hour ago</div>
                    </div>
                    
                    {!notification.read && (
                      <div className="shrink-0 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </HolographicBackground>
              ))}
              
              <HolographicBackground intensity="low">
                <div className="p-3 flex items-start">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                    <Gift size={20} className="text-white" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-white font-bold">Weekend Tournament Starts Tomorrow!</div>
                    <div className="text-xs text-blue-300 mt-1">5 hours ago</div>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3 flex items-start">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                    <Trophy size={20} className="text-white" />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-white font-bold">You've been promoted to Division 3!</div>
                    <div className="text-xs text-blue-300 mt-1">Yesterday</div>
                  </div>
                </div>
              </HolographicBackground>
            </div>
            
            {/* Settings shortcuts */}
            <div className="mt-4">
              <h2 className="text-lg font-bold text-white mb-2">NOTIFICATION SETTINGS</h2>
              <HolographicBackground>
                <div className="p-3 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-white">Match Notifications</div>
                    <div className="w-10 h-6 bg-green-600 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-white">Friend Requests</div>
                    <div className="w-10 h-6 bg-green-600 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-white">Special Offers</div>
                    <div className="w-10 h-6 bg-gray-600 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-white">Tournament Updates</div>
                    <div className="w-10 h-6 bg-green-600 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full transform translate-x-4"></div>
                    </div>
                  </div>
                </div>
              </HolographicBackground>
            </div>
          </div>
        );
        
      case 'training':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">TRAINING CENTER</h1>
            </div>
            
            {/* Main training options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div 
                className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl overflow-hidden relative h-36 cursor-pointer"
                onClick={() => navigateTo('practice-match')}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-700 mb-2 flex items-center justify-center">
                    <div className="text-white font-bold">AI</div>
                  </div>
                  <div className="text-white font-bold">Practice Match</div>
                  <div className="text-xs text-blue-300">Play against AI at different difficulty levels</div>
                </div>
                
                {/* 3D field background with perspective */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-green-800 transform rotateX-60 origin-bottom opacity-50"></div>
                  <div className="absolute bottom-20 left-0 right-0 h-16 bg-gradient-to-b from-gray-800 to-transparent opacity-30"></div>
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl overflow-hidden relative h-36 cursor-pointer"
                onClick={() => navigateTo('formation-lab')}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 mb-2 flex items-center justify-center">
                    <div className="text-white font-bold">TF</div>
                  </div>
                  <div className="text-white font-bold">Formation Lab</div>
                  <div className="text-xs text-blue-300">Experiment with team tactics and formations</div>
                </div>
                
                {/* Formation diagram background */}
                <div className="absolute top-4 right-4 opacity-30">
                  <div className="grid grid-cols-3 gap-1">
                    {[...Array(11)].map((_, i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-white"></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl overflow-hidden relative h-36 cursor-pointer"
                onClick={() => navigateTo('scenario-challenges')}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 mb-2 flex items-center justify-center">
                    <div className="text-white font-bold">SC</div>
                  </div>
                  <div className="text-white font-bold">Scenario Challenges</div>
                  <div className="text-xs text-blue-300">Win from specific game situations</div>
                </div>
                
                {/* Challenge stars background */}
                <div className="absolute top-2 right-2 flex">
                  <div className="w-5 h-5 text-yellow-400">★</div>
                  <div className="w-5 h-5 text-yellow-400">★</div>
                  <div className="w-5 h-5 text-gray-600">★</div>
                </div>
              </div>
              
              <div 
                className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl overflow-hidden relative h-36 cursor-pointer"
                onClick={() => navigateTo('card-testing')}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 mb-2 flex items-center justify-center">
                    <div className="text-white font-bold">CT</div>
                  </div>
                  <div className="text-white font-bold">Card Testing</div>
                  <div className="text-xs text-blue-300">Try out new cards and abilities</div>
                </div>
                
                {/* Card background */}
                <div className="absolute top-2 right-2 w-16 h-20 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg transform rotate-12 opacity-40"></div>
              </div>
            </div>
            
            {/* Training progress */}
            <HolographicBackground>
              <div className="p-4">
                <h2 className="text-white font-bold mb-2">TRAINING PROGRESS</h2>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">Basic Gameplay</span>
                      <span className="text-green-400">100%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">Advanced Movement</span>
                      <span className="text-yellow-400">75%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">Special Abilities</span>
                      <span className="text-red-400">30%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-blue-300">Tactical Mastery</span>
                      <span className="text-red-400">15%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full" style={{width: '15%'}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <Button3D color="green" size="small">
                    CONTINUE TRAINING
                  </Button3D>
                </div>
              </div>
            </HolographicBackground>
            
            {/* Recent training activity */}
            <div className="mt-4">
              <h2 className="text-lg font-bold text-white mb-2">RECENT ACTIVITY</h2>
              
              <div className="space-y-2">
                <HolographicBackground intensity="low">
                  <div className="p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3">
                      <div className="text-white text-xs font-bold">W</div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-white font-bold">Practice Match</div>
                      <div className="text-xs text-blue-300">Won 3-1 against AI (Medium)</div>
                    </div>
                    <div className="text-xs text-gray-400">2h ago</div>
                  </div>
                </HolographicBackground>
                
                <HolographicBackground intensity="low">
                  <div className="p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <div className="text-white text-xs font-bold">C</div>
                    </div>
                    <div className="flex-grow">
                      <div className="text-white font-bold">Formation Changed</div>
                      <div className="text-xs text-blue-300">Switched to 4-3-3 Attack</div>
                    </div>
                    <div className="text-xs text-gray-400">5h ago</div>
                  </div>
                </HolographicBackground>
              </div>
            </div>
          </div>
        );
      
      case 'practice-match':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('training')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">PRACTICE MATCH</h1>
            </div>
            
            {/* AI Difficulty Selection */}
            <h2 className="text-lg font-bold text-white mb-2">SELECT DIFFICULTY</h2>
            
            <div className="grid grid-cols-1 gap-3 mb-4">
              {['Rookie', 'Amateur', 'Professional', 'World Class', 'Legendary'].map((level, index) => (
                <HolographicBackground key={`diff-${index}`} intensity={index === 2 ? "medium" : "low"}>
                  <div className="p-3 flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-green-600' :
                      index === 1 ? 'bg-blue-600' :
                      index === 2 ? 'bg-yellow-600' :
                      index === 3 ? 'bg-orange-600' :
                      'bg-red-600'
                    }`}>
                      <div className="text-white font-bold">{index + 1}</div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-white font-bold">{level}</div>
                      <div className="text-xs text-blue-300">
                        {index === 0 ? 'For beginners learning the basics' :
                         index === 1 ? 'For casual players with some experience' :
                         index === 2 ? 'For regular players looking for a challenge' :
                         index === 3 ? 'For experienced tacticians' :
                         'For master strategists only'}
                      </div>
                    </div>
                    
                    {index === 2 ? (
                      <Button3D color="green" size="small">
                        SELECT
                      </Button3D>
                    ) : (
                      <button className="text-gray-400 text-sm font-bold">
                        SELECT
                      </button>
                    )}
                  </div>
                </HolographicBackground>
              ))}
            </div>
            
            {/* Match Settings */}
            <h2 className="text-lg font-bold text-white mb-2">MATCH SETTINGS</h2>
            
            <HolographicBackground>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-white">Half Length</div>
                  <div className="flex items-center bg-gray-800 rounded-full h-8 px-2">
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400">-</button>
                    <span className="w-8 text-center text-white font-bold">5m</span>
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400">+</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-white">Weather</div>
                  <div className="flex items-center gap-2">
                    {renderWeatherIcon()}
                    <span className="text-blue-400 font-bold capitalize">{weather}</span>
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400">⟳</button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-white">Stadium</div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">Home</span>
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400">⟳</button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button3D color="green" className="w-full">
                    START PRACTICE MATCH
                  </Button3D>
                </div>
              </div>
            </HolographicBackground>
          </div>
        );
      
      case 'formation-lab':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('training')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">FORMATION LAB</h1>
              <div className="ml-auto">
                <Button3D color="green" size="small">
                  SAVE
                </Button3D>
              </div>
            </div>
            
            {/* Formation selection */}
            <div className="flex gap-2 overflow-x-auto mb-4">
              {['4-3-3', '4-4-2', '3-5-2', '5-3-2', '4-2-3-1'].map((formation, index) => (
                <Button3D 
                  key={`form-${index}`} 
                  color={formation === currentFormation ? "green" : "blue"} 
                  size="small"
                  onClick={() => setCurrentFormation(formation)}
                  className="whitespace-nowrap"
                >
                  {formation}
                </Button3D>
              ))}
            </div>
            
            {/* 3D Formation Visualization */}
            <div className="relative w-full h-72 perspective-1000 overflow-hidden rounded-xl mb-4 bg-gradient-to-b from-green-800 to-green-900">
              {/* Field lines */}
              <div className="absolute inset-0 grid-lines opacity-30"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-12 border border-white/30 rounded-full"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border border-white/30 rounded-t-lg"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-20 border border-white/30 rounded-b-lg"></div>
              
              {/* Formation dots - 4-3-3 */}
              {currentFormation === "4-3-3" && (
                <>
                  {/* GK */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">GK</span>
                  </div>
                  
                  {/* Defenders */}
                  <div className="absolute bottom-16 left-1/5 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">LB</span>
                  </div>
                  <div className="absolute bottom-16 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CB</span>
                  </div>
                  <div className="absolute bottom-16 right-1/3 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CB</span>
                  </div>
                  <div className="absolute bottom-16 right-1/5 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">RB</span>
                  </div>
                  
                  {/* Midfielders */}
                  <div className="absolute bottom-32 left-1/4 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="absolute bottom-32 right-1/4 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  
                  {/* Forwards */}
                  <div className="absolute top-16 left-1/4 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">LW</span>
                  </div>
                  <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">ST</span>
                  </div>
                  <div className="absolute top-16 right-1/4 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">RW</span>
                  </div>
                </>
              )}
              
              {/* Formation dots - 4-4-2 */}
              {currentFormation === "4-4-2" && (
                <>
                  {/* GK */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">GK</span>
                  </div>
                  
                  {/* Defenders */}
                  <div className="absolute bottom-16 left-1/5 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">LB</span>
                  </div>
                  <div className="absolute bottom-16 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CB</span>
                  </div>
                  <div className="absolute bottom-16 right-1/3 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CB</span>
                  </div>
                  <div className="absolute bottom-16 right-1/5 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">RB</span>
                  </div>
                  
                  {/* Midfielders */}
                  <div className="absolute bottom-32 left-1/5 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">LM</span>
                  </div>
                  <div className="absolute bottom-32 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="absolute bottom-32 right-1/3 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">CM</span>
                  </div>
                  <div className="absolute bottom-32 right-1/5 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">RM</span>
                  </div>
                  
                  {/* Forwards */}
                  <div className="absolute top-16 left-1/3 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">ST</span>
                  </div>
                  <div className="absolute top-16 right-1/3 transform translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center draggable-player cursor-move">
                    <span className="text-white text-xs font-bold">ST</span>
                  </div>
                </>
              )}
              
              {/* Guidance text */}
              <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-white opacity-70">
                Drag players to adjust positions
              </div>
            </div>
            
            {/* Formation Stats */}
            <h2 className="text-lg font-bold text-white mb-2">FORMATION STATS</h2>
            
            <HolographicBackground>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-blue-300 text-sm mb-1">Attack Rating</div>
                    <div className="flex items-center">
                      <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{
                          width: currentFormation === "4-3-3" ? '85%' : 
                                 currentFormation === "4-4-2" ? '70%' : '60%'
                        }}></div>
                      </div>
                      <div className="text-white font-bold">
                        {currentFormation === "4-3-3" ? '85' : 
                         currentFormation === "4-4-2" ? '70' : '60'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-blue-300 text-sm mb-1">Defense Rating</div>
                    <div className="flex items-center">
                      <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{
                          width: currentFormation === "4-3-3" ? '65%' : 
                                 currentFormation === "4-4-2" ? '75%' : '85%'
                        }}></div>
                      </div>
                      <div className="text-white font-bold">
                        {currentFormation === "4-3-3" ? '65' : 
                         currentFormation === "4-4-2" ? '75' : '85'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-blue-300 text-sm mb-1">Midfield Control</div>
                    <div className="flex items-center">
                      <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{
                          width: currentFormation === "4-3-3" ? '80%' : 
                                 currentFormation === "4-4-2" ? '70%' : '90%'
                        }}></div>
                      </div>
                      <div className="text-white font-bold">
                        {currentFormation === "4-3-3" ? '80' : 
                         currentFormation === "4-4-2" ? '70' : '90'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-blue-300 text-sm mb-1">Width</div>
                    <div className="flex items-center">
                      <div className="flex-grow h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{
                          width: currentFormation === "4-3-3" ? '90%' : 
                                 currentFormation === "4-4-2" ? '85%' : '60%'
                        }}></div>
                      </div>
                      <div className="text-white font-bold">
                        {currentFormation === "4-3-3" ? '90' : 
                         currentFormation === "4-4-2" ? '85' : '60'}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button3D color="blue" size="small">
                    TEST IN PRACTICE MATCH
                  </Button3D>
                </div>
              </div>
            </HolographicBackground>
          </div>
        );
        
      case 'friends':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">FRIENDS</h1>
              <div className="ml-auto">
                <Button3D color="blue" size="small">
                  ADD FRIEND
                </Button3D>
              </div>
            </div>
            
            {/* Search and filters */}
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search friends..." 
                className="w-full bg-gray-800 text-white rounded-lg py-2 px-3 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            {/* Online friends */}
            <h2 className="text-lg font-bold text-white mb-2 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              ONLINE (3)
            </h2>
            
            <div className="space-y-2 mb-4">
              {[
                {name: "TacticalMaster", level: 32, status: "In Match"},
                {name: "GoalMachine", level: 28, status: "Online"},
                {name: "MidFieldGenius", level: 30, status: "In Shop"}
              ].map((friend, index) => (
                <HolographicBackground key={`friend-${index}`}>
                  <div className="p-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{friend.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-white font-bold">{friend.name}</div>
                      <div className="flex items-center text-xs">
                        <span className="text-blue-300 mr-2">Lvl {friend.level}</span>
                        <span className="text-green-400">{friend.status}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Button3D color="green" size="small">
                        CHALLENGE
                      </Button3D>
                    </div>
                  </div>
                </HolographicBackground>
              ))}
            </div>
            
            {/* Offline friends */}
            <h2 className="text-lg font-bold text-white mb-2 flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              OFFLINE (2)
            </h2>
            
            <div className="space-y-2 mb-4">
              {[
                {name: "StrikerElite", level: 25, lastSeen: "2h ago"},
                {name: "DefenseWall", level: 27, lastSeen: "5h ago"}
              ].map((friend, index) => (
                <HolographicBackground key={`friend-off-${index}`} intensity="low">
                  <div className="p-3 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{friend.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-white font-bold">{friend.name}</div>
                      <div className="flex items-center text-xs">
                        <span className="text-blue-300 mr-2">Lvl {friend.level}</span>
                        <span className="text-gray-400">Last seen: {friend.lastSeen}</span>
                      </div>
                    </div>
                    
                    <div>
                      <Button3D color="blue" size="small">
                        MESSAGE
                      </Button3D>
                    </div>
                  </div>
                </HolographicBackground>
              ))}
            </div>
            
            {/* Friend Requests */}
            <h2 className="text-lg font-bold text-white mb-2">FRIEND REQUESTS (2)</h2>
            
            <HolographicBackground>
              <div className="p-3">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">F</span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-white font-bold">FootballKing99</div>
                    <div className="text-xs text-blue-300">Lvl 21</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button3D color="green" size="small">
                      ACCEPT
                    </Button3D>
                    <Button3D color="red" size="small">
                      DECLINE
                    </Button3D>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">S</span>
                  </div>
                  
                  <div className="flex-grow">
                    <div className="text-white font-bold">SuperStriker</div>
                    <div className="text-xs text-blue-300">Lvl 18</div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button3D color="green" size="small">
                      ACCEPT
                    </Button3D>
                    <Button3D color="red" size="small">
                      DECLINE
                    </Button3D>
                  </div>
                </div>
              </div>
            </HolographicBackground>
          </div>
        );
      
      case 'clan':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">ALLIANCE</h1>
            </div>
            
            {/* Clan Header */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-4 mb-4">
              <div className="flex mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center text-3xl mr-4">
                  {clanData.emblem}
                </div>
                
                <div className="flex-grow">
                  <div className="text-xl font-bold text-white">{clanData.name}</div>
                  <div className="text-sm text-blue-300">Level {clanData.level}</div>
                  <div className="flex items-center text-xs text-gray-300 mt-1">
                    <span className="mr-3">Members: {clanData.members}/{clanData.maxMembers}</span>
                    <span>Trophies: {clanData.trophies}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs rounded-full px-2 py-1 mb-1">
                    Rank #{clanData.ranking}
                  </div>
                  <Button3D color="blue" size="small">
                    INVITE
                  </Button3D>
                </div>
              </div>
              
              <div className="text-sm text-white bg-black/20 rounded-lg p-2">
                "United by passion, driven by excellence - we dominate the pitch with strategy and skill!"
              </div>
            </div>
            
            {/* Upcoming Clan Events */}
            <h2 className="text-lg font-bold text-white mb-2">UPCOMING EVENTS</h2>
            
            <div className="space-y-3 mb-4">
              {clanData.events.map((event, index) => (
                <HolographicBackground key={`event-${index}`}>
                  <div className="p-3 flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      event.type === 'monthly' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                      event.type === 'season' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                      'bg-gradient-to-br from-amber-500 to-amber-700'
                    }`}>
                      <Trophy size={20} className="text-white" />
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-white font-bold">{event.name}</div>
                      <div className="text-xs text-blue-300">
                        {event.type === 'monthly' ? 'Monthly Alliance Challenge' :
                         event.type === 'season' ? 'Seasonal Alliance League' :
                         'Annual World Championship'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-yellow-400 font-bold text-sm">{event.date}</div>
                      <Button3D color="green" size="small" className="mt-1">
                        {event.type === 'monthly' ? 'PREPARE' : 'VIEW'}
                      </Button3D>
                    </div>
                  </div>
                </HolographicBackground>
              ))}
            </div>
            
            {/* Alliance Members */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-white">MEMBERS</h2>
              <div className="text-sm text-blue-400">See All</div>
            </div>
            
            <div className="space-y-2 overflow-y-auto flex-grow">
              {clanData.members.map((member, index) => (
                <HolographicBackground key={`member-${index}`} intensity={member.status === 'online' ? 'medium' : 'low'}>
                  <div className="p-3 flex items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                      member.role === 'Leader' ? 'bg-amber-600' :
                      member.role === 'Co-Leader' ? 'bg-purple-600' :
                      member.role === 'Elder' ? 'bg-blue-600' :
                      'bg-green-600'
                    }`}>
                      <span className="text-white font-bold">{member.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center">
                        <span className="text-white font-bold mr-2">{member.name}</span>
                        {member.status === 'online' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="text-xs text-blue-300">
                        {member.role}
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="text-yellow-400">{member.trophies} 🏆</span>
                      </div>
                    </div>
                    
                    <div>
                      <Button3D color="blue" size="small">
                        PROFILE
                      </Button3D>
                    </div>
                  </div>
                </HolographicBackground>
              ))}
            </div>
          </div>
        );
      
      case 'clan-wars':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('clan')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">ALLIANCE WARS</h1>
            </div>
            
            {/* Current War Status */}
            <div className="relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-4 mb-4 overflow-hidden">
              {/* Background effects */}
              <div className="absolute -right-10 top-0 bottom-0 w-40 bg-red-500/10 transform skew-x-12 blur-xl"></div>
              <div className="absolute -left-10 top-0 bottom-0 w-40 bg-blue-500/10 transform -skew-x-12 blur-xl"></div>
              
              <div className="relative">
                <div className="text-white font-bold mb-4 text-center">MONTHLY CHALLENGE</div>
                
                <div className="flex items-center justify-center mb-4">
                  {/* Our Alliance */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-3xl mb-2">
                      {clanData.emblem}
                    </div>
                    <div className="text-white font-bold">{clanData.name}</div>
                    <div className="text-sm text-blue-300">Level {clanData.level}</div>
                  </div>
                  
                  {/* VS */}
                  <div className="mx-8 flex flex-col items-center">
                    <div className="text-3xl text-yellow-400 font-bold mb-2">VS</div>
                    <div className="bg-gradient-to-r from-blue-500 to-red-500 text-xs text-white rounded-full px-3 py-1">
                      7d 12h left
                    </div>
                  </div>
                  
                  {/* Opponent Alliance */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-3xl mb-2">
                      ⚔️
                    </div>
                    <div className="text-white font-bold">GOAL MASTERS</div>
                    <div className="text-sm text-red-300">Level 11</div>
                  </div>
                </div>
                
                {/* War score */}
                <div className="bg-black/30 rounded-lg p-3 mb-4">
                  <div className="flex justify-between text-sm text-white mb-2">
                    <span>245</span>
                    <span>War Points</span>
                    <span>210</span>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '54%'}}></div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button3D color="green">
                    PLAY WAR MATCH
                  </Button3D>
                </div>
              </div>
            </div>
            
            {/* War Leaderboard */}
            <h2 className="text-lg font-bold text-white mb-2">ALLIANCE CONTRIBUTION</h2>
            
            <div className="space-y-2 overflow-y-auto flex-grow">
              {[
                {name: "TacticalMaster", role: "Leader", points: 45, matches: 3},
                {name: "MidFieldGenius", role: "Co-Leader", points: 40, matches: 3},
                {name: "StrikerElite", role: "Elder", points: 35, matches: 2},
                {name: "DefenseWall", role: "Elder", points: 30, matches: 2},
                {name: "GoalMachine", role: "Member", points: 25, matches: 2}
              ].map((member, index) => (
                <HolographicBackground key={`war-member-${index}`} intensity={index < 2 ? 'medium' : 'low'}>
                  <div className="p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="text-white font-bold">{member.name}</div>
                      <div className="text-xs text-blue-300">
                        {member.role}
                        <span className="text-gray-400 mx-1">•</span>
                        <span className="text-gray-300">{member.matches} matches played</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{member.points} pts</div>
                      <div className="text-xs text-blue-300">
                        {Math.round(member.points / clanData.members.length * 100)}% of total
                      </div>
                    </div>
                  </div>
                </HolographicBackground>
              ))}
            </div>
            
            {/* War History */}
            <h2 className="text-lg font-bold text-white mt-4 mb-2">RECENT WARS</h2>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                {opponent: "GOAL KINGS", result: "win", score: "320-280"},
                {opponent: "FC TACTICIANS", result: "loss", score: "270-310"},
                {opponent: "STRIKER SQUAD", result: "win", score: "350-290"}
              ].map((war, index) => (
                <div 
                  key={`history-${index}`}
                  className={`rounded-lg p-2 text-center ${
                    war.result === 'win' ? 'bg-green-900/30 border border-green-500/30' : 
                    'bg-red-900/30 border border-red-500/30'
                  }`}
                >
                  <div className="text-white text-xs mb-1 truncate">{war.opponent}</div>
                  <div className={`text-sm font-bold ${war.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
                    {war.result.toUpperCase()}
                  </div>
                  <div className="text-gray-300 text-xs">{war.score}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'spectate':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-2">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">LIVE MATCH</h1>
              
              <div className="ml-auto flex items-center gap-2">
                {/* Live spectator count */}
                <div className="flex items-center bg-red-900/50 rounded-full px-2 py-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                  <span className="text-white text-xs font-bold">{liveSpectators} WATCHING</span>
                </div>
                
                <Button3D color="blue" size="small">
                  SHARE
                </Button3D>
              </div>
            </div>
            
            {/* Match info bar */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-lg p-2 mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">MC</span>
                </div>
                <div className="text-white font-bold">3</div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-gray-400 text-xs">75'</div>
                <div className="text-blue-400 text-xs">ALLIANCE LEAGUE</div>
              </div>
              
              <div className="flex items-center">
                <div className="text-white font-bold mr-2">1</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">FC</span>
                </div>
              </div>
            </div>
            
            {/* Live Match View */}
            <div className="relative w-full h-64 perspective-1000 overflow-hidden rounded-xl mb-2">
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
              
              {/* Field base with 3D perspective */}
              <div className="absolute bottom-0 left-0 right-0 h-52 bg-gradient-to-b from-green-700 to-green-900 transform rotateX-60 origin-bottom overflow-hidden">
                {/* Field grid lines */}
                <div className="absolute inset-0 grid-lines opacity-50"></div>
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-12 border-2 border-white/70 rounded-full"></div>
                
                {/* Goals */}
                <div className="absolute bottom-0 left-0 w-10 h-16 border-2 border-white/70"></div>
                <div className="absolute bottom-0 right-0 w-10 h-16 border-2 border-white/70"></div>
                
                {/* Player cards on field - simplified view */}
                {/* Team Blue - MC */}
                <div className="absolute bottom-12 left-1/4 transform -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">GK</span>
                </div>
                
                <div className="absolute bottom-24 left-1/3 transform -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CB</span>
                </div>
                
                <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CM</span>
                </div>
                
                <div className="absolute top-16 left-1/4 transform -translate-x-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">ST</span>
                </div>
                
                {/* Team Red - FC */}
                <div className="absolute bottom-12 right-1/4 transform translate-x-1/2 w-10 h-10 bg-red-600 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs font-bold">GK</span>
                </div>
                
                <div className="absolute bottom-24 right-1/3 transform translate-x-1/2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CB</span>
                </div>
                
                <div className="absolute bottom-32 right-1/2 transform translate-x-1/2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CM</span>
                </div>
                
                <div className="absolute top-16 right-1/4 transform translate-x-1/2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">ST</span>
                </div>
                
                {/* Ball */}
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full"></div>
                
                {/* Current move indicator - ball going to be passed */}
                <svg className="absolute inset-0 w-full h-full" overflow="visible">
                  <path d="M 200,120 C 250,90 350,90 400,120" stroke="#FFFF00" strokeWidth="2" strokeDasharray="5,3" />
                  <circle cx="400" cy="120" r="4" fill="#FFFF00" />
                </svg>
                
                {/* Player turn indicator */}
                <div className="absolute top-16 left-1/4 transform -translate-x-1/2 scale-150">
                  <div className="w-12 h-12 border-2 border-yellow-400 rounded-full animate-pulse opacity-70"></div>
                </div>
              </div>
              
              {/* HUD elements */}
              {/* Last Move */}
              <div className="absolute top-2 left-0 right-0 flex justify-center">
                <div className="bg-black/60 rounded-full px-3 py-1 text-yellow-400 text-xs">
                  PASS: DE BRUYNE → HAALAND
                </div>
              </div>
              
              {/* Move counter */}
              <div className="absolute bottom-2 left-2 bg-black/60 rounded-full px-3 py-1 text-white text-xs">
                MOVE: 2/3
              </div>
              
              {/* Cheers and reactions floating up */}
              <div className="absolute bottom-10 right-10 animate-float-up-fade">
                <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white">
                  👍
                </div>
              </div>
              
              <div className="absolute bottom-20 right-20 animate-float-up-fade animation-delay-500">
                <div className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white">
                  🔥
                </div>
              </div>
            </div>
            
            {/* Match stats tabs */}
            <div className="flex mb-2 border-b border-gray-700">
              <div className="px-4 py-2 text-blue-400 border-b-2 border-blue-400 font-bold text-sm">
                CHAT
              </div>
              <div className="px-4 py-2 text-gray-400 text-sm">
                STATS
              </div>
              <div className="px-4 py-2 text-gray-400 text-sm">
                PLAYERS
              </div>
            </div>
            
            {/* Spectator chat */}
            <div className="flex-grow overflow-y-auto space-y-2 mb-2">
              {spectatorMessages.map((msg, index) => (
                <div key={`chat-${index}`} className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-2 flex-shrink-0">
                    <span className="text-white text-xs font-bold">{msg.name.charAt(0)}</span>
                  </div>
                  <div className="bg-gray-800/60 rounded-lg p-2 max-w-[85%]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white text-xs font-bold">{msg.name}</span>
                      <span className="text-gray-400 text-xs">{msg.time}</span>
                    </div>
                    <div className={msg.type === 'emoji' ? "text-xl" : "text-sm text-gray-200"}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat input and reactions */}
            <div className="flex gap-2 items-center">
              {/* Quick reactions */}
              <div className="flex gap-1">
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600/50 to-blue-800/50 flex items-center justify-center text-white">
                  👍
                </button>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600/50 to-red-800/50 flex items-center justify-center text-white">
                  🔥
                </button>
                <button className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600/50 to-green-800/50 flex items-center justify-center text-white">
                  💪
                </button>
              </div>
              
              {/* Text input */}
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Send a message..." 
                  className="w-full bg-gray-800 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <Button3D color="blue" size="small">
                SEND
              </Button3D>
            </div>
          </div>
        );
        
      case 'spectate-list':
        return (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center mb-4">
              <button className="mr-2" onClick={() => navigateTo('home')}>
                <ChevronLeft size={24} className="text-gray-400" />
              </button>
              <h1 className="text-xl font-bold text-white">LIVE MATCHES</h1>
              <div className="ml-auto flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                <span className="text-white text-xs">{12 + liveSpectators} ONLINE</span>
              </div>
            </div>
            
            {/* Alliance Matches */}
            <h2 className="text-lg font-bold text-white mb-2">ALLIANCE MATCHES</h2>
            
            <div className="space-y-3 mb-4">
              <HolographicBackground>
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">TM</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">TacticalMaster</div>
                        <div className="text-xs text-blue-300">Alliance: {clanData.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold">3 - 1</div>
                      <div className="text-xs text-yellow-400">75'</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div>
                        <div className="text-white font-bold text-right">FootballKing99</div>
                        <div className="text-xs text-red-300 text-right">Alliance: GOAL MASTERS</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center ml-2">
                        <span className="text-white text-xs font-bold">FK</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mr-1">
                        <span className="text-white text-xs">{liveSpectators}</span>
                      </div>
                      <span className="text-xs text-gray-300">watching</span>
                    </div>
                    
                    <Button3D color="green" size="small" onClick={() => navigateTo('spectate')}>
                      WATCH LIVE
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">MG</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">MidFieldGenius</div>
                        <div className="text-xs text-blue-300">Alliance: {clanData.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold">2 - 2</div>
                      <div className="text-xs text-yellow-400">45'</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div>
                        <div className="text-white font-bold text-right">DefenseTitan</div>
                        <div className="text-xs text-red-300 text-right">Alliance: DEFENDERS FC</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center ml-2">
                        <span className="text-white text-xs font-bold">DT</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mr-1">
                        <span className="text-white text-xs">5</span>
                      </div>
                      <span className="text-xs text-gray-300">watching</span>
                    </div>
                    
                    <Button3D color="green" size="small">
                      WATCH LIVE
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
            </div>
            
            {/* Friend Matches */}
            <h2 className="text-lg font-bold text-white mb-2">FRIEND MATCHES</h2>
            
            <div className="space-y-3 mb-4">
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center mr-2">
                        <span className="text-white text-xs font-bold">SE</span>
                      </div>
                      <div>
                        <div className="text-white font-bold">StrikerElite</div>
                        <div className="text-xs text-blue-300">Ranked Match</div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold">1 - 0</div>
                      <div className="text-xs text-yellow-400">12'</div>
                    </div>
                    
                    <div className="flex items-center">
                      <div>
                        <div className="text-white font-bold text-right">ProDefender</div>
                        <div className="text-xs text-gray-300 text-right">Division 2</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center ml-2">
                        <span className="text-white text-xs font-bold">PD</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mr-1">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <span className="text-xs text-gray-300">watching</span>
                    </div>
                    
                    <Button3D color="green" size="small">
                      WATCH LIVE
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
            </div>
            
            {/* Tournament Matches */}
            <h2 className="text-lg font-bold text-white mb-2">TOURNAMENT MATCHES</h2>
            
            <div className="space-y-3">
              <HolographicBackground>
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-xl mr-3">
                      🏆
                    </div>
                    <div>
                      <div className="text-white font-bold">Weekend League Finals</div>
                      <div className="text-xs text-blue-300">SuperStar vs GoalMachine</div>
                    </div>
                    <div className="ml-auto bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                      FEATURED
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mr-1">
                        <span className="text-white text-xs">124</span>
                      </div>
                      <span className="text-xs text-gray-300">watching</span>
                    </div>
                    
                    <Button3D color="amber" size="small">
                      WATCH LIVE
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
              
              <HolographicBackground intensity="low">
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center text-xl mr-3">
                      ⚔️
                    </div>
                    <div>
                      <div className="text-white font-bold">Pro League - Quarterfinals</div>
                      <div className="text-xs text-blue-300">TeamLegend vs PitchMasters</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mr-1">
                        <span className="text-white text-xs">87</span>
                      </div>
                      <span className="text-xs text-gray-300">watching</span>
                    </div>
                    
                    <Button3D color="blue" size="small">
                      WATCH LIVE
                    </Button3D>
                  </div>
                </div>
              </HolographicBackground>
            </div>
          </div>
        );
        
      default:
        return <div>View not implemented</div>;
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes floatUpFade {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
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

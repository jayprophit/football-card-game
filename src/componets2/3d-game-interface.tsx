import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Card Types with 3D Characteristics
const CARD_TYPES = {
  GOALKEEPER: {
    name: 'Goalkeeper',
    description: 'Defensive specialist with high interception skills',
    color: '#3B82F6', // Blue
    stats: {
      defense: 90,
      positioning: 85,
      specialAbility: 'Goal Line Defense'
    }
  },
  DEFENDER: {
    name: 'Defender',
    description: 'Tactical blocking and strategic positioning',
    color: '#10B981', // Green
    stats: {
      defense: 85,
      tackling: 80,
      specialAbility: 'Tactical Block'
    }
  },
  MIDFIELDER: {
    name: 'Midfielder',
    description: 'Playmaker with advanced vision and passing',
    color: '#F59E0B', // Yellow
    stats: {
      passing: 85,
      vision: 80,
      specialAbility: 'Field Control'
    }
  },
  FORWARD: {
    name: 'Forward',
    description: 'Offensive powerhouse with scoring potential',
    color: '#EF4444', // Red
    stats: {
      shooting: 90,
      speed: 85,
      specialAbility: 'Precision Shot'
    }
  }
};

const ThreeDGameInterface = () => {
  // State Management
  const [selectedCard, setSelectedCard] = useState(null);

  // 3D Rendering References
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  // Initialize 3D Scene
  useEffect(() => {
    // Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB); // Sky blue background
    rendererRef.current = renderer;

    // Mount renderer
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Stadium Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x228B22, // Grass green
      side: THREE.DoubleSide 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = Math.PI / 2;
    scene.add(ground);

    // Simple Camera Movement
    let cameraAngle = 0;
    const animateCamera = () => {
      cameraAngle += 0.005;
      camera.position.x = Math.sin(cameraAngle) * 10;
      camera.position.z = Math.cos(cameraAngle) * 10;
      camera.lookAt(scene.position);
    };

    // Animate Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      animateCamera();
      renderer.render(scene, camera);
    };
    animate();

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Create Player Card Representation
  const createPlayerCard = (cardType) => {
    const type = CARD_TYPES[cardType];
    
    return (
      <div 
        className={`
          p-4 rounded-lg shadow-lg 
          transform transition-all 
          hover:scale-105 
          cursor-pointer
        `}
        style={{ backgroundColor: type.color }}
        onClick={() => setSelectedCard(cardType)}
      >
        <h3 className="font-bold text-white text-xl">{type.name}</h3>
        <p className="text-white">{type.description}</p>
        <div className="mt-2 bg-white bg-opacity-20 p-2 rounded">
          <h4 className="font-semibold">Special Ability</h4>
          <p className="text-white">{type.stats.specialAbility}</p>
        </div>
      </div>
    );
  };

  // Render Card Details Modal
  const renderCardDetails = () => {
    if (!selectedCard) return null;
    
    const cardType = CARD_TYPES[selectedCard];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div 
          className="bg-white p-6 rounded-lg max-w-md w-full"
          style={{ backgroundColor: cardType.color }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">{cardType.name}</h2>
          <p className="text-white mb-4">{cardType.description}</p>
          
          <div className="bg-white bg-opacity-20 p-4 rounded">
            <h3 className="font-semibold text-white mb-2">Card Stats</h3>
            {Object.entries(cardType.stats)
              .filter(([key]) => key !== 'specialAbility')
              .map(([stat, value]) => (
                <div key={stat} className="mb-1">
                  <div className="flex justify-between text-white">
                    <span className="capitalize">{stat}</span>
                    <span>{value}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{width: `${value}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            
            <div className="mt-4">
              <h4 className="font-semibold text-white">Special Ability</h4>
              <p className="text-white">{cardType.stats.specialAbility}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setSelectedCard(null)}
            className="mt-4 w-full bg-white bg-opacity-20 text-white p-2 rounded hover:bg-opacity-30"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-screen w-full">
      {/* 3D Rendering Container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0"
      />

      {/* Card Selection Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="grid grid-cols-4 gap-4">
          {Object.keys(CARD_TYPES).map(cardType => createPlayerCard(cardType))}
        </div>
      </div>

      {/* Card Details Modal */}
      {renderCardDetails()}
    </div>
  );
};

export default ThreeDGameInterface;

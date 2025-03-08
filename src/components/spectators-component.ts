import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpectatorProps {
  stadiumType: string;
  sectionSize: number;
  sectionPosition: [number, number, number];
  teamColors: [string, string]; // Primary colors for home and away team
  density?: number; // 0-1 value for crowd density
  excitement?: number; // 0-1 value for crowd movement/excitement
}

const StadiumSpectators: React.FC<SpectatorProps> = ({
  stadiumType,
  sectionSize,
  sectionPosition,
  teamColors,
  density = 0.8,
  excitement = 0.5
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const spectatorRefs = useRef<THREE.Group[]>([]);
  const waveRef = useRef<number>(0);
  
  // Indoor stadiums have different spectator layouts
  const isIndoor = stadiumType.includes('indoor');
  
  // Create spectator instances
  const spectatorCount = useMemo(() => {
    // Calculate based on section size and density
    return Math.floor(sectionSize * 100 * density);
  }, [sectionSize, density]);
  
  // Create spectator colors array based on team colors
  const spectatorColors = useMemo(() => {
    const colors: THREE.Color[] = [];
    const [homeColor, awayColor] = teamColors;
    
    // Convert hex to Three.js colors
    const homeThreeColor = new THREE.Color(homeColor);
    const awayThreeColor = new THREE.Color(awayColor);
    
    // Add base colors
    colors.push(homeThreeColor);
    colors.push(awayThreeColor);
    
    // Add some neutral colors
    colors.push(new THREE.Color('#222222')); // Dark gray
    colors.push(new THREE.Color('#333333')); // Gray
    colors.push(new THREE.Color('#444444')); // Light gray
    colors.push(new THREE.Color('#555555')); // Very light gray
    
    // Add color variations
    const addColorVariation = (baseColor: THREE.Color, count: number) => {
      const hsl = { h: 0, s: 0, l: 0 };
      baseColor.getHSL(hsl);
      
      for (let i = 0; i < count; i++) {
        const variation = new THREE.Color();
        variation.setHSL(
          hsl.h + (Math.random() * 0.1 - 0.05), // Slight hue variation
          Math.max(0, Math.min(1, hsl.s + (Math.random() * 0.2 - 0.1))), // Saturation variation
          Math.max(0.2, Math.min(0.8, hsl.l + (Math.random() * 0.2 - 0.1))) // Lightness variation
        );
        colors.push(variation);
      }
    };
    
    // Add variations of team colors
    addColorVariation(homeThreeColor, 5);
    addColorVariation(awayThreeColor, 5);
    
    return colors;
  }, [teamColors]);

  // Initialize spectators
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Clear any existing spectators
    while (groupRef.current.children.length) {
      groupRef.current.remove(groupRef.current.children[0]);
    }
    
    spectatorRefs.current = [];
    
    // Create stylized "block" spectators (Clash of Clans style)
    const createSpectators = () => {
      const [posX, posY, posZ] = sectionPosition;
      
      for (let i = 0; i < spectatorCount; i++) {
        // Create spectator group
        const spectator = new THREE.Group();
        
        // Position within section
        // For indoor stadiums, arrange in rows and columns
        // For outdoor stadiums, arrange in a more organic cluster
        let x, y, z;
        
        if (isIndoor) {
          // Indoor: Grid-like arrangement
          const row = Math.floor(i / 20);
          const col = i % 20;
          x = posX + (col * 0.25 - 2.5) + (Math.random() * 0.1);
          y = posY + (row * 0.25) + (Math.random() * 0.05);
          z = posZ + (Math.random() * 0.1);
        } else {
          // Outdoor: More organic cluster
          const angle = Math.random() * Math.PI;
          const radius = Math.random() * sectionSize;
          x = posX + Math.cos(angle) * radius;
          z = posZ + Math.sin(angle) * radius;
          y = posY + Math.random() * 0.3;
        }
        
        // Randomly select color from spectator colors
        const colorIndex = Math.floor(Math.random() * spectatorColors.length);
        const spectatorColor = spectatorColors[colorIndex];
        
        // Create basic body - simplified for performance
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.15, 0.1),
          new THREE.MeshStandardMaterial({ color: spectatorColor })
        );
        
        // Create head
        const head = new THREE.Mesh(
          new THREE.SphereGeometry(0.05, 6, 6),
          new THREE.MeshStandardMaterial({ color: 0xE0AC69 }) // Skin tone
        );
        head.position.y = 0.125;
        
        // Add body parts to spectator
        spectator.add(body);
        spectator.add(head);
        
        // Position spectator
        spectator.position.set(x, y, z);
        
        // Add some random rotation
        spectator.rotation.y = Math.random() * Math.PI * 2;
        
        // Store original position for animation
        (spectator as any).originalY = spectator.position.y;
        (spectator as any).phaseOffset = Math.random() * Math.PI * 2;
        (spectator as any).amplitudeMultiplier = 0.7 + Math.random() * 0.6;
        
        // Add to group
        groupRef.current.add(spectator);
        spectatorRefs.current.push(spectator);
      }
    };
    
    createSpectators();
  }, [spectatorCount, sectionPosition, sectionSize, isIndoor, spectatorColors]);
  
  // Animate spectators based on excitement level
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Increase wave counter for Mexican wave effect
    waveRef.current += 0.01;
    
    // Update each spectator
    spectatorRefs.current.forEach((spectator, index) => {
      if (!spectator) return;
      
      // Get original Y position
      const originalY = (spectator as any).originalY || spectator.position.y;
      const phaseOffset = (spectator as any).phaseOffset || 0;
      const amplitudeMultiplier = (spectator as any).amplitudeMultiplier || 1;
      
      // Calculate position in wave
      const spectatorXPos = spectator.position.x - sectionPosition[0];
      const wavePosition = (spectatorXPos + waveRef.current) % (Math.PI * 2);
      
      // Calculate jump height based on excitement and wave
      let jumpHeight = 0;
      
      // If high excitement, add Mexican wave effect
      if (excitement > 0.7) {
        // Mexican wave effect
        if (Math.abs(wavePosition) < 0.5) {
          jumpHeight = Math.sin(wavePosition * Math.PI * 2) * 0.15 * excitement;
        }
      }
      
      // Regular random movement based on excitement
      jumpHeight += Math.sin(state.clock.getElapsedTime() * 3 + phaseOffset) * 0.05 * excitement * amplitudeMultiplier;
      
      // Apply movement
      spectator.position.y = originalY + Math.max(0, jumpHeight);
      
      // Random arm raising for some spectators
      if (index % 5 === 0) {
        // Only animate if spectator has arms (children[2] and children[3])
        if (spectator.children.length > 3) {
          const rightArm = spectator.children[2];
          const leftArm = spectator.children[3];
          
          // Random arm raising based on excitement and time
          const shouldRaiseArms = Math.sin(state.clock.getElapsedTime() * 2 + index) > 0.7;
          
          if (shouldRaiseArms && excitement > 0.3) {
            rightArm.rotation.x = -Math.PI / 2 * excitement;
            leftArm.rotation.x = -Math.PI / 2 * excitement;
          } else {
            rightArm.rotation.x = 0;
            leftArm.rotation.x = 0;
          }
        }
      }
    });
  });
  
  return (
    <group ref={groupRef} />
  );
};

// Multiple crowd sections component
interface CrowdSectionsProps {
  stadiumType: string;
  teamColors: [string, string];
  homeScore: number;
  awayScore: number;
  stadiumSize?: 'small' | 'medium' | 'large';
  crowdDensity?: number;
}

export const CrowdSections: React.FC<CrowdSectionsProps> = ({
  stadiumType,
  teamColors,
  homeScore,
  awayScore,
  stadiumSize = 'medium',
  crowdDensity = 0.8
}) => {
  // Calculate crowd excitement based on scores
  const crowdExcitement = useMemo(() => {
    // Base excitement
    let excitement = 0.5;
    
    // Increase for close/tied games
    if (Math.abs(homeScore - awayScore) <= 1) {
      excitement += 0.2;
    }
    
    // Increase for high-scoring games
    if (homeScore + awayScore >= 4) {
      excitement += 0.2;
    }
    
    // Cap at 1.0
    return Math.min(1.0, excitement);
  }, [homeScore, awayScore]);
  
  // Define stadium section positions based on stadium size
  const sectionPositions = useMemo(() => {
    const isIndoor = stadiumType.includes('indoor');
    let positions: [number, number, number][] = [];
    
    if (isIndoor) {
      // Indoor stadium sections are arranged differently
      positions = [
        // North stand (behind goal)
        [-3, 2, -8],
        [0, 2, -8],
        [3, 2, -8],
        
        // East stand (side)
        [6, 2, -4],
        [6, 2, 0],
        [6, 2, 4],
        
        // South stand (behind goal)
        [-3, 2, 8],
        [0, 2, 8],
        [3, 2, 8],
        
        // West stand (side)
        [-6, 2, -4],
        [-6, 2, 0],
        [-6, 2, 4]
      ];
    } else {
      // Outdoor stadium
      switch (stadiumSize) {
        case 'small':
          positions = [
            // North stand (behind goal)
            [0, 1, -9],
            
            // East stand (side)
            [9, 1, 0],
            
            // South stand (behind goal)
            [0, 1, 9],
            
            // West stand (side)
            [-9, 1, 0]
          ];
          break;
          
        case 'large':
          positions = [
            // North stand (behind goal)
            [-6, 1, -12],
            [-3, 1, -12],
            [0, 1, -12],
            [3, 1, -12],
            [6, 1, -12],
            
            // Northeast corner
            [9, 1, -9],
            
            // East stand (side)
            [12, 1, -6],
            [12, 1, -3],
            [12, 1, 0],
            [12, 1, 3],
            [12, 1, 6],
            
            // Southeast corner
            [9, 1, 9],
            
            // South stand (behind goal)
            [-6, 1, 12],
            [-3, 1, 12],
            [0, 1, 12],
            [3, 1, 12],
            [6, 1, 12],
            
            // Southwest corner
            [-9, 1, 9],
            
            // West stand (side)
            [-12, 1, -6],
            [-12, 1, -3],
            [-12, 1, 0],
            [-12, 1, 3],
            [-12, 1, 6],
            
            // Northwest corner
            [-9, 1, -9]
          ];
          break;
          
        default: // medium
          positions = [
            // North stand (behind goal)
            [-4, 1, -11],
            [0, 1, -11],
            [4, 1, -11],
            
            // East stand (side)
            [11, 1, -4],
            [11, 1, 0],
            [11, 1, 4],
            
            // South stand (behind goal)
            [-4, 1, 11],
            [0, 1, 11],
            [4, 1, 11],
            
            // West stand (side)
            [-11, 1, -4],
            [-11, 1, 0],
            [-11, 1, 4]
          ];
          break;
      }
    }
    
    return positions;
  }, [stadiumType, stadiumSize]);
  
  // Calculate section size based on stadium size
  const sectionSize = useMemo(() => {
    switch (stadiumSize) {
      case 'small': return 3;
      case 'large': return 5;
      default: return 4; // medium
    }
  }, [stadiumSize]);
  
  return (
    <group>
      {sectionPositions.map((position, index) => (
        <StadiumSpectators 
          key={index}
          stadiumType={stadiumType}
          sectionSize={sectionSize}
          sectionPosition={position}
          teamColors={teamColors}
          density={crowdDensity}
          excitement={crowdExcitement}
        />
      ))}
    </group>
  );
};

export default StadiumSpectators;

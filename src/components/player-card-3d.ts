import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture, Html } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Card, InjuryType } from '../models/GameModels';

interface PlayerCard3DProps {
  card: Card;
  position: [number, number, number];
  hasBall: boolean;
  isCurrentTeam: boolean;
  zIndex?: number;
}

const PlayerCard3D: React.FC<PlayerCard3DProps> = ({ 
  card, 
  position,
  hasBall, 
  isCurrentTeam,
  zIndex = 0
}) => {
  const { player } = card;
  const groupRef = useRef<THREE.Group>(null);
  const cardRef = useRef<THREE.Mesh>(null);
  const avatarRef = useRef<THREE.Mesh>(null);
  const hoverRef = useRef<boolean>(false);
  const [hovered, setHovered] = useState(false);
  const [avatarTexture, setAvatarTexture] = useState<THREE.Texture | null>(null);
  
  // Player team colors
  const teamColor = useMemo(() => new THREE.Color(player.team.primaryColor), [player.team.primaryColor]);
  const secondaryColor = useMemo(() => new THREE.Color(player.team.secondaryColor), [player.team.secondaryColor]);
  
  // Load default player textures
  const textures = useTexture({
    cardTemplate: '/images/cards/card_template.png',
    defaultAvatar: '/images/cards/default_avatar.png'
  });
  
  // Load player avatar if available
  useEffect(() => {
    if (player.avatarUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        player.avatarUrl,
        (texture) => {
          setAvatarTexture(texture);
        },
        undefined,
        (err) => {
          console.error('Error loading player avatar:', err);
        }
      );
    }
  }, [player.avatarUrl]);
  
  // Get position abbreviation
  const getPositionAbbr = (position: string): string => {
    return position.split(' ').map(word => word[0]).join('');
  };
  
  // Animation for card hover and selection
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Hover animation
    if (hovered && !hoverRef.current) {
      hoverRef.current = true;
      gsap.to(groupRef.current.position, {
        y: position[1] + 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      if (cardRef.current) {
        gsap.to(cardRef.current.scale, {
          x: 1.1,
          y: 1.1,
          z: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    } else if (!hovered && hoverRef.current) {
      hoverRef.current = false;
      gsap.to(groupRef.current.position, {
        y: position[1],
        duration: 0.3,
        ease: 'power2.out'
      });
      
      if (cardRef.current) {
        gsap.to(cardRef.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }
    
    // Subtle floating animation
    if (cardRef.current) {
      cardRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5 + position[0] * 0.5 + position[2] * 0.7) * 0.05;
    }
    
    // Rotation to face camera
    if (groupRef.current) {
      groupRef.current.lookAt(state.camera.position);
    }
  });
  
  // Card height based on position and z-index
  const height = position[1] + 0.1 + (zIndex * 0.05);
  
  return (
    <group 
      ref={groupRef} 
      position={[position[0], height, position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main card body */}
      <mesh 
        ref={cardRef}
        scale={[0.8, 1, 0.01]}
      >
        <boxGeometry args={[1, 1.4, 0.05]} />
        <meshStandardMaterial color={teamColor} />
        
        {/* Card edge highlights */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[0.95, 1.35, 0.01]} />
          <meshStandardMaterial color={secondaryColor} />
        </mesh>
        
        {/* Card content */}
        <group position={[0, 0, 0.04]}>
          {/* Player avatar */}
          <mesh 
            ref={avatarRef}
            position={[0, 0.2, 0]}
            scale={[0.7, 0.7, 1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial 
              map={avatarTexture || textures.defaultAvatar}
              transparent={true}
            />
          </mesh>
          
          {/* Position label */}
          <Text
            position={[0, -0.4, 0.03]}
            fontSize={0.2}
            color={secondaryColor}
            font="/fonts/Roboto-Bold.ttf"
            anchorX="center"
            anchorY="middle"
          >
            {getPositionAbbr(player.position)}
          </Text>
          
          {/* Player name */}
          <Text
            position={[0, -0.6, 0.03]}
            fontSize={0.12}
            color={secondaryColor}
            font="/fonts/Roboto-Regular.ttf"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.7}
          >
            {player.name}
          </Text>
        </group>
        
        {/* Status indicators */}
        <group position={[0, 0, 0.06]}>
          {/* Yellow card indicator */}
          {card.yellowCard && (
            <mesh position={[-0.3, 0.6, 0]}>
              <planeGeometry args={[0.15, 0.2]} />
              <meshBasicMaterial color="#ffeb3b" />
            </mesh>
          )}
          
          {/* Red card indicator */}
          {card.redCard && (
            <mesh position={[-0.3, 0.6, 0]}>
              <planeGeometry args={[0.15, 0.2]} />
              <meshBasicMaterial color="#f44336" />
            </mesh>
          )}
          
          {/* Injury indicator */}
          {card.injury && (
            <mesh position={[0.3, 0.6, 0]}>
              <planeGeometry args={[0.15, 0.15]} />
              <meshBasicMaterial color={
                card.injury === InjuryType.MINOR ? '#ffb74d' :
                card.injury === InjuryType.SERIOUS ? '#f44336' :
                '#b71c1c'
              } />
            </mesh>
          )}
          
          {/* Current team indicator */}
          {isCurrentTeam && (
            <mesh position={[0, 0.65, 0]}>
              <ringGeometry args={[0.1, 0.15, 16]} />
              <meshBasicMaterial color="#ffc107" />
            </mesh>
          )}
        </group>
      </mesh>
      
      {/* Ball indicator */}
      {hasBall && (
        <mesh position={[0.3, 0.8, 0.1]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="white" />
          {/* Ball pattern (simplified) */}
          <mesh position={[0, 0, 0.05]} rotation={[0, 0, 0]}>
            <circleGeometry args={[0.04, 5]} />
            <meshBasicMaterial color="black" />
          </mesh>
        </mesh>
      )}
      
      {/* HTML label for better readability on hover */}
      {hovered && (
        <Html
          position={[0, 1, 0]}
          center
          distanceFactor={15}
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            fontSize: '12px',
            pointerEvents: 'none',
            whiteSpace: 'nowrap'
          }}
        >
          {player.name} | {player.position}
          {card.injury && ` | ${card.injury}`}
        </Html>
      )}
    </group>
  );
};

export default PlayerCard3D;

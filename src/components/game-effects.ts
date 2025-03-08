import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

export enum EffectType {
  GOAL = 'goal',
  NEAR_MISS = 'near-miss',
  TACKLE = 'tackle',
  CARD = 'card',
  INJURY = 'injury',
  UPGRADE = 'upgrade'
}

interface EffectProps {
  type: EffectType;
  position: [number, number, number];
  teamColor?: string;
  message?: string;
  onComplete?: () => void;
}

const GameEffect: React.FC<EffectProps> = ({
  type,
  position,
  teamColor = '#ffffff',
  message,
  onComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const textRef = useRef<any>(null);
  const timerRef = useRef<number>(0);
  const completedRef = useRef<boolean>(false);
  
  // Convert hex color to Three.js color
  const color = new THREE.Color(teamColor);
  
  // Initialize effect
  useEffect(() => {
    if (!groupRef.current) return;
    
    const createEffect = () => {
      // Clear any existing effects
      while (groupRef.current?.children.length) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      
      // Create effect based on type
      switch (type) {
        case EffectType.GOAL:
          createGoalEffect();
          break;
        case EffectType.NEAR_MISS:
          createNearMissEffect();
          break;
        case EffectType.TACKLE:
          createTackleEffect();
          break;
        case EffectType.CARD:
          createCardEffect();
          break;
        case EffectType.INJURY:
          createInjuryEffect();
          break;
        case EffectType.UPGRADE:
          createUpgradeEffect();
          break;
      }
    };
    
    // Create goal celebration effect
    const createGoalEffect = () => {
      // Particle explosion
      const particleCount = 200;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = [];
      const particleVelocities = [];
      const particleColors = [];
      
      for (let i = 0; i < particleCount; i++) {
        // All particles start at origin
        particlePositions.push(0, 0, 0);
        
        // Random velocity in all directions
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.1 + Math.random() * 0.2;
        
        const vx = Math.sin(phi) * Math.cos(theta) * speed;
        const vy = Math.cos(phi) * speed;
        const vz = Math.sin(phi) * Math.sin(theta) * speed;
        
        particleVelocities.push(vx, vy, vz);
        
        // Particle colors based on team with some variation
        const hsl = { h: 0, s: 0, l: 0 };
        color.getHSL(hsl);
        
        const variation = new THREE.Color();
        variation.setHSL(
          hsl.h + (Math.random() * 0.1 - 0.05), // Slight hue variation
          Math.max(0, Math.min(1, hsl.s + (Math.random() * 0.2 - 0.1))), // Saturation variation
          Math.max(0.3, Math.min(0.9, hsl.l + (Math.random() * 0.3 - 0.1))) // Lightness variation
        );
        
        particleColors.push(variation.r, variation.g, variation.b);
      }
      
      particleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(particlePositions, 3)
      );
      
      particleGeometry.setAttribute(
        'velocity',
        new THREE.Float32BufferAttribute(particleVelocities, 3)
      );
      
      particleGeometry.setAttribute(
        'color',
        new THREE.Float32BufferAttribute(particleColors, 3)
      );
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 1
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particlesRef.current = particles;
      groupRef.current?.add(particles);
      
      // Text effect - "GOAL!"
      const displayText = message || "GOAL!";
      
      // Add 3D text
      textRef.current = (
        <Text
          position={[0, 1, 0]}
          fontSize={1}
          color={teamColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
          fillOpacity={1}
        >
          {displayText}
        </Text>
      );
      
      // Set completion timer (3 seconds)
      timerRef.current = 3;
    };
    
    // Create near miss effect
    const createNearMissEffect = () => {
      // Smaller particle effect
      const particleCount = 50;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = [];
      const particleVelocities = [];
      
      for (let i = 0; i < particleCount; i++) {
        // All particles start at origin
        particlePositions.push(0, 0, 0);
        
        // Random velocity mostly upward
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.3; // Mostly upward
        const speed = 0.05 + Math.random() * 0.1;
        
        const vx = Math.sin(phi) * Math.cos(theta) * speed;
        const vy = Math.cos(phi) * speed;
        const vz = Math.sin(phi) * Math.sin(theta) * speed;
        
        particleVelocities.push(vx, vy, vz);
      }
      
      particleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(particlePositions, 3)
      );
      
      particleGeometry.setAttribute(
        'velocity',
        new THREE.Float32BufferAttribute(particleVelocities, 3)
      );
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffcc00,
        transparent: true,
        opacity: 1
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particlesRef.current = particles;
      groupRef.current?.add(particles);
      
      // Text effect - "Close!"
      const displayText = message || "Close!";
      
      // Add 3D text
      textRef.current = (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          fillOpacity={1}
        >
          {displayText}
        </Text>
      );
      
      // Set completion timer (1.5 seconds)
      timerRef.current = 1.5;
    };
    
    // Create tackle effect
    const createTackleEffect = () => {
      // Dust cloud effect
      const particleCount = 30;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = [];
      const particleVelocities = [];
      const particleSizes = [];
      
      for (let i = 0; i < particleCount; i++) {
        // Random starting position near ground
        particlePositions.push(
          (Math.random() - 0.5) * 0.5,
          Math.random() * 0.2,
          (Math.random() - 0.5) * 0.5
        );
        
        // Random velocity outward and upward
        const theta = Math.random() * Math.PI * 2;
        const speed = 0.03 + Math.random() * 0.05;
        
        const vx = Math.cos(theta) * speed;
        const vy = 0.03 + Math.random() * 0.05; // Upward
        const vz = Math.sin(theta) * speed;
        
        particleVelocities.push(vx, vy, vz);
        
        // Random sizes
        particleSizes.push(0.1 + Math.random() * 0.2);
      }
      
      particleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(particlePositions, 3)
      );
      
      particleGeometry.setAttribute(
        'velocity',
        new THREE.Float32BufferAttribute(particleVelocities, 3)
      );
      
      particleGeometry.setAttribute(
        'size',
        new THREE.Float32BufferAttribute(particleSizes, 1)
      );
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        color: 0xbbbbbb, // Dust color
        transparent: true,
        opacity: 0.7
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particlesRef.current = particles;
      groupRef.current?.add(particles);
      
      // Sound effect (in a real implementation)
      // playSound('tackle.mp3');
      
      // Set completion timer (1 second)
      timerRef.current = 1.0;
    };
    
    // Create card effect
    const createCardEffect = () => {
      // Card display
      const cardGeometry = new THREE.PlaneGeometry(0.5, 0.7);
      const cardMaterial = new THREE.MeshBasicMaterial({ 
        color: message?.includes('Yellow') ? 0xffeb3b : 0xf44336,
        side: THREE.DoubleSide
      });
      
      const card = new THREE.Mesh(cardGeometry, cardMaterial);
      card.position.y = 0.5;
      groupRef.current?.add(card);
      
      // Add shadow
      const shadowGeometry = new THREE.PlaneGeometry(0.5, 0.1);
      const shadowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadow.position.y = 0.01;
      shadow.rotation.x = -Math.PI / 2;
      groupRef.current?.add(shadow);
      
      // Text effect - card type
      const displayText = message || "Card!";
      
      // Add 3D text
      textRef.current = (
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          fillOpacity={1}
        >
          {displayText}
        </Text>
      );
      
      // Set completion timer (2 seconds)
      timerRef.current = 2.0;
    };
    
    // Create injury effect
    const createInjuryEffect = () => {
      // Injury symbols
      const crossGeometry = new THREE.BufferGeometry();
      const crossVertices = [
        // First line of the cross (X)
        -0.2, 0, -0.2,
        0.2, 0, 0.2,
        
        // Second line of the cross (X)
        -0.2, 0, 0.2,
        0.2, 0, -0.2
      ];
      
      crossGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(crossVertices, 3)
      );
      
      const crossMaterial = new THREE.LineBasicMaterial({ 
        color: 0xf44336,
        linewidth: 2
      });
      
      const cross = new THREE.LineSegments(crossGeometry, crossMaterial);
      cross.position.y = 0.5;
      groupRef.current?.add(cross);
      
      // Add pulsing circle
      const circleGeometry = new THREE.CircleGeometry(0.3, 32);
      const circleMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xf44336,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.position.y = 0.5;
      circle.rotation.x = -Math.PI / 2;
      groupRef.current?.add(circle);
      
      // Text effect - "Injury!"
      const displayText = message || "Injury!";
      
      // Add 3D text
      textRef.current = (
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="#f44336"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          fillOpacity={1}
        >
          {displayText}
        </Text>
      );
      
      // Set completion timer (2.5 seconds)
      timerRef.current = 2.5;
    };
    
    // Create upgrade effect
    const createUpgradeEffect = () => {
      // Particle rays shooting upward
      const particleCount = 50;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = [];
      const particleVelocities = [];
      
      for (let i = 0; i < particleCount; i++) {
        // Random starting position in a circle
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.3;
        particlePositions.push(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );
        
        // Upward velocity with slight spread
        const spreadAngle = Math.random() * Math.PI * 0.1;
        const velocityX = Math.cos(angle) * Math.sin(spreadAngle) * 0.1;
        const velocityY = Math.cos(spreadAngle) * 0.1;
        const velocityZ = Math.sin(angle) * Math.sin(spreadAngle) * 0.1;
        
        particleVelocities.push(velocityX, velocityY, velocityZ);
      }
      
      particleGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(particlePositions, 3)
      );
      
      particleGeometry.setAttribute(
        'velocity',
        new THREE.Float32BufferAttribute(particleVelocities, 3)
      );
      
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffcc00, // Golden color
        transparent: true,
        opacity: 1
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      particlesRef.current = particles;
      groupRef.current?.add(particles);
      
      // Add glow ring
      const ringGeometry = new THREE.RingGeometry(0.3, 0.4, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffcc00,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = -Math.PI / 2;
      groupRef.current?.add(ring);
      
      // Text effect - "Upgrade!"
      const displayText = message || "Upgrade!";
      
      // Add 3D text
      textRef.current = (
        <Text
          position={[0, 1, 0]}
          fontSize={0.4}
          color="#ffcc00"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
          fillOpacity={1}
        >
          {displayText}
        </Text>
      );
      
      // Set completion timer (2 seconds)
      timerRef.current = 2.0;
    };
    
    createEffect();
  }, [type, teamColor, message]);
  
  // Animation loop
  useFrame((state, delta) => {
    // Decrement timer
    timerRef.current -= delta;
    
    // Check for completion
    if (timerRef.current <= 0 && !completedRef.current) {
      completedRef.current = true;
      if (onComplete) {
        onComplete();
      }
    }
    
    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.getAttribute('position');
      const velocities = particlesRef.current.geometry.getAttribute('velocity');
      
      // Update positions based on velocities
      for (let i = 0; i < positions.count; i++) {
        positions.setX(i, positions.getX(i) + velocities.getX(i));
        positions.setY(i, positions.getY(i) + velocities.getY(i));
        positions.setZ(i, positions.getZ(i) + velocities.getZ(i));
      }
      
      positions.needsUpdate = true;
      
      // Fade out particles as effect ends
      const material = particlesRef.current.material as THREE.PointsMaterial;
      
      if (timerRef.current < 1.0) {
        material.opacity = Math.max(0, timerRef.current);
      }
    }
    
    // Animate other elements based on effect type
    switch (type) {
      case EffectType.GOAL:
        // Text rises and scales
        if (textRef.current?.position) {
          textRef.current.position[1] += delta * 0.5; // Rise
          
          // Pulse scale
          const scale = 1 + Math.sin(state.clock.getElapsedTime() * 5) * 0.2;
          textRef.current.scale = [scale, scale, scale];
          
          // Fade out text at the end
          if (timerRef.current < 1.0) {
            textRef.current.fillOpacity = Math.max(0, timerRef.current);
          }
        }
        break;
        
      case EffectType.CARD:
        // Card rises and rotates slightly
        if (groupRef.current?.children[0]) {
          const card = groupRef.current.children[0];
          
          // Rise
          card.position.y += delta * 0.2;
          
          // Slight wobble
          card.rotation.y = Math.sin(state.clock.getElapsedTime() * 3) * 0.2;
          
          // Fade out at the end
          if (timerRef.current < 0.5) {
            (card.material as THREE.MeshBasicMaterial).opacity = Math.max(0, timerRef.current * 2);
          }
        }
        
        // Text fades
        if (textRef.current?.fillOpacity) {
          if (timerRef.current < 0.5) {
            textRef.current.fillOpacity = Math.max(0, timerRef.current * 2);
          }
        }
        break;
        
      case EffectType.INJURY:
        // Pulse the circle
        if (groupRef.current?.children[1]) {
          const circle = groupRef.current.children[1];
          
          // Pulse size
          const scale = 1 + Math.sin(state.clock.getElapsedTime() * 8) * 0.3;
          circle.scale.set(scale, 1, scale);
          
          // Fade out at the end
          if (timerRef.current < 0.5) {
            (circle.material as THREE.MeshBasicMaterial).opacity = Math.max(0, timerRef.current * 0.6);
          }
        }
        
        // Cross flashes
        if (groupRef.current?.children[0]) {
          const cross = groupRef.current.children[0];
          (cross.material as THREE.LineBasicMaterial).color.setHSL(
            0, 1, 0.5 + Math.sin(state.clock.getElapsedTime() * 10) * 0.3
          );
        }
        break;
        
      case EffectType.UPGRADE:
        // Ring pulses and expands
        if (groupRef.current?.children[1]) {
          const ring = groupRef.current.children[1];
          
          // Expand
          const scale = 1 + state.clock.getElapsedTime() * 0.5;
          ring.scale.set(scale, scale, scale);
          
          // Fade out as it expands
          (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(
            0, 0.7 - state.clock.getElapsedTime() * 0.2
          );
        }
        break;
    }
  });
  
  return (
    <group ref={groupRef} position={position}>
      {textRef.current}
    </group>
  );
};

// Effect manager component
interface EffectManagerProps {
  effects: {
    id: string;
    type: EffectType;
    position: [number, number, number];
    teamColor?: string;
    message?: string;
  }[];
  onEffectComplete?: (id: string) => void;
}

export const EffectManager: React.FC<EffectManagerProps> = ({
  effects,
  onEffectComplete
}) => {
  return (
    <group>
      {effects.map(effect => (
        <GameEffect
          key={effect.id}
          type={effect.type}
          position={effect.position}
          teamColor={effect.teamColor}
          message={effect.message}
          onComplete={() => onEffectComplete?.(effect.id)}
        />
      ))}
    </group>
  );
};

export default GameEffect;

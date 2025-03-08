import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

export enum GroundType {
  GRASS = 'grass',
  MUD = 'mud',
  ASTROTURF = 'astroturf',
  SNOW = 'snow',
  DIRT = 'dirt',
  CONCRETE = 'concrete'
}

interface GroundEffectsProps {
  groundType: GroundType;
  size: [number, number]; // [width, height] of the field
  position: [number, number, number];
  weatherType: string;
  gameDuration?: number; // How long the game has been active in seconds
}

const GroundEffects: React.FC<GroundEffectsProps> = ({
  groundType,
  size,
  position,
  weatherType,
  gameDuration = 0
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const grassRef = useRef<THREE.InstancedMesh | null>(null);
  const mudPuddlesRef = useRef<THREE.InstancedMesh | null>(null);
  const footprintsRef = useRef<THREE.InstancedMesh | null>(null);
  const snowflakesRef = useRef<THREE.Points | null>(null);
  
  // Load textures
  const textures = useTexture({
    grass: '/images/fields/grass_blade.png',
    mud: '/images/fields/mud_puddle.png',
    footprint: '/images/fields/footprint.png'
  });
  
  // Check if we should have weather and ground-specific effects
  const hasGrass = groundType === GroundType.GRASS;
  const hasMud = groundType === GroundType.MUD || 
                (groundType === GroundType.GRASS && weatherType === 'rainy');
  const hasSnow = weatherType === 'snowy';
  
  // Calculate wear based on game duration
  const wearFactor = useMemo(() => {
    // Max wear is 1.0 (completely worn)
    return Math.min(1.0, gameDuration / 600); // 10 minutes to reach max wear
  }, [gameDuration]);
  
  // Initialize grass blades
  useEffect(() => {
    if (!groupRef.current || !hasGrass) return;
    
    // Create grass effect
    const createGrass = () => {
      const [width, height] = size;
      const grassCount = Math.floor(width * height * 50); // Density factor
      
      // Create instanced grass blades
      const grassGeometry = new THREE.PlaneGeometry(0.1, 0.3);
      const grassMaterial = new THREE.MeshStandardMaterial({
        color: 0x4CAF50,
        map: textures.grass,
        alphaTest: 0.5,
        side: THREE.DoubleSide,
        transparent: true
      });
      
      const instancedGrass = new THREE.InstancedMesh(
        grassGeometry,
        grassMaterial,
        grassCount
      );
      
      // Position each blade of grass
      const dummy = new THREE.Object3D();
      for (let i = 0; i < grassCount; i++) {
        // Random position within the field
        // Avoid center of the field where most play happens
        let x, z;
        const avoidCenter = Math.random() > 0.2;
        
        if (avoidCenter) {
          // Position in the outer areas
          x = (Math.random() - 0.5) * width;
          z = (Math.random() - 0.5) * height;
          
          // If too close to center, push outward
          const distFromCenter = Math.sqrt(x*x + z*z);
          if (distFromCenter < Math.min(width, height) * 0.3) {
            const factor = (Math.min(width, height) * 0.3) / distFromCenter;
            x *= factor;
            z *= factor;
          }
        } else {
          // Some blades in center
          x = (Math.random() - 0.5) * width;
          z = (Math.random() - 0.5) * height;
        }
        
        dummy.position.set(x, 0.05, z);
        
        // Random rotation
        dummy.rotation.y = Math.random() * Math.PI;
        
        // Random scale (height)
        const scale = 0.7 + Math.random() * 0.6;
        dummy.scale.set(scale, scale, scale);
        
        dummy.updateMatrix();
        instancedGrass.setMatrixAt(i, dummy.matrix);
      }
      
      instancedGrass.instanceMatrix.needsUpdate = true;
      grassRef.current = instancedGrass;
      groupRef.current?.add(instancedGrass);
    };
    
    createGrass();
  }, [hasGrass, size, textures.grass]);
  
  // Initialize mud puddles
  useEffect(() => {
    if (!groupRef.current || !hasMud) return;
    
    const createMudPuddles = () => {
      const [width, height] = size;
      
      // More puddles if it's rainy, fewer if it's just a mud field
      const puddleCount = groundType === GroundType.MUD ? 10 : 20;
      
      // Create instanced mud puddles
      const puddleGeometry = new THREE.PlaneGeometry(1, 1);
      const puddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x553311,
        map: textures.mud,
        transparent: true,
        alphaTest: 0.5,
        roughness: 0.6,
        metalness: 0.1
      });
      
      const instancedPuddles = new THREE.InstancedMesh(
        puddleGeometry,
        puddleMaterial,
        puddleCount
      );
      instancedPuddles.rotation.x = -Math.PI / 2; // Lay flat
      
      // Position each puddle
      const dummy = new THREE.Object3D();
      for (let i = 0; i < puddleCount; i++) {
        // Focus puddles in high-traffic areas
        let x, z;
        
        // Higher probability in the center of the field
        if (Math.random() < 0.6) {
          // Center area
          x = (Math.random() - 0.5) * width * 0.6;
          z = (Math.random() - 0.5) * height * 0.6;
        } else if (Math.random() < 0.7) {
          // Goal areas
          x = (Math.random() - 0.5) * width * 0.4;
          const side = Math.random() < 0.5 ? -1 : 1;
          z = side * (height * 0.4 + Math.random() * 0.1);
        } else {
          // Random across the field
          x = (Math.random() - 0.5) * width * 0.9;
          z = (Math.random() - 0.5) * height * 0.9;
        }
        
        dummy.position.set(x, 0.02, z);
        
        // Random rotation
        dummy.rotation.y = Math.random() * Math.PI * 2;
        
        // Random scale
        const scale = 0.5 + Math.random() * 1.5;
        dummy.scale.set(scale, 1, scale);
        
        dummy.updateMatrix();
        instancedPuddles.setMatrixAt(i, dummy.matrix);
      }
      
      instancedPuddles.instanceMatrix.needsUpdate = true;
      mudPuddlesRef.current = instancedPuddles;
      groupRef.current?.add(instancedPuddles);
    };
    
    createMudPuddles();
  }, [hasMud, size, textures.mud, groundType]);
  
  // Add footprints and wear
  useEffect(() => {
    if (!groupRef.current) return;
    
    // Only add footprints after some game duration
    if (gameDuration < 30) return; // After 30 seconds
    
    const createFootprints = () => {
      const [width, height] = size;
      
      // Number of footprints depends on wear factor
      const footprintCount = Math.floor(wearFactor * 200);
      
      // Create instanced footprints
      const footprintGeometry = new THREE.PlaneGeometry(0.3, 0.15);
      const footprintMaterial = new THREE.MeshStandardMaterial({
        map: textures.footprint,
        transparent: true,
        alphaTest: 0.5,
        color: groundType === GroundType.MUD ? 0x553311 : 0x336633,
        opacity: 0.7
      });
      
      const instancedFootprints = new THREE.InstancedMesh(
        footprintGeometry,
        footprintMaterial,
        footprintCount
      );
      instancedFootprints.rotation.x = -Math.PI / 2; // Lay flat
      
      // Position each footprint
      const dummy = new THREE.Object3D();
      for (let i = 0; i < footprintCount; i++) {
        // Focus footprints in high-traffic areas
        let x, z;
        
        // Higher probability in the center of the field
        if (Math.random() < 0.7) {
          // Center corridor
          x = (Math.random() - 0.5) * width * 0.8;
          z = (Math.random() - 0.5) * height * 0.4;
        } else if (Math.random() < 0.8) {
          // Goal areas
          x = (Math.random() - 0.5) * width * 0.4;
          const side = Math.random() < 0.5 ? -1 : 1;
          z = side * (height * 0.4 + Math.random() * 0.1);
        } else {
          // Random across the field
          x = (Math.random() - 0.5) * width * 0.9;
          z = (Math.random() - 0.5) * height * 0.9;
        }
        
        dummy.position.set(x, 0.02, z);
        
        // Random rotation - footprints can face any direction
        dummy.rotation.y = Math.random() * Math.PI * 2;
        
        // Random scale
        const scale = 0.8 + Math.random() * 0.4;
        dummy.scale.set(scale, 1, scale);
        
        dummy.updateMatrix();
        instancedFootprints.setMatrixAt(i, dummy.matrix);
      }
      
      instancedFootprints.instanceMatrix.needsUpdate = true;
      footprintsRef.current = instancedFootprints;
      groupRef.current?.add(instancedFootprints);
    };
    
    // Clear existing footprints
    if (footprintsRef.current && footprintsRef.current.parent) {
      footprintsRef.current.parent.remove(footprintsRef.current);
    }
    
    createFootprints();
  }, [wearFactor, gameDuration, size, textures.footprint, groundType]);
  
  // Snow effect
  useEffect(() => {
    if (!groupRef.current || !hasSnow) return;
    
    const createSnow = () => {
      const [width, height] = size;
      
      // Create snow covering
      const snowCoverGeometry = new THREE.PlaneGeometry(width, height);
      const snowCoverMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.9,
        metalness: 0,
        transparent: true,
        opacity: 0.7
      });
      
      const snowCover = new THREE.Mesh(
        snowCoverGeometry,
        snowCoverMaterial
      );
      snowCover.rotation.x = -Math.PI / 2;
      snowCover.position.y = 0.01;
      
      groupRef.current?.add(snowCover);
      
      // Add snow particles falling
      const snowflakeCount = 1000;
      const snowflakeGeometry = new THREE.BufferGeometry();
      const snowflakePositions = [];
      const snowflakeVelocities = [];
      
      for (let i = 0; i < snowflakeCount; i++) {
        snowflakePositions.push(
          (Math.random() - 0.5) * width * 1.2, // x
          Math.random() * 10, // y
          (Math.random() - 0.5) * height * 1.2 // z
        );
        
        snowflakeVelocities.push(
          (Math.random() - 0.5) * 0.05, // x velocity
          -0.05 - Math.random() * 0.1, // y velocity (falling slowly)
          (Math.random() - 0.5) * 0.05 // z velocity
        );
      }
      
      snowflakeGeometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(snowflakePositions, 3)
      );
      
      snowflakeGeometry.setAttribute(
        'velocity',
        new THREE.Float32BufferAttribute(snowflakeVelocities, 3)
      );
      
      const snowflakeMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8
      });
      
      const snowflakes = new THREE.Points(snowflakeGeometry, snowflakeMaterial);
      snowflakesRef.current = snowflakes;
      groupRef.current?.add(snowflakes);
    };
    
    createSnow();
  }, [hasSnow, size]);
  
  // Animation loop
  useFrame((state, delta) => {
    // Animate grass swaying
    if (grassRef.current) {
      // Use instanced mesh animation
      const time = state.clock.getElapsedTime();
      const instanceMatrix = grassRef.current.instanceMatrix;
      const count = grassRef.current.count;
      
      // Temporary objects for calculations
      const dummy = new THREE.Object3D();
      const matrix = new THREE.Matrix4();
      
      for (let i = 0; i < count; i++) {
        // Get current matrix
        grassRef.current.getMatrixAt(i, matrix);
        
        // Extract position, rotation, and scale
        dummy.position.setFromMatrixPosition(matrix);
        dummy.rotation.setFromRotationMatrix(matrix);
        dummy.scale.setFromMatrixScale(matrix);
        
        // Apply swaying effect
        const swayAmount = Math.sin(time + dummy.position.x * 0.5 + dummy.position.z * 0.5) * 0.2;
        dummy.rotation.z = swayAmount;
        
        // Update matrix
        dummy.updateMatrix();
        grassRef.current.setMatrixAt(i, dummy.matrix);
      }
      
      grassRef.current.instanceMatrix.needsUpdate = true;
    }
    
    // Animate mud puddles (subtle ripple effect in rain)
    if (mudPuddlesRef.current && weatherType === 'rainy') {
      const time = state.clock.getElapsedTime();
      const material = mudPuddlesRef.current.material as THREE.MeshStandardMaterial;
      
      // Subtle opacity fluctuation
      material.opacity = 0.7 + Math.sin(time * 2) * 0.1;
    }
    
    // Animate snowflakes
    if (snowflakesRef.current) {
      const positions = snowflakesRef.current.geometry.getAttribute('position');
      const velocities = snowflakesRef.current.geometry.getAttribute('velocity');
      
      for (let i = 0; i < positions.count; i++) {
        // Update position based on velocity
        positions.setX(i, positions.getX(i) + velocities.getX(i));
        positions.setY(i, positions.getY(i) + velocities.getY(i));
        positions.setZ(i, positions.getZ(i) + velocities.getZ(i));
        
        // Reset particles that fall below ground
        if (positions.getY(i) < 0) {
          positions.setY(i, 10);
          positions.setX(i, (Math.random() - 0.5) * size[0] * 1.2);
          positions.setZ(i, (Math.random() - 0.5) * size[1] * 1.2);
        }
      }
      
      positions.needsUpdate = true;
    }
  });
  
  return (
    <group ref={groupRef} position={position} />
  );
};

export default GroundEffects;

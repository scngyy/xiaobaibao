import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { THEME } from '../constants';

export const FloatingParticles: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Very slow rotation of the entire starfield
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Distant Stars */}
      <Stars 
        radius={80} 
        depth={40} 
        count={6000} 
        factor={3} 
        saturation={0.5} 
        fade 
        speed={0.3} 
      />
      
      {/* Foreground Magic Dust */}
      <Sparkles 
          count={500} 
          scale={[18, 18, 18]} 
          size={2} 
          speed={0.5} 
          opacity={0.8} 
          color="#ffffff" 
      />

      {/* Pink Floating Petals/Light */}
      <Sparkles 
          count={200} 
          scale={[12, 12, 12]} 
          size={5} 
          speed={0.2} 
          opacity={0.4} 
          color={THEME.colors.primary}
          noise={1} // Organic movement
      />
      
      {/* Gold Bokeh */}
      <Sparkles 
          count={150} 
          scale={[15, 20, 15]} 
          size={8} 
          speed={0.3} 
          opacity={0.3} 
          color={THEME.colors.accent} 
      />
    </group>
  );
};

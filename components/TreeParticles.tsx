import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { THEME, TREE_CONFIG } from '../constants';

interface TreeParticlesProps {
  height: number;
  radius: number;
  count: number;
}

const useGlowTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Sharper gradient for less blur
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)'); // Fast drop-off
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
};

export const TreeParticles: React.FC<TreeParticlesProps> = ({ height, radius, count }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const lightsRef = useRef<THREE.Points>(null);
  const heartRef = useRef<THREE.Points>(null);
  
  const glowTexture = useGlowTexture();

  // 1. Magical "Energy Vortex" Tree Body
  const foliage = useMemo(() => {
    const tempPositions = new Float32Array(count * 3);
    const tempColors = new Float32Array(count * 3);
    const tempSizes = new Float32Array(count);
    
    const colorPrimary = new THREE.Color(THEME.colors.primary);
    const colorSecondary = new THREE.Color(THEME.colors.secondary);
    const colorIce = new THREE.Color(THEME.colors.tertiary);
    const colorDeep = new THREE.Color("#880044");

    const armCount = 12; 
    
    for (let i = 0; i < count; i++) {
      const armIndex = i % armCount;
      const t = Math.random(); 
      
      const yNorm = Math.pow(t, 0.8); 
      const y = (yNorm * height) - (height / 2);

      const rBase = radius * Math.exp(-2.5 * yNorm); 
      const rFinal = Math.max(rBase, 0.2);

      const spiralTightness = 4.0;
      const thetaOffset = (armIndex / armCount) * Math.PI * 2;
      const theta = (yNorm * Math.PI * 2 * spiralTightness) + thetaOffset;

      const spread = 0.8 * (1 - yNorm * 0.5); 
      const rRandom = (Math.random() - 0.5) * spread;
      const thetaRandom = (Math.random() - 0.5) * (spread / rFinal);
      const yRandom = (Math.random() - 0.5) * spread;

      const x = (rFinal + rRandom) * Math.cos(theta + thetaRandom);
      const z = (rFinal + rRandom) * Math.sin(theta + thetaRandom);
      const yPos = y + yRandom;

      tempPositions[i * 3] = x;
      tempPositions[i * 3 + 1] = yPos;
      tempPositions[i * 3 + 2] = z;

      const distFromCore = Math.abs(rRandom) + Math.abs(yRandom);
      let c;
      if (distFromCore < 0.2) {
         c = colorIce;
      } else if (distFromCore < 0.4) {
         c = colorSecondary;
      } else {
         c = Math.random() > 0.5 ? colorPrimary : colorDeep;
      }

      tempColors[i * 3] = c.r;
      tempColors[i * 3 + 1] = c.g;
      tempColors[i * 3 + 2] = c.b;

      // MUCH Smaller sizes for "HD" look
      tempSizes[i] = (Math.random() * 0.5 + 0.1); 
    }

    return { positions: tempPositions, colors: tempColors, sizes: tempSizes };
  }, [count, height, radius]);

  // 2. Floating Lights
  const lights = useMemo(() => {
    const lightCount = TREE_CONFIG.lightCount;
    const pos = new Float32Array(lightCount * 3);
    const colors = new Float32Array(lightCount * 3);
    const sizes = new Float32Array(lightCount);
    
    const c1 = new THREE.Color(THEME.colors.accent);
    const c2 = new THREE.Color(THEME.colors.tertiary);

    const armCount = 12;

    for (let i = 0; i < lightCount; i++) {
        const armIndex = Math.floor(Math.random() * armCount);
        const t = Math.random();
        const yNorm = Math.pow(t, 0.8);
        const y = (yNorm * height) - (height / 2);

        const rBase = radius * Math.exp(-2.5 * yNorm);
        const rFinal = Math.max(rBase, 0.2);

        const spiralTightness = 4.0;
        const thetaOffset = (armIndex / armCount) * Math.PI * 2;
        const theta = (yNorm * Math.PI * 2 * spiralTightness) + thetaOffset;

        const r = rFinal + 0.3 + (Math.random() * 0.3);
        
        pos[i * 3] = r * Math.cos(theta);
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = r * Math.sin(theta);

        const col = Math.random() > 0.6 ? c1 : c2;
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;

        sizes[i] = Math.random() * 0.6 + 0.3;
    }
    return { positions: pos, colors: colors, sizes };
  }, [height, radius]);

  // 3. Heart Topper
  const heartParticles = useMemo(() => {
    const heartCount = 3000;
    const pos = new Float32Array(heartCount * 3);
    const cols = new Float32Array(heartCount * 3);
    const sizes = new Float32Array(heartCount);
    
    const cCore = new THREE.Color("#ff0066");
    const cOuter = new THREE.Color("#ffccff");

    for (let i = 0; i < heartCount; i++) {
        const t = Math.random() * Math.PI * 2;
        const scale = 0.08 * Math.sqrt(Math.random()); 

        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
        const zThickness = 6; 
        let z = (Math.random() - 0.5) * zThickness * scale * 10;

        x *= scale;
        y *= scale;
        z *= scale;

        const yOffset = (height / 2) + 1.2; 
        
        pos[i * 3] = x;
        pos[i * 3 + 1] = y + yOffset;
        pos[i * 3 + 2] = z;

        const dist = Math.sqrt(x*x + (y-yOffset)*(y-yOffset) + z*z);
        const col = dist < 0.5 ? cCore : cOuter;
        
        cols[i * 3] = col.r;
        cols[i * 3 + 1] = col.g;
        cols[i * 3 + 2] = col.b;
        
        sizes[i] = Math.random() * 0.3 + 0.1;
    }

    return { positions: pos, colors: cols, sizes };
  }, [height]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -time * 0.1;
    }
    if (lightsRef.current) {
      lightsRef.current.rotation.y = -time * 0.1;
      const pulse = 1 + Math.sin(time * 3) * 0.15;
      lightsRef.current.scale.set(pulse, pulse, pulse);
    }
    if (heartRef.current) {
      heartRef.current.rotation.y = time * 0.5;
      const beat = (Math.sin(time * 8) + Math.sin(time * 8 + Math.PI*0.3)) * 0.05;
      const baseScale = 1.0 + Math.max(0, beat);
      heartRef.current.scale.set(baseScale, baseScale, baseScale);
    }
  });

  return (
    <group>
      {/* 1. Spiral Energy Tree - Reduced Size for Sharpness */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={foliage.positions.length / 3} array={foliage.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={foliage.colors.length / 3} array={foliage.colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={foliage.sizes.length} array={foliage.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial 
            map={glowTexture} 
            size={0.25} // drastically reduced size for crystal look
            vertexColors 
            transparent 
            opacity={0.9} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
            sizeAttenuation 
        />
      </points>

      {/* 2. Floating Lights */}
      <points ref={lightsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lights.positions.length / 3} array={lights.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={lights.colors.length / 3} array={lights.colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={lights.sizes.length} array={lights.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial 
            map={glowTexture} 
            size={0.6} 
            vertexColors 
            transparent 
            opacity={1} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
            sizeAttenuation 
        />
      </points>

      {/* 3. Volumetric Heart */}
      <points ref={heartRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={heartParticles.positions.length / 3} array={heartParticles.positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={heartParticles.colors.length / 3} array={heartParticles.colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={heartParticles.sizes.length} array={heartParticles.sizes} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial 
            map={glowTexture} 
            size={0.3} 
            vertexColors 
            transparent 
            opacity={0.9} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false} 
            sizeAttenuation 
        />
      </points>
      
      <pointLight position={[0, -2, 0]} intensity={2} color={THEME.colors.primary} distance={15} decay={2} />
      <pointLight position={[0, height/2, 0]} intensity={3} color={THEME.colors.secondary} distance={10} decay={2} />
    </group>
  );
};

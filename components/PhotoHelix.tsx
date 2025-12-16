import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Photo } from '../types';
import { THEME } from '../constants';
import { useUI } from './UIContext';

interface PhotoHelixProps {
  photos: Photo[];
  radius: number;
  height: number;
}

const useStarTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      g.addColorStop(0, 'rgba(255, 255, 255, 1)');
      g.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 32, 32);
    }
    const t = new THREE.CanvasTexture(canvas);
    return t;
  }, []);
};

export const PhotoHelix: React.FC<PhotoHelixProps> = ({ photos, radius, height }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const starTexture = useStarTexture();
  const { setActivePhoto } = useUI();

  const spiralData = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const photoPositions: { pos: THREE.Vector3; rotation: number; photo: Photo }[] = [];

    const loops = 4;
    const pointsPerLoop = 150; 
    const totalPoints = loops * pointsPerLoop;
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const y = t * height - height / 2;
      const yInv = 1 - t; 
      const currentRadius = (radius * 1.2 * yInv) + 2.0; 
      
      const angle = t * Math.PI * 2 * loops;
      const x = Math.cos(angle) * currentRadius;
      const z = Math.sin(angle) * currentRadius;
      
      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);

    photos.forEach((photo, index) => {
        const t = index / Math.max(photos.length - 1, 1);
        const point = curve.getPointAt(t);
        photoPositions.push({ pos: point, rotation: 0, photo });
    });

    const trailCount = 3000;
    const trailPos = new Float32Array(trailCount * 3);
    const trailColors = new Float32Array(trailCount * 3);
    const trailSizes = new Float32Array(trailCount);
    
    const c1 = new THREE.Color(THEME.colors.ribbon);
    const c2 = new THREE.Color('#ffffff');

    for(let i=0; i<trailCount; i++) {
        const t = Math.random();
        const corePoint = curve.getPointAt(t);
        
        const spread = 0.4;
        const xOff = (Math.random() - 0.5) * spread;
        const yOff = (Math.random() - 0.5) * spread * 0.5;
        const zOff = (Math.random() - 0.5) * spread;

        trailPos[i*3] = corePoint.x + xOff;
        trailPos[i*3+1] = corePoint.y + yOff;
        trailPos[i*3+2] = corePoint.z + zOff;
        
        const mix = Math.random();
        const c = mix > 0.7 ? c2 : c1;
        
        trailColors[i*3] = c.r;
        trailColors[i*3+1] = c.g;
        trailColors[i*3+2] = c.b;

        trailSizes[i] = Math.random() * 0.4 + 0.1;
    }

    return { photoPositions, trailPos, trailColors, trailSizes };
  }, [photos, height, radius]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = -state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
          <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={spiralData.trailPos.length/3} array={spiralData.trailPos} itemSize={3} />
              <bufferAttribute attach="attributes-color" count={spiralData.trailColors.length/3} array={spiralData.trailColors} itemSize={3} />
              <bufferAttribute attach="attributes-size" count={spiralData.trailSizes.length} array={spiralData.trailSizes} itemSize={1} />
          </bufferGeometry>
          <pointsMaterial 
            map={starTexture}
            size={1}
            sizeAttenuation={true}
            vertexColors
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
      </points>

      {spiralData.photoPositions.map(({ pos, photo }, i) => {
        const isHovered = hoveredId === photo.id;
        
        return (
          <FloatingPhoto 
             key={photo.id}
             pos={pos}
             photo={photo}
             isHovered={isHovered}
             setHoveredId={setHoveredId}
             onClick={() => setActivePhoto(photo)}
             index={i}
          />
        );
      })}
    </group>
  );
};

const FloatingPhoto = ({ pos, photo, isHovered, setHoveredId, onClick, index }: any) => {
    const meshRef = useRef<THREE.Group>(null);
    
    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.elapsedTime;
        const floatY = Math.sin(t * 1 + index) * 0.15;
        meshRef.current.position.y = pos.y + floatY;
    });

    return (
        <Billboard
            position={[pos.x, pos.y, pos.z]}
            follow={true}
        >
            <group
               ref={meshRef}
               onPointerOver={(e) => {
                 e.stopPropagation();
                 setHoveredId(photo.id);
                 document.body.style.cursor = 'pointer';
               }}
               onPointerOut={() => {
                 setHoveredId(null);
                 document.body.style.cursor = 'default';
               }}
               onClick={(e) => {
                 e.stopPropagation();
                 onClick();
               }}
               // Increased scale: Base is now 1.5/1.8, Hover is 2.2
               scale={isHovered ? 2.2 : 1.5} 
            >
              <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[1.05, 1.35]} />
                <meshBasicMaterial 
                    color={isHovered ? THEME.colors.primary : THEME.colors.accent}
                    transparent
                    opacity={isHovered ? 0.6 : 0.2}
                    blending={THREE.AdditiveBlending}
                />
              </mesh>

              <Image 
                url={photo.url} 
                transparent 
                opacity={isHovered ? 1 : 0.9}
                scale={[1, 1.3]}
                side={THREE.DoubleSide}
              />
            </group>
        </Billboard>
    );
};

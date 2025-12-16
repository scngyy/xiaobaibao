import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { TreeParticles } from './TreeParticles';
import { PhotoHelix } from './PhotoHelix';
import { FloatingParticles } from './FloatingParticles';
import { TREE_CONFIG, getAllPhotos, getDefaultPhotos } from '../constants';
import { Photo } from '../types';

export const Scene: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        setIsLoading(true);
        const loadedPhotos = await getAllPhotos();
        
        // 如果没有找到本地图片，使用默认图片列表
        if (loadedPhotos.length === 0) {
          const defaultPhotos = getDefaultPhotos();
          setPhotos(defaultPhotos);
          console.log('使用默认图片列表，请将图片放入 public/photos 文件夹');
        } else {
          setPhotos(loadedPhotos);
        }
      } catch (error) {
        console.error('加载图片失败:', error);
        // 发生错误时使用默认图片
        const defaultPhotos = getDefaultPhotos();
        setPhotos(defaultPhotos);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 2, 14], fov: 45 }}
      dpr={[1, 2]} // Optimize pixel ratio
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#000000']} />
      
      {/* Cinematic Fog - Darker */}
      <fog attach="fog" args={['#000000', 10, 40]} />

      <Suspense fallback={null}>
        <group position={[0, -2, 0]}>
          {/* Main Tree (Procedural - Fast Load) */}
          <TreeParticles 
            height={TREE_CONFIG.height} 
            radius={TREE_CONFIG.radius} 
            count={TREE_CONFIG.particleCount} 
          />

          {/* Photo Spiral (External Assets - Nested Suspense to prevent blocking) */}
          <Suspense fallback={null}>
             <PhotoHelix 
               photos={photos} 
               height={TREE_CONFIG.height} 
               radius={TREE_CONFIG.radius} 
             />
          </Suspense>
          
          {/* Floor Reflection/Shadow */}
          <ContactShadows 
            opacity={0.5} 
            scale={20} 
            blur={3} 
            far={5} 
            resolution={256} 
            color="#ff69b4" 
          />
        </group>

        {/* Ambient Effects - Snow and Stars */}
        <FloatingParticles />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          color="#d8b4fe" 
        />
        <pointLight position={[-10, -5, -10]} intensity={1} color="#ff69b4" />

        {/* Environment Reflections */}
        <Environment preset="night" />
      </Suspense>

      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 4} 
        maxPolarAngle={Math.PI / 1.8}
        minDistance={8}
        maxDistance={25}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};
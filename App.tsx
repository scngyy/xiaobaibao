import React from 'react';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { PhotoModal } from './components/PhotoModal';
import { UIProvider } from './components/UIContext';

const App: React.FC = () => {
  return (
    <UIProvider>
      <main className="relative w-full h-screen bg-black overflow-hidden selection:bg-pink-500 selection:text-white">
        <Overlay />
        <PhotoModal />
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
      </main>
    </UIProvider>
  );
};

export default App;

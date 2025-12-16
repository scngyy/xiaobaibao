import React from 'react';
import { X } from 'lucide-react';
import { useUI } from './UIContext';

export const PhotoModal: React.FC = () => {
  const { activePhoto, setActivePhoto } = useUI();

  if (!activePhoto) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
      onClick={() => setActivePhoto(null)}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setActivePhoto(null)}
          className="absolute -top-12 right-0 md:-right-12 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={32} />
        </button>

        <div className="relative p-1 rounded-lg bg-gradient-to-br from-pink-500/30 to-purple-500/30">
            <div className="bg-black/40 rounded-lg overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,100,200,0.3)]">
                <img 
                    src={activePhoto.url} 
                    alt="Memory" 
                    className="max-h-[80vh] w-auto object-contain block"
                />
            </div>
        </div>
        
        <p className="mt-4 text-pink-200/60 font-serif italic text-lg tracking-widest">
            Memory #{activePhoto.id + 1}
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { Music, Heart } from 'lucide-react';

export const Overlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-12">
      {/* Empty div to maintain spacing via justify-between, pushing content to bottom */}
      <div></div>

      {/* Side Controls (Visual Only for Aesthetics) */}
      <div className="absolute top-1/2 right-6 -translate-y-1/2 hidden md:flex flex-col gap-4 pointer-events-auto">
        <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all group">
            <Music className="w-5 h-5 text-pink-300 group-hover:text-pink-100" />
        </button>
        <button className="p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:scale-110 transition-all group">
            <Heart className="w-5 h-5 text-pink-300 group-hover:text-pink-100" />
        </button>
      </div>

      {/* Footer Instructions / Greeting */}
      <footer className="text-center pb-8 animate-fade-in-up">
        <h1 
          className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-[0_0_10px_rgba(255,105,180,0.5)]"
          style={{ fontFamily: '"Cinzel Decorative", cursive' }}
        >
          小白宝公主圣诞快乐
        </h1>
      </footer>
    </div>
  );
};

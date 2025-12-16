import React, { createContext, useContext, useState } from 'react';
import { Photo } from '../types';

interface UIContextType {
  activePhoto: Photo | null;
  setActivePhoto: (photo: Photo | null) => void;
}

const UIContext = createContext<UIContextType>({
  activePhoto: null,
  setActivePhoto: () => {},
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);

  return (
    <UIContext.Provider value={{ activePhoto, setActivePhoto }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);

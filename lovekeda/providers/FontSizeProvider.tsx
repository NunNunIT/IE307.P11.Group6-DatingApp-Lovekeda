import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FontSizeContextType {
  fontSize: number;
  setFontSize: (size: number) => void;
}

const FontSizeContext = createContext<FontSizeContextType>({
  fontSize: 16,
  setFontSize: () => {},
});

export const useFontSize = () => useContext(FontSizeContext);

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const loadFontSize = async () => {
      const storedFontSize = await AsyncStorage.getItem('fontSize');
      if (storedFontSize) {
        setFontSize(parseInt(storedFontSize, 10));
      }
    };
    loadFontSize();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

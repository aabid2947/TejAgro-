import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LuckyDrawContextType {
  hasVisitedLuckyDraw: boolean;
  setHasVisitedLuckyDraw: (visited: boolean) => void;
  isLoading: boolean;
}

const LuckyDrawContext = createContext<LuckyDrawContextType | undefined>(undefined);

const LUCKY_DRAW_VISITED_KEY = 'userVisitedLuckyDrawWinner';

interface LuckyDrawProviderProps {
  children: ReactNode;
}

export const LuckyDrawProvider: React.FC<LuckyDrawProviderProps> = ({ children }) => {
  const [hasVisitedLuckyDraw, setHasVisitedLuckyDrawState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadVisitedStatus();
    setHasVisitedLuckyDraw(false)
  }, []);

  const loadVisitedStatus = async () => {
    try {
      const visited = await AsyncStorage.getItem(LUCKY_DRAW_VISITED_KEY);
      setHasVisitedLuckyDrawState(visited === 'true');
    } catch (error) {
      console.error('Error loading lucky draw visited status:', error);
      setHasVisitedLuckyDrawState(false);
    } finally {
      setIsLoading(false);
    }
  };

  const setHasVisitedLuckyDraw = async (visited: boolean) => {
    try {
      await AsyncStorage.setItem(LUCKY_DRAW_VISITED_KEY, visited.toString());
      setHasVisitedLuckyDrawState(visited);
    } catch (error) {
      console.error('Error saving lucky draw visited status:', error);
    }
  };

  const value: LuckyDrawContextType = {
    hasVisitedLuckyDraw,
    setHasVisitedLuckyDraw,
    isLoading,
  };

  return (
    <LuckyDrawContext.Provider value={value}>
      {children}
    </LuckyDrawContext.Provider>
  );
};

export const useLuckyDraw = (): LuckyDrawContextType => {
  const context = useContext(LuckyDrawContext);
  if (context === undefined) {
    throw new Error('useLuckyDraw must be used within a LuckyDrawProvider');
  }
  return context;
};
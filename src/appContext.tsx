import React, { createContext, useContext, useState } from 'react';

export type VideoLength = number | undefined;

interface AppContext {
  videoLength: VideoLength;
  setVideoLength: React.Dispatch<React.SetStateAction<VideoLength>>;
}

const AppContext = createContext<AppContext | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [videoLength, setVideoLength] = useState<VideoLength>(undefined);
  const contextValue = { videoLength, setVideoLength };
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const contextValue = useContext(AppContext);
  if (contextValue === undefined) {
    throw new Error('useAppContext must be used within a AppProvider');
  }
  return contextValue;
}

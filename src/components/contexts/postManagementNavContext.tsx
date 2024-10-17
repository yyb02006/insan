import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

interface PostManagementNavContext {
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  isNavigating: boolean;
  setIsNavigating: Dispatch<SetStateAction<boolean>>;
}

const HamburgerMenuContext = createContext<PostManagementNavContext | undefined>(undefined);

export function HamburgerMenuProvider({ children }: { children: ReactNode }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const ContextValue = { isAnimating, setIsAnimating, isNavigating, setIsNavigating };
  return (
    <HamburgerMenuContext.Provider value={ContextValue}>{children}</HamburgerMenuContext.Provider>
  );
}

export function UseHamburgerMenuContext() {
  const contextValue = useContext(HamburgerMenuContext);
  if (contextValue === undefined) {
    throw new Error('HamburgerMenuContext must be used within a HamburgerMenuProvider');
  }
  return contextValue;
}

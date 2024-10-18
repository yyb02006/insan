import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type useScrollLock = [boolean, Dispatch<SetStateAction<boolean>>];

export default function useScrollLock(initialState: boolean = false): useScrollLock {
  const [isLocked, setIsLocked] = useState(initialState);
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLocked]);
  return [isLocked, setIsLocked];
}

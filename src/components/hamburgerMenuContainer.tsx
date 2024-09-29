import { AnimatePresence, stagger, useAnimate, usePresence } from 'framer-motion';
import { Dispatch, ReactNode, SetStateAction, useEffect } from 'react';
import LoaidngIndicator from './loadingIndicator';
import HamburgerButton from './hamburgerButton';

interface HamburgerMenuWrapperProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isNavigating: boolean;
  isAborted: boolean;
  children: ReactNode;
}

export default function HamburgerMenuContainer({
  isOpen,
  setIsOpen,
  isAborted,
  isNavigating,
  children,
}: HamburgerMenuWrapperProps) {
  const [isPresent, safeToRemove] = usePresence();
  const [navRef, animate] = useAnimate();
  useEffect(() => {
    if (isPresent) {
      const enterAnimation = async () => {
        await animate(
          '.ButtonShapes',
          { x: [84, 0] },
          {
            duration: 0.2,
            ease: 'easeOut',
            delay: stagger(0.2, { from: 3 }),
          }
        );
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        await animate(
          '.ButtonShapes',
          { x: [0, 84] },
          { duration: 0.2, ease: 'easeOut', delay: stagger(0.2) }
        );
        safeToRemove();
      };
      exitAnimation();
    }
  }, [isPresent, animate, safeToRemove]);
  useEffect(() => {
    if (isOpen && isPresent) {
      animate('.top', { y: 11.5, rotate: -45 });
      animate('.bottom', { y: -11.5, rotate: 45 });
      animate('.middle', { opacity: 0 });
    } else if (!isOpen && isPresent) {
      animate('.top', { y: 0, rotate: 0 });
      animate('.bottom', { y: 0, rotate: 0 });
      animate('.middle', { opacity: 1 });
    }
  }, [isOpen, isPresent, animate]);
  return (
    <div
      ref={navRef}
      className="absolute flex justify-center items-center right-0 w-6 aspect-square font-Roboto font-light text-[15px] text-[#E1E1E1] gap-9"
    >
      <AnimatePresence>{isOpen ? children : null}</AnimatePresence>
      <HamburgerButton isAbort={isAborted} setIsOpen={setIsOpen} />
      {isNavigating ? <LoaidngIndicator /> : null}
    </div>
  );
}

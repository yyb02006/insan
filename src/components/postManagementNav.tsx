import { AnimatePresence, stagger, useAnimate, usePresence } from 'framer-motion';
import {
  Children,
  cloneElement,
  Dispatch,
  isValidElement,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import LoaidngIndicator from './loadingIndicator';
import HamburgerButton from './hamburgerButton';

interface AdminNavProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsNavigating: Dispatch<SetStateAction<boolean>>;
  isNavigating: boolean;
  [key: string]: any;
}

interface AdminNavContainerProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isNavigating: boolean;
  isLoading: boolean;
  children: ReactElement<AdminNavProps>;
}

export default function AdminNavContainer({
  isOpen,
  setIsOpen,
  isLoading,
  isNavigating,
  children,
}: AdminNavContainerProps) {
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
  /* 
  const childrenWithProps = Children.map(children, (child) =>
    isValidElement(child)
      ? cloneElement(child, { setIsLoading, setIsNavigating, isNavigating })
      : child
  );
 */
  return (
    <ul
      ref={navRef}
      className="absolute flex justify-center items-center right-0 w-6 aspect-square font-Roboto font-light text-[15px] text-[#E1E1E1] gap-9"
    >
      {/* <ExtendedNav
            videoLength={videoLength}
            setIsLoading={setIsLoading}
            isMobile={isMobile}
            setIsNavigating={setIsNavigating}
            isNavigating={isNavigating}
          /> */}
      <AnimatePresence>{isOpen ? children : null}</AnimatePresence>
      <HamburgerButton isAbort={isLoading} setIsOpen={setIsOpen} />
      {isNavigating ? <LoaidngIndicator /> : null}
    </ul>
  );
}

// 부모 컴포넌트에서 자식 컴포넌트의 프로퍼티를 엮는 건 실패

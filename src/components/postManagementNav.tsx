import { stagger, useAnimate, usePresence, motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function PostManagementNav({
  setIsAborted,
}: {
  setIsAborted: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [ispresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  useEffect(() => {
    console.log(ispresent);
    if (ispresent) {
      const enterAnimation = async () => {
        setIsAborted(true);
        await animate(scope.current, { scale: 1 }, { duration: 0.4 });
        await animate(
          '.Circles',
          { scale: [1.5, 1], opacity: [0, 1] },
          {
            duration: 0.3,
            ease: 'easeOut',
            type: 'spring',
            delay: stagger(0.2),
          }
        );
        animate(
          '.Menu',
          { scale: [0.7, 1.2, 1], opacity: [0, 1] },
          { duration: 0.3, ease: 'easeIn', type: 'spring', bounce: 0.5 }
        );
        setIsAborted(false);
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        setIsAborted(true);
        animate(
          '.Circles',
          { scale: [1, 1.5], opacity: [1, 0] },
          {
            duration: 0.3,
            ease: 'easeOut',
            type: 'spring',
          }
        );
        await animate(
          '.Menu',
          { scale: [1, 1.2, 0.7], opacity: [1, 0] },
          { duration: 0.3, ease: 'easeIn', type: 'spring', bounce: 0.5 }
        );
        animate(scope.current, { borderRadius: '0% 0% 0% 100%' }, { duration: 0.2 });
        await animate(scope.current, { scale: 0 }, { duration: 4 });
        safeToRemove();
        setIsAborted(false);
      };
      exitAnimation();
    }
  }, [ispresent, animate, scope, setIsAborted]);
  return (
    <motion.div
      ref={scope}
      initial={{ scale: 0 }}
      className="origin-top-right box-content fixed right-0 top-0 w-[100vw] h-[100vh] bg-sky-500"
    >
      <div className="Menu"></div>
      <div className="Circles"></div>
    </motion.div>
  );
}

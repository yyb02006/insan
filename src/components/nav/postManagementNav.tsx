import { useAnimate, usePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

export default function PostManagementNav({
  setIsNavigating,
  setIsAborted,
}: {
  setIsNavigating: Dispatch<SetStateAction<boolean>>;
  setIsAborted: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPresent, safeToRemove] = usePresence();
  const [scope, animate] = useAnimate();
  const menuItems = useRef([
    { name: '추가하기', path: '/work/write' },
    { name: '삭제하기', path: '/work/delete' },
    { name: '정렬하기', path: '/work/sort' },
  ]);
  useEffect(() => {
    // safeToRemove는 isPresent가 false로 변하는 순간 생성되는 방식으로 isPresent에 의존하고 있다.
    // 따라서 의존성 배열에 safeToRemove를 넣으면 safeToRemove가 생성되며 useEffect를 한 번 더 실행시켜 의도치 않은 동작을 발생시킬 수 있다.
    if (isPresent) {
      const enterAnimation = async () => {
        setIsAborted(true);
        animate(scope.current, { scale: 1 }, { duration: 0.3 });
        await animate('.Inner', { scale: 1 }, { duration: 0.35 });
        setIsAborted(false);
      };
      enterAnimation();
    } else {
      const exitAnimation = async () => {
        setIsAborted(true);
        animate('.Inner', { scale: 0 }, { duration: 0.3 });
        await animate(scope.current, { scale: 0 }, { duration: 0.35 });
        safeToRemove();
        setIsAborted(false);
      };
      exitAnimation();
    }
  }, [isPresent, animate, scope, setIsAborted]);
  const handleMenuClick = () => {
    setIsNavigating(true);
  };
  return (
    <motion.div
      ref={scope}
      initial={{ scale: 0 }}
      className="origin-top-right rounded-bl-[24px] box-content fixed right-0 top-0 w-[200px] h-[360px] bg-[#101010] border-b border-l border-[#eaeaea]"
    >
      <motion.div
        initial={{ scale: 0 }}
        className="Inner origin-top-right w-[calc(100%-6px)] h-[calc(100%-6px)] border-b border-l float-right rounded-bl-[16px] border-[#eaeaea]"
      >
        <ul className="font-Pretendard pt-[100px] pb-[60px] font-light text-base w-full h-full flex flex-col justify-between items-center">
          {menuItems.current.map((item) => {
            const { name, path } = item;
            return (
              <li
                key={name}
                onClick={() => {
                  handleMenuClick();
                }}
                className="hover:text-palettered cursor-pointer"
              >
                <Link href={path}>{name}</Link>
              </li>
            );
          })}
          <li
            onClick={() => {
              handleMenuClick();
            }}
            className="hover:text-palettered cursor-pointer"
          >
            로그아웃
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

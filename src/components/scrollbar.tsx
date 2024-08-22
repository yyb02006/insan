import { cls } from '@/libs/client/utils';
import { m, useScroll, useTransform } from 'framer-motion';
import { RefObject, useEffect, useRef, useState } from 'react';

interface ScrollBarProps {
  paddingY: 4 | 8 | 12;
  right: 4 | 6 | 8;
}

interface WavePatternProps {
  repeatHeight?: number;
  outputMax?: number;
  verticalPostion?: number;
  bgColor?: string;
}

const WavePattern = ({
  repeatHeight = 3000,
  outputMax = 360,
  verticalPostion = 20,
  bgColor = 'bg-[#eaeaea]',
}: WavePatternProps) => {
  const { scrollY, scrollYProgress } = useScroll();
  const rotate = useTransform(scrollY, [0, repeatHeight], [0, outputMax], { clamp: false });
  const translateY = useTransform(
    scrollYProgress,
    (value) => `${-(value * 60) + verticalPostion}%`
  );
  return (
    <m.div
      style={{
        rotateZ: rotate,
        translateX: '-50%',
        translateY: translateY,
      }}
      className={cls(bgColor, 'w-[200%] h-[200%] top-[50%] left-[50%] absolute rounded-[35%]')}
    />
  );
};

export default function ScrollBar({ paddingY, right }: ScrollBarProps) {
  const [scrollDistance, setScrollDistance] = useState<number>();
  const thumbRef = useRef<HTMLDivElement>(null);
  const pYClasses = { 4: 'py-1', 8: 'py-2', 12: 'py-3' };
  const rightClasses = { 4: 'right-[4px]', 6: 'right-[6px]', 8: 'right-[8px]' };

  const getScrollData = () => {
    const { scrollHeight, clientHeight } = document.documentElement;
    const { scrollY } = window;
    const thumbHeight = thumbRef.current?.offsetHeight || 0;
    const validScrollHeight = clientHeight - thumbHeight - paddingY * 2;
    return { scrollHeight, clientHeight, scrollY, thumbHeight, validScrollHeight };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startY = e.clientY;
    const { clientHeight, scrollHeight, scrollY, validScrollHeight } = getScrollData();
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (e.clientY < 0 || e.clientY > clientHeight) return;
      const deltaY = e.clientY - startY;
      window.scrollTo(0, scrollY + deltaY * ((scrollHeight - clientHeight) / validScrollHeight));
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  useEffect(() => {
    const handleScroll = () => {
      const { clientHeight, scrollHeight, scrollY, validScrollHeight } = getScrollData();
      setScrollDistance((validScrollHeight * scrollY) / (scrollHeight - clientHeight));
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={cls(pYClasses[paddingY], 'fixed h-screen w-6 z-[1000] top-0 right-0')}>
      <div
        ref={thumbRef}
        style={{ translate: `0 ${scrollDistance}px` }}
        onMouseDown={handleMouseDown}
        className={cls(
          rightClasses[right],
          scrollDistance === undefined ? 'opacity-0' : 'opacity-100',
          'relative w-full aspect-square overflow-hidden rounded-full bg-transparent'
        )}
      >
        {/* <div className="absolute top-0 w-full h-full border border-[#101010] rounded-full bg-[#eaeaea]"></div> */}
        <WavePattern bgColor="bg-[#444444]" outputMax={480} />
        <WavePattern bgColor="bg-[#8a8a8a]" outputMax={420} verticalPostion={30} />
        <WavePattern verticalPostion={40} />
      </div>
    </div>
  );
}

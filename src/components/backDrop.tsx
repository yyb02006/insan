import { cls } from '@/libs/client/utils';

export default function BackDrop({
  postion = 'fixed',
  opacity = 70,
}: {
  postion?: 'fixed' | 'absolute';
  opacity?: 60 | 70 | 80 | 90;
}) {
  const opacityCSS = (opacity: 60 | 70 | 80 | 90) => {
    switch (opacity) {
      case 60:
        return 'opacity-60';
      case 70:
        return 'opacity-70';
      case 80:
        return 'opacity-80';
      case 90:
        return 'opacity-90';
      default:
        return '';
    }
  };
  return (
    <div
      className={cls(
        postion === 'fixed' ? 'fixed z-[1001]' : 'absolute',
        opacityCSS(opacity),
        'fixed top-0 left-0 w-screen h-screen bg-black'
      )}
    />
  );
}

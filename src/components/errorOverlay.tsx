import BackDrop from '@/components/backDrop';
import { ReactNode } from 'react';

export default function ErrorOverlay({ children }: { children: ReactNode }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[1001] flex justify-center items-center">
      <BackDrop postion="absolute" />
      {children}
    </div>
  );
}

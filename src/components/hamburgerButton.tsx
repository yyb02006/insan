import { cls } from '@/libs/client/utils';
import { Dispatch, SetStateAction } from 'react';

export default function HamburgerButton({
  setIsOpen,
  isAbort,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isAbort: boolean;
}) {
  return (
    <div
      onClick={() => {
        if (isAbort) return;
        setIsOpen((p) => !p);
      }}
      className="relative h-16 cursor-pointer aspect-square bg-[#101010] rounded-full flex justify-center items-center group"
    >
      <ul className="h-6 aspect-square flex flex-col justify-between items-end">
        {[
          { position: 'top', width: 'w-6' },
          { position: 'middle', width: 'w-4' },
          { position: 'bottom', width: 'w-6' },
        ].map((arr, idx) => (
          <li
            key={idx}
            className={cls(
              cls(arr.position, arr.width),
              'ButtonShapes h-[1px] origin-center bg-[#cacaca] rounded-full translate-x-[84px] group-hover:bg-palettered transition-colors duration-300'
            )}
          />
        ))}
      </ul>
    </div>
  );
}

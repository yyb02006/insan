import { cls } from '@/libs/client/utils';

const ListIcon = () => {
  return (
    <ul className="w-[50%] h-[50%] flex flex-col justify-around">
      <li className="w-full border-y-[1px] bg-white" />
      <li className="w-full border-y-[1px] bg-white" />
      <li className="w-full border-y-[1px] bg-white" />
    </ul>
  );
};

const GridIcon = () => {
  return (
    <ul className="w-[50%] h-[50%] grid grid-cols-2 gap-1">
      <li className="w-full aspect-square bg-[#eaeaea]" />
      <li className="w-full aspect-square border border-[#eaeaea]" />
      <li className="w-full aspect-square border border-[#eaeaea]" />
      <li className="w-full aspect-square bg-[#eaeaea]" />
    </ul>
  );
};

interface UtilButtonsProps {
  onListClick: () => void;
  onViewSwitch: () => void;
  isGrid: boolean;
  onSelectedList: boolean;
  count: number;
  useOnMobile: boolean;
  listLabel?: string;
}

export default function UtilButtons({
  onListClick,
  onViewSwitch,
  isGrid,
  onSelectedList,
  count,
  useOnMobile,
  listLabel = 'Videos',
}: UtilButtonsProps) {
  return (
    <div
      className={`${
        useOnMobile
          ? 'fixed sm:hidden bottom-24 right-4 w-16 font-bold '
          : 'hidden sm:inline-block w-full font-light hover:font-bold'
      }`}
    >
      <button
        onClick={onListClick}
        className={cls(
          useOnMobile
            ? 'mb-4 sm:hidden w-16 font-bold'
            : 'hidden sm:inline-block w-full font-light hover:font-bold',
          onSelectedList
            ? 'bg-palettered'
            : 'bg-[#101010] hover:text-palettered ring-1 ring-palettered',
          'aspect-square text-sm rounded-full'
        )}
        disabled={!onSelectedList && count === 0}
      >
        <div>{count}</div>
        <div>{listLabel}</div>
      </button>
      <button
        onClick={onViewSwitch}
        className={cls(
          'w-full flex justify-center items-center ring-1 ring-palettered aspect-square bg-[#101010] rounded-full'
        )}
      >
        {isGrid ? <ListIcon /> : <GridIcon />}
      </button>
    </div>
  );
}

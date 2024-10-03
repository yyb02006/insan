import UtilButtons from '@/components/butttons/utilButtons';
import { cls } from '@/libs/client/utils';

interface ButtonsControllerProps {
  onResetClick: () => void;
  onSaveClick: () => void;
  onListClick: () => void;
  onViewSwitch: () => void;
  isGrid: boolean;
  onSelectedList: boolean;
  count: number;
  action?: 'save' | 'delete';
}

export default function ButtonsController({
  onResetClick,
  onSaveClick,
  onListClick,
  onViewSwitch,
  isGrid,
  onSelectedList,
  count,
  action = 'save',
}: ButtonsControllerProps) {
  return (
    <div className="sm:w-[60px] flex sm:block h-14 sm:h-auto w-full sm:ring-1 sm:space-y-[1px] sm:ring-palettered sm:rounded-full fixed xl:right-20 sm:right-4 right-0 sm:top-[100px] sm:bottom-auto bottom-0">
      <button
        onClick={onResetClick}
        className={cls(
          count > 0 ? 'sm:hover:text-palettered sm:hover:font-bold' : 'text-[#404040]',
          'w-full ring-1 ring-palettered aspect-square bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm '
        )}
        disabled={count === 0}
      >
        Reset
      </button>
      <button
        onClick={onSaveClick}
        className={cls(
          count > 0
            ? 'sm:hover:text-palettered sm:hover:font-bold bg-palettered'
            : 'text-[#404040]',
          'w-full ring-1 ring-palettered aspect-square bg-[#101010] sm:bg-[#101010] sm:rounded-full sm:font-light font-bold text-sm '
        )}
        disabled={count === 0}
      >
        {action === 'save' ? <span>Save</span> : <span>Delete</span>}
      </button>
      <UtilButtons
        onViewSwitch={onViewSwitch}
        onListClick={onListClick}
        isGrid={isGrid}
        onSelectedList={onSelectedList}
        count={count}
        useOnMobile={false}
      />
    </div>
  );
}

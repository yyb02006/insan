import { GetServerSideProps } from 'next';
import {
  Dispatch,
  DragEvent,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import Layout from '@/components/layout';
import PostManagementLayout from '@/components/nav/postManagementLayout';
import SearchForm from '@/components/searchForm';
import client from '@/libs/server/client';
import PostManagementMenu from '@/components/nav/postManagementMenu';
import { FlatformsCategory, VideoCollection, VideoResponseState } from '@/pages/work/work';
import { Works } from '@prisma/client';
import { ciIncludes, cls, normalizeLeadingZero } from '@/libs/client/utils';
import { useInfiniteScroll } from '@/libs/client/useInfiniteScroll';
import ButtonsController from '@/components/butttons/buttonsController';
import UtilButtons from '@/components/butttons/utilButtons';
import Thumbnail from '@/components/thumbnail';
import useMutation from '@/libs/client/useMutation';
import LoaidngIndicator from '@/components/loadingIndicator';
import BackDrop from '@/components/backDrop';
import ErrorOverlay from '@/components/errorOverlay';
import { useRouter } from 'next/router';

type WorksUsedInSort = Omit<Works, 'createdAt' | 'updatedAt' | 'description'>;

interface IdWithOrder {
  id: number;
  currentOrder: number;
  originalOrder: number;
}

type IdWithOrderByCategory = VideoCollection<Array<IdWithOrder>>;

interface SelectedItem extends WorksUsedInSort {
  currentOrder: number;
}

interface VideoItemInputProps {
  video: WorksUsedInSort;
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
  swapItems: IdWithOrder[];
  currentSwapItem: IdWithOrder | undefined;
}

const VideoItemInput = ({
  video,
  setSwapItems,
  swapItems,
  currentSwapItem,
}: VideoItemInputProps) => {
  const [orderValue, setOrderValue] = useState(currentSwapItem?.currentOrder || 0);
  useEffect(() => {
    setOrderValue(currentSwapItem?.currentOrder || 0);
  }, [currentSwapItem?.currentOrder]);

  const onOrderChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const numValue = Number(value);
    setOrderValue(numValue);
  };
  const onInputBlur = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const currentValue = Number(value);
    const previousValue = currentSwapItem?.currentOrder;
    const duplicateOrder = swapItems.find(
      (item) => item.currentOrder === currentValue && item.id !== video.id // 값을 바꾸지 않아서 입력된 값으로 검색된 id가 자기 자신인 경우가 아닐 때
    );
    if (
      previousValue &&
      duplicateOrder &&
      currentValue <= swapItems.length && // 입력된 값이 전체 길이보다 낮은 값일 때
      currentValue > 0 // 입력된 값이 전체 길이보다 높은 값일 때
    ) {
      setSwapItems((p) => {
        return p.map((item) => {
          {
            switch (true) {
              // 자신일 경우
              case item.id === video.id:
                return { ...item, currentOrder: currentValue };
              // 전보다 낮은 order를 입력했을 때, 이전 order와 현재 order 사이의 item일 경우
              case item.currentOrder >= currentValue && item.currentOrder < previousValue:
                return { ...item, currentOrder: item.currentOrder + 1 };
              // 전보다 높은 order를 입력했을 때, 이전 order와 현재 order 사이의 item일 경우
              case item.currentOrder <= currentValue && item.currentOrder > previousValue:
                return { ...item, currentOrder: item.currentOrder - 1 };
              // order 변경에 해당되지 않는 경우
              default:
                return item;
            }
          }
        });
      });
    } else {
      setOrderValue(previousValue || 0); // 값 원상복귀
    }
  };
  return (
    <input
      className="mr-2 h-10 w-16 border px-1 border-palettered flex justify-center items-center text-lg text-center bg-[#101010]"
      type="number"
      value={normalizeLeadingZero(orderValue.toString())}
      onChange={onOrderChange}
      onBlur={onInputBlur}
    />
  );
};

interface VideoItemTitleProps {
  category: FlatformsCategory;
  kind: string;
  title: string;
}

const VideoItemTitle = ({ category, kind, title }: VideoItemTitleProps) => {
  return (
    <div className="relative text-base break-words">
      <span className="whitespace-nowrap">
        {category !== 'outsource' ? (
          <span
            className={cls(
              kind === 'film' ? 'text-palettered' : 'text-green-500',
              'text-base font-semibold'
            )}
          >
            {kind === 'film' ? '[FILM]' : '[SHORT]'}
          </span>
        ) : null}{' '}
      </span>
      <h1 className="inline-block">{title}</h1>
    </div>
  );
};

interface DragAreaProps {
  position: 'left' | 'right';
  isDraggingOver: {
    left: boolean;
    right: boolean;
  };
  setIsDraggingOver: Dispatch<
    SetStateAction<{
      left: boolean;
      right: boolean;
    }>
  >;
  isDraggable: boolean;
  currentSwapItem: IdWithOrder | undefined;
  isDraggingElement: boolean;
  selectedItem: SelectedItem | undefined;
}

const DragArea = ({
  position,
  isDraggable,
  isDraggingOver,
  currentSwapItem,
  isDraggingElement,
  selectedItem,
  setIsDraggingOver,
}: DragAreaProps) => {
  const onVideoDragOver = (e: DragEvent<HTMLElement>, sidePosition: 'left' | 'right') => {
    e.preventDefault();
    if (!isDraggable || isDraggingElement || !currentSwapItem) return;
    if (sidePosition === 'left') {
      setIsDraggingOver((p) => ({ ...p, left: true }));
    } else {
      setIsDraggingOver((p) => ({ ...p, right: true }));
    }
  };
  const sideAreaOffset = position === 'left' ? '-left-3' : '-right-3';
  const sideBorderOffset =
    position === 'left' ? '-left-[6px] border-l-[6px]' : '-right-[6px] border-r-[6px]';
  const sideRingOffset = position === 'left' ? '-left-[4px]' : '-right-[4px]';
  useEffect(() => {
    if (!isDraggable) {
      setIsDraggingOver({ left: false, right: false });
    }
  }, [isDraggable, setIsDraggingOver]);
  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          onVideoDragOver(e, position);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDraggingOver((p) => ({ ...p, [position]: false }));
        }}
        className={cls(
          isDraggable && !isDraggingElement ? 'block' : 'hidden',
          sideAreaOffset,
          'absolute w-[calc(50%+12px)] h-full top-0 z-10 bg-transparent'
        )}
      />
      <div
        className={cls(
          isDraggable && isDraggingOver[position] && !selectedItem
            ? 'border-palettered'
            : 'border-transparent',
          sideBorderOffset,
          'absolute top-0 h-full'
        )}
      >
        {selectedItem ? (
          <div
            className={cls(
              isDraggable && isDraggingOver[position] ? 'bg-palettered ring-2 ring-palettered' : '',
              sideRingOffset,
              'absolute top-0 w-[2px] h-full'
            )}
          />
        ) : null}
      </div>
    </>
  );
};

interface VideoListItemProps {
  idx: number;
  video: WorksUsedInSort;
  category: FlatformsCategory;
  selectedItem: SelectedItem | undefined;
  currentSwapItem: IdWithOrder | undefined;
  isDraggable: boolean;
  isDragging: boolean;
  isDraggingOver: { left: boolean; right: boolean };
  swapItems: IdWithOrder[];
  setIsDraggable: Dispatch<SetStateAction<boolean>>;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  setIsDraggingOver: Dispatch<SetStateAction<{ left: boolean; right: boolean }>>;
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
  onVideoDrop: () => void;
  onThumbnailClick: (video: WorksUsedInSort) => void;
}

const VideoListItem = ({
  idx,
  category,
  currentSwapItem,
  isDraggable,
  isDragging,
  isDraggingOver,
  onThumbnailClick,
  onVideoDrop,
  selectedItem,
  setIsDraggable,
  setIsDragging,
  setIsDraggingOver,
  setSwapItems,
  swapItems,
  video,
}: VideoListItemProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [onThumbnail, setOnThumbnail] = useState(false);
  const { resourceId, title, thumbnailLink, category: kind, order } = video;
  return (
    <section
      draggable
      onDragStart={() => {
        if (!selectedItem) return;
        setIsDraggable(true);
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnd={() => {
        setIsDraggable(false);
        setIsDragging(false);
      }}
      onDrop={onVideoDrop}
      onMouseDown={() => {
        if (selectedItem) {
          setIsRegistering(false);
        } else {
          setIsRegistering(true);
          onThumbnailClick(video);
        }
      }}
      onClick={() => {
        if (!selectedItem || isRegistering) return;
        onThumbnailClick(video);
      }}
      className={cls(
        selectedItem ? 'ring-2' : 'ring-0',
        'text-xs flex ring-palettered relative cursor-pointer hover:ring-2 hover:ring-palettered',
        `px-2 py-3 ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : ''} ${
          idx % 4 === 2 ? 'xl:bg-[#101010]' : ''
        } ${idx % 4 === 3 || idx % 4 === 0 ? 'xl:bg-[#1a1a1a] bg-[#101010]' : ''} `
      )}
    >
      {['left', 'right'].map((position) => (
        <DragArea
          key={position}
          position={position as 'left' | 'right'}
          isDraggable={isDraggable}
          currentSwapItem={currentSwapItem}
          isDraggingOver={isDraggingOver}
          isDraggingElement={isDragging}
          setIsDraggingOver={setIsDraggingOver}
          selectedItem={selectedItem}
        />
      ))}
      <VideoItemInput
        video={video}
        setSwapItems={setSwapItems}
        swapItems={swapItems}
        currentSwapItem={currentSwapItem}
      />
      <div className="w-full">
        <VideoItemTitle category={category} title={title} kind={kind} />
        <div className="flex justify-between">
          <div className="font-light break-words text-[#606060]">
            <span className="whitespace-nowrap">OriginalOrder : </span>
            <span className="text-[#999999] font-semibold">{order}</span>
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOnThumbnail((p) => !p);
            }}
          >
            <span className="whitespace-nowrap text-[#888888] hover:text-palettered">
              (미리보기)
            </span>
            {onThumbnail ? (
              <div className="fixed z-[1002] w-screen h-screen left-0 top-0 flex justify-center items-center">
                <div className="w-full h-full bg-black opacity-80 absolute top-0 left-0" />
                <div className="w-[80%] lg:w-[640px] relative">
                  <Thumbnail
                    category={category}
                    src={
                      category === 'filmShort'
                        ? {
                            main: `${thumbnailLink}_640x360?r=pad`,
                            sub: `${thumbnailLink}_640x360?r=pad`,
                            alt: title,
                          }
                        : {
                            main: `https://i.ytimg.com/vi/${resourceId}/sddefault.jpg`,
                            sub: `https://i.ytimg.com/vi/${resourceId}/hqdefault.jpg`,
                            alt: title,
                          }
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

interface VideoGridItemProps {
  video: WorksUsedInSort;
  category: FlatformsCategory;
  selectedItem: SelectedItem | undefined;
  currentSwapItem: IdWithOrder | undefined;
  isDraggable: boolean;
  isDragging: boolean;
  isDraggingOver: { left: boolean; right: boolean };
  swapItems: IdWithOrder[];
  setIsDraggable: Dispatch<SetStateAction<boolean>>;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  setIsDraggingOver: Dispatch<SetStateAction<{ left: boolean; right: boolean }>>;
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
  onVideoDrop: () => void;
  onThumbnailClick: (video: WorksUsedInSort) => void;
}

const VideoGridItem = ({
  video,
  category,
  selectedItem,
  currentSwapItem,
  isDraggable,
  isDragging,
  isDraggingOver,
  swapItems,
  setIsDraggable,
  setIsDragging,
  setIsDraggingOver,
  setSwapItems,
  onVideoDrop,
  onThumbnailClick,
}: VideoGridItemProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { resourceId, title, thumbnailLink, category: kind, order } = video;
  return (
    <section
      onDragStart={() => {
        if (!selectedItem) return;
        setIsDraggable(true);
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDragEnd={() => {
        setIsDraggable(false);
        setIsDragging(false);
      }}
      onDrop={onVideoDrop}
      className={cls(
        selectedItem ? 'ring-2' : 'ring-0',
        'ring-palettered relative cursor-pointer hover:ring-2 hover:ring-palettered'
      )}
    >
      {['left', 'right'].map((position) => (
        <DragArea
          key={position}
          position={position as 'left' | 'right'}
          isDraggable={isDraggable}
          currentSwapItem={currentSwapItem}
          isDraggingOver={isDraggingOver}
          isDraggingElement={isDragging}
          setIsDraggingOver={setIsDraggingOver}
          selectedItem={selectedItem}
        />
      ))}
      <div
        // 클릭과 동시에 드래그해도 리스트에 등록되면서,
        // 이미 등록된 리스트를 드래그하기 위해 클릭할 때는 등록 해제가 되지 않도록 down, click 둘 다 사용
        onMouseDown={() => {
          if (selectedItem) {
            setIsRegistering(false);
          } else {
            setIsRegistering(true);
            onThumbnailClick(video);
          }
        }}
        onClick={() => {
          if (!selectedItem || isRegistering) return;
          onThumbnailClick(video);
        }}
        className="relative"
      >
        <Thumbnail
          category={category}
          src={
            category === 'filmShort'
              ? {
                  main: `${thumbnailLink}_640x360?r=pad`,
                  sub: `${thumbnailLink}_640x360?r=pad`,
                  alt: title,
                }
              : {
                  main: `https://i.ytimg.com/vi/${resourceId}/sddefault.jpg`,
                  sub: `https://i.ytimg.com/vi/${resourceId}/hqdefault.jpg`,
                  alt: title,
                }
          }
        />
      </div>
      <div className="flex mt-2 relative">
        <VideoItemInput
          video={video}
          setSwapItems={setSwapItems}
          swapItems={swapItems}
          currentSwapItem={currentSwapItem}
        />
        <div className="text-xs">
          <VideoItemTitle category={category} title={title} kind={kind} />
          <div className="font-light break-words text-[#606060]">
            <span className="whitespace-nowrap">OriginalOrder : </span>
            <span className="text-[#999999] font-semibold">{order}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

interface VideoItemProps {
  video: WorksUsedInSort;
  category: FlatformsCategory;
  isGrid: boolean;
  idx: number;
  selectedList: SelectedItem[];
  setSelectedList: Dispatch<SetStateAction<SelectedItem[]>>;
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
  swapItems: IdWithOrder[];
  isDraggable: boolean;
  setIsDraggable: Dispatch<SetStateAction<boolean>>;
}

const VideoItem = ({
  video,
  category,
  isGrid,
  idx,
  selectedList,
  setSelectedList,
  setSwapItems,
  swapItems,
  isDraggable,
  setIsDraggable,
}: VideoItemProps) => {
  const selectedItem = selectedList.find((item) => item.id === video.id);
  const currentSwapItem = swapItems.find((item) => item.id === video.id);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const onThumbnailClick = (video: WorksUsedInSort) => {
    setSelectedList((p) => {
      const matchedSwapItem = swapItems.find((item) => item.id === video.id);
      return selectedItem
        ? p.filter((item) => item.id !== video.id)
        : [
            ...p,
            {
              ...video,
              currentOrder: matchedSwapItem?.currentOrder || 0,
            },
          ];
    });
  };
  const onVideoDrop = () => {
    console.log(!!currentSwapItem, !!isDraggable);
    if (!currentSwapItem || !isDraggable) return;
    const sortedSelectedList = selectedList.sort((a, b) => b.currentOrder - a.currentOrder);
    const videoSort = (items: IdWithOrder[], position: 'left' | 'right') => {
      return items.map((item) => {
        const matchedIndex = sortedSelectedList.findIndex((listItem) => listItem.id === item.id);
        // 드롭하려는 위치 의 order값
        const targetOrder =
          position === 'left' ? currentSwapItem.currentOrder : currentSwapItem.currentOrder - 1;
        switch (true) {
          // matchedIndex가 존재하는 경우
          case matchedIndex !== -1:
            return {
              ...item,
              currentOrder:
                // 드롭하려는 위치
                targetOrder -
                // selectedList내부의 order값 순서대로 그대로 옮기기 위해 order값 순서만큼 감산
                matchedIndex +
                // 드롭하려는 위치보다 앞에서 아이템이 빠졌을 경우, 해당 아이템 수만큼 가산해서 드롭하려는 위치 조정
                selectedList.filter((listItem) => listItem.currentOrder > targetOrder).length,
            };
          case item.currentOrder > targetOrder:
            return {
              ...item,
              currentOrder:
                item.currentOrder +
                selectedList.filter((listItem) => listItem.currentOrder > item.currentOrder).length,
            };
          case item.currentOrder <= targetOrder:
            return {
              ...item,
              currentOrder:
                item.currentOrder -
                selectedList.filter((listItem) => listItem.currentOrder < item.currentOrder).length,
            };
          default:
            return item;
        }
      });
    };
    if (isDraggingOver.left) {
      setSwapItems((p) => videoSort(p, 'left'));
    } else if (isDraggingOver.right) {
      setSwapItems((p) => videoSort(p, 'right'));
    } else {
      return;
    }
    setSelectedList([]);
  };
  return (
    <>
      {isGrid ? (
        <VideoGridItem
          category={category}
          currentSwapItem={currentSwapItem}
          selectedItem={selectedItem}
          isDraggable={isDraggable}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          onThumbnailClick={onThumbnailClick}
          onVideoDrop={onVideoDrop}
          setIsDraggable={setIsDraggable}
          setIsDragging={setIsDragging}
          setIsDraggingOver={setIsDraggingOver}
          setSwapItems={setSwapItems}
          swapItems={swapItems}
          video={video}
        />
      ) : (
        <VideoListItem
          idx={idx}
          category={category}
          currentSwapItem={currentSwapItem}
          selectedItem={selectedItem}
          isDraggable={isDraggable}
          isDragging={isDragging}
          isDraggingOver={isDraggingOver}
          onThumbnailClick={onThumbnailClick}
          onVideoDrop={onVideoDrop}
          setIsDraggable={setIsDraggable}
          setIsDragging={setIsDragging}
          setIsDraggingOver={setIsDraggingOver}
          setSwapItems={setSwapItems}
          swapItems={swapItems}
          video={video}
        />
      )}
    </>
  );
};

interface VideoFeedProps {
  category: FlatformsCategory;
  searchResult: VideoCollection<WorksUsedInSort[]>;
  setSearchResult: Dispatch<SetStateAction<VideoCollection<WorksUsedInSort[]>>>;
  selectedList: SelectedItem[];
  setSelectedList: Dispatch<SetStateAction<SelectedItem[]>>;
  isGrid: boolean;
  page: number;
  swapItems: IdWithOrder[];
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
}

const VideoFeed = ({
  searchResult,
  selectedList,
  setSelectedList,
  category,
  isGrid,
  page,
  setSearchResult,
  swapItems,
  setSwapItems,
}: VideoFeedProps) => {
  useEffect(() => {
    setSearchResult((p) => ({
      ...p,
      [category]: p[category]
        .map((video) => {
          const matchedItem = swapItems.find((item) => video.id === item.id);
          return matchedItem ? { ...video, order: matchedItem.currentOrder } : video;
        })
        .sort((a, b) => b.order - a.order),
    }));
  }, [searchResult[category].length, swapItems, setSearchResult]);
  const [isDraggable, setIsDraggable] = useState(false);
  return (
    <div
      className={
        isGrid
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '
          : 'grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4'
      }
    >
      {searchResult[category].map((video, index) => {
        return index < 12 * page ? (
          <VideoItem
            key={video.id}
            category={category}
            video={video}
            isGrid={isGrid}
            idx={index}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            setSwapItems={setSwapItems}
            swapItems={swapItems}
            isDraggable={isDraggable}
            setIsDraggable={setIsDraggable}
          />
        ) : null;
      })}
    </div>
  );
};

interface ChangedItemsModal {
  setIsSelectedListOpen: Dispatch<SetStateAction<boolean>>;
  changedSwapItems: IdWithOrder[];
}

const ChangedItemsModal = ({ changedSwapItems, setIsSelectedListOpen }: ChangedItemsModal) => {
  return (
    <div className="fixed z-[1001] top-0 left-0 w-screen h-screen xl:px-48 sm:px-32 px-24 py-32">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-80" />
      <div className="relative bg-[#101010] w-full h-full overflow-y-scroll">
        <button
          className="absolute m-2 top-4 right-4"
          onClick={() => {
            setIsSelectedListOpen(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-10 h-10 stroke-[#707070]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 max-w-[420px] m-auto gap-4 py-20">
          {changedSwapItems.map((item) => (
            <div key={item.id} className="w-full h-full flex justify-center items-center">
              <span>
                {item.originalOrder}
                {` => `}
                {item.currentOrder}
              </span>
              <span
                className={cls(
                  item.originalOrder > item.currentOrder
                    ? 'text-palettered'
                    : item.originalOrder < item.currentOrder
                    ? 'text-green-500'
                    : '',
                  'ml-2'
                )}
              >
                {`( ${
                  item.originalOrder > item.currentOrder
                    ? '-'
                    : item.originalOrder < item.currentOrder
                    ? '+'
                    : ''
                }${Math.abs(item.originalOrder - item.currentOrder)} )`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface InitialData {
  initialWorks: VideoCollection<WorksUsedInSort[]>;
  initialHasNextPage: VideoCollection<boolean>;
  idWithOrderByCategory: IdWithOrderByCategory;
}

export default function Sort({
  initialWorks,
  initialHasNextPage,
  idWithOrderByCategory,
}: InitialData) {
  const topElementRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [category, setCategory] = useState<FlatformsCategory>('filmShort');
  const [videoList, setVideoList] = useState(initialWorks);
  const [searchWord, setSearchWord] = useState('');
  const [searchWordSnapShot, setSearchWordSnapShot] = useState('');
  const [searchResult, setSearchResult] =
    useState<VideoCollection<WorksUsedInSort[]>>(initialWorks);
  const [selectedList, setSelectedList] = useState<SelectedItem[]>([]);
  const [hasNextPage, setHasNextPage] = useState<VideoCollection<boolean>>(initialHasNextPage);
  const [isGrid, setIsGrid] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isSelectedListOpen, setIsSelectedListOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [apiPage, setApiPage] = useState<{
    filmShort: number;
    outsource: number;
  }>({ filmShort: 1, outsource: 1 });
  const [swapItems, setSwapItems] = useState<IdWithOrder[]>(idWithOrderByCategory[category]);
  const perPage = 12;
  const onCategoryClick = (categoryLabel: FlatformsCategory) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
  };
  const [sendItems, { loading, data, error }] = useMutation<{ success: boolean }>(
    `/api/work?purpose=sort`
  );
  const changedSwapItems = swapItems.filter((item) => item.currentOrder !== item.originalOrder);

  useEffect(() => {
    if (data && data?.success) {
      router.push('/work');
    } else if (data && !data?.success) {
      const timeOut = setTimeout(() => {
        router.push('/work');
      }, 3000);
      return () => clearTimeout(timeOut);
    }
  }, [data]);

  const onSearchSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1); // page 부분이 2부터 시작할 필요가 있는지 살피고 수정 필요
    setSearchWordSnapShot(searchWord);
    const currentList = isSelectedListOpen ? selectedList : videoList[category]; // 뻐킹 상상치도 못한방법
    setSearchResult((p) => ({
      ...p,
      [category]: currentList.filter((li) => ciIncludes(li.title, searchWord)),
    }));
  };
  const commonReset = () => {
    setPage(1);
    setSearchWord('');
    setSearchWordSnapShot('');
    setSelectedList([]);
    setSearchResult((p) => ({ ...p, [category]: videoList[category] }));
    setSwapItems(idWithOrderByCategory[category]);
  };
  useEffect(() => {
    commonReset();
  }, [category]);
  const onResetClick = () => {
    if (changedSwapItems.length > 0) {
      commonReset();
      topElementRef.current?.scrollIntoView();
    }
  };
  const processIntersection = () => {
    const getVideos = async () => {
      setFetchLoading(true);
      const response: VideoResponseState = await (
        await fetch(
          `/api/work/list?page=${apiPage[category] + 1}&per_page=${perPage}&category=${category}`
        )
      ).json();
      const convertedCategory = category === 'filmShort' ? 'film' : 'outsource';
      if (response.works[convertedCategory].length < perPage) {
        setHasNextPage((p) => ({ ...p, [category]: false }));
      }
      setVideoList((p) => ({
        ...p,
        [category]: [...p[category], ...response.works[convertedCategory]],
      }));
      setSearchResult((p) => ({
        ...p,
        [category]: [
          ...p[category],
          ...response.works[convertedCategory].filter((work) =>
            ciIncludes(work.title, searchWordSnapShot)
          ),
        ],
      }));
      setApiPage((p) => ({ ...p, [category]: p[category] + 1 }));
      setFetchLoading(false);
    };
    if (fetchLoading) return;
    if (
      searchResult[category].length <= page * perPage &&
      hasNextPage[category] &&
      !isSelectedListOpen
    ) {
      getVideos();
    }
    if (searchResult[category].length >= page * perPage) {
      setPage((p) => p + 1);
    }
  };
  const onSubmitSort = () => {
    if (loading || changedSwapItems.length === 0) return;
    sendItems({ data: changedSwapItems, secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN });
  };
  const intersectionRef = useInfiniteScroll({
    processIntersection,
    dependencyArray: [page, isGrid],
  });
  const onSelectedListClick = () => {
    setIsSelectedListOpen((p) => !p);
  };
  return (
    <Layout
      seoTitle="SORT"
      footerPosition="hidden"
      nav={{ isCollapsed: true }}
      menu={{
        hasMenu: true,
        menuComponent: <PostManagementMenu />,
      }}
    >
      <PostManagementLayout
        category={category}
        onCategoryClick={onCategoryClick}
        title="정렬하기"
        topElementRef={topElementRef}
      >
        <SearchForm
          onSearch={onSearchSubmit}
          setSearchWord={setSearchWord}
          searchWord={searchWord}
        />
        <VideoFeed
          category={category}
          isGrid={isGrid}
          page={page}
          searchResult={searchResult}
          setSearchResult={setSearchResult}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
          swapItems={swapItems}
          setSwapItems={setSwapItems}
        />
        <UtilButtons
          onViewSwitch={() => {
            setIsGrid((p) => !p);
          }}
          isGrid={isGrid}
          onListClick={onSelectedListClick}
          onSelectedList={isSelectedListOpen}
          count={changedSwapItems.length}
          useOnMobile={true}
          listLabel="Diff"
        />
        <ButtonsController
          onResetClick={onResetClick}
          onSaveClick={onSubmitSort}
          onListClick={onSelectedListClick}
          onViewSwitch={() => {
            setIsGrid((p) => !p);
          }}
          isGrid={isGrid}
          onSelectedList={isSelectedListOpen}
          count={changedSwapItems.length}
          action="save"
          listLabel="Diff"
        />
        <div ref={intersectionRef} className="h-1 mt-20" />
        {isSelectedListOpen ? (
          <ChangedItemsModal
            changedSwapItems={changedSwapItems}
            setIsSelectedListOpen={setIsSelectedListOpen}
          />
        ) : null}
        {loading ? <LoaidngIndicator /> : null}
        {data?.success ? <BackDrop /> : null}
        {error ? (
          <ErrorOverlay>
            <div className="relative text-[#eaeaea] font-bold text-3xl lg:w-1/2 w-auto lg:px-0 px-6 leading-snug">
              인산아 <span className="text-palettered">세이브</span> 도중 에러가 생겼단다 ㅎㅎ
              <br />
              아마도 새로고침하고 다시 해보면 되겠지만 그전에 나에게 보고하도록
            </div>
          </ErrorOverlay>
        ) : null}
      </PostManagementLayout>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const initialWorks = {
    filmShort: await client.works.findMany({
      where: { OR: [{ category: 'film' }, { category: 'short' }] },
      take: 12,
      orderBy: { order: 'desc' },
    }),
    outsource: await client.works.findMany({
      where: { category: 'outsource' },
      take: 12,
      orderBy: { order: 'desc' },
    }),
  };
  let initialHasNextPage = { filmShort: false, outsource: false };
  for (const count in initialWorks) {
    initialWorks[count as FlatformsCategory].length < 12
      ? (initialHasNextPage[count as FlatformsCategory] = false)
      : (initialHasNextPage[count as FlatformsCategory] = true);
  }
  const idWithOrderByCategory = {
    filmShort: (
      await client.works.findMany({
        where: { OR: [{ category: 'film' }, { category: 'short' }] },
        select: { id: true, order: true },
        orderBy: { order: 'desc' },
      })
    ).map((item) => ({ id: item.id, currentOrder: item.order, originalOrder: item.order })),
    outsource: (
      await client.works.findMany({
        where: { category: 'outsource' },
        select: { id: true, order: true },
        orderBy: { order: 'desc' },
      })
    ).map((item) => ({ id: item.id, currentOrder: item.order, originalOrder: item.order })),
  };
  return {
    props: {
      initialWorks: JSON.parse(JSON.stringify(initialWorks)),
      initialHasNextPage,
      idWithOrderByCategory,
    },
  };
};

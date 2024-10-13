import { GetServerSideProps } from 'next';
import { Dispatch, SetStateAction, SyntheticEvent, useEffect, useRef, useState } from 'react';
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

type IdWithOrder = { id: number; currentOrder: number; originalOrder: number };

type IdWithOrderByCategory = VideoCollection<Array<IdWithOrder>>;

interface VideoItemInputProps {
  video: WorksUsedInSort;
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
  swapItems: IdWithOrder[];
  setSearchResult: Dispatch<SetStateAction<VideoCollection<WorksUsedInSort[]>>>;
}

const VideoItemInput = ({
  video,
  setSwapItems,
  swapItems,
  setSearchResult,
}: VideoItemInputProps) => {
  const currentSwapItem = swapItems.find((item) => item.id === video.id);
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

interface VideoItemProps {
  video: WorksUsedInSort;
  category: FlatformsCategory;
  isGrid: boolean;
  idx: number;
  selectedItem?: WorksUsedInSort;
  setSelectedList: Dispatch<SetStateAction<WorksUsedInSort[]>>;
  setSwapItems: Dispatch<SetStateAction<IdWithOrder[]>>;
  swapItems: IdWithOrder[];
  setSearchResult: Dispatch<SetStateAction<VideoCollection<WorksUsedInSort[]>>>;
}

const VideoItem = ({
  video,
  category,
  isGrid,
  idx,
  selectedItem,
  setSelectedList,
  setSwapItems,
  swapItems,
  setSearchResult,
}: VideoItemProps) => {
  const { resourceId, title, thumbnailLink, category: kind, order } = video;
  const [onThumbnail, setOnThumbnail] = useState(false);
  const onThumbnailClick = (video: WorksUsedInSort) => {
    setSelectedList((p) =>
      selectedItem ? p.filter((item) => item.id !== video.id) : [...p, video]
    );
  };
  return (
    <>
      {isGrid ? (
        <section
          className={cls(
            selectedItem ? 'ring-2' : 'ring-0',
            'ring-palettered relative cursor-pointer hover:ring-2 hover:ring-palettered'
          )}
        >
          <div
            onClick={() => {
              onThumbnailClick(video);
            }}
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
          <div className="flex mt-2">
            <VideoItemInput
              video={video}
              setSwapItems={setSwapItems}
              swapItems={swapItems}
              setSearchResult={setSearchResult}
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
      ) : (
        <section
          className={cls(
            selectedItem ? 'ring-2' : 'ring-0',
            'ring-palettered relative cursor-pointer hover:ring-2 hover:ring-palettered'
          )}
        >
          <div
            className={cls(
              `px-2 py-3 ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : ''} ${
                idx % 4 === 2 ? 'xl:bg-[#101010]' : ''
              } ${idx % 4 === 3 || idx % 4 === 0 ? 'xl:bg-[#1a1a1a] bg-[#101010]' : ''} `,
              'text-xs'
            )}
          >
            <VideoItemTitle category={category} title={title} kind={kind} />
            <div className="flex justify-between">
              <div className="font-light break-words text-[#606060]">
                <span className="whitespace-nowrap">Id : </span>
                {resourceId}
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
                  <div className="fixed z-[1000] w-screen h-screen left-0 top-0 flex justify-center items-center">
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
      )}
    </>
  );
};

interface VideoFeedProps {
  category: FlatformsCategory;
  searchResult: VideoCollection<WorksUsedInSort[]>;
  setSearchResult: Dispatch<SetStateAction<VideoCollection<WorksUsedInSort[]>>>;
  selectedList: WorksUsedInSort[];
  setSelectedList: Dispatch<SetStateAction<WorksUsedInSort[]>>;
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
    console.log(swapItems);
  }, [searchResult[category].length, swapItems, setSearchResult]);
  return (
    <div
      className={
        isGrid
          ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '
          : 'grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4'
      }
    >
      {searchResult[category].map((video, index) => {
        const selectedItem = selectedList.find((item) => item.id === video.id);
        return index < 12 * page ? (
          <VideoItem
            key={video.id}
            category={category}
            video={video}
            isGrid={isGrid}
            idx={index}
            selectedItem={selectedItem}
            setSelectedList={setSelectedList}
            setSwapItems={setSwapItems}
            swapItems={swapItems}
            setSearchResult={setSearchResult}
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
  const [selectedList, setSelectedList] = useState<WorksUsedInSort[]>([]);
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

import { GetServerSideProps } from 'next';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout';
import PostManagementLayout from '@/components/nav/postManagementLayout';
import SearchForm from '@/components/searchForm';
import client from '@/libs/server/client';
import PostManagementMenu from '@/components/nav/postManagementMenu';
import { FlatformsCategory, VideoCollection, VideoResponseState } from '@/pages/work/work';
import { Works } from '@prisma/client';
import { ciIncludes, cls } from '@/libs/client/utils';
import Image from 'next/image';
import { useInfiniteScroll } from '@/libs/client/useInfiniteScroll';
import ButtonsController from '@/components/butttons/buttonsController';
import UtilButtons from '@/components/butttons/utilButtons';

type WorksUsedInSort = Omit<Works, 'createdAt' | 'updatedAt' | 'description'>;

interface InitialData {
  initialWorks: VideoCollection<WorksUsedInSort[]>;
  initialHasNextPage: VideoCollection<boolean>;
}

interface ThumbnailProps {
  src: { main: string; sub: string };
  setPriority: boolean;
  category: FlatformsCategory;
}

const Thumbnail = ({ category, src, setPriority }: ThumbnailProps) => {
  const [error, setError] = useState(false);
  const handleImageError = () => {
    setError(true);
  };
  return (
    <Image
      src={!error ? src.main : src.sub}
      alt="picturesAlter"
      width={640}
      height={category === 'filmShort' ? 360 : 480}
      onError={handleImageError}
      className="w-full object-cover aspect-video"
      priority={setPriority}
    />
  );
};

interface WorkProps {
  onClick: () => void;
  searchResult: VideoCollection<WorksUsedInSort[]>;
  category: FlatformsCategory;
  selected: boolean;
  resourceId: string;
  title: string;
  thumbnailLink: string;
  setPriority: boolean;
  kind: string;
  isGrid: boolean;
  idx: number;
}

const Work = ({
  category,
  selected,
  resourceId,
  title,
  onClick,
  searchResult,
  thumbnailLink,
  setPriority,
  kind,
  isGrid,
  idx,
}: WorkProps) => {
  const [onThumbnail, setOnThumbnail] = useState(false);
  return (
    <div
      className={cls(
        selected ? 'ring-2' : 'ring-0',
        'ring-palettered relative cursor-pointer hover:ring-2 hover:ring-palettered'
      )}
      onClick={onClick}
    >
      {isGrid ? (
        <Thumbnail
          category={category}
          src={
            searchResult[category].length !== 0
              ? category === 'outsource'
                ? {
                    main: `https://i.ytimg.com/vi/${resourceId}/sddefault.jpg`,
                    sub: `https://i.ytimg.com/vi/${resourceId}/hqdefault.jpg`,
                  }
                : {
                    main: `${thumbnailLink}_640x360?r=pad`,
                    sub: `${thumbnailLink}_640x360?r=pad`,
                  }
              : { main: '', sub: '' }
          }
          setPriority={setPriority}
        />
      ) : null}

      <div
        className={cls(
          isGrid
            ? 'mt-2'
            : `px-2 py-3 ${idx % 2 === 0 ? 'bg-[#1a1a1a]' : ''} ${
                idx % 4 === 2 ? 'xl:bg-[#101010]' : ''
              } ${idx % 4 === 3 || idx % 4 === 0 ? 'xl:bg-[#1a1a1a] bg-[#101010]' : ''} `,
          'text-xs'
        )}
      >
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
          {title}
        </div>
        <div className="flex justify-between">
          <div className="font-light break-words text-[#606060]">
            <span className="whitespace-nowrap">Id : </span>
            {resourceId}
          </div>
          {!isGrid ? (
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
                        searchResult[category].length !== 0
                          ? category === 'outsource'
                            ? {
                                main: `https://i.ytimg.com/vi/${resourceId}/sddefault.jpg`,
                                sub: `https://i.ytimg.com/vi/${resourceId}/hqdefault.jpg`,
                              }
                            : {
                                main: `${thumbnailLink}_640x360?r=pad`,
                                sub: `${thumbnailLink}_640x360?r=pad`,
                              }
                          : { main: '', sub: '' }
                      }
                      setPriority={setPriority}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function Sort({ initialWorks, initialHasNextPage }: InitialData) {
  const topElementRef = useRef<HTMLDivElement>(null);
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
  const perPage = 12;
  const onCategoryClick = (categoryLabel: FlatformsCategory) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
  };
  const onVideoClick = (video: WorksUsedInSort) => {
    setSelectedList((p) =>
      p.some((obj) => obj.id === video.id)
        ? p.filter((item) => item.id !== video.id)
        : [...p, video]
    );
  };
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
  useEffect(() => {
    setIsSelectedListOpen(false);
    setSelectedList([]);
    setPage(1);
    setSearchWordSnapShot('');
    setSearchWord('');
    setSearchResult((p) => ({
      ...p,
      [category === 'filmShort' ? 'outsource' : 'filmShort']:
        videoList[category === 'filmShort' ? 'outsource' : 'filmShort'],
    }));
  }, [category]);
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
  const intersectionRef = useInfiniteScroll({
    processIntersection,
    dependencyArray: [page, isGrid],
  });
  const commonReset = (initialVideos: WorksUsedInSort[] = videoList[category]) => {
    setPage(1);
    setSearchWord('');
    setSearchWordSnapShot('');
    setSearchResult((p) => ({ ...p, [category]: initialVideos }));
  };
  const onSelectedListClick = () => {
    if (isSelectedListOpen) {
      setIsSelectedListOpen(false);
      commonReset();
    } else {
      setIsSelectedListOpen(true);
      commonReset(selectedList);
      topElementRef.current?.scrollIntoView();
    }
  };
  const onResetClick = () => {
    if (selectedList.length > 0) {
      setSelectedList([]);
      setIsSelectedListOpen(false);
      commonReset();
      topElementRef.current?.scrollIntoView();
    }
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
        <div
          className={
            isGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '
              : 'grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4'
          }
        >
          {searchResult[category].map((li, index) =>
            index < 12 * page ? (
              <Work
                key={li.id}
                category={category}
                selected={selectedList.some((p) => p.id === li.id)}
                kind={li.category}
                resourceId={li.resourceId}
                title={li.title}
                thumbnailLink={li.thumbnailLink}
                onClick={() => {
                  onVideoClick(li);
                }}
                searchResult={searchResult}
                setPriority={index < 6 ? true : false}
                isGrid={isGrid}
                idx={index}
              />
            ) : null
          )}
          <UtilButtons
            onViewSwitch={() => {
              setIsGrid((p) => !p);
            }}
            isGrid={isGrid}
            onListClick={onSelectedListClick}
            onSelectedList={isSelectedListOpen}
            count={selectedList.length}
            useOnMobile={true}
          />
          <ButtonsController
            onResetClick={onResetClick}
            onSaveClick={() => {}}
            onListClick={onSelectedListClick}
            onViewSwitch={() => {
              setIsGrid((p) => !p);
            }}
            isGrid={isGrid}
            onSelectedList={isSelectedListOpen}
            count={selectedList.length}
            action="save"
          />
        </div>
        <div ref={intersectionRef} className="h-1 mt-20 bg-pink-500" />
      </PostManagementLayout>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const initialWorks = {
    filmShort: await client.works.findMany({
      where: { OR: [{ category: 'film' }, { category: 'short' }] },
      take: 12,
      orderBy: { id: 'desc' },
    }),
    outsource: await client.works.findMany({
      where: { category: 'outsource' },
      take: 12,
      orderBy: { id: 'desc' },
    }),
  };
  let initialHasNextPage = { filmShort: false, outsource: false };
  for (const count in initialWorks) {
    initialWorks[count as FlatformsCategory].length < 12
      ? (initialHasNextPage[count as FlatformsCategory] = false)
      : (initialHasNextPage[count as FlatformsCategory] = true);
  }
  return {
    props: {
      initialWorks: JSON.parse(JSON.stringify(initialWorks)),
      initialHasNextPage,
    },
  };
};

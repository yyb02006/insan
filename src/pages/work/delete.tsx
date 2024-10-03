import {
  ReactNode,
  RefObject,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { FlatformsCategory, WorkInfos } from './write';
import { ciIncludes, cls } from '@/libs/client/utils';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Input from '@/components/input';
import { useInfiniteScroll } from '@/libs/client/useInfiniteScroll';
import useDeleteRequest from '@/libs/client/useDelete';
import ToTop from '@/components/toTop';
import { GetServerSideProps } from 'next';
import client from '@/libs/server/client';
import { Works } from '@prisma/client';
import Circles from '@/components/circles';
import HamburgerMenuContainer from '@/components/nav/hamburgerMenuContainer';
import PostManagementNav from '@/components/nav/postManagementNav';

interface list extends WorkInfos {
  id: number;
}

interface dataState {
  success: boolean;
  works: { film: list[]; short: list[]; outsource: list[] };
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

interface CategoryTabProps {
  onFilmShortClick: () => void;
  onOutsourceClick: () => void;
  category: FlatformsCategory;
}

export const CategoryTab = ({ onFilmShortClick, onOutsourceClick, category }: CategoryTabProps) => {
  return (
    <div className="flex py-4">
      <button
        onClick={onFilmShortClick}
        className={cls(
          category === 'filmShort' ? 'text-palettered' : '',
          'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
        )}
      >
        Film / Short
      </button>
      <button
        onClick={onOutsourceClick}
        className={cls(
          category === 'outsource' ? 'text-palettered' : '',
          'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
        )}
      >
        Outsource
      </button>
    </div>
  );
};

interface SearchFormProps {
  onSearch: (e: SyntheticEvent<HTMLFormElement>) => void;
  setSearchWord: (value: SetStateAction<string>) => void;
  searchWord: string;
}

export const SearchForm = ({ onSearch, setSearchWord, searchWord }: SearchFormProps) => {
  return (
    <form
      onSubmit={onSearch}
      className="relative mb-8 font-light flex items-center gap-2 pb-1 border-b border-[#9a9a9a] text-lg leading-tight text-[#eaeaea]"
    >
      <button type="submit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
      <Input
        name="search"
        type="text"
        placeholder="search"
        css="border-none placeholder:font-bold bg-transparent"
        onChange={(e: SyntheticEvent<HTMLInputElement>) => {
          setSearchWord(e.currentTarget.value);
        }}
        value={searchWord}
      />
    </form>
  );
};

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
}

export const UtilButtons = ({
  onListClick,
  onViewSwitch,
  isGrid,
  onSelectedList,
  count,
  useOnMobile,
}: UtilButtonsProps) => {
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
        <div>Videos</div>
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
};

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

export const ButtonsController = ({
  onResetClick,
  onSaveClick,
  onListClick,
  onViewSwitch,
  isGrid,
  onSelectedList,
  count,
  action = 'save',
}: ButtonsControllerProps) => {
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
};

interface WorkProps {
  onClick: () => void;
  searchResult: VideoCollection<Works[]>;
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

export interface VideoCollection<T, U = T> {
  filmShort: T;
  outsource: U;
}

interface InitialData {
  initialWorks: VideoCollection<Works[]>;
  initialHasNextPage: VideoCollection<boolean>;
}

export const Title = ({ name }: { name: string }) => {
  return (
    <h1 className="relative h-[100px] flex justify-center items-center font-GmarketSans font-bold text-3xl">
      {name}
    </h1>
  );
};

export const MenuComponent = () => {
  const [isAborted, setIsAborted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  return (
    <HamburgerMenuContainer
      isAborted={isAborted}
      isNavigating={isNavigating}
      setIsOpen={setIsOpen}
      isOpen={isOpen}
    >
      <PostManagementNav setIsAborted={setIsAborted} setIsNavigating={setIsNavigating} />
    </HamburgerMenuContainer>
  );
};

export const PostManagementLayout = ({
  topElementRef,
  category,
  title,
  onCategoryClick,
  children,
}: {
  topElementRef: RefObject<HTMLDivElement>;
  category: FlatformsCategory;
  title: string;
  onCategoryClick: (categoryLabel: FlatformsCategory) => void;
  children: ReactNode;
}) => {
  return (
    <section ref={topElementRef} className="relative xl:px-40 sm:px-24 px-16">
      <Title name={title} />
      <CategoryTab
        category={category}
        onFilmShortClick={() => {
          onCategoryClick('filmShort');
        }}
        onOutsourceClick={() => {
          onCategoryClick('outsource');
        }}
      />
      {children}
    </section>
  );
};

export default function Delete({ initialWorks, initialHasNextPage }: InitialData) {
  const router = useRouter();
  const topElement = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<FlatformsCategory>('filmShort');
  const [searchWord, setSearchWord] = useState('');
  const [searchWordSnapShot, setSearchWordSnapShot] = useState('');
  const [searchResult, setSearchResult] = useState<VideoCollection<Works[]>>(initialWorks);
  const [searchResultSnapShot, setSearchResultSnapShot] = useState<VideoCollection<Works[]>>({
    filmShort: [],
    outsource: [],
  });
  const [list, setList] = useState<VideoCollection<Works[]>>(initialWorks);
  const [send, { loading, data, error }] = useDeleteRequest<{
    success: boolean;
  }>(`/api/work`);
  const [deleteIdList, setDeleteIdList] = useState<number[]>([]);
  const [page, setPage] = useState(2);
  const [apiPage, setApiPage] = useState<{
    filmShort: number;
    outsource: number;
  }>({ filmShort: 2, outsource: 2 });
  const perPage = 12;
  const [onSelectedList, setOnSelectedList] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const [hasNextPage, setHasNextPage] = useState<VideoCollection<boolean>>(initialHasNextPage);

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

  useEffect(() => {
    setOnSelectedList(false);
    setDeleteIdList([]);
    setPage(2);
    setSearchWordSnapShot('');
    setSearchWord('');
    setSearchResult((p) => ({
      ...p,
      [category === 'filmShort' ? 'outsource' : 'filmShort']:
        list[category === 'filmShort' ? 'outsource' : 'filmShort'],
    }));
  }, [category]);

  const onSubmitDelete = () => {
    if (loading && deleteIdList.length > 0) return;
    send(deleteIdList, process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN!);
  };

  const resetInit = () => {
    setOnSelectedList(false);
    setPage(2);
    setSearchWord('');
    setSearchWordSnapShot('');
    setSearchResult((p) => ({ ...p, [category]: list[category] }));
    setSearchResultSnapShot((p) => ({ ...p, [category]: [] }));
  };

  const onReset = () => {
    if (deleteIdList.length > 0) {
      setDeleteIdList([]);
      resetInit();
      topElement.current?.scrollIntoView();
    }
  };

  const onSelectedListClick = () => {
    if (onSelectedList) {
      resetInit();
    } else {
      if (!deleteIdList || deleteIdList?.length < 1) return;
      setPage(2);
      setSearchWord('');
      setSearchWordSnapShot('');
      setOnSelectedList(true);
      topElement.current?.scrollIntoView();
      setSearchResultSnapShot((p) => ({
        ...p,
        [category]: list[category].filter((li) => deleteIdList.includes(li.id)),
      }));
      setSearchResult((p) => ({
        ...p,
        [category]: list[category].filter((li) => deleteIdList.includes(li.id)),
      }));
    }
  };

  const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(2);
    if (typeof searchWord === undefined) return;
    setSearchWordSnapShot(searchWord);
    if (onSelectedList) {
      setSearchResult((p) => ({
        ...p,
        [category]: searchResultSnapShot[category].filter((result) =>
          ciIncludes(result.title, searchWord)
        ),
      }));
    } else {
      setSearchResult((p) => ({
        ...p,
        [category]: list[category].filter((li) => ciIncludes(li.title, searchWord)),
      }));
    }
  };

  const onWorkClick = (id: number) => {
    setDeleteIdList((p) => (p.includes(id) ? p.filter((item) => item !== id) : [...p, id]));
  };

  const processIntersection = () => {
    const getList = async () => {
      setFetchLoading(true);
      const lists: dataState = await (
        await fetch(
          `/api/work/list?page=${apiPage[category]}&per_page=${perPage}&category=${category}`
        )
      ).json();
      if (lists.works[category === 'filmShort' ? 'film' : 'outsource'].length < perPage) {
        setHasNextPage((p) => ({ ...p, [category]: false }));
      }
      setList((p) => ({
        ...p,
        [category]: [
          ...p[category],
          ...lists.works[category === 'filmShort' ? 'film' : 'outsource'],
        ],
      }));
      setSearchResult((p) => ({
        ...p,
        [category]: [
          ...p[category],
          ...lists.works[category === 'filmShort' ? 'film' : 'outsource'].filter((li) =>
            ciIncludes(li.title, searchWordSnapShot)
          ),
        ],
      }));
      setFetchLoading(false);
      setApiPage((p) => ({ ...p, [category]: p[category] + 1 }));
    };
    if (fetchLoading) return;
    if (!onSelectedList && hasNextPage[category] && apiPage[category] <= page) {
      getList();
    }
    if (page <= searchResult[category].length / perPage + 1) {
      setPage((p) => p + 1);
    }
  };

  const intersectionRef = useInfiniteScroll({
    processIntersection,
    dependencyArray: [page, fetchLoading, isGrid],
  });

  const onCategoryClick = (categoryLabel: FlatformsCategory) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
  };

  return (
    <Layout
      seoTitle="DELETE"
      footerPosition="hidden"
      menu={{ hasMenu: true, menuComponent: <MenuComponent /> }}
      nav={{ isCollapsed: true }}
    >
      <Title name="삭제하기" />
      <section ref={topElement} className="relative xl:px-40 sm:px-24 px-16">
        <CategoryTab
          category={category}
          onFilmShortClick={() => {
            onCategoryClick('filmShort');
          }}
          onOutsourceClick={() => {
            onCategoryClick('outsource');
          }}
        />
        <SearchForm onSearch={onSearch} setSearchWord={setSearchWord} searchWord={searchWord} />
        <div
          className={
            isGrid
              ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12 '
              : 'grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-4'
          }
        >
          {searchResult[category].map((li, index) =>
            index < 12 * (page - 1) ? (
              <Work
                key={li.id}
                category={category}
                selected={deleteIdList.includes(li.id)}
                kind={li.category}
                resourceId={li.resourceId}
                title={li.title}
                thumbnailLink={li.thumbnailLink}
                onClick={() => {
                  onWorkClick(li.id);
                }}
                searchResult={searchResult}
                setPriority={index < 6 ? true : false}
                isGrid={isGrid}
                idx={index}
              />
            ) : null
          )}
        </div>
        <div ref={intersectionRef} className="w-full h-1 mt-20" />
        {fetchLoading ? (
          <div className="relative w-full h-20 flex justify-center items-center mb-20">
            <div className="animate-spin-middle contrast-50 absolute w-[40px] aspect-square">
              <Circles
                liMotion={{
                  css: 'w-[calc(15px+100%)] border-[#eaeaea] border-1',
                }}
              />
            </div>
          </div>
        ) : null}

        <UtilButtons
          onViewSwitch={() => {
            setIsGrid((p) => !p);
          }}
          isGrid={isGrid}
          onListClick={onSelectedListClick}
          onSelectedList={onSelectedList}
          count={deleteIdList.length}
          useOnMobile={true}
        />
        <ButtonsController
          onResetClick={onReset}
          onSaveClick={onSubmitDelete}
          onListClick={onSelectedListClick}
          onViewSwitch={() => {
            setIsGrid((p) => !p);
          }}
          isGrid={isGrid}
          onSelectedList={onSelectedList}
          count={deleteIdList.length}
          action="delete"
        />
        <ToTop toScroll={topElement} />
      </section>
      {loading ? (
        <div className="fixed top-0 w-screen h-screen opacity-60 z-[1] bg-black">
          <div className="absolute top-0 w-full h-full flex justify-center items-center">
            <div className="animate-spin-middle contrast-50 absolute w-[100px] aspect-square">
              <Circles
                liMotion={{
                  css: 'w-[calc(16px+100%)] border-[#eaeaea] border-1',
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
      {data?.success ? <div className="fixed top-0 w-screen h-screen z-[1]"></div> : null}
      {error ? (
        <div className="fixed top-0 w-screen h-screen z-[1] flex justify-center items-center">
          <div className="absolute top-0 w-full h-full opacity-60 bg-black" />
          <div className="relative text-[#eaeaea] font-bold text-3xl lg:w-1/2 w-auto lg:px-0 px-6 leading-snug">
            인산아 <span className="text-palettered">딜리트</span> 도중 에러가 생겼단다 ㅎㅎ 아마도
            새로고침하고 다시 해보면 되겠지만 그전에 나에게 보고하도록
          </div>
        </div>
      ) : null}
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

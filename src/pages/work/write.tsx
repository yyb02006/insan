import { ciIncludes, fetchData } from '@/libs/client/utils';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import { GapiItem } from '.';
import useMutation from '@/libs/client/useMutation';
import Layout from '@/components/layout';
import { VimeoThumbnailFeed, YoutubeThumbnailFeed } from '@/components/feed/thumbnailFeed';
import useInfiniteScrollFromFlatform from '@/libs/client/useInfiniteScroll';
import { useRouter } from 'next/router';
import PostManagementLayout from '@/components/nav/postManagementLayout';
import ToTop from '@/components/toTop';
import { GetServerSideProps } from 'next';
import client from '@/libs/server/client';
import { VimeoListFeed, YoutubeListFeed } from '@/components/feed/listFeed';
import SearchForm from '@/components/searchForm';
import PostManagementMenu from '@/components/nav/postManagementMenu';
import UtilButtons from '@/components/butttons/utilButtons';
import ButtonsController from '@/components/butttons/buttonsController';
import {
  FlatformsCategory,
  OwnedVideoItems,
  VideoCollection,
  VimeoVideos,
  WorkInfos,
} from '@/pages/work/work';
import LoaidngIndicator from '@/components/loadingIndicator';
import BackDrop from '@/components/backDrop';
import ErrorOverlay from '@/components/errorOverlay';

interface InitialData {
  initialVimeoVideos: VimeoVideos[];
  initialYoutubeVideos: GapiItem[];
  initialOwnedVideos: VideoCollection<OwnedVideoItems[]>;
  initialNextPageToken: string;
}

export default function Write({
  initialVimeoVideos,
  initialYoutubeVideos,
  initialOwnedVideos,
  initialNextPageToken,
}: InitialData) {
  const router = useRouter();
  const topElementRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<FlatformsCategory>('filmShort');
  const [searchWord, setSearchWord] = useState('');
  const [searchWordSnapshot, setSearchWordSnapshot] = useState('');
  const [searchResults, setSearchResults] = useState<VideoCollection<VimeoVideos[], GapiItem[]>>({
    filmShort: initialVimeoVideos,
    outsource: initialYoutubeVideos,
  });
  const [searchResultsSnapshot, setSearchResultsSnapshot] = useState<
    VideoCollection<VimeoVideos[], GapiItem[]>
  >({ filmShort: [], outsource: [] });
  const [list, setList] = useState<VideoCollection<VimeoVideos[], GapiItem[]>>({
    filmShort: initialVimeoVideos,
    outsource: initialYoutubeVideos,
  });
  const [sendList, { loading, data, error }] = useMutation<{
    success: boolean;
  }>(`/api/work/update?purpose=write`);
  const [workInfos, setWorkInfos] = useState<WorkInfos[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const ownedVideos: VideoCollection<OwnedVideoItems[]> = initialOwnedVideos;
  const [page, setPage] = useState(2);
  const [onSelectedList, setOnSelectedList] = useState(false);
  const [isGrid, setIsGrid] = useState(true);
  const intersectionRef = useInfiniteScrollFromFlatform({
    setList,
    setSearchResults,
    setFetchLoading,
    category,
    onSelectedList,
    page,
    setPage,
    snapshot: searchWordSnapshot,
    searchResultsCount: searchResults[category].length,
    initialNextPageToken,
    dependencies: [isGrid],
  });

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
    setWorkInfos([]);
    setPage(2);
    setSearchWordSnapshot('');
    setSearchWord('');
    setSearchResults((p) => ({
      ...p,
      [category === 'filmShort' ? 'outsource' : 'filmShort']:
        list[category === 'filmShort' ? 'outsource' : 'filmShort'],
    }));
  }, [category]);

  const inputBlur = (e: SyntheticEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      dataset: { resourceid },
    } = e.currentTarget;
    const workIdx = workInfos?.findIndex((i) => i.resourceId === resourceid);
    if (workIdx !== undefined && workIdx >= 0) {
      if (name == 'title' && value === '') {
        setWorkInfos((p) => p.filter((arr) => arr.resourceId !== resourceid));
      }
    }
  };

  /* Legacy inputChange Function Code

  const inputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value, name, dataset, type } = e.currentTarget;
    const workIdx = workInfos?.findIndex((i) => i.resourceId === dataset.resourceid);
    if (workIdx !== undefined && workIdx >= 0) {
      if (name === 'title') {
        setWorkInfos((p) =>
          p.map((arr) => (arr.resourceId === dataset.resourceid ? { ...arr, title: value } : arr))
        );
      } else if (name === 'description') {
        setWorkInfos((p) =>
          p.map((arr) =>
            arr.resourceId === dataset.resourceid ? { ...arr, description: value } : arr
          )
        );
      } else if (name === 'date') {
        setWorkInfos((p) =>
          p.map((arr) => (arr.resourceId === dataset.resourceid ? { ...arr, date: value } : arr))
        );
      } else if (type === 'radio') {
        setWorkInfos((p) =>
          p.map((arr) =>
            arr.resourceId === dataset.resourceid ? { ...arr, category: value } : arr
          )
        );
      }
    } else {
      if (name === 'title') {
        setWorkInfos((p) => [
          ...p,
          {
            resourceId: dataset.resourceid || '',
            title: value,
            description: dataset.description || '',
            category: dataset.category
              ? dataset.category
              : category === 'filmShort'
              ? ''
              : 'outsource',
            date: dataset.date || '',
            thumbnailLink: dataset.thumbnail || '',
            animatedThumbnailLink: dataset.animated_thumbnail || '',
          },
        ]);
      }
    }
  }; */

  const onSubmitWrites = () => {
    // const inspectedWorkInfos = workInfos.filter((info) => info.title.length !== 0);
    if (loading && workInfos.length > 0) return;
    // workInfos.reduce((previous, current) => , []);
    sendList({
      data: workInfos,
      secret: process.env.NEXT_PUBLIC_ODR_SECRET_TOKEN,
    });
  };

  const onSearch = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(2);
    setSearchWordSnapshot(searchWord);
    if (onSelectedList) {
      if (category === 'filmShort') {
        setSearchResults((p) => ({
          ...p,
          [category]: searchResultsSnapshot[category].filter((el) =>
            ciIncludes(el.name, searchWord)
          ),
        }));
      } else if (category === 'outsource') {
        setSearchResults((p) => ({
          ...p,
          [category]: searchResultsSnapshot[category].filter((el) =>
            ciIncludes(el.snippet.title, searchWord)
          ),
        }));
      }
    } else {
      if (category === 'filmShort') {
        setSearchResults((p) => ({
          ...p,
          [category]: list[category].filter((el) => ciIncludes(el.name, searchWord)),
        }));
      } else if (category === 'outsource') {
        setSearchResults((p) => ({
          ...p,
          [category]: list[category].filter((el) => ciIncludes(el.snippet.title, searchWord)),
        }));
      }
    }
  };

  const resetInit = () => {
    setOnSelectedList(false);
    setPage(2);
    setSearchWord('');
    setSearchWordSnapshot('');
    setSearchResults((p) => ({
      ...p,
      [category]: list[category],
    }));
    setSearchResultsSnapshot((p) => ({ ...p, [category]: [] }));
  };

  const onReset = () => {
    if (workInfos.length < 1) return;
    setWorkInfos([]);
    resetInit();
    topElementRef.current?.scrollIntoView();
  };

  const onSelectedListClick = () => {
    if (onSelectedList) {
      resetInit();
    } else {
      if (workInfos.length < 1) return;
      setPage(2);
      setSearchWord('');
      setSearchWordSnapshot('');
      setOnSelectedList(true);
      topElementRef.current?.scrollIntoView();
      if (category === 'filmShort') {
        setSearchResults((p) => ({
          ...p,
          [category]: list[category].filter((info) =>
            workInfos?.some((video) => video.resourceId === info.player_embed_url)
          ),
        }));
        setSearchResultsSnapshot((p) => ({
          ...p,
          [category]: list[category].filter((info) =>
            workInfos?.some((video) => video.resourceId === info.player_embed_url)
          ),
        }));
      } else if (category === 'outsource') {
        setSearchResults((p) => ({
          ...p,
          [category]: list[category].filter((info) =>
            workInfos?.some((video) => video.resourceId === info.snippet.resourceId?.videoId)
          ),
        }));
        setSearchResultsSnapshot((p) => ({
          ...p,
          [category]: list[category].filter((info) =>
            workInfos?.some((video) => video.resourceId === info.snippet.resourceId?.videoId)
          ),
        }));
      }
    }
  };

  const onCategoryClick = (categoryLabel: FlatformsCategory) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
    setWorkInfos([]);
  };

  return (
    <Layout
      seoTitle="WRITE"
      footerPosition="hidden"
      menu={{ hasMenu: true, menuComponent: <PostManagementMenu /> }}
      nav={{ isCollapsed: true }}
    >
      <PostManagementLayout
        category={category}
        onCategoryClick={onCategoryClick}
        title="추가하기"
        topElementRef={topElementRef}
      >
        <SearchForm onSearch={onSearch} searchWord={searchWord} setSearchWord={setSearchWord} />
        {category === 'filmShort' && list[category].length > 0 ? (
          isGrid ? (
            <VimeoThumbnailFeed
              inputBlur={inputBlur}
              setWorkInfos={setWorkInfos}
              workInfos={workInfos}
              resource={searchResults[category]}
              intersectionRef={intersectionRef}
              fetchLoading={fetchLoading}
              ownedVideos={ownedVideos[category]}
              page={page}
            />
          ) : (
            <VimeoListFeed
              inputBlur={inputBlur}
              setWorkInfos={setWorkInfos}
              workInfos={workInfos}
              resource={searchResults[category]}
              intersectionRef={intersectionRef}
              fetchLoading={fetchLoading}
              ownedVideos={ownedVideos[category]}
              page={page}
            />
          )
        ) : null}
        {category === 'outsource' ? (
          isGrid ? (
            <YoutubeThumbnailFeed
              resource={searchResults[category]}
              setWorkInfos={setWorkInfos}
              workInfos={workInfos}
              intersectionRef={intersectionRef}
              fetchLoading={fetchLoading}
              ownedVideos={ownedVideos[category]}
              inputBlur={inputBlur}
              page={page}
            />
          ) : (
            <YoutubeListFeed
              resource={searchResults[category]}
              setWorkInfos={setWorkInfos}
              workInfos={workInfos}
              intersectionRef={intersectionRef}
              fetchLoading={fetchLoading}
              ownedVideos={ownedVideos[category]}
              inputBlur={inputBlur}
              page={page}
            />
          )
        ) : null}
        {/* These buttons will be used in mobile environment */}
        <UtilButtons
          onViewSwitch={() => {
            setIsGrid((p) => !p);
          }}
          onListClick={onSelectedListClick}
          isGrid={isGrid}
          count={workInfos.length}
          useOnMobile={true}
          onSelectedList={onSelectedList}
        />
        {/* These Buttons for any other environmnet */}
        <ButtonsController
          onResetClick={onReset}
          onSaveClick={onSubmitWrites}
          onListClick={onSelectedListClick}
          onViewSwitch={() => {
            setIsGrid((p) => !p);
          }}
          isGrid={isGrid}
          onSelectedList={onSelectedList}
          count={workInfos.length}
          action="save"
        />
        <ToTop toScroll={topElementRef} />
      </PostManagementLayout>
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
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const perPage = 12;
  const vimeoVideos = await fetchData(
    `https://api.vimeo.com/users/136249834/videos?fields=uri,player_embed_url,resource_key,pictures.base_link,name,description&page=1&per_page=${perPage}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
      },
    }
  );

  const mergedVimeoVideos = await Promise.all(
    vimeoVideos.data.map(async (el: VimeoVideos) => {
      const data = (
        await fetchData(
          `https://api.vimeo.com${el.uri}/animated_thumbsets?fields=sizes.link,sizes.profile_id`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: process.env.NEXT_PUBLIC_VIMEO_ACCESS_TOKEN || '',
            },
          }
        )
      ).data;
      return {
        ...el,
        animated_thumbnail:
          data[0]?.sizes?.find(
            (el: { profile_id: string; link: string }) => el.profile_id === 'Low'
          )?.link || 'no-link',
      };
    })
  );

  const youtubePlaylistId = 'PL3Sx9O__-BGlt-FYFXIO15RbxFwegMs8C';
  const youtubeVideos = await fetchData(
    `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${youtubePlaylistId}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}&maxResults=${perPage}&part=snippet&fields=(items(id,snippet(resourceId(videoId),thumbnails(medium,standard,maxres),title)),nextPageToken)`
  );

  const lists = await client.works.findMany({
    orderBy: { order: 'desc' },
    select: {
      title: true,
      category: true,
      date: true,
      description: true,
      resourceId: true,
      order: true,
    },
  });

  const initialOwnedVideos = {
    filmShort: lists.filter((list) => list.category === 'film' || list.category === 'short'),
    outsource: lists.filter((list) => list.category === 'outsource'),
  };

  return {
    props: {
      initialVimeoVideos: mergedVimeoVideos,
      initialYoutubeVideos: youtubeVideos.items,
      initialNextPageToken: youtubeVideos.nextPageToken,
      initialOwnedVideos,
    },
  };
};

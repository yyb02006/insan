import { GetServerSideProps } from 'next';
import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout';
import PostManagementLayout from '@/components/nav/postManagementLayout';
import SearchForm from '@/components/searchForm';
import client from '@/libs/server/client';
import PostManagementMenu from '@/components/nav/postManagementMenu';
import { FlatformsCategory, VideoCollection } from '@/pages/work/work';
import { Works } from '@prisma/client';
import { ciIncludes } from '@/libs/client/utils';
import Image from 'next/image';

type WorksUsedInSort = Omit<Works, 'createdAt' | 'updatedAt' | 'description'>;

interface InitialData {
  initialWorks: VideoCollection<WorksUsedInSort[]>;
  initialHasNextPage: VideoCollection<boolean>;
}

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
  const searchSubmitHandler = (e: SyntheticEvent<HTMLFormElement>) => {
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
  }, [category, videoList]);
  useEffect(() => {
    console.log(selectedList);
  }, [selectedList]);
  useEffect(() => {
    console.log(searchResult);
  }, [searchResult]);
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
          onSearch={searchSubmitHandler}
          setSearchWord={setSearchWord}
          searchWord={searchWord}
        />
        {searchResult[category].map((li, index) =>
          index < 12 * page ? (
            <div
              key={li.id}
              onClick={() => {
                onVideoClick(li);
              }}
            >
              <Image
                alt={li.title}
                src={
                  category === 'outsource'
                    ? `https://i.ytimg.com/vi/${li.thumbnailLink}/sddefault.jpg`
                    : `${li.thumbnailLink}_640x360?r=pad`
                }
                width={640}
                height={360}
              />
            </div>
          ) : null
        )}
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

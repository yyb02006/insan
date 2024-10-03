import { GetServerSideProps } from 'next';
import { useRef, useState } from 'react';
import Layout from '@/components/layout';
import PostManagementLayout from '@/components/nav/postManagementLayout';
import SearchForm from '@/components/searchForm';
import client from '@/libs/server/client';
import PostManagementMenu from '@/components/nav/postManagementMenu';
import { FlatformsCategory, WorkInfos } from '@/pages/work/work';

export default function Sort() {
  const [workInfos, setWorkInfos] = useState<WorkInfos[]>([]);
  const [category, setCategory] = useState<FlatformsCategory>('filmShort');
  const [searchWord, setSearchWord] = useState('');
  const topElementRef = useRef<HTMLDivElement>(null);
  const onCategoryClick = (categoryLabel: FlatformsCategory) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
    setWorkInfos([]);
  };
  const searchHandler = () => {};
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
          onSearch={searchHandler}
          setSearchWord={setSearchWord}
          searchWord={searchWord}
        />
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

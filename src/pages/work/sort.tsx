import Layout from '@/components/layout';
import { MenuComponent } from './delete';
import PostManagementLayout from '@/components/nav/PostManagementLayout';
import { FlatformsCategory, WorkInfos } from './write';
import { useRef, useState } from 'react';
import SearchForm from '@/components/searchForm';
import { GetServerSideProps } from 'next';
import client from '@/libs/server/client';

export default function Sort() {
  const [category, setCategory] = useState<FlatformsCategory>('filmShort');
  const [workInfos, setWorkInfos] = useState<WorkInfos[]>([]);
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
        menuComponent: <MenuComponent />,
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

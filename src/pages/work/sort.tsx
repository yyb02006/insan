import Layout from '@/components/layout';
import { MenuComponent, PostManagementLayout } from './delete';
import { FlatformsCategory, WorkInfos } from './write';
import { useRef, useState } from 'react';
import SearchForm from '@/components/searchForm';

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
      <SearchForm onSearch={searchHandler} setSearchWord={setSearchWord} searchWord={searchWord} />
      <PostManagementLayout
        category={category}
        onCategoryClick={onCategoryClick}
        title="정렬하기"
        topElementRef={topElementRef}
      >
        <div></div>
      </PostManagementLayout>
    </Layout>
  );
}

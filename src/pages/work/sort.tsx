import Layout from '@/components/layout';
import { MenuComponent, PostManagementLayout } from './delete';
import { FlatformsCategory, WorkInfos } from './write';
import { useRef, useState } from 'react';

export default function Sort() {
  const [category, setCategory] = useState<FlatformsCategory>('filmShort');
  const [workInfos, setWorkInfos] = useState<WorkInfos[]>([]);
  const topElementRef = useRef<HTMLDivElement>(null);
  const onCategoryClick = (categoryLabel: FlatformsCategory) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
    setWorkInfos([]);
  };
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
        <div></div>
      </PostManagementLayout>
    </Layout>
  );
}

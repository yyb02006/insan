import Layout from '@/components/layout';
import { MenuComponent, Title } from './delete';

export default function Sort() {
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
      <Title name="정렬하기" />
    </Layout>
  );
}

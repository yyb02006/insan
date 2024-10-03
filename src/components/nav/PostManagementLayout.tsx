import { RefObject, ReactNode } from 'react';
import { Title, CategoryTab } from '../../pages/work/delete';
import { FlatformsCategory } from '../../pages/work/write';

export default function PostManagementLayout({
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
}) {
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
}

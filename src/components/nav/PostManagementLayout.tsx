import { RefObject, ReactNode } from 'react';
import { cls } from '@/libs/client/utils';
import { FlatformsCategory } from '@/pages/work/work';

interface CategoryTabProps {
  onFilmShortClick: () => void;
  onOutsourceClick: () => void;
  category: FlatformsCategory;
}

const CategoryTab = ({ onFilmShortClick, onOutsourceClick, category }: CategoryTabProps) => {
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

const Title = ({ name }: { name: string }) => {
  return (
    <h1 className="relative h-[100px] flex justify-center items-center font-GmarketSans font-bold text-3xl">
      {name}
    </h1>
  );
};

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

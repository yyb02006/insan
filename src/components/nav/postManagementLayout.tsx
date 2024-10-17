import { RefObject, ReactNode, Dispatch, SetStateAction } from 'react';
import { cls } from '@/libs/client/utils';

interface Tabs<T> {
  category: T;
  name: string;
}

interface CategoryTabProps<T> {
  tabs: Tabs<T>[];
  category: T;
  onCategoryClick: (categoryLabel: T) => void;
}

const CategoryTab = <T,>({ tabs, category, onCategoryClick }: CategoryTabProps<T>) => {
  return (
    <div className="flex py-4">
      {tabs.map((tab) => (
        <button
          key={tab.name}
          onClick={() => {
            onCategoryClick(tab.category);
          }}
          className={cls(
            category === tab.category ? 'text-palettered' : '',
            'w-full flex justify-center items-center text-lg font-semibold hover:text-palettered'
          )}
        >
          {tab.name}
        </button>
      ))}
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

export default function PostManagementLayout<T>({
  topElementRef,
  category,
  title,
  tabs,
  setCategory,
  reset,
  children,
}: {
  topElementRef: RefObject<HTMLDivElement>;
  category: T;
  title: string;
  tabs: Tabs<T>[];
  setCategory: Dispatch<SetStateAction<T>>;
  reset: (agr: T) => void;
  children: ReactNode;
}) {
  const onCategoryClick = (categoryLabel: T) => {
    if (category === categoryLabel) return;
    setCategory(categoryLabel);
    reset(categoryLabel);
  };
  return (
    <section ref={topElementRef} className="relative xl:px-40 sm:px-24 px-16">
      <Title name={title} />
      <CategoryTab category={category} tabs={tabs} onCategoryClick={onCategoryClick} />
      {children}
    </section>
  );
}

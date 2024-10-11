import React, { useRef } from 'react';
import { Button } from '../../ui/button';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { LetterCategory } from '../types/category.types';

interface CategoryTabsProps {
  categories: LetterCategory[];
  activeTab: number | null;
  setActiveTab: (id: number) => void;
  hasNextPage: boolean;
  onLoadMore: () => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeTab,
  setActiveTab,
  hasNextPage,
  onLoadMore,
}) => {
  const tabsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      <div
        ref={tabsRef}
        className="flex overflow-x-auto overflow-y-hidden pb-2 thin-scrollbar"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={cn(
              'py-2 px-4 text-sm font-medium whitespace-nowrap flex-shrink-0',
              activeTab === category.id
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700',
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
      {hasNextPage && (
        <Button
          onClick={onLoadMore}
          className="absolute right-0 top-0 p-2 rounded-full bg-white shadow-md"
          variant="ghost"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CategoryTabs;

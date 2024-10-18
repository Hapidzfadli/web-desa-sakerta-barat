import { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchLetterCategory } from '../../../lib/actions/list-letter.action';

const ITEMS_PER_PAGE = 10;

export const useCategoryData = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, status, error } = useInfiniteQuery({
    queryKey: ['letterCategories'],
    queryFn: ({ pageParam = 1 }) =>
      fetchLetterCategory({ limit: ITEMS_PER_PAGE, page: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.length < ITEMS_PER_PAGE) return undefined;
      return pages.length + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (
      data &&
      data.pages.length > 0 &&
      data.pages[0].data.length > 0 &&
      activeTab === null
    ) {
      setActiveTab(data.pages[0].data[0].id);
    }
  }, [data, activeTab]);

  const categories = data?.pages.flatMap((page) => page.data) || [];

  return {
    categories,
    status,
    error,
    activeTab,
    setActiveTab,
    fetchNextPage,
    hasNextPage,
  };
};

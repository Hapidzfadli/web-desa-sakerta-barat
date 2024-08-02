import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLetterType } from '../../../lib/actions/list-letter.action';

export const useLetterTypeData = (categoryId: number) => {
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState('name');

  const {
    data: letterTypeData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['letterTypes', categoryId, search, sortBy, sortOrder],
    queryFn: () => fetchLetterType({ categoryId, search, sortBy, sortOrder }),
    staleTime: 60000, // 1 minute
  });

  return {
    letterTypeData,
    isLoading,
    isError,
    search,
    setSearch,
    sortOrder,
    setSortOrder,
    sortBy,
    setSortBy,
  };
};

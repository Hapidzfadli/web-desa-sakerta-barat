import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserRole } from '../../lib/actions/user.actions';
import { UserListResponse } from './types';

const useUserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<UserListResponse>({
    queryKey: ['users', currentPage, itemsPerPage, searchQuery, filters],
    queryFn: () => getAllUsers(currentPage, itemsPerPage, searchQuery, filters),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleUpdateRole = async (userId: number, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleFilterChange = (
    newFilters: Record<string, string | string[]>,
  ) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return {
    users: data?.data ?? [],
    loading: isLoading,
    error,
    totalItems: data?.meta.totalItems ?? 0,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    handleUpdateRole,
    handleFilterChange,
  };
};

export default useUserList;

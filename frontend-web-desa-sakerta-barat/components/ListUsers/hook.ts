import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserRole } from '../../lib/actions/user.actions';
import { UserListResponse } from './types';
import { useToast } from '@/components/ui/use-toast';

const useUserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery<UserListResponse>({
    queryKey: [
      'users',
      currentPage,
      itemsPerPage,
      searchQuery,
      filters,
      sortColumn,
      sortOrder,
    ],
    queryFn: () =>
      getAllUsers(
        currentPage,
        itemsPerPage,
        searchQuery,
        sortColumn,
        sortOrder,
        filters,
      ),
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Gagal memuat data pengguna. Silakan coba lagi.',
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) =>
      updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Sukses',
        description: 'Role pengguna berhasil diperbarui',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui role pengguna',
        variant: 'destructive',
        duration: 3000,
      });
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return {
    users: data?.data ?? [],
    loading: isLoading,
    error,
    totalItems: data?.meta.totalItems ?? 0,
    currentPage,
    itemsPerPage,
    searchQuery,
    sortColumn,
    sortOrder,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    handleUpdateRole,
    handleFilterChange,
    handleSort,
  };
};

export default useUserList;

'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '../../../components/shared/Table';
import { Button } from '../../../components/ui/button';
import { Printer, MoreVertical, Trash } from 'lucide-react';
import { fetchLetterRequests } from '../../../lib/actions/letterRequest.action';
import { formatDate } from '../../../lib/utils';
import { translateStatus } from '../../../lib/letterRequestUtils';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const DaftarPermohonan = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['letterRequests', page, limit, searchQuery],
    queryFn: () => fetchLetterRequests(page, limit, searchQuery),
    staleTime: 60000,
    cacheTime: 300000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Gagal memuat data permohonan surat. Silakan coba lagi.',
        variant: 'destructive',
        duration: 5000,
      });
    },
  });

  const statusColors: { [key: string]: string } = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SIGNED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-16 text-center' },
    {
      header: 'Pemohon',
      accessor: 'residentName',
      className: 'w-1/6 text-left',
    },
    { header: 'Surat', accessor: 'letterName', className: 'w-1/4 text-left' },
    {
      header: 'Tanggal',
      accessor: 'requestDate',
      cell: (value: string) => formatDate(value),
      className: 'w-32 text-left',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[value]}`}
        >
          {translateStatus(value)}
        </span>
      ),
      className: 'w-32 text-center',
    },
    {
      header: 'Action',
      accessor: (row: LetterRequest) => (
        <div className="flex space-x-1 justify-center">
          <Button size="sm" variant="ghost">
            <Printer className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: 'w-32 text-center',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <DataTable
        data={data?.data || []}
        columns={columns}
        onSearch={handleSearch}
        searchPlaceholder="Cari surat..."
        itemsPerPageOptions={[10, 20, 50, 100]}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={data?.paging.total || 0}
        currentPage={page}
        itemsPerPage={limit}
        isLoading={isLoading}
      />
      <Toaster />
    </div>
  );
};

export default DaftarPermohonan;

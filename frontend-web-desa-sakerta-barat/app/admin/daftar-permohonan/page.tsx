'use client';
import React, { useState, useEffect } from 'react';
import DataTable from '../../../components/shared/Table';
import { Button } from '../../../components/ui/button';
import { Printer, MoreVertical, Trash } from 'lucide-react';
import { fetchLetterRequests } from '../../../lib/actions/letterRequest.action';
import { formatDate } from '../../../lib/utils';
import { translateStatus } from '../../../lib/letterRequestUtils';

const DaftarSurat = () => {
  const [letterRequests, setLetterRequests] = useState<LetterRequest[]>([]);
  const [paging, setPaging] = useState<PaginationInfo>({
    size: 10,
    total_page: 1,
    current_page: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLetterRequests();
  }, []);

  const loadLetterRequests = async (page: number = 1, limit: number = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchLetterRequests(page, limit);
      setLetterRequests(response.data);
      setPaging(response.paging);
    } catch (error) {
      console.error('Error fetching letter requests:', error);
      setError('Failed to load letter requests. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const statusColors: { [key: string]: string } = {
    SUBMITTED: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
    SIGNED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Pemohon', accessor: 'residentName' },
    { header: 'Surat', accessor: 'letterName' },
    {
      header: 'Tanggal',
      accessor: 'requestDate',
      cell: (value: string) => formatDate(value),
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
    },
    {
      header: 'Action',
      accessor: (row: LetterRequest) => (
        <div className="flex space-x-1">
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
    },
  ];

  const handleSearch = (query: string) => {
    // Implement search logic here
    console.log('Searching for:', query);
    // You might want to call loadLetterRequests with search params
  };

  const handleFilter = () => {
    // Implement filter logic here
    console.log('Filter button clicked');
    // You might want to call loadLetterRequests with filter params
  };

  const handlePageChange = (page: number) => {
    loadLetterRequests(page, paging.size);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <DataTable
        data={letterRequests}
        columns={columns}
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchPlaceholder="Cari surat..."
        itemsPerPageOptions={[10, 20, 50, 100]}
        onPageChange={handlePageChange}
        totalItems={paging.total}
        currentPage={paging.current_page}
        itemsPerPage={paging.size}
      />
    </div>
  );
};

export default DaftarSurat;

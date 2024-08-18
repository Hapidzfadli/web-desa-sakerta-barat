import React, { useState, useMemo, useCallback } from 'react';
import { PopulationDocumentRow } from '../types/dashboard.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DataTable from '../../shared/Table';

interface PopulationDocumentsTableProps {
  data: PopulationDocumentRow[];
}

const PopulationDocumentsTable: React.FC<PopulationDocumentsTableProps> = ({
  data,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((row) => row.category)),
    );
    return ['Semua', ...uniqueCategories];
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let result = data;

    // Filter by category
    if (selectedCategory !== 'Semua') {
      result = result.filter((row) => row.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (row) =>
          row.documentType.toLowerCase().includes(lowerQuery) ||
          row.category.toLowerCase().includes(lowerQuery),
      );
    }

    // Sort data
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, selectedCategory, searchQuery, sortColumn, sortOrder]);

  const handleSort = useCallback(
    (column: string) => {
      setSortOrder((currentOrder) =>
        sortColumn === column && currentOrder === 'asc' ? 'desc' : 'asc',
      );
      setSortColumn(column);
    },
    [sortColumn],
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const columns = [
    { header: 'Nama', accessor: 'documentType' },
    { header: 'Jumlah', accessor: 'totalRequests' },
    { header: 'Tanggal', accessor: 'lastRequestDate' },
    {
      header: 'Progress',
      accessor: 'completionRate',
      cell: (value: number) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${value}%` }}
          ></div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg border shadow-card border-gray-50">
      <div className="flex justify-between items-center mb-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-[#F4F7FE] text-[#A3AED0]">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={filteredAndSortedData}
        columns={columns}
        itemsPerPageOptions={[5, 10, 20]}
        searchPlaceholder="Cari surat..."
        onSearch={handleSearch}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
      />
    </div>
  );
};

export default PopulationDocumentsTable;

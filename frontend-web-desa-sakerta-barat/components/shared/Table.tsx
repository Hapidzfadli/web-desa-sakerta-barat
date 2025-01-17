'use client';
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Search, ArrowUpDown, Filter, Loader2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import CustomPaginationButton from './CustomPaginationButtonProps';

interface TableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T | ((data: T) => React.ReactNode);
    cell?: (value: any, row: T) => React.ReactNode;
    className?: string;
    disableSorting?: boolean;
  }[];
  itemsPerPageOptions?: number[];
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  searchPlaceholder?: string;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  totalItems?: number;
  currentPage?: number;
  itemsPerPage?: number;
  onSort?: (column: string) => void;
  sortColumn?: string | null;
  sortOrder?: 'asc' | 'desc';
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  itemsPerPageOptions = [5, 10, 20, 50],
  onSearch,
  onFilter,
  searchPlaceholder = 'Cari...',
  isLoading = false,
  onPageChange,
  onItemsPerPageChange,
  totalItems,
  currentPage: controlledCurrentPage,
  itemsPerPage: controlledItemsPerPage,
  onSort,
  sortColumn: controlledSortColumn,
  sortOrder: controlledSortOrder,
}: TableProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(
    itemsPerPageOptions[0],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const currentPage = controlledCurrentPage ?? internalCurrentPage;
  const itemsPerPage = controlledItemsPerPage ?? internalItemsPerPage;

  const totalPages = Math.ceil((totalItems ?? data.length) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else {
      setInternalCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(value);
    } else {
      setInternalItemsPerPage(value);
    }
    handlePageChange(1); // Reset to first page when changing items per page
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSort = (column: string) => {
    if (onSort) {
      onSort(column);
    } else {
      // Local sorting logic if needed
    }
  };

  const displayData = data;

  return (
    <div className="space-y-4 text-black-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="whitespace-nowrap">Tampilkan</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => handleItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] bg-red-50">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 w-full sm:w-auto">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F9BBA] h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full text-[#8F9BBA] bg-[#F4F7FE] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {onFilter && (
            <Button
              onClick={onFilter}
              className="bg-save hover:bg-gray-100 h-8 px-2 rounded-lg whitespace-nowrap"
              title="Filter"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border rounded-lg">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={`bg-gray-50 ${column.className}`}
                    >
                      {column.disableSorting ? (
                        <div className="px-2 py-1">{column.header}</div>
                      ) : (
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(column.accessor as string)}
                          className="hover:bg-transparent p-0 w-full flex justify-between items-center"
                        >
                          {column.header}
                          <FontAwesomeIcon
                            icon={faSort}
                            className={`ml-2 h-4 w-4 ${
                              controlledSortColumn === column.accessor
                                ? controlledSortOrder === 'asc'
                                  ? 'text-blue-500'
                                  : 'text-blue-500 rotate-180'
                                : 'text-[#9E9E9E]'
                            }`}
                          />
                        </Button>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : displayData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  displayData.map((row, rowIndex) => (
                    <TableRow
                      key={row.id}
                      className={
                        rowIndex % 2 === 0 ? 'bg-[#F7F6FE]' : 'bg-white'
                      }
                    >
                      {columns.map((column, index) => (
                        <TableCell key={index} className={column.className}>
                          {column.cell
                            ? column.cell(
                                typeof column.accessor === 'function'
                                  ? column.accessor(row)
                                  : row[column.accessor],
                                row,
                              )
                            : typeof column.accessor === 'function'
                              ? column.accessor(row)
                              : row[column.accessor]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-sm">
        <div className="w-full sm:w-auto mb-2 sm:mb-0 text-center sm:text-left">
          <p>
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga{' '}
            {Math.min(currentPage * itemsPerPage, totalItems ?? data.length)}{' '}
            dari {totalItems ?? data.length} entri
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <CustomPaginationButton
                direction="previous"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              if (
                i === 0 ||
                i === totalPages - 1 ||
                (i >= currentPage - 2 && i <= currentPage + 2)
              ) {
                return (
                  <PaginationItem key={i} className="hidden sm:inline-block">
                    <PaginationLink
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (i === currentPage - 3 || i === currentPage + 3) {
                return (
                  <PaginationEllipsis
                    key={i}
                    className="hidden sm:inline-block"
                  />
                );
              }
              return null;
            })}
            <PaginationItem>
              <CustomPaginationButton
                direction="next"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default DataTable;

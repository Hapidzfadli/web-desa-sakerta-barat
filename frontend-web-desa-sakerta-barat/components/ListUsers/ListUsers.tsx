'use client';
import React, { useState } from 'react';
import DataTable from '../shared/Table';
import useUserList from './hook';
import { User } from './types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import Filter from '../shared/Filter';
import { useUser } from '../../app/context/UserContext';

const ListUsers: React.FC = () => {
  const { toast } = useToast();
  const { user: currentUser } = useUser(); // Get the current user
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | string[]>
  >({});

  const {
    users,
    loading,
    error,
    totalItems,
    currentPage,
    itemsPerPage,
    sortColumn,
    sortOrder,
    handlePageChange,
    handleItemsPerPageChange,
    handleSearch,
    handleUpdateRole,
    handleSort,
    handleFilterChange,
  } = useUserList();

  const columns = [
    { header: 'Nama', accessor: 'name' },
    { header: 'Username', accessor: 'username' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    {
      header: 'Status',
      accessor: 'isVerified',
      cell: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {value ? 'Terverifikasi' : 'Belum Terverifikasi'}
        </span>
      ),
    },
    {
      header: 'Aksi',
      accessor: (row: User) =>
        currentUser?.role === 'KADES' ? (
          <Select
            onValueChange={(value) => {
              handleUpdateRole(row.id, value);
              toast({
                title: 'Role Updated',
                description: `User ${row.name}'s role has been updated to ${value}.`,
              });
            }}
            defaultValue={row.role}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="WARGA">Warga</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <span>{row.role}</span>
        ),
    },
  ];

  const filterOptions = [
    {
      id: 'role',
      label: 'Role',
      type: 'select',
      options: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'WARGA', label: 'Warga' },
      ],
    },
    {
      id: 'isVerified',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'true', label: 'Terverifikasi' },
        { value: 'false', label: 'Belum Terverifikasi' },
      ],
    },
  ];

  const handleApplyFilters = (filters: Record<string, string | string[]>) => {
    setActiveFilters(filters);
    handleFilterChange(filters);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Terjadi kesalahan saat memuat data pengguna. Silakan coba lagi nanti.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <DataTable
        data={users}
        columns={columns}
        isLoading={loading}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        onSearch={handleSearch}
        searchPlaceholder="Cari pengguna..."
        onFilter={() => setIsFilterOpen(true)}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
      />
      <Filter
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        filterOptions={filterOptions}
      />
    </div>
  );
};

export default ListUsers;

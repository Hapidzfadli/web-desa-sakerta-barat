import React from 'react';
import DataTable from '../../../components/shared/Table';
import { LetterRequest, TableColumn } from '../types';
import { Button } from '../../../components/ui/button';
import { Printer, FileIcon, User, Edit, Save } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPrint,
  faSignature,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate, translateStatus } from '../utils/helpers';

interface DaftarPermohonanTableProps {
  data: LetterRequest[];
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onSort: (column: string) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  sortColumn: string | null;
  sortOrder: 'asc' | 'desc';
  onPrint: (id: number) => void;
  onView: (id: number) => void;
  onDelete: (id: number) => void;
  userRole: string;
  onFilter: () => void;
}

const DaftarPermohonanTable: React.FC<DaftarPermohonanTableProps> = ({
  data,
  onSearch,
  onPageChange,
  onItemsPerPageChange,
  onSort,
  totalItems,
  currentPage,
  itemsPerPage,
  isLoading,
  sortColumn,
  sortOrder,
  onPrint,
  onView,
  onDelete,
  userRole,
  onFilter,
}) => {
  const statusColors: { [key: string]: string } = {
    SUBMITTED: 'bg-[#EBF9F1] text-[#1F9254]',
    APPROVED: 'bg-[#D2F3F3] text-[#3F709D]',
    REJECTED: 'bg-red-100 text-red-800',
    SIGNED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  const printableStatuses = ['APPROVED', 'SIGNED', 'COMPLETED', 'ARCHIVED'];

  const columns: TableColumn[] = [
    {
      header: 'ID',
      accessor: 'id',
      className: 'w-20 text-center',
    },
    {
      header: 'Pemohon',
      accessor: 'residentName',
      className: 'w-40 text-left',
    },
    {
      header: 'Surat',
      accessor: 'letterName',
      className: 'w-60 text-left',
    },
    {
      header: 'Tanggal',
      accessor: 'requestDate',
      cell: (value: string) => formatDate(value),
      className: 'w-40 text-left',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value]}`}
        >
          {translateStatus(value)}
        </span>
      ),
      className: 'w-32 text-center',
    },
    {
      header: 'Action',
      accessor: (row: LetterRequest) => (
        <div className="flex items-center space-x-1 justify-center">
          {userRole !== 'WARGA' && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onPrint(row.id)}
                disabled={!printableStatuses.includes(row.status)}
                title={
                  printableStatuses.includes(row.status)
                    ? 'Lihat dan Cetak Surat'
                    : 'Tidak dapat dicetak'
                }
              >
                {printableStatuses.includes(row.status) ? (
                  <FontAwesomeIcon
                    icon={faPrint}
                    className="h-4 w-4 text-blue-500"
                  />
                ) : (
                  <Printer className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              {userRole === 'KADES' && row.status === 'APPROVED' && (
                <Button
                  size="sm"
                  variant="ghost"
                  title="Tanda Tangan"
                  onClick={() => onPrint(row.id)}
                >
                  <FontAwesomeIcon
                    className="h-4 w-4 text-black-2"
                    icon={faSignature}
                  />
                </Button>
              )}
            </>
          )}
          <Button size="sm" title="Lihat" onClick={() => onView(row.id)}>
            <FontAwesomeIcon className="h-4 w-4 text-view" icon={faEye} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Delete"
            onClick={() => onDelete(row.id)}
          >
            <FontAwesomeIcon
              className="h-4 w-4 text-delete"
              icon={faTrashCan}
            />
          </Button>
        </div>
      ),
      className: 'w-40 text-center',
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      onSearch={onSearch}
      searchPlaceholder="Cari Permohonan..."
      itemsPerPageOptions={[10, 20, 50, 100]}
      onPageChange={onPageChange}
      onItemsPerPageChange={onItemsPerPageChange}
      totalItems={totalItems}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      isLoading={isLoading}
      onSort={onSort}
      sortColumn={sortColumn}
      sortOrder={sortOrder}
      onFilter={onFilter}
    />
  );
};

export default DaftarPermohonanTable;

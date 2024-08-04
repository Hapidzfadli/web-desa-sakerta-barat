'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DataTable from '../../../components/shared/Table';
import { Button } from '../../../components/ui/button';
import { Printer, FileIcon, User, Edit, Save } from 'lucide-react';
import {
  fetchLetterRequests,
  fetchLetterRequestById,
  verifyLetterRequest,
  resubmitLetterRequest,
  updateLetterRequest,
  deleteLetterRequest,
  getAttachmentFile,
  previewLetterRequest,
  printLetterRequest,
} from '../../../lib/actions/letterRequest.action';
import { formatDate } from '../../../lib/utils';
import { translateStatus } from '../../../lib/letterRequestUtils';
import LoadingSpinner from '../../../components/shared/LoadingSpinner';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPrint,
  faSignature,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../context/UserContext';
import EditPopup from '../../../components/shared/EditPopup';
import { updateResidentData } from '../../../lib/actions/setting.actions';
import PreviewPopup from '../../../components/shared/PreviewPopup';

const DaftarPermohonan = () => {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );
  const [showApplicantDetails, setShowApplicantDetails] = useState(false);
  const [showRejectionPopup, setShowRejectionPopup] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isEditingResident, setIsEditingResident] = useState(false);
  const [editedResidentData, setEditedResidentData] = useState({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [previewRequestId, setPreviewRequestId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isPrinting, setIsPrinting] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      'letterRequests',
      page,
      limit,
      searchQuery,
      sortColumn,
      sortOrder,
    ],
    queryFn: () =>
      fetchLetterRequests(page, limit, searchQuery, sortColumn, sortOrder),
    staleTime: 60000,
    cacheTime: 30000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Gagal memuat data permohonan surat. Silakan coba lagi.',
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  const { data: selectedRequest, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['letterRequest', selectedRequestId],
    queryFn: () => fetchLetterRequestById(selectedRequestId!),
    enabled: !!selectedRequestId,
  });

  const verifyMutation = useMutation({
    mutationFn: ({
      id,
      status,
      rejectionReason,
    }: {
      id: number;
      status: 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
    }) => verifyLetterRequest(id, status, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries(['letterRequests']);
      queryClient.invalidateQueries(['letterRequest', selectedRequestId]);
      toast({
        title: 'Sukses',
        description: 'Status permohonan berhasil diperbarui',
        duration: 3000,
      });
      setSelectedRequestId(null);
      setShowRejectionPopup(false);
      setRejectionReason('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui status permohonan',
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  const resubmitMutation = useMutation({
    mutationFn: (id: number) => resubmitLetterRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['letterRequests']);
      toast({
        title: 'Sukses',
        description: 'Permohonan berhasil diajukan kembali',
        duration: 3000,
      });
      setSelectedRequestId(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Gagal mengajukan kembali permohonan',
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  const updateResidentMutation = useMutation({
    mutationFn: (data: any) => updateResidentData(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['letterRequest', selectedRequestId]);
      toast({
        title: 'Sukses',
        description: 'Data penduduk berhasil diperbarui',
        duration: 3000,
      });
      setIsEditingResident(false);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui data penduduk',
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLetterRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['letterRequests']);
      toast({
        title: 'Sukses',
        description: 'Permohonan surat berhasil dihapus',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Gagal menghapus permohonan surat',
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  const {
    data: pdfBlob,
    isLoading: isPdfLoading,
    error: pdfError,
    refetch: refetchPdf,
  } = useQuery({
    queryKey: ['letterPreview', previewRequestId],
    queryFn: () => previewLetterRequest(previewRequestId!),
    enabled: false,
  });

  useEffect(() => {
    if (previewRequestId !== null) {
      refetchPdf();
    }
  }, [previewRequestId, refetchPdf]);

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPreviewUrl(url);
    }
  }, [pdfBlob]);

  useEffect(() => {
    if (isPdfLoading) {
      const interval = setInterval(() => {
        setProgress((oldProgress) => {
          const newProgress = Math.min(oldProgress + 10, 90);
          return newProgress;
        });
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isPdfLoading]);

  const statusColors: { [key: string]: string } = {
    SUBMITTED: 'bg-[#EBF9F1] text-[#1F9254]',
    APPROVED: 'bg-[#D2F3F3] text-[#3F709D]',
    REJECTED: 'bg-red-100 text-red-800',
    SIGNED: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };

  const printableStatuses = ['APPROVED', 'SIGNED', 'COMPLETED', 'ARCHIVED'];

  const columns = [
    { header: 'ID', accessor: 'id', className: 'w-16 text-center' },
    {
      header: 'Pemohon',
      accessor: 'residentName',
      className: 'w-1/6 text-left',
    },
    { header: 'Surat', accessor: 'letterName', className: 'w-1/3 text-left' },
    {
      header: 'Tanggal',
      accessor: 'requestDate',
      cell: (value: string) => formatDate(value),
      className: 'w-1/5 text-left',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value: string) => (
        <span
          className={`px-4 py-2 rounded-full text-xs font-medium ${statusColors[value]}`}
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
          {user?.role !== 'WARGA' && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handlePrint(row.id)}
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
              {user?.role === 'KADES' && row.status === 'APPROVED' && (
                <Button
                  size="sm"
                  variant="ghost"
                  title="Tanda Tangan"
                  onClick={() => handleSign(row.id)}
                >
                  <FontAwesomeIcon
                    className="h-4 w-4 text-black-2"
                    icon={faSignature}
                  />
                </Button>
              )}
            </>
          )}
          <Button
            size="sm"
            title="Lihat"
            onClick={() => setSelectedRequestId(row.id)}
          >
            <FontAwesomeIcon className="h-4 w-4 text-view" icon={faEye} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
            <FontAwesomeIcon
              className="h-4 w-4 text-delete"
              icon={faTrashCan}
            />
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleVerify = (status: 'APPROVED' | 'REJECTED') => {
    if (selectedRequestId) {
      if (status === 'REJECTED') {
        setShowRejectionPopup(true);
      } else {
        verifyMutation.mutate({ id: selectedRequestId, status });
      }
    }
  };

  const handleRejectConfirm = () => {
    if (selectedRequestId) {
      verifyMutation.mutate({
        id: selectedRequestId,
        status: 'REJECTED',
        rejectionReason,
      });
    }
  };

  const handleResubmit = () => {
    if (selectedRequestId) {
      resubmitMutation.mutate(selectedRequestId);
    }
  };

  const handleSaveResident = () => {
    updateResidentMutation.mutate(editedResidentData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus permohonan ini?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleResidentFieldChange = (name: string, value: string) => {
    setEditedResidentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewAttachment = async (api: string) => {
    try {
      const blob = await getAttachmentFile(api);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Gagal melihat dokumen. Silakan coba lagi.',
      });
    }
  };

  const handlePrint = useCallback((id: number) => {
    setPreviewRequestId(id);
    setProgress(0);
  }, []);

  const handleSign = useCallback((id: number) => {
    // Implement the signing logic here
    console.log('Signing letter request:', id);
    // You might want to call an API to sign the letter
    // and then invalidate the queries to refresh the data
  }, []);

  const printDocument = async () => {
    if (!previewRequestId) return;
    console.log('HALLOOO');
    setIsPrinting(true);
    try {
      const printableBlob = await printLetterRequest(previewRequestId);
      const printUrl = URL.createObjectURL(printableBlob);

      const printWindow = window.open(printUrl, '_blank');
      printWindow?.print();

      // Clean up
      URL.revokeObjectURL(printUrl);
    } catch (error) {
      console.error('Error printing document:', error);
      toast({
        title: 'Error',
        description: 'Gagal mencetak dokumen. Silakan coba lagi.',
        variant: 'destructive',
        duration: 3000,
      });
    } finally {
      setIsPrinting(false);
    }
  };

  const renderDetailsFields = () => {
    if (!selectedRequest) return [];

    const fields = [
      {
        label: 'Pemohon',
        name: 'resident.name',
        value: selectedRequest.resident.name,
      },
      { label: 'Surat', name: 'letterName', value: selectedRequest.letterName },
      {
        label: 'Tanggal Pengajuan',
        name: 'requestDate',
        value: formatDate(selectedRequest.requestDate),
      },
      {
        label: 'Status',
        name: 'status',
        value: translateStatus(selectedRequest.status),
      },
      {
        label: 'Catatan',
        name: 'notes',
        value: selectedRequest.notes,
        type: 'textarea',
      },
    ];

    if (
      selectedRequest.status === 'REJECTED' &&
      selectedRequest.rejectionReason
    ) {
      fields.push({
        label: 'Alasan Penolakan',
        name: 'rejectionReason',
        value: selectedRequest.rejectionReason,
        type: 'textarea',
      });
    }

    fields.push({
      label: 'Detail Pemohon',
      name: 'applicantDetails',
      value: '',
      type: 'custom',
      render: () => (
        <Button
          onClick={() => {
            setShowApplicantDetails(true);
            if (
              (selectedRequest.status === 'REJECTED' ||
                selectedRequest.status === 'SUBMITTED') &&
              user?.role == 'WARGA'
            ) {
              setIsEditingResident(true);
            }
          }}
          className="bg-blue-500 text-white"
        >
          <User className="mr-2 h-4 w-4" />
          Lihat Detail Pemohon
        </Button>
      ),
    });

    if (printableStatuses.includes(selectedRequest.status)) {
      fields.push({
        label: 'Lihat dan Cetak Surat',
        name: 'previewLetter',
        value: '',
        type: 'custom',
        render: () => (
          <Button
            onClick={() => handlePrint(selectedRequest.id)}
            className="bg-blue-500 text-white"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2 h-4 w-4" />
            Lihat dan Cetak Surat
          </Button>
        ),
      });
    }

    return fields;
  };

  const renderResidentFields = () => {
    if (!selectedRequest || !selectedRequest.resident) return [];

    return [
      { label: 'Nama', name: 'name', value: selectedRequest.resident.name },
      {
        label: 'NIK',
        name: 'nationalId',
        value: selectedRequest.resident.nationalId,
      },
      {
        label: 'Tanggal Lahir',
        name: 'dateOfBirth',
        value: formatDate(selectedRequest.resident.dateOfBirth),
        type: 'date',
      },
      {
        label: 'Alamat KTP',
        name: 'idCardAddress',
        value: selectedRequest.resident.idCardAddress,
      },
      {
        label: 'Alamat Domisili',
        name: 'residentialAddress',
        value: selectedRequest.resident.residentialAddress,
      },
      {
        label: 'Agama',
        name: 'religion',
        value: selectedRequest.resident.religion,
      },
      {
        label: 'Status Pernikahan',
        name: 'maritalStatus',
        value: selectedRequest.resident.maritalStatus,
      },
      {
        label: 'Pekerjaan',
        name: 'occupation',
        value: selectedRequest.resident.occupation,
      },
      {
        label: 'Kewarganegaraan',
        name: 'nationality',
        value: selectedRequest.resident.nationality,
      },
      {
        label: 'Tempat Lahir',
        name: 'placeOfBirth',
        value: selectedRequest.resident.placeOfBirth,
      },
      {
        label: 'Jenis Kelamin',
        name: 'gender',
        value: selectedRequest.resident.gender,
      },
      {
        label: 'No. Kartu Keluarga',
        name: 'familyCardNumber',
        value: selectedRequest.resident.familyCardNumber,
      },
      {
        label: 'Kecamatan',
        name: 'district',
        value: selectedRequest.resident.district,
      },
      {
        label: 'Kabupaten',
        name: 'regency',
        value: selectedRequest.resident.regency,
      },
      {
        label: 'Provinsi',
        name: 'province',
        value: selectedRequest.resident.province,
      },
      {
        label: 'Kode Pos',
        name: 'postalCode',
        value: selectedRequest.resident.postalCode,
      },
      { label: 'RT', name: 'rt', value: selectedRequest.resident.rt },
      { label: 'RW', name: 'rw', value: selectedRequest.resident.rw },
      {
        label: 'Golongan Darah',
        name: 'bloodType',
        value: selectedRequest.resident.bloodType,
      },
    ].map((field) => ({
      ...field,
      value: isEditingResident
        ? editedResidentData[field.name] || field.value
        : field.value,
      onChange: isEditingResident
        ? (value) => handleResidentFieldChange(field.name, value)
        : undefined,
      disabled: !isEditingResident,
    }));
  };

  return (
    <div className="container mx-auto p-4 ">
      <DataTable
        data={data?.data || []}
        columns={columns}
        onSearch={handleSearch}
        searchPlaceholder="Cari Permohonan..."
        itemsPerPageOptions={[10, 20, 50, 100]}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        totalItems={data?.paging.total || 0}
        currentPage={page}
        itemsPerPage={limit}
        isLoading={isLoading}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
      />
      {selectedRequestId && (
        <EditPopup
          title="Detail Permohonan"
          fields={renderDetailsFields()}
          isOpen={!!selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          viewMode={true}
          additionalContent={
            selectedRequest?.attachments &&
            selectedRequest?.attachments.length > 0 && (
              <div className="space-y-2">
                {selectedRequest?.attachments?.map((attachment, index) => (
                  <Button
                    key={index}
                    className="flex items-center input-form p-2 rounded-lg w-full justify-start"
                    onClick={() => {
                      handleViewAttachment(attachment.fileUrl);
                    }}
                  >
                    <FileIcon className="mr-2 h-5 w-5 text-blue-500" />
                    {attachment.fileName}
                  </Button>
                ))}
              </div>
            )
          }
          customButtons={
            <>
              {user?.role === 'ADMIN' &&
                selectedRequest?.status === 'SUBMITTED' && (
                  <>
                    <Button
                      onClick={() => handleVerify('REJECTED')}
                      className="bg-red-500 text-white"
                    >
                      Tolak
                    </Button>
                    <Button
                      onClick={() => handleVerify('APPROVED')}
                      className="bg-green-500 text-white"
                    >
                      Terima
                    </Button>
                  </>
                )}
              {user?.role === 'WARGA' &&
                selectedRequest?.status === 'REJECTED' && (
                  <Button
                    onClick={handleResubmit}
                    className="bg-blue-500 text-white"
                  >
                    Ajukan Kembali
                  </Button>
                )}
            </>
          }
        />
      )}
      {previewRequestId !== null && (
        <PreviewPopup
          isOpen={true}
          onClose={() => {
            setPreviewRequestId(null);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
          }}
          pdfUrl={previewUrl}
          isLoading={isPdfLoading}
          progress={progress}
          onPrint={printDocument}
        />
      )}

      {showApplicantDetails && (
        <EditPopup
          title="Detail Pemohon"
          fields={renderResidentFields()}
          isOpen={showApplicantDetails}
          onClose={() => {
            setShowApplicantDetails(false);
            setIsEditingResident(false);
            setEditedResidentData({});
          }}
          viewMode={!isEditingResident}
          onSave={handleSaveResident}
        />
      )}
      {showRejectionPopup && (
        <EditPopup
          title="Alasan Penolakan"
          fields={[
            {
              label: 'Alasan Penolakan',
              name: 'rejectionReason',
              value: rejectionReason,
              type: 'textarea',
              onChange: (value: string) => setRejectionReason(value),
            },
          ]}
          grid={'1'}
          isOpen={showRejectionPopup}
          onClose={() => {
            setShowRejectionPopup(false);
            setRejectionReason('');
          }}
          viewMode={false}
          customButtons={
            <>
              <Button
                onClick={() => {
                  setShowRejectionPopup(false);
                  setRejectionReason('');
                }}
                className="bg-gray-500 text-white"
              >
                Batal
              </Button>
              <Button
                onClick={handleRejectConfirm}
                className="bg-red-500 text-white"
              >
                Konfirmasi Penolakan
              </Button>
            </>
          }
        />
      )}
      <Toaster />
    </div>
  );
};

export default DaftarPermohonan;

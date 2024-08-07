import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
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
  signLetterRequest,
} from '../../../lib/actions/letterRequest.action';
import { updateResidentData } from '../../../lib/actions/setting.actions';
import { LetterRequest } from '../types';

export const useDaftarPermohonan = () => {
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [signPin, setSignPin] = useState('');

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
    onMutate: () => {
      setIsVerifying(true);
    },
    onSettled: () => {
      setIsVerifying(false);
    },
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

  const signMutation = useMutation({
    mutationFn: ({ id, pin }: { id: number; pin: string }) =>
      signLetterRequest(id, pin),
    onMutate: () => {
      setIsSigning(true);
    },
    onSettled: () => {
      setIsSigning(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['letterRequests']);
      queryClient.invalidateQueries(['letterRequest', previewRequestId]);
      queryClient.invalidateQueries(['letterPreview', previewRequestId]);
      toast({
        title: 'Sukses',
        description: 'Surat berhasil ditandatangani',
        duration: 3000,
      });
      setShowPinPopup(false);
      setSignPin('');
      setPreviewRequestId(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Gagal menandatangani surat',
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

  const handleSignButtonClick = () => {
    setShowPinPopup(true);
  };

  const handleSignConfirm = () => {
    if (previewRequestId) {
      signMutation.mutate({ id: previewRequestId, pin: signPin });
    }
  };

  const printDocument = async () => {
    if (!previewRequestId) return;
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

  return {
    data,
    isLoading,
    isError,
    selectedRequest,
    isLoadingDetails,
    page,
    limit,
    searchQuery,
    sortColumn,
    sortOrder,
    selectedRequestId,
    showApplicantDetails,
    showRejectionPopup,
    rejectionReason,
    isEditingResident,
    editedResidentData,
    previewUrl,
    previewRequestId,
    progress,
    isVerifying,
    isPrinting,
    isSigning,
    showPinPopup,
    signPin,
    isPdfLoading,
    setIsEditingResident,
    handleSearch,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
    handleVerify,
    handleRejectConfirm,
    handleResubmit,
    handleSaveResident,
    handleDelete,
    handleResidentFieldChange,
    handleViewAttachment,
    handlePrint,
    handleSignButtonClick,
    handleSignConfirm,
    printDocument,
    setSelectedRequestId,
    setShowApplicantDetails,
    setShowRejectionPopup,
    setRejectionReason,
    setEditedResidentData,
    setPreviewRequestId,
    setShowPinPopup,
    setSignPin,
  };
};

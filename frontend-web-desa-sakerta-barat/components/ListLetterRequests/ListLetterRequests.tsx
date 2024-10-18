'use client';
import React from 'react';
import { useDaftarPermohonan } from './hooks/useDaftarPermohonan';
import DaftarPermohonanTable from './components/DaftarPermohonanTable';
import DetailPermohonan from './components/DetailPermohonan';
import ApplicantDetails from './components/ApplicantDetails';
import RejectionPopup from './components/RejectionPopup';
import PreviewPopup from '../shared/PreviewPopup';
import PinPopup from '../shared/PinPopup';
import ProgressOverlay from '../shared/ProgressOverlay';
import { Toaster } from '@/components/ui/toaster';
import { useUser } from '../../app/context/UserContext';
import Filter from '../shared/Filter';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const ListLetterRequests: React.FC = () => {
  const { user } = useUser();
  const {
    data,
    isLoading,
    isError,
    selectedRequest,
    isLoadingDetails,
    isPdfLoading,
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
    isFilterOpen,
    filters,
    showDeleteConfirmation,
    requestToDelete,
    showRejectReasonPopup,
    rejectReason,
    action,
    handleDownload,
    handleComplete,
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
    setIsEditingResident,
    setEditedResidentData,
    setPreviewRequestId,
    setShowPinPopup,
    setSignPin,
    setIsFilterOpen,
    handleFilterChange,
    setRequestToDelete,
    setShowDeleteConfirmation,
    handleArchive,
    handleReject,
    setShowRejectReasonPopup,
    setRejectReason,
    handlePinConfirm,
  } = useDaftarPermohonan();

  const filterOptions = [
    {
      id: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'SUBMITTED', label: 'Diajukan' },
        { value: 'APPROVED', label: 'Disetujui' },
        { value: 'REJECTED', label: 'Ditolak' },
        { value: 'REJECTED_BY_KADES', label: 'Ditolak oleh Kades' },
        { value: 'SIGNED', label: 'Ditandatangani' },
        { value: 'COMPLETED', label: 'Selesai' },
        { value: 'ARCHIVED', label: 'Diarsipkan' },
      ],
    },
  ];

  return (
    <>
      {(isVerifying || isPrinting || isSigning) && (
        <ProgressOverlay
          isLoading={true}
          action={
            isVerifying
              ? 'Memverifikasi Surat'
              : isPrinting
                ? 'Mencetak Surat'
                : 'Menandatangani Surat'
          }
        />
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <DaftarPermohonanTable
            data={data?.data || []}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            onSort={handleSort}
            totalItems={data?.paging.total || 0}
            currentPage={page}
            itemsPerPage={limit}
            isLoading={isLoading}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onPrint={handlePrint}
            onView={setSelectedRequestId}
            onDelete={(id) => {
              setRequestToDelete(id);
              setShowDeleteConfirmation(true);
            }}
            userRole={user?.role || ''}
            onFilter={() => setIsFilterOpen(true)}
          />

          {selectedRequestId && (
            <DetailPermohonan
              selectedRequest={selectedRequest}
              onClose={() => setSelectedRequestId(null)}
              onViewApplicant={() => setShowApplicantDetails(true)}
              onViewAttachment={handleViewAttachment}
              onPrint={handlePrint}
              onDownload={handleDownload}
              onVerify={handleVerify}
              onResubmit={handleResubmit}
              setIsEditingResident={setIsEditingResident}
              userRole={user?.role || ''}
              onComplete={handleComplete}
              onArchive={handleArchive}
            />
          )}

          {showApplicantDetails && selectedRequest && (
            <ApplicantDetails
              resident={selectedRequest.resident}
              isOpen={showApplicantDetails}
              onClose={() => {
                setShowApplicantDetails(false);
                setIsEditingResident(false);
                setEditedResidentData({});
              }}
              isEditing={isEditingResident}
              onEdit={handleResidentFieldChange}
              onSave={handleSaveResident}
            />
          )}

          {showRejectionPopup && (
            <RejectionPopup
              isOpen={showRejectionPopup}
              onClose={() => {
                setShowRejectionPopup(false);
                setRejectionReason('');
              }}
              rejectionReason={rejectionReason}
              onReasonChange={setRejectionReason}
              onConfirm={handleRejectConfirm}
            />
          )}

          {previewRequestId !== null && (
            <PreviewPopup
              isOpen={true}
              onClose={() => {
                setPreviewRequestId(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
              }}
              pdfUrl={previewUrl}
              isLoading={isPdfLoading}
              progress={progress}
              onPrint={printDocument}
              onSign={handleSignButtonClick}
              onReject={() => handleReject(previewRequestId)}
              onDownload={() => handleDownload(previewRequestId)}
              showSignButton={user?.role === 'KADES'}
              letterStatus={selectedRequest?.status || ''}
            />
          )}

          <PinPopup
            isOpen={showPinPopup}
            onClose={() => {
              setShowPinPopup(false);
              setSignPin('');
            }}
            onConfirm={handlePinConfirm}
            pin={signPin}
            setPin={setSignPin}
            action={action === 'SIGN' ? 'sign' : 'reject'}
          />

          <Filter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterChange}
            filterOptions={filterOptions}
          />

          <ConfirmationDialog
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            onConfirm={() => {
              if (requestToDelete !== null) {
                handleDelete(requestToDelete);
              }
              setShowDeleteConfirmation(false);
            }}
            title="Konfirmasi Penghapusan"
            description="Apakah Anda yakin ingin menghapus permohonan surat ini?"
            confirmText="Hapus"
            cancelText="Batal"
          />

          <RejectionPopup
            isOpen={showRejectReasonPopup}
            onClose={() => {
              setShowRejectReasonPopup(false);
              setRejectReason('');
            }}
            rejectionReason={rejectReason}
            onReasonChange={setRejectReason}
            onConfirm={handleRejectConfirm}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default ListLetterRequests;

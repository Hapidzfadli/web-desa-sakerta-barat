'use client';
import React from 'react';
import { useDaftarPermohonan } from './hooks/useDaftarPermohonan';
import DaftarPermohonanTable from './components/DaftarPermohonanTable';
import DetailPermohonan from './components/DetailPermohonan';
import ApplicantDetails from './components/ApplicantDetails';
import RejectionPopup from './components/RejectionPopup';
import PreviewPopup from '../../components/shared/PreviewPopup';
import PinPopup from '../../components/shared/PinPopup';
import ProgressOverlay from '../../components/shared/ProgressOverlay';
import { Toaster } from '@/components/ui/toaster';
import { useUser } from '../../app/context/UserContext';
import Filter from '../shared/Filter';

const DaftarPermohonan: React.FC = () => {
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
    handleArchive,
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
            onDelete={handleDelete}
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
              showSignButton={user?.role === 'KADES'}
            />
          )}

          <PinPopup
            isOpen={showPinPopup}
            onClose={() => {
              setShowPinPopup(false);
              setSignPin('');
            }}
            onConfirm={handleSignConfirm}
            pin={signPin}
            setPin={setSignPin}
          />

          <Filter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={handleFilterChange}
            filterOptions={filterOptions}
          />
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default DaftarPermohonan;

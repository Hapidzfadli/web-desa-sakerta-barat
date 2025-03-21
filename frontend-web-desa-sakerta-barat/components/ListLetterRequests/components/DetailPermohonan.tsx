import React from 'react';
import { Button } from '../../../components/ui/button';
import { User, FileIcon, Archive, Download } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { LetterRequest } from '../types';
import { formatDate, translateStatus } from '../utils/helpers';
import EditPopup from '../../../components/shared/EditPopup';

interface DetailPermohonanProps {
  selectedRequest: LetterRequest | undefined;
  onClose: () => void;
  onViewApplicant: () => void;
  onViewAttachment: (fileUrl: string) => void;
  onPrint: (id: number) => void;
  onDownload: (id: number) => void;
  onVerify: (status: 'APPROVED' | 'REJECTED') => void;
  setIsEditingResident: (isEditing: boolean) => void;
  onResubmit: () => void;
  onComplete: (id: number) => void;
  userRole: string;
  onArchive: (id: number) => void;
}

const DetailPermohonan: React.FC<DetailPermohonanProps> = ({
  selectedRequest,
  onClose,
  onViewApplicant,
  onViewAttachment,
  setIsEditingResident,
  onPrint,
  onDownload,
  onVerify,
  onComplete,
  onResubmit,
  onArchive,
  userRole,
}) => {
  if (!selectedRequest) return null;

  const printableStatuses = ['APPROVED', 'SIGNED', 'COMPLETED', 'ARCHIVED'];
  const downloadableStatuses = ['SIGNED', 'COMPLETED', 'ARCHIVED'];

  const renderDetailsFields = () => {
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
            onViewApplicant();
            if (
              (selectedRequest.status === 'REJECTED' ||
                selectedRequest.status === 'SUBMITTED') &&
              userRole === 'WARGA'
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
          <div className="flex space-x-2">
            <Button
              onClick={() => onPrint(selectedRequest.id)}
              className="bg-blue-500 text-white"
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2 h-4 w-4" />
              Lihat dan Cetak Surat
            </Button>
            {downloadableStatuses.includes(selectedRequest.status) && (
              <Button
                onClick={() => onDownload(selectedRequest.id)}
                className="bg-purple-500 text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Unduh Surat
              </Button>
            )}
          </div>
        ),
      });
    }

    return fields;
  };

  return (
    <EditPopup
      title="Detail Permohonan"
      fields={renderDetailsFields()}
      isOpen={true}
      onClose={onClose}
      viewMode={true}
      additionalContent={
        selectedRequest.attachments &&
        selectedRequest.attachments.length > 0 && (
          <div className="space-y-2">
            {selectedRequest.attachments.map((attachment, index) => (
              <Button
                key={index}
                className="flex items-center input-form p-2 rounded-lg w-full justify-start"
                onClick={() => onViewAttachment(attachment.fileUrl)}
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
          {userRole === 'ADMIN' && selectedRequest.status === 'SUBMITTED' && (
            <>
              <Button
                onClick={() => onVerify('REJECTED')}
                className="bg-red-500 text-white"
              >
                Tolak
              </Button>
              <Button
                onClick={() => onVerify('APPROVED')}
                className="bg-green-500 text-white"
              >
                Terima
              </Button>
            </>
          )}
          {selectedRequest.status === 'SIGNED' && (
            <Button
              onClick={() => onComplete(selectedRequest.id)}
              className="bg-green-500 text-white"
            >
              Selesai
            </Button>
          )}
          {selectedRequest.status === 'COMPLETED' &&
            (userRole === 'ADMIN' || userRole === 'KADES') && (
              <Button
                onClick={() => onArchive(selectedRequest.id)}
                className="bg-blue-500 text-white"
              >
                <Archive className="mr-2 h-4 w-4" />
                Arsipkan
              </Button>
            )}
          {userRole === 'WARGA' && selectedRequest.status === 'REJECTED' && (
            <Button onClick={onResubmit} className="bg-blue-500 text-white">
              Ajukan Kembali
            </Button>
          )}
        </>
      }
    />
  );
};

export default DetailPermohonan;

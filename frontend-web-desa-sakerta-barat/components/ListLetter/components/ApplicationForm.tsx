import React, { useState, useEffect } from 'react';
import { fetchResidentData } from '../../../lib/actions/setting.actions';
import { useToast } from '../../ui/use-toast';
import EditPopup from '../../shared/EditPopup';
import { FileIcon } from 'lucide-react';
import {
  getDocumentTypeIndonesian,
  DocumentType,
} from '../../../lib/documentTypeUtils';
import { applicationValidationSchema } from '../../../lib/letterRequestUtils';
import { LetterType } from '../types/letterType.types';
import { toInputDateValue } from '../../BiodataDiri/utils/profileUtils';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  letterType: LetterType | null;
  onApply: (
    letterTypeId: number,
    notes: string,
    attachments: File[],
  ) => Promise<void>;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  isOpen,
  onClose,
  letterType,
  onApply,
}) => {
  const [residentData, setResidentData] = useState<any>(null);
  const [residentDocuments, setResidentDocuments] = useState<any[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchResidentData()
        .then((data) => {
          setResidentData(data.resident);
          setResidentDocuments(data.resident.documents || []);
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: 'Failed to load resident data',
            variant: 'destructive',
            duration: 1000,
          });
        });
    }
  }, [isOpen, toast]);

  const handleSubmit = async (
    data: Record<string, string | File | FileList>,
  ) => {
    if (!letterType) {
      console.error('No letter type selected');
      return;
    }

    try {
      const notes = (data.notes as string) || '';
      await onApply(letterType.id, notes, newAttachments);
      toast({
        title: 'Berhasil',
        description: 'Pengajuan surat berhasil dikirim',
        duration: 1000,
      });
      onClose();
      setNewAttachments([]);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Gagal',
        description: 'Pengajuan surat gagal. Silakan coba lagi.',
        variant: 'destructive',
        duration: 1000,
      });
    }
  };

  const handleNewAttachment = (files: FileList | null) => {
    if (files) {
      const validFiles = Array.from(files).filter(
        (file) => file.type === 'application/pdf',
      );
      if (validFiles.length !== files.length) {
        toast({
          title: 'Peringatan',
          description: 'Hanya file PDF yang diperbolehkan.',
          variant: 'warning',
          duration: 1000,
        });
      }
      setNewAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  const applicationFormFields = [
    {
      label: 'Nama',
      name: 'name',
      value: residentData?.name || '',
      required: true,
    },
    {
      label: 'NIK',
      name: 'nationalId',
      value: residentData?.nationalId || '',
      required: true,
    },
    {
      label: 'Alamat',
      name: 'address',
      value: residentData?.residentialAddress || '',
      required: true,
    },
    {
      label: 'Agama',
      name: 'religion',
      value: residentData?.religion,
      required: true,
    },
    {
      label: 'Status Pernikahan',
      name: 'maritalStatus',
      value: residentData?.maritalStatus,
      required: true,
    },
    {
      label: 'Pekerjaan',
      name: 'occupation',
      value: residentData?.occupation,
      required: true,
    },
    {
      label: 'Kewarganegaraan',
      name: 'nationality',
      value: residentData?.nationality,
      required: true,
    },
    {
      label: 'Tanggal Lahir',
      name: 'dateOfBirth',
      value: toInputDateValue(residentData?.dateOfBirth || ''),
      type: 'date',
      required: true,
    },
    {
      label: 'Tempat Lahir',
      name: 'placeOfBirth',
      value: residentData?.placeOfBirth,
      required: true,
    },
    {
      label: 'Jenis Kelamin',
      name: 'gender',
      value: residentData?.gender,
      required: true,
    },
    {
      label: 'Nomor Kartu Keluarga',
      name: 'familyCardNumber',
      value: residentData?.familyCardNumber,
      required: true,
    },
    {
      label: 'Kecamatan',
      name: 'district',
      value: residentData?.district,
      required: true,
    },
    {
      label: 'Kabupaten',
      name: 'regency',
      value: residentData?.regency,
      required: true,
    },
    {
      label: 'Provinsi',
      name: 'province',
      value: residentData?.province,
      required: true,
    },
    {
      label: 'Kode Pos',
      name: 'postalCode',
      value: residentData?.postalCode,
      required: true,
    },
    { label: 'RT', name: 'rt', value: residentData?.rt, required: true },
    { label: 'RW', name: 'rw', value: residentData?.rw, required: true },
    {
      label: 'Alamat KTP',
      name: 'idCardAddress',
      value: residentData?.idCardAddress,
      type: 'textarea',
      required: true,
    },
    {
      label: 'Alamat Domisili',
      name: 'residentialAddress',
      value: residentData?.residentialAddress,
      type: 'textarea',
      required: true,
    },
    { label: 'Catatan', name: 'notes', value: '', type: 'textarea' },
    {
      label: 'Dokumen Penduduk',
      name: 'residentDocuments',
      value: '',
      type: 'custom',
      render: () => (
        <div className="grid grid-cols-2 gap-2 w-full">
          {residentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center p-2 input-form rounded-md w-full"
            >
              <FileIcon className="mr-2 h-5 w-5 text-blue-500" />
              <span className="flex-grow">
                {getDocumentTypeIndonesian(doc.type as DocumentType)}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      label: 'Lampiran Tambahan',
      name: 'newAttachments',
      value: '',
      type: 'file',
      required: false,
      multiple: true,
      accept: '.pdf',
    },
  ];

  return (
    <EditPopup
      title={`Pengajuan Surat ${letterType?.name || ''}`}
      fields={applicationFormFields}
      onSave={handleSubmit}
      validationSchema={applicationValidationSchema}
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setNewAttachments([]);
      }}
      labelSubmit={'Ajukan'}
      viewMode={false}
      onFileChange={handleNewAttachment}
      additionalContent={
        newAttachments.length > 0 && (
          <div className="mt-4">
            <h4 className="glassy-label">Lampiran Baru</h4>
            <div className="space-y-2">
              {newAttachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 input-form rounded-md"
                >
                  <FileIcon className="mr-2 h-5 w-5 text-blue-500" />
                  <span className="flex-grow">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }
    />
  );
};

export default ApplicationForm;

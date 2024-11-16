import React, { useState, useEffect } from 'react';
import { FileIcon, Plus, X } from 'lucide-react';
import { fetchResidentData } from '../../../lib/actions/setting.actions';
import { useToast } from '../../ui/use-toast';
import EditPopup from '../../shared/EditPopup';
import {
  getDocumentTypeIndonesian,
  DocumentType,
} from '../../../lib/documentTypeUtils';
import { applicationValidationSchema } from '../../../lib/letterRequestUtils';
import { LetterType, SecondaryPartyData } from '../types/letterType.types';
import { toInputDateValue } from '../../Biodata/utils/profileUtils';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Label } from '../../ui/label';

interface ApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  letterType: LetterType | null;
  onApply: (
    letterTypeId: number,
    notes: string,
    attachments: File[],
    additionalResidents?: SecondaryPartyData,
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
  const [hasSecondaryParty, setHasSecondaryParty] = useState(false);
  const { toast } = useToast();

  const [secondaryPartyData, setSecondaryPartyData] =
    useState<SecondaryPartyData>({
      nama_lengkap2: '',
      nik2: '',
      tempat_lahir2: '',
      tanggal_lahir2: '',
      jenis_kelamin2: '',
      agama2: '',
      status2: '',
      pekerjaan2: '',
      wn2: 'WNI',
      alamat_lengkap2: '',
      binti2: '',
    });

  // Fetch resident data when form opens
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
            description: 'Gagal memuat data penduduk',
            variant: 'destructive',
            duration: 1000,
          });
        });
    }
  }, [isOpen, toast]);

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setHasSecondaryParty(false);
      setNewAttachments([]);
      setSecondaryPartyData({
        nama_lengkap2: '',
        nik2: '',
        tempat_lahir2: '',
        tanggal_lahir2: '',
        jenis_kelamin2: '',
        agama2: '',
        status2: '',
        pekerjaan2: '',
        wn2: 'WNI',
        alamat_lengkap2: '',
        binti2: '',
      });
    }
  }, [isOpen]);

  const handleSubmit = async (
    data: Record<string, string | File | FileList>,
  ) => {
    if (!letterType) {
      console.error('No letter type selected');
      return;
    }

    try {
      const notes = (data.notes as string) || '';
      const additionalResidents = hasSecondaryParty
        ? secondaryPartyData
        : undefined;

      await onApply(letterType.id, notes, newAttachments, additionalResidents);
      toast({
        title: 'Berhasil',
        description: 'Pengajuan surat berhasil dikirim',
        duration: 1000,
      });
      onClose();
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

  const handleSecondaryPartyChange =
    (field: keyof SecondaryPartyData) => (value: string) => {
      setSecondaryPartyData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  // Primary resident form fields
  const primaryResidentFields = [
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
      label: 'Alamat Lengkap',
      name: 'residentialAddress',
      value: `${residentData?.residentialAddress || ''}, RT ${residentData?.rt || ''}, RW ${residentData?.rw || ''}, ${residentData?.district || ''}, ${residentData?.regency || ''}, ${residentData?.province || ''} ${residentData?.postalCode || ''}`,
      type: 'textarea',
      required: true,
    },
    {
      label: 'Catatan',
      name: 'notes',
      value: '',
      type: 'textarea',
    },
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
              className="flex items-center p-2 border rounded-md"
            >
              <FileIcon className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">
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

  // Secondary party form fields
  const secondaryPartyFields = [
    {
      label: 'Nama Lengkap',
      name: 'nama_lengkap2',
      value: secondaryPartyData.nama_lengkap2,
      required: true,
      onChange: handleSecondaryPartyChange('nama_lengkap2'),
    },
    {
      label: 'Binti/Bin',
      name: 'binti2',
      value: secondaryPartyData.binti2,
      required: true,
      onChange: handleSecondaryPartyChange('binti2'),
    },
    {
      label: 'NIK',
      name: 'nik2',
      value: secondaryPartyData.nik2,
      required: true,
      onChange: handleSecondaryPartyChange('nik2'),
    },
    {
      label: 'Tempat Lahir',
      name: 'tempat_lahir2',
      value: secondaryPartyData.tempat_lahir2,
      required: true,
      onChange: handleSecondaryPartyChange('tempat_lahir2'),
    },
    {
      label: 'Tanggal Lahir',
      name: 'tanggal_lahir2',
      type: 'date',
      value: secondaryPartyData.tanggal_lahir2,
      required: true,
      onChange: handleSecondaryPartyChange('tanggal_lahir2'),
    },
    {
      label: 'Jenis Kelamin',
      name: 'jenis_kelamin2',
      type: 'select',
      value: secondaryPartyData.jenis_kelamin2,
      required: true,
      options: [
        { value: 'LAKI_LAKI', label: 'Laki-laki' },
        { value: 'PEREMPUAN', label: 'Perempuan' },
      ],
      onChange: handleSecondaryPartyChange('jenis_kelamin2'),
    },
    {
      label: 'Agama',
      name: 'agama2',
      type: 'select',
      value: secondaryPartyData.agama2,
      required: true,
      options: [
        { value: 'ISLAM', label: 'Islam' },
        { value: 'KRISTEN', label: 'Kristen' },
        { value: 'KATOLIK', label: 'Katolik' },
        { value: 'HINDU', label: 'Hindu' },
        { value: 'BUDDHA', label: 'Buddha' },
        { value: 'KONGHUCU', label: 'Konghucu' },
      ],
      onChange: handleSecondaryPartyChange('agama2'),
    },
    {
      label: 'Status Pernikahan',
      name: 'status2',
      type: 'select',
      value: secondaryPartyData.status2,
      required: true,
      options: [
        { value: 'BELUM_KAWIN', label: 'Belum Kawin' },
        { value: 'KAWIN', label: 'Kawin' },
        { value: 'CERAI_HIDUP', label: 'Cerai Hidup' },
        { value: 'CERAI_MATI', label: 'Cerai Mati' },
      ],
      onChange: handleSecondaryPartyChange('status2'),
    },
    {
      label: 'Pekerjaan',
      name: 'pekerjaan2',
      value: secondaryPartyData.pekerjaan2,
      required: true,
      onChange: handleSecondaryPartyChange('pekerjaan2'),
    },
    {
      label: 'Kewarganegaraan',
      name: 'wn2',
      type: 'select',
      value: secondaryPartyData.wn2,
      required: true,
      options: [
        { value: 'WNI', label: 'WNI' },
        { value: 'WNA', label: 'WNA' },
      ],
      onChange: handleSecondaryPartyChange('wn2'),
    },
    {
      label: 'Alamat Lengkap',
      name: 'alamat_lengkap2',
      type: 'textarea',
      value: secondaryPartyData.alamat_lengkap2,
      required: true,
      onChange: handleSecondaryPartyChange('alamat_lengkap2'),
    },
  ];

  return (
    <EditPopup
      title={`Pengajuan Surat ${letterType?.name || ''}`}
      fields={primaryResidentFields}
      onSave={handleSubmit}
      validationSchema={applicationValidationSchema}
      isOpen={isOpen}
      onClose={onClose}
      labelSubmit="Ajukan"
      viewMode={false}
      onFileChange={handleNewAttachment}
      additionalContent={
        <div className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Data Pihak Kedua</h3>
            <Button
              type="button"
              variant={hasSecondaryParty ? 'destructive' : 'default'}
              onClick={() => setHasSecondaryParty(!hasSecondaryParty)}
              className="flex items-center gap-2"
            >
              {hasSecondaryParty ? (
                <>
                  <X className="w-4 h-4" />
                  Hapus
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Tambah
                </>
              )}
            </Button>
          </div>

          {hasSecondaryParty && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {secondaryPartyFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label
                      htmlFor={field.name}
                      className="glassy-label text-left text-sm sm:text-base"
                    >
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.type === "select" ? (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full input-form">
                          <SelectValue placeholder={`Pilih ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        required={field.required}
                        className="w-full input-form"
                      />
                    ) : (
                      <Input
                        type={field.type || "text"}
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        required={field.required}
                        className="w-full input-form"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
              )}

              {newAttachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Lampiran Baru</h4>
                  <div className="space-y-2">
                    {newAttachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 border rounded-md"
                      >
                        <FileIcon className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewAttachments((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                          className="ml-auto text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          }
          />
          );
          };

          export default ApplicationForm;

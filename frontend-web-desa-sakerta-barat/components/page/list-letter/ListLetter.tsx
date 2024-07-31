'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  fetchLetterType,
  createLetterType,
  updateLetterType,
  deleteLetterType,
} from '../../../lib/actions/list-letter.action';
import LoadingSpinner from '../../shared/LoadingSpinner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  CirclePlus,
  Search,
  ArrowUpAZ,
  ArrowDownAZ,
  FileIcon,
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrashCan,
  faEye,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import LetterTypeForm from '../../shared/LetterTypeForm';
import { useToast } from '@/components/ui/use-toast';
import debounce from 'lodash/debounce';
import { useUser } from '../../../app/context/UserContext';
import CustomAlert from '../../shared/CustomAlert';
import CustomAlertDialog from '../../shared/CustomAlertDialog';
import { fetchResidentData } from '../../../lib/actions/setting.actions';
import EditPopup from '../../shared/EditPopup';
import { applicationValidationSchema } from '../../../lib/letterRequestUtils';
import {
  DocumentType,
  getDocumentTypeIndonesian,
} from '../../../lib/documentTypeUtils';
import { applyLetter } from '../../../lib/actions/letterRequest.action';

const ListLetter: React.FC<ListLetterProps> = ({ categoryId }) => {
  const { user } = useUser();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [letterTypeData, setLetterTypeData] = useState<LetterTypeProps[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLetterTypeId, setSelectedLetterTypeId] = useState<
    number | null
  >(null);
  const [isApplicationFormOpen, setIsApplicationFormOpen] = useState(false);
  const [residentData, setResidentData] = useState<any>(null);
  const [residentDocuments, setResidentDocuments] = useState<any[]>([]);
  const [newAttachments, setNewAttachments] = useState<File[]>([]);
  const [currentLetterType, setCurrentLetterType] =
    useState<LetterTypeProps | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState(false);
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertData, setAlertData] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const loadLetterTypeData = useCallback(async () => {
    setIsContentLoading(true);
    setError(null);
    try {
      const data = await fetchLetterType({
        categoryId,
        search,
        sortBy,
        sortOrder,
      });
      setLetterTypeData(data);
    } catch (err) {
      setError('Failed to load letter type data');
      toast({
        title: 'Error',
        description: 'Failed to load letter types',
        variant: 'destructive',
      });
    } finally {
      setIsContentLoading(false);
      setIsInitialLoading(false);
    }
  }, [categoryId, search, sortBy, sortOrder, toast]);

  const debouncedLoadLetterTypeData = useCallback(
    debounce(loadLetterTypeData, 300),
    [loadLetterTypeData],
  );

  useEffect(() => {
    loadLetterTypeData();
  }, [categoryId, sortBy, sortOrder]);

  useEffect(() => {
    debouncedLoadLetterTypeData();
  }, [search]);

  useEffect(() => {
    if (selectedLetterTypeId !== null) {
      const selectedType = letterTypeData.find(
        (lt) => lt.id === selectedLetterTypeId,
      );

      setCurrentLetterType(selectedType || null);
      setIsFormOpen(true);
    }
  }, [selectedLetterTypeId, letterTypeData]);

  const handleAddEdit = async (data: any) => {
    data.categoryId = Number(categoryId);
    try {
      if (currentLetterType) {
        await updateLetterType(currentLetterType.id, data);
        toast({
          title: 'Berhasil',
          description: 'Tipe surat berhasil diperbaharui',
        });
      } else {
        await createLetterType(data);
        toast({
          title: 'Berhasil',
          description: 'Tipe surat berhasil ditambahkan',
        });
      }
      setIsFormOpen(false);
      setSelectedLetterTypeId(null);
      loadLetterTypeData();
    } catch (err) {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal disimpan',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLetterType(id);
      toast({
        title: 'Berhasil',
        description: 'Tipe surat berhasil dihapus',
      });
      loadLetterTypeData();
    } catch (err) {
      toast({
        title: 'Gagal',
        description: 'Tipe surat gagal dihapus',
        variant: 'destructive',
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSort = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const openEditForm = (letterType: LetterTypeProps) => {
    setSelectedLetterTypeId(letterType.id);
    setViewMode(false);
  };

  const handleApplyLetter = async (letterType: LetterTypeProps) => {
    setCurrentLetterType(letterType);
    try {
      const data = await fetchResidentData();
      setResidentData(data.resident);
      setResidentDocuments(data.resident.documents || []);
      setIsApplicationFormOpen(true);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to load resident data',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitApplication = async (
    data: Record<string, string | File | FileList>,
  ) => {
    if (!currentLetterType) {
      toast({
        title: 'Error',
        description: 'No letter type selected',
        variant: 'destructive',
      });
      return;
    }

    try {
      const letterTypeId = currentLetterType.id;
      const notes = (data.notes as string) || '';

      // Use the state for newAttachments instead of parsing from form data
      await applyLetter(letterTypeId, notes, newAttachments);

      toast({
        title: 'Berhasil',
        description: 'Pengajuan surat berhasil dikirim',
      });
      setIsApplicationFormOpen(false);
      setNewAttachments([]);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Gagal',
        description: 'Pengajuan surat gagal. Silakan coba lagi.',
        variant: 'destructive',
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
    {
      label: 'RT',
      name: 'rt',
      value: residentData?.rt,
      required: true,
    },
    {
      label: 'RW',
      name: 'rw',
      value: residentData?.rw,
      required: true,
    },
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
              className="flex items-center  p-2 input-form rounded-md w-full"
            >
              <FileIcon className="mr-2 h-5 w-5 text-blue-500" />{' '}
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

  const openViewForm = (letterType: LetterTypeProps) => {
    if (user?.role === 'WARGA') {
      const requirements = letterType.requirements
        ? JSON.parse(letterType.requirements)
        : [];
      const requirementsString = requirements.join(', ');
      setAlertData({
        title: 'Informasi Persyaratan',
        description: `Untuk membuat ${letterType.name}, Anda perlu menyiapkan: ${requirementsString}.`,
      });
      setIsAlertOpen(true);
    } else {
      setSelectedLetterTypeId(letterType.id);
      setViewMode(true);
    }
  };

  const openAddForm = () => {
    setSelectedLetterTypeId(null);
    setCurrentLetterType(null);
    setIsFormOpen(true);
  };

  const renderLetterTypeCard = (letterType: LetterTypeProps) => (
    <Card
      key={letterType.id}
      className={`flex flex-col  relative  ${letterType.icon ? 'h-96' : 'h-44'}`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-black-2">
          {letterType.name}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`relative ${letterType.icon ? 'grow ' : 'flex-none'}`}
      >
        {letterType.icon && (
          <div className="h-40 mb-4 rounded-lg overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src={`http://localhost:3001${letterType.icon}`}
                layout="fill"
                objectFit="cover"
                alt={letterType.name}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
        <CardDescription className="text-[#A3AED0]">
          {letterType.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end gap-3 relative">
        {user?.role !== 'WARGA' ? (
          <>
            <Button
              className="bg-delete hover:bg-red-600 h-8 w-8 rounded-full p-0"
              title="Hapus"
              onClick={() => handleDelete(letterType.id)}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faTrashCan}
              />
            </Button>
            <Button
              className="bg-edit hover:bg-yellow-500 h-8 w-8 rounded-full p-0"
              title="Edit"
              onClick={() => openEditForm(letterType)}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPenToSquare}
              />
            </Button>
            <Button
              className="bg-view hover:bg-blue-500 h-8 w-8 rounded-full p-0"
              title="Lihat"
              onClick={() => openViewForm(letterType)}
            >
              <FontAwesomeIcon className="h-4 w-4 text-white" icon={faEye} />
            </Button>
          </>
        ) : (
          <>
            <Button
              className="bg-view hover:bg-blue-500 h-8 w-8 rounded-full p-0"
              title="Lihat"
              onClick={() => openViewForm(letterType)}
            >
              <FontAwesomeIcon className="h-4 w-4 text-white" icon={faEye} />
            </Button>
            <Button
              className="bg-edit hover:bg-yellow-500 h-8 w-8 rounded-full p-0"
              title="Ajukan"
              onClick={() => handleApplyLetter(letterType)}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPaperPlane}
              />
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );

  if (isInitialLoading) return <LoadingSpinner />;

  return (
    <div>
      <div
        className={`flex items-center mb-4 ${user?.role !== 'WARGA' ? 'justify-between' : 'justify-end'}`}
      >
        {user?.role != 'WARGA' && (
          <Button
            className="bg-bank-gradient h-8 shadow-sm text-white"
            onClick={openAddForm}
          >
            Tambah <CirclePlus className="h-4 w-4 ml-2 text-white" />
          </Button>
        )}

        <div className=" shadow-card rounded-full">
          <div className="flex gap-2 items-center ">
            <div className="flex-grow max-w-md mx-2 md:block py-2 px-0 text-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8F9BBA] h-5" />
                <input
                  type="text"
                  placeholder="Cari disini..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 rounded-full h-8 text-[#8F9BBA] bg-[#F4F7FE] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mr-4">
              <Button onClick={handleSort} className="focus:outline-none">
                {sortOrder === 'asc' ? (
                  <ArrowUpAZ className="text-[#8F9BBA] cursor-pointer h-6" />
                ) : (
                  <ArrowDownAZ className="text-[#8F9BBA] cursor-pointer h-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isContentLoading ? (
        <div className="flex justify-center items-center h-64 relative">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="grid grid-cols-1 gap-6">
            {letterTypeData
              .slice(0, Math.ceil(letterTypeData.length / 2))
              .map(renderLetterTypeCard)}
          </div>
          <div className="grid grid-cols-1 gap-6">
            {letterTypeData
              .slice(Math.ceil(letterTypeData.length / 2))
              .map(renderLetterTypeCard)}
          </div>
        </div>
      )}
      {alertData && (
        <CustomAlertDialog
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          title={alertData.title}
          description={alertData.description}
        />
      )}
      <LetterTypeForm
        key={currentLetterType ? currentLetterType.id : 'new'}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedLetterTypeId(null);
          setCurrentLetterType(null);
          setViewMode(false);
        }}
        onSubmit={handleAddEdit}
        initialData={currentLetterType}
        viewMode={viewMode}
      />

      <EditPopup
        title={`Pengajuan Surat ${currentLetterType?.name || ''}`}
        fields={applicationFormFields}
        onSave={handleSubmitApplication}
        validationSchema={applicationValidationSchema}
        isOpen={isApplicationFormOpen}
        onClose={() => {
          setIsApplicationFormOpen(false);
          setNewAttachments([]);
        }}
        viewMode={false}
        onFileChange={handleNewAttachment}
        additionalContent={
          newAttachments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Lampiran Baru:</h4>
              <ul className="list-disc list-inside">
                {newAttachments.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )
        }
      />
    </div>
  );
};

export default ListLetter;

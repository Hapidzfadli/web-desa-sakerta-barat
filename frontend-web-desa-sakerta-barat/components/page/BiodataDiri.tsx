import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  fetchResidentData,
  saveResidentData,
  saveProfileData,
  saveProfilePicture,
  getAvatar,
  getDocumentFile,
  deleteDocument,
  updateDocument,
  addDocument,
} from '../../lib/actions/setting.actions';
import EditPopup from '../shared/EditPopup';
import EditImageDialog from '../shared/EditImageDialog';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import { useToast } from '../ui/use-toast';
import { formatDate, toInputDateValue } from '../../lib/utils';
import {
  updateProfileSchema,
  updateResidentSchema,
  addDocumentSchema,
} from '../../lib/settingUtils';
import LoadingSpinner from '../shared/LoadingSpinner';
import { PlusCircle, FileIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrashCan,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {
  DocumentType,
  getDocumentTypeIndonesian,
} from '../../lib/documentTypeUtils';

const BiodataDiri = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isResidentPopupOpen, setIsResidentPopupOpen] = useState(false);
  const [isAddDocumentPopupOpen, setIsAddDocumentPopupOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(
    null,
  );
  const { toast } = useToast();

  const documentTypeOptions = useMemo(
    () =>
      Object.values(DocumentType).map((type) => ({
        value: type,
        label: getDocumentTypeIndonesian(type),
      })),
    [],
  );

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchResidentData();
        setProfileData(data);
        if (data.profilePicture) {
          const avatarUrl = await getAvatar(data.profilePicture);
          setAvatarUrl(avatarUrl);
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!profileData) return <div>Tidak ada data profile</div>;

  const handleSaveProfile = async (
    data: Record<string, string>,
    errors?: Record<string, string>,
  ) => {
    if (errors) {
      const errorMessage = Object.values(errors).join(', ');
      toast({
        variant: 'destructive',
        title: 'Kesalahan Validasi',
        description: errorMessage,
      });
      return;
    }

    try {
      const validatedData = updateProfileSchema.parse(data);
      const savedData = await saveProfileData(validatedData);
      setProfileData((prevData: profileData) => ({
        ...prevData,
        ...savedData,
      }));
      setIsProfilePopupOpen(false);
      toast({
        title: 'Berhasil',
        description: 'Profil berhasil diperbarui',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description:
          'Gagal menyimpan data profil. Silakan periksa input Anda dan coba lagi.',
      });
    }
  };

  const handleSaveResident = async (
    data: Record<string, string>,
    errors?: Record<string, string>,
  ) => {
    if (errors) {
      const errorMessage = Object.values(errors).join(', ');
      toast({
        variant: 'destructive',
        title: 'Kesalahan Validasi',
        description: errorMessage,
      });
      return;
    }

    try {
      const processedData = {
        ...data,
        rt: data.rt ? Number(data.rt) : undefined,
        rw: data.rw ? Number(data.rw) : undefined,
      };
      const validatedData = updateResidentSchema.parse(processedData);
      const savedData = await saveResidentData(validatedData);
      setProfileData((prevData) => ({
        ...prevData,
        resident: { ...prevData.resident, ...savedData },
      }));
      setIsResidentPopupOpen(false);
      toast({
        title: 'Berhasil',
        description: 'Data penduduk berhasil disimpan',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description:
          'Gagal menyimpan data penduduk. Silakan periksa input Anda dan coba lagi.',
      });
    }
  };

  const handleSaveAvatar = async (file: File) => {
    try {
      const data = await saveProfilePicture(file);
      setProfileData((prevData) => ({
        ...prevData,
        profilePicture: data?.profilePicture,
      }));

      if (data?.profilePicture) {
        const newAvatarUrl = await getAvatar(data.profilePicture);
        setAvatarUrl(newAvatarUrl);
      }

      toast({
        title: 'Berhasil',
        description: 'Avatar berhasil diperbarui',
      });
    } catch (error) {
      console.error('Update avatar error:', error);
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description:
          error instanceof Error
            ? error.message
            : 'Gagal memperbarui avatar. Silakan coba lagi.',
      });
    }
  };

  const handleDeleteDocument = (documentId: number) => {
    setDocumentToDelete(documentId);
    setIsDeleteDialogOpen(true);
  };

  const handleEditDocument = (documentId: number) => {
    setEditingDocumentId(documentId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && editingDocumentId) {
      try {
        const documentToEdit = profileData.resident.documents.find(
          (doc) => doc.id === editingDocumentId,
        );
        if (!documentToEdit) {
          throw new Error('Document not found');
        }
        const updatedDoc = await updateDocument(
          editingDocumentId,
          file,
          documentToEdit.type,
        );
        setProfileData((prevData) => ({
          ...prevData,
          resident: {
            ...prevData.resident,
            documents: prevData.resident.documents.map((doc) =>
              doc.id === editingDocumentId ? updatedDoc : doc,
            ),
          },
        }));
        toast({
          title: 'Success',
          description: 'Document updated successfully',
        });
      } catch (error) {
        console.error('Error updating document:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description:
            error instanceof Error
              ? error.message
              : 'Failed to update document. Please try again.',
        });
      } finally {
        setEditingDocumentId(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleAddDocument = async (
    data: Record<string, string | File>,
    errors?: Record<string, string>,
  ) => {
    if (errors) {
      const errorMessage = Object.values(errors).join(', ');
      toast({
        variant: 'destructive',
        title: 'Kesalahan Validasi',
        description: errorMessage,
      });
      return;
    }

    const file = data.file as File;
    const type = data.type as DocumentType;

    if (!file || !(file instanceof File)) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Silakan pilih file untuk diunggah.',
      });
      return;
    }

    try {
      const newDocument = await addDocument(file, type);
      if (newDocument && newDocument.id) {
        setProfileData((prevData) => ({
          ...prevData,
          resident: {
            ...prevData.resident,
            documents: [...(prevData.resident?.documents || []), newDocument],
          },
        }));
        setIsAddDocumentPopupOpen(false);
        toast({
          title: 'Berhasil',
          description: 'Dokumen berhasil ditambahkan',
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Gagal menambahkan dokumen. Silakan coba lagi.',
      });
    }
  };

  const confirmDeleteDocument = async () => {
    if (documentToDelete) {
      try {
        await deleteDocument(documentToDelete);
        setProfileData((prevData) => ({
          ...prevData,
          resident: {
            ...prevData.resident,
            documents: prevData.resident.documents.filter(
              (doc) => doc.id !== documentToDelete,
            ),
          },
        }));
        toast({
          title: 'Berhasil',
          description: 'Dokumen berhasil dihapus',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Kesalahan',
          description: 'Gagal menghapus dokumen. Silakan coba lagi.',
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setDocumentToDelete(null);
      }
    }
  };

  const handleViewDocument = async (documentId: number) => {
    try {
      const blob = await getDocumentFile(documentId);
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

  return (
    <div className="p-4 space-y-8">
      <Card>
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <EditImageDialog
              currentAvatar={
                avatarUrl ||
                `https://api.dicebear.com/6.x/avataaars/svg?seed=${profileData?.username}`
              }
              username={profileData?.username}
              label="Foto Profile"
              onSave={handleSaveAvatar}
            />
            <div>
              <h2 className="text-xl font-semibold">{profileData.username}</h2>
              <p className="text-sm text-gray-500">
                Last updated: {new Date(profileData.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <Button
            className="bg-edit h-8 w-8 rounded-full p-0"
            title="Edit"
            onClick={() => setIsProfilePopupOpen(true)}
          >
            <FontAwesomeIcon
              className="h-4 w-4 text-white"
              icon={faPenToSquare}
            />
          </Button>
        </div>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Nama Depan', field: 'firstName' },
              { label: 'Nama Belakang', field: 'lastName' },
              { label: 'Nama Lengkap', field: 'name' },
              { label: 'Role', field: 'role' },
              { label: 'Email', field: 'email' },
              { label: 'Nomor HP', field: 'phoneNumber' },
              { label: 'Status', field: 'isVerified' },
            ].map((item) => (
              <div key={item.field}>
                <p className="label-form">{item.label}</p>
                <p>
                  {item.field === 'isVerified'
                    ? profileData[item.field]
                      ? 'Terverifikasi'
                      : 'Belum terverifikasi'
                    : profileData[item.field] !== undefined
                      ? String(profileData[item.field])
                      : 'Not provided'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="head-form ">Biodata Penduduk</CardTitle>
            <Button
              className="bg-edit h-8 w-8 rounded-full p-0"
              title="Edit"
              onClick={() => setIsResidentPopupOpen(true)}
            >
              <FontAwesomeIcon
                className="h-4 w-4 text-white"
                icon={faPenToSquare}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { label: 'Nama Lengkap', field: 'name' },
              { label: 'NIK', field: 'nationalId' },
              {
                label: 'Tanggal Lahir',
                field: 'dateOfBirth',
                format: (value: string) => formatDate(value),
              },
              { label: 'Agama', field: 'religion' },
              { label: 'Status Pernikahan', field: 'maritalStatus' },
              { label: 'Pekerjaan', field: 'occupation' },
              { label: 'Kewarganegaraan', field: 'nationality' },
              { label: 'Tempat Lahir', field: 'placeOfBirth' },
              { label: 'Jenis Kelamin', field: 'gender' },
              { label: 'Nomor Kartu Keluarga', field: 'familyCardNumber' },
              { label: 'Kecamatan', field: 'district' },
              { label: 'Kabupaten', field: 'regency' },
              { label: 'Provinsi', field: 'province' },
              { label: 'Kode Pos', field: 'postalCode' },
              { label: 'RT', field: 'rt' },
              { label: 'RW', field: 'rw' },
              { label: 'Alamat KTP', field: 'idCardAddress' },
              { label: 'Alamat Domisili', field: 'residentialAddress' },
            ].map((item) => (
              <div key={item.field}>
                <p className="label-form">{item.label}</p>
                <p>
                  {item.format
                    ? item.format(profileData.resident?.[item.field])
                    : profileData.resident?.[item.field] || 'Not provided'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="head-form">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {profileData.resident?.documents?.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center p-2 input-form rounded-md"
              >
                <FileIcon className="mr-2 h-5 w-5 text-blue-500" />
                <span className="flex-grow">
                  {getDocumentTypeIndonesian(doc.type as DocumentType)}
                </span>

                <div className="flex gap-2">
                  <Button
                    className="bg-edit h-6 w-6 rounded-full p-0"
                    title="Edit"
                    onClick={() => handleEditDocument(doc.id)}
                  >
                    <FontAwesomeIcon
                      className="h-3 w-3 text-white"
                      icon={faPenToSquare}
                    />
                  </Button>
                  <Button
                    className="bg-delete h-6 w-6 rounded-full p-0"
                    title="Delete"
                    onClick={() => {
                      handleDeleteDocument(doc.id);
                    }}
                  >
                    <FontAwesomeIcon
                      className="h-3 w-3 text-white"
                      icon={faTrashCan}
                    />
                  </Button>
                  <Button
                    className="bg-view h-6 w-6 rounded-full p-0"
                    title="Lihat"
                    onClick={() => {
                      handleViewDocument(doc.id);
                    }}
                  >
                    <FontAwesomeIcon
                      className="h-3 w-3 text-white"
                      icon={faEye}
                    />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="mt-4 ml-0 p-2 w-49 text-[#A3AED0] flex items-center justify-start"
            onClick={() => setIsAddDocumentPopupOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4 bg-blue-500 text-blue-100 rounded-full" />
            Tambah Dokumen
          </Button>
        </CardContent>
      </Card>

      <EditPopup
        title="Edit Profile"
        fields={[
          { label: 'Nama Lengkap', name: 'name', value: profileData.name },
          {
            label: 'Nama Depan',
            name: 'firstName',
            value: profileData.firstName,
          },
          {
            label: 'Nama Belakang',
            name: 'lastName',
            value: profileData.lastName,
          },
          { label: 'Email', name: 'email', value: profileData.email },
          {
            label: 'Nomor Hp',
            name: 'phoneNumber',
            value: profileData.phoneNumber,
          },
        ]}
        onSave={handleSaveProfile}
        validationSchema={updateProfileSchema}
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
      />

      <EditPopup
        title="Edit Biodata Penduduk"
        fields={[
          {
            label: 'Nama Lengkap',
            name: 'name',
            value: profileData.resident?.name,
            required: true,
          },
          {
            label: 'NIK',
            name: 'nationalId',
            value: profileData.resident?.nationalId,
            required: true,
          },
          {
            label: 'Tanggal Lahir',
            name: 'dateOfBirth',
            value: profileData.resident?.dateOfBirth
              ? toInputDateValue(profileData.resident.dateOfBirth)
              : '',
            type: 'date',
            required: true,
          },
          {
            label: 'Agama',
            name: 'religion',
            value: profileData.resident?.religion,
            required: true,
          },
          {
            label: 'Status Pernikahan',
            name: 'maritalStatus',
            value: profileData.resident?.maritalStatus,
            required: true,
          },
          {
            label: 'Pekerjaan',
            name: 'occupation',
            value: profileData.resident?.occupation,
            required: true,
          },
          {
            label: 'Kewarganegaraan',
            name: 'nationality',
            value: profileData.resident?.nationality,
            required: true,
          },
          {
            label: 'Tempat Lahir',
            name: 'placeOfBirth',
            value: profileData.resident?.placeOfBirth,
            required: true,
          },
          {
            label: 'Jenis Kelamin',
            name: 'gender',
            value: profileData.resident?.gender,
            required: true,
          },
          {
            label: 'Nomor Kartu Keluarga',
            name: 'familyCardNumber',
            value: profileData.resident?.familyCardNumber,
            required: true,
          },
          {
            label: 'Kecamatan',
            name: 'district',
            value: profileData.resident?.district,
            required: true,
          },
          {
            label: 'Kabupaten',
            name: 'regency',
            value: profileData.resident?.regency,
            required: true,
          },
          {
            label: 'Provinsi',
            name: 'province',
            value: profileData.resident?.province,
            required: true,
          },
          {
            label: 'Kode Pos',
            name: 'postalCode',
            value: profileData.resident?.postalCode,
            required: true,
          },
          {
            label: 'RT',
            name: 'rt',
            value: profileData.resident?.rt,
            required: true,
          },
          {
            label: 'RW',
            name: 'rw',
            value: profileData.resident?.rw,
            required: true,
          },
          {
            label: 'Alamat KTP',
            name: 'idCardAddress',
            value: profileData.resident?.idCardAddress,
            type: 'textarea',
            required: true,
          },
          {
            label: 'Alamat Domisili',
            name: 'residentialAddress',
            value: profileData.resident?.residentialAddress,
            type: 'textarea',
            required: true,
          },
        ]}
        onSave={handleSaveResident}
        validationSchema={updateResidentSchema}
        isOpen={isResidentPopupOpen}
        onClose={() => setIsResidentPopupOpen(false)}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf"
      />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteDocument}
        title="Konfirmasi Hapus"
        description="Apakah kamu yakin ingin menghapus dokument"
        confirmText="Hapus"
        cancelText="Kembali"
      />

      <EditPopup
        title="Tambah Dokumen"
        fields={[
          {
            label: 'Tipe Dokumen',
            name: 'type',
            value: '',
            type: 'select',
            options: documentTypeOptions,
            required: true,
          },
          {
            label: 'File',
            name: 'file',
            value: '',
            type: 'file',
            required: true,
          },
        ]}
        onSave={handleAddDocument}
        validationSchema={addDocumentSchema}
        isOpen={isAddDocumentPopupOpen}
        onClose={() => setIsAddDocumentPopupOpen(false)}
      />
    </div>
  );
};

export default BiodataDiri;

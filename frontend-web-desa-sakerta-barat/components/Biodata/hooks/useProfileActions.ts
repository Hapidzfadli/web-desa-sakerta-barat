import { useToast } from '../../ui/use-toast';
import {
  saveProfileData,
  saveResidentData,
  saveProfilePicture,
  addDocument,
  uploadSignature,
} from '../../../lib/actions/setting.actions';
import { DocumentType, ProfileData } from '../types/profile.types';
import {
  updateProfileSchema,
  updateResidentSchema,
  addDocumentSchema,
} from '../utils/profileUtils';

export const useProfileActions = (
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData | null>>,
) => {
  const { toast } = useToast();

  const handleSaveProfile = async (data: Record<string, string>) => {
    try {
      const validatedData = updateProfileSchema.parse(data);
      const savedData = await saveProfileData(validatedData);
      setProfileData((prevData) => ({
        ...prevData!,
        ...savedData,
      }));
      toast({
        title: 'Berhasil',
        description: 'Profil berhasil diperbarui',
      });
      return savedData;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description:
          'Gagal menyimpan data profil. Silakan periksa input Anda dan coba lagi.',
      });
      throw error;
    }
  };

  const handleSaveResident = async (data: Record<string, string>) => {
    try {
      const processedData = {
        ...data,
        rt: data.rt ? Number(data.rt) : undefined,
        rw: data.rw ? Number(data.rw) : undefined,
      };
      const validatedData = updateResidentSchema.parse(processedData);
      const savedData = await saveResidentData(validatedData);
      setProfileData((prevData) => ({
        ...prevData!,
        resident: {
          ...prevData!.resident,
          ...savedData,
        },
      }));
      toast({
        title: 'Berhasil',
        description: 'Data penduduk berhasil disimpan',
      });
      return savedData;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description:
          'Gagal menyimpan data penduduk. Silakan periksa input Anda dan coba lagi.',
      });
      throw error;
    }
  };

  const handleSaveAvatar = async (file: File) => {
    try {
      const data = await saveProfilePicture(file);
      toast({
        title: 'Berhasil',
        description: 'Avatar berhasil diperbarui',
      });
      return data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Gagal memperbarui avatar. Silakan coba lagi.',
      });
      throw error;
    }
  };

  const handleAddDocument = async (data: Record<string, string | File>) => {
    try {
      const validatedData = addDocumentSchema.parse(data);
      const newDocument = await addDocument(
        validatedData.file as File,
        validatedData.type as DocumentType,
      );
      toast({
        title: 'Berhasil',
        description: 'Dokumen berhasil ditambahkan',
      });
      return newDocument;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description: 'Gagal menambahkan dokumen. Silakan coba lagi.',
      });
      throw error;
    }
  };

  const handleUploadSignature = async (file: File) => {
    try {
      const data = await uploadSignature(file);
      toast({
        title: 'Berhasil',
        description: 'Tanda tangan digital berhasil diunggah',
      });
      return data;
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Kesalahan',
        description:
          'Gagal mengunggah tanda tangan digital. Silakan coba lagi.',
      });
      throw error;
    }
  };

  return {
    handleSaveProfile,
    handleSaveResident,
    handleSaveAvatar,
    handleAddDocument,
    handleUploadSignature,
  };
};

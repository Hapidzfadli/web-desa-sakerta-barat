import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useUser } from '../../app/context/UserContext';
import {
  fetchResidentData,
  saveResidentData,
  saveProfileData,
  saveProfilePicture,
  getAvatar,
} from '../../lib/actions/setting.actions';
import EditPopup from '../shared/EditPopup';
import EditImageDialog from '../shared/EditImageDialog';
import { useToast } from '../ui/use-toast';
import { formatDate, toInputDateValue } from '../../lib/utils';
import {
  createResidentSchema,
  updateProfileSchema,
  updateResidentSchema,
} from '../../lib/settingUtils';
import LoadingSpinner from '../shared/LoadingSpinner';
import { PencilIcon } from 'lucide-react';

const BiodataDiri = () => {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isResidentPopupOpen, setIsResidentPopupOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchResidentData();
        setProfileData(data);
        // Load avatar
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
  if (!profileData) return <div>No profile data available</div>;

  const handleSaveProfile = async (
    data: Record<string, string>,
    errors?: Record<string, string>,
  ) => {
    if (errors) {
      const errorMessage = Object.values(errors).join(', ');
      toast({
        variant: 'destructive',
        title: 'Validation Error',
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
        title: 'Success',
        description: 'Profile data saved successfully',
      });
    } catch (error) {
      console.error('Save profile error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Failed to save profile data. Please check your input and try again.',
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
        title: 'Validation Error',
        description: errorMessage,
      });
      return;
    }

    try {
      const validatedData = updateResidentSchema.parse(data);
      const savedData = await saveResidentData(validatedData);
      setProfileData((prevData) => ({
        ...prevData,
        Resident: { ...prevData.Resident, ...savedData },
      }));
      setIsResidentPopupOpen(false);
      toast({
        title: 'Success',
        description: 'Resident data saved successfully',
      });
    } catch (error) {
      console.error('Save resident error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'Failed to save resident data. Please check your input and try again.',
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

      // Update avatar URL
      if (data?.profilePicture) {
        const newAvatarUrl = await getAvatar(data.profilePicture);
        setAvatarUrl(newAvatarUrl);
      }

      toast({
        title: 'Success',
        description: 'Avatar updated successfully',
      });
    } catch (error) {
      console.error('Update avatar error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update avatar. Please try again.',
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
            <PencilIcon className="h-4 w-4 text-white" />
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
              <PencilIcon className="h-4 w-4 text-white" />
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
          {profileData.Resident?.documents?.length > 0 ? (
            <ul>
              {profileData.Resident.documents.map((doc: any) => (
                <li key={doc.id}>
                  <p className="text-sm font-medium">{doc.type}</p>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Document
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents available</p>
          )}
        </CardContent>
      </Card>

      <EditPopup
        title="Edit Informasi Akun"
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
            value: profileData.Resident?.name,
            required: true,
          },
          {
            label: 'NIK',
            name: 'nationalId',
            value: profileData.Resident?.nationalId,
            required: true,
          },
          {
            label: 'Tanggal Lahir',
            name: 'dateOfBirth',
            value: profileData.Resident?.dateOfBirth
              ? toInputDateValue(profileData.Resident.dateOfBirth)
              : '',
            type: 'date',
            required: true,
          },
          {
            label: 'Agama',
            name: 'religion',
            value: profileData.Resident?.religion,
            required: true,
          },
          {
            label: 'Status Pernikahan',
            name: 'maritalStatus',
            value: profileData.Resident?.maritalStatus,
            required: true,
          },
          {
            label: 'Pekerjaan',
            name: 'occupation',
            value: profileData.Resident?.occupation,
            required: true,
          },
          {
            label: 'Kewarganegaraan',
            name: 'nationality',
            value: profileData.Resident?.nationality,
            required: true,
          },
          {
            label: 'Tempat Lahir',
            name: 'placeOfBirth',
            value: profileData.Resident?.placeOfBirth,
            required: true,
          },
          {
            label: 'Jenis Kelamin',
            name: 'gender',
            value: profileData.Resident?.gender,
            required: true,
          },
          {
            label: 'Nomor Kartu Keluarga',
            name: 'familyCardNumber',
            value: profileData.Resident?.familyCardNumber,
            required: true,
          },
          {
            label: 'Kecamatan',
            name: 'district',
            value: profileData.Resident?.district,
            required: true,
          },
          {
            label: 'Kabupaten',
            name: 'regency',
            value: profileData.Resident?.regency,
            required: true,
          },
          {
            label: 'Provinsi',
            name: 'province',
            value: profileData.Resident?.province,
            required: true,
          },
          {
            label: 'Kode Pos',
            name: 'postalCode',
            value: profileData.Resident?.postalCode,
            required: true,
          },
          {
            label: 'Alamat KTP',
            name: 'idCardAddress',
            value: profileData.Resident?.idCardAddress,
            type: 'textarea',
            required: true,
          },
          {
            label: 'Alamat Domisili',
            name: 'residentialAddress',
            value: profileData.Resident?.residentialAddress,
            type: 'textarea',
            required: true,
          },
        ]}
        onSave={handleSaveResident}
        validationSchema={updateResidentSchema}
        isOpen={isResidentPopupOpen}
        onClose={() => setIsResidentPopupOpen(false)}
      />
    </div>
  );
};

export default BiodataDiri;

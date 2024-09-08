import React, { useState, Suspense } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import EditImageDialog from '../shared/EditImageDialog';
import EditPopup from '../shared/EditPopup';
import { ProfileData } from './types/profile.types';
import { updateProfileSchema } from './utils/profileUtils';

interface ProfileCardProps {
  profileData: ProfileData;
  onSave: (data: Record<string, string>) => Promise<void>;
  onSaveAvatar: (file: File) => Promise<void>;
  isPopupOpen: boolean;
  setIsPopupOpen: (isOpen: boolean) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileData,
  onSave,
  onSaveAvatar,
  isPopupOpen,
  setIsPopupOpen,
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          <Suspense fallback={<div>Loading...</div>}>
            <EditImageDialog
              currentAvatar={
                profileData.avatarUrl ||
                `https://api.dicebear.com/6.x/avataaars/svg?seed=${profileData.username}`
              }
              username={profileData.username}
              label="Foto Profile"
              onSave={onSaveAvatar}
            />
          </Suspense>
          <div>
            <h2 className="text-xl text-[#2B3674] font-semibold">
              {profileData.username}
            </h2>
            <p className="text-sm text-gray-500">
              Last updated: {new Date(profileData.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <Button
          className="bg-edit h-8 w-8 rounded-full p-0"
          title="Edit"
          onClick={() => setIsPopupOpen(true)}
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
      <Suspense fallback={<div>Loading...</div>}>
        <EditPopup
          title="Edit Profile"
          fields={[
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
            { label: 'Nama Lengkap', name: 'name', value: profileData.name },
            { label: 'Email', name: 'email', value: profileData.email },
            {
              label: 'Nomor Hp',
              name: 'phoneNumber',
              value: profileData.phoneNumber,
            },
          ]}
          onSave={onSave}
          validationSchema={updateProfileSchema}
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      </Suspense>
    </Card>
  );
};

export default ProfileCard;

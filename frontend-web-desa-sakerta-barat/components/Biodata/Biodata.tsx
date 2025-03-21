import React, { useState } from 'react';
import { useProfileData } from './hooks/useProfileData';
import { useProfileActions } from './hooks/useProfileActions';
import ProfileCard from './ProfileCard';
import ResidentCard from './ResidentCard';
import DocumentCard from './DocumentCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import SignatureCard from './SignatureCard';
import { useUser } from '../../app/context/UserContext';

const Biodata: React.FC = () => {
  const { profileData, isLoading, error, setProfileData } = useProfileData();
  const { user } = useUser();
  const {
    handleSaveProfile,
    handleSaveResident,
    handleSaveAvatar,
    handleAddDocument,
    handleUploadSignature,
  } = useProfileActions(setProfileData);

  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isResidentPopupOpen, setIsResidentPopupOpen] = useState(false);
  const [isAddDocumentPopupOpen, setIsAddDocumentPopupOpen] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!profileData) return <div>Tidak ada data profile</div>;

  const onSaveProfile = async (data: Record<string, string>) => {
    try {
      await handleSaveProfile(data);
      setIsProfilePopupOpen(false);
    } catch (error) {
      console.error('Failed to save profile data:', error);
    }
  };

  const onSaveResident = async (data: Record<string, string>) => {
    try {
      await handleSaveResident(data);
      setIsResidentPopupOpen(false);
    } catch (error) {
      console.error('Failed to save resident data:', error);
    }
  };

  const onAddDocument = async (data: Record<string, string | File>) => {
    try {
      await handleAddDocument(data);
      setIsAddDocumentPopupOpen(false);
    } catch (error) {
      console.error('Failed to add document:', error);
    }
  };

  return (
    <div className="p-4 space-y-8">
      <ProfileCard
        profileData={profileData}
        onSave={onSaveProfile}
        onSaveAvatar={handleSaveAvatar}
        isPopupOpen={isProfilePopupOpen}
        setIsPopupOpen={setIsProfilePopupOpen}
      />
      <ResidentCard
        residentData={profileData.resident}
        onSave={onSaveResident}
        isPopupOpen={isResidentPopupOpen}
        setIsPopupOpen={setIsResidentPopupOpen}
      />
      {user?.role === 'KADES' && (
        <SignatureCard
          signatureUrl={profileData.signatureUrl ?? null}
          onUploadSignature={handleUploadSignature}
        />
      )}
      <DocumentCard
        documents={profileData.resident?.documents}
        onAddDocument={onAddDocument}
        isPopupOpen={isAddDocumentPopupOpen}
        setIsPopupOpen={setIsAddDocumentPopupOpen}
      />
    </div>
  );
};

export default Biodata;

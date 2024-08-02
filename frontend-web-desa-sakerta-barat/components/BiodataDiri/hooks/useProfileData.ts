import { useState, useEffect } from 'react';
import {
  fetchResidentData,
  getAvatar,
} from '../../../lib/actions/setting.actions';
import { ProfileData } from '../types/profile.types';

export const useProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = await fetchResidentData();
        setProfileData(data);
        if (data.profilePicture) {
          const avatarUrl = await getAvatar(data.profilePicture);
          setProfileData((prevData) => ({ ...prevData!, avatarUrl }));
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data');
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  return { profileData, isLoading, error, setProfileData };
};

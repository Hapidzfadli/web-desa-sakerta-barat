import { useState } from 'react';
import { useToast } from '../../../components/ui/use-toast';
import { API_URL } from '../../../constants';
import Cookies from 'js-cookie';
import { ChangePasswordData, UpdatePinData } from '../type/keamananTypes';

export const useSecurityActions = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get('session');

  const changePassword = async (data: ChangePasswordData) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      toast({
        title: 'Success',
        description: 'Password has been changed successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to change password. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePin = async (data: UpdatePinData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/update-kades-pin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update PIN');
      }

      toast({
        title: 'Success',
        description: 'PIN has been updated successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update PIN. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { changePassword, updatePin, isLoading };
};

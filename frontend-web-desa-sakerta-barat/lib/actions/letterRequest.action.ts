import { API_URL } from '../../constants';
import Cookies from 'js-cookie';

export const applyLetter = async (
  letterTypeId: number,
  notes: string,
  attachments: File[],
) => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('letterTypeId', letterTypeId.toString());
    formData.append('notes', notes);

    attachments.forEach((file, index) => {
      formData.append(`attachments`, file);
    });

    const response = await fetch(`${API_URL}/api/letter-requests`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // Remove 'Content-Type' header, let the browser set it automatically for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to apply for letter: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in applyLetter:', error);
    throw error;
  }
};

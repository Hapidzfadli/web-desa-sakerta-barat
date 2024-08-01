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

export const fetchLetterRequests = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
): Promise<LetterRequestsResponse> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    let url = `${API_URL}/api/letter-requests?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch letter requests');
    }

    const data: LetterRequestsResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error in fetchLetterRequests:', error);
    throw error;
  }
};

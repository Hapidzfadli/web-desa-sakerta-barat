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

export const fetchLetterRequestById = async (
  id: number,
): Promise<LetterRequest> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/letter-requests/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in fetchLetterRequestById:', error);
    throw error;
  }
};

export const verifyLetterRequest = async (
  id: number,
  status: 'APPROVED' | 'REJECTED',
  rejectionReason: string,
): Promise<LetterRequest> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_URL}/api/letter-requests/${id}/verify`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, rejectionReason }),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to verify letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in verifyLetterRequest:', error);
    throw error;
  }
};

export const updateLetterRequest = async (
  id: number,
  data: any,
): Promise<LetterRequest> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/letter-requests/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update letter request');
    }

    const responseData = await response.json();
    return responseData.data;
  } catch (error) {
    console.error('Error in updateLetterRequest:', error);
    throw error;
  }
};

export const resubmitLetterRequest = async (id: number): Promise<any> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_URL}/api/letter-requests/${id}/resubmit`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to resubmit letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in resubmitLetterRequest:', error);
    throw error;
  }
};

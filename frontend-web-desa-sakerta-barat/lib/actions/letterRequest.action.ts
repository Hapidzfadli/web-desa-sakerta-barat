import { buildQueryString } from '../../components/ListLetterRequests/utils/helpers';
import { API_URL } from '../../constants';
import Cookies from 'js-cookie';

export const applyLetter = async (
  letterTypeId: number,
  notes: string,
  attachments: File[] = [],
) => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    formData.append('letterTypeId', letterTypeId.toString());
    formData.append('notes', notes);

    if (attachments && attachments.length > 0) {
      attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });
    }

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
  sortColumn?: string,
  sortOrder?: 'asc' | 'desc',
  filters?: Record<string, any>,
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
    if (sortColumn) {
      url += `&sortBy=${sortColumn}&sortOrder=${sortOrder}`;
    }

    if (filters) {
      url += buildQueryString(filters);
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

export const completeLetterRequest = async (
  id: number,
): Promise<LetterRequest> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_URL}/api/letter-requests/${id}/complete`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to complete letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in completeLetterRequest:', error);
    throw error;
  }
};

export const archiveLetterRequest = async (
  id: number,
): Promise<LetterRequest> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_URL}/api/letter-requests/${id}/archive`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to archive letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in archiveLetterRequest:', error);
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

export const deleteLetterRequest = async (id: number): Promise<void> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/letter-requests/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in deleteLetterRequest:', error);
    throw error;
  }
};

export const getAttachmentFile = async (url: string): Promise<Blob> => {
  try {
    const token = Cookies.get('session');
    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch document file');
    }

    return await response.blob();
  } catch (error) {
    console.error('Get document file error:', error);
    throw error;
  }
};

export const previewLetterRequest = async (id: number): Promise<Blob> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(
      `${API_URL}/api/printed-letters/preview/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to preview letter request');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error in previewLetterRequest:', error);
    throw error;
  }
};

export const printLetterRequest = async (id: number): Promise<Blob> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/printed-letters/print/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get printable letter');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error in printLetterRequest:', error);
    throw error;
  }
};

export const signLetterRequest = async (
  id: number,
  pin: string,
): Promise<LetterRequest> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/letter-requests/${id}/sign`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pin, status: 'SIGNED' }),
    });

    if (!response.ok) {
      throw new Error('Failed to sign letter request');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error in signLetterRequest:', error);
    throw error;
  }
};

import { API_URL } from '../../constants';
import Cookies from 'js-cookie';
import { getDecodedToken } from '../jwtUtils';
import { DocumentType } from '../documentTypeUtils';

export const saveResidentData = async (residentData: any) => {
  try {
    const existingData = await fetchResidentData();

    let data;

    if (existingData && existingData.resident) {
      data = updateResidentData(residentData);
    } else {
      data = createResidentData(residentData);
    }

    return data;
  } catch (error) {
    console.error('Save resident data error:', error);
    throw error;
  }
};

export const createResidentData = async (residentData: any) => {
  try {
    const token = Cookies.get('session');
    const decodedToken = getDecodedToken();

    residentData.userId = decodedToken?.sub;

    const response = await fetch(`${API_URL}/api/residents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(residentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create resident data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Create resident data error:', error);
    throw error;
  }
};

export const fetchResidentData = async () => {
  try {
    const token = Cookies.get('session');

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resident data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fetch resident data error:', error);
    throw error;
  }
};

export const updateResidentData = async (residentData: any) => {
  try {
    const token = Cookies.get('session');
    const decodedToken = getDecodedToken();
    if (!decodedToken) throw new Error('No valid token found');
    const response = await fetch(
      `${API_URL}/api/residents/${decodedToken.sub}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(residentData),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to update resident data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Update resident data error:', error);
    throw error;
  }
};

export const saveProfileData = async (profileData: any) => {
  try {
    const token = Cookies.get('session');
    const decodedToken = getDecodedToken();
    if (!decodedToken) throw new Error('No valid token found');
    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Update profile data error:', error);
    throw error;
  }
};

export const saveProfilePicture = async (file: File) => {
  try {
    const token = Cookies.get('session');
    const decodedToken = getDecodedToken();
    const formData = new FormData();
    formData.append('profilePicture', file);
    if (!decodedToken) throw new Error('No valid token found');

    const response = await fetch(`${API_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors || 'Failed to update avatar');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Update profile picture error:', error);
    throw error;
  }
};

export const getAvatar = async (
  profilePicture: string | null | undefined,
): Promise<string> => {
  if (!profilePicture) {
    return ''; // Atau URL default avatar
  }

  try {
    const token = Cookies.get('session');
    const response = await fetch(`${API_URL}${profilePicture}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    return ''; // Atau URL default avatar
  }
};

export const getDocumentFile = async (documentId: number): Promise<Blob> => {
  try {
    const token = Cookies.get('session');
    const response = await fetch(
      `${API_URL}/api/residents/documents/${documentId}/file`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch document file');
    }

    return await response.blob();
  } catch (error) {
    console.error('Get document file error:', error);
    throw error;
  }
};

export const updateDocument = async (
  documentId: number,
  file: File,
  type: DocumentType,
) => {
  try {
    const token = Cookies.get('session');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(
      `${API_URL}/api/residents/documents/${documentId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update document');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Update document error:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId: number) => {
  try {
    const token = Cookies.get('session');
    const response = await fetch(
      `${API_URL}/api/residents/documents/${documentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete document');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Delete document error:', error);
    throw error;
  }
};

export const addDocument = async (file: File, type: DocumentType) => {
  try {
    const token = Cookies.get('session');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${API_URL}/api/residents/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add document');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Add document error:', error);
    throw error;
  }
};

export const uploadSignature = async (file: File) => {
  const token = Cookies.get('session');
  const formData = new FormData();
  formData.append('signature', file);

  const response = await fetch(`${API_URL}/api/users/upload-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload signature');
  }

  return response.json();
};

export const getSignature = async (fileName: string) => {
  const token = Cookies.get('session');
  const response = await fetch(`${API_URL}${fileName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to get signature');
  }
  return URL.createObjectURL(await response.blob());
};

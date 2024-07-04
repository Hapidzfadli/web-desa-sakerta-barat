import { API_URL } from '../../constants';
import Cookies from 'js-cookie';
import { getDecodedToken } from '../jwtUtils';


export const saveResidentData = async (residentData: any) => {
  try {
    const existingData = await fetchResidentData();

    let data;

    if (existingData && existingData.Resident) {
      data = updateResidentData(residentData)
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
            
      const response = await fetch(`${API_URL}/api/residents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
          'Authorization': `Bearer ${token}`,
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
      const response = await fetch(`${API_URL}/api/residents/${decodedToken.sub}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(residentData),
      });
  
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
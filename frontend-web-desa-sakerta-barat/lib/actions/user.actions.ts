import { buildQueryString } from '../../components/ListLetterRequests/utils/helpers';
import { API_URL } from '../../constants';
import Cookies from 'js-cookie';

export const registerUser = async ({ ...userData }: RegisterParams) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'An error occurred during registration',
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during registration');
    } else {
      throw new Error('An unexpected error occurred during registration');
    }
  }
};

export const loginUser = async ({ username, password }: LoginProps) => {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred during login');
    }

    const data = await response.json();
    Cookies.set('session', data.data.token, { expires: 7 });
    localStorage.setItem('userData', JSON.stringify(data.data));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      throw new Error(error.message || 'An error occurred during login');
    } else {
      throw new Error('An unexpected error occurred during login');
    }
  }
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  sortColumn?: string,
  sortOrder?: 'asc' | 'desc',
  filters?: Record<string, any>,
) => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    let url = `${API_URL}/api/users?page=${page}&limit=${limit}`;

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
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
};

export const updateUserRole = async (userId: number, role: string) => {
  try {
    const token = Cookies.get('session');
    const response = await fetch(`${API_URL}/api/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'An error occurred while updating user role',
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

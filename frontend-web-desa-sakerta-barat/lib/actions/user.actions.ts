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

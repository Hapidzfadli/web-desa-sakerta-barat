'use server';
import { cookies } from 'next/headers';
import { API_URL } from '../../constants';

export const loginUser = async ({username, password} : LoginProps) => {
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
    
    // Set session cookie
    cookies().set("session", data.data.token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async ({...userData} : RegisterParams) => {
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
      throw new Error(errorData.message || 'An error occurred during registration');
    }

    const data = await response.json();
    
    // Set session cookie after successful registration
    cookies().set("session", data.data.token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};
import { API_URL } from '../../constants';
import Cookies from 'js-cookie';

export interface Notification {
  id: number;
  userId: number;
  content: string;
  isRead: boolean;
  recipients: {
    isRead: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/notifications`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn('API did not return an array. Returning empty array.');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error in fetchNotifications:', error);
    throw error;
  }
};

export const markAsRead = async (id: number): Promise<void> => {
  try {
    const token = Cookies.get('session');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  } catch (error) {
    console.error('Error in markAsRead:', error);
    throw error;
  }
};

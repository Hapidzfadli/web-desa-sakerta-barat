import {
  DashboardData,
  ResidentDashboardData,
} from '../../components/Dashboard/types/dashboard.type';
import { API_URL } from '../../constants';
import Cookies from 'js-cookie';

export const fetchDashboardData = async (
  role: string,
): Promise<DashboardData | ResidentDashboardData> => {
  try {
    const token = Cookies.get('session');
    const endpoint = role === 'WARGA' ? 'resident' : 'admin';

    const response = await fetch(`${API_URL}/api/dashboard/${endpoint}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch dashboard data error:', error);
    throw error;
  }
};

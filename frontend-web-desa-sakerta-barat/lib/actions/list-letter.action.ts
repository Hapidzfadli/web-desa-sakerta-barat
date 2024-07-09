import { API_URL } from '../../constants';
import Cookies from 'js-cookie';

const getHeaders = () => {
  const token = Cookies.get('session');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchLetterCategory = async () => {
  try {
    const token = Cookies.get('session');

    const response = await fetch(`${API_URL}/api/letter-category`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch letter category data');
    }

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error('Fetch letter category data error:', error);
    throw error;
  }
};

export const fetchLetterType = async ({
  categoryId,
  filter,
  sort,
}: {
  categoryId: number;
  filter?: string;
  sort?: string;
}) => {
  try {
    let url = `${API_URL}/api/letter-type?categoryId=${categoryId}`;
    if (filter) url += `&filter=${filter}`;
    if (sort) url += `&sort=${sort}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch letter type data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Fetch letter type data error:', error);
    throw error;
  }
};

export const createLetterType = async (data: any) => {
  try {
    const token = Cookies.get('session');
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== 'icon' && key !== 'template') {
        formData.append(key, data[key]);
      }
    });

    if (data.icon) formData.append('icon', data.icon);
    if (data.template) formData.append('template', data.template);

    const response = await fetch(`${API_URL}/api/letter-type`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    return await response.json();
  } catch (error) {
    console.error('Create letter type error:', error);
    throw error;
  }
};

export const updateLetterType = async (id: number, data: any) => {
  try {
    const token = Cookies.get('session');
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== 'icon' && key !== 'template') {
        formData.append(key, data[key]);
      }
    });

    if (data.icon) formData.append('icon', data.icon);
    if (data.template) formData.append('template', data.template);

    const response = await fetch(`${API_URL}/api/letter-type/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update letter type');
    }

    return await response.json();
  } catch (error) {
    console.error('Update letter type error:', error);
    throw error;
  }
};

export const deleteLetterType = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/api/letter-type/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete letter type');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete letter type error:', error);
    throw error;
  }
};

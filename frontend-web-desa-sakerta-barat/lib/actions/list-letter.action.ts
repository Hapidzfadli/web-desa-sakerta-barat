import { API_URL } from '../../constants';
import Cookies from 'js-cookie';
import { getHeaders } from '../utils';



// Api Call Letter Category
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

export const createLetterCategory = async (letterCategoryData : any) => {
  try {
    
    const response = await fetch(`${API_URL}/api/letter-category`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(letterCategoryData),
    });

    if (!response.ok) {
      throw new Error('Failed to create letter category data');
    }

    const data = await response.json();
    return data.data;

  } catch (error) {
    console.error('Create letter category  data error:', error);
    throw error;
  }
}

export const updateLetterCategory = async (letterCategoryData : any) => {
  try {
    const response = await fetch(
      `${API_URL}/api/letter-category/${letterCategoryData.id}`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(letterCategoryData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update letter category  data');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Update letter category  data error:', error);
    throw error;
  }
}

export const deleteLetterCategory = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/api/letter-category/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete letter category');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete letter category error:', error);
    throw error;
  }
};

// Api Call Letter Type
export const fetchLetterType = async ({
  categoryId,
  search,
  sortBy,
  sortOrder,
  page,
  limit,
}: OptionsProps & { categoryId: number }) => {
  try {
    let url = `${API_URL}/api/letter-type?categoryId=${categoryId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (sortBy) url += `&sortBy=${sortBy}`;
    if (sortOrder) url += `&sortOrder=${sortOrder}`;
    if (page) url += `&page=${page}`;
    if (limit) url += `&limit=${limit}`;

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

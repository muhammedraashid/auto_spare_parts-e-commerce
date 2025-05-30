
import api from './api';

export interface CategoryResponse {
  id: number;
  slug: string;
  image: string;
  parent: number | null;
  translations: {
    en: { name: string };
    ar: { name: string };
  };
}

export const fetchCategories = async (): Promise <CategoryResponse[]> => {
  try {
    const response = await api.get('categories/');
    console.log('Fetched categories:', response.data);
    return response.data.results; 
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchCategoryById = async (id: number): Promise<CategoryResponse> => {
  try {
    const response = await api.get(`categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (data: FormData): Promise<CategoryResponse> => {
  for (const [key, value] of data.entries()) {
     console.log(key, value);
}
  const response = await api.post('categories/', data);
  return response.data;
};

export const updateCategory = async (id: number, data: FormData): Promise<CategoryResponse> => {
  const response = await api.patch(`categories/${id}/`, data);
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`categories/${id}/`);
};

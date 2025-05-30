import api from './api';

export interface BrandResponse {
  id: number;
  name: string;
  slug: string;
  logo: string;
  logo_thumbnail: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export const fetchBrands = async (): Promise<BrandResponse[]> => {
  try {
    const response = await api.get('brands/');
    console.log('Fetched brands:', response.data);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
};

export const fetchBrandById = async (id: number): Promise<BrandResponse> => {
  try {
    const response = await api.get(`brands/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching brand ${id}:`, error);
    throw error;
  }
};

export const createBrand = async (data: FormData): Promise<BrandResponse> => {
  for (const [key, value] of data.entries()) {
    console.log(key, value);
  }
  const response = await api.post('brands/', data);
  return response.data;
};

export const updateBrand = async (id: number, data: FormData): Promise<BrandResponse> => {
  const response = await api.patch(`brands/${id}/`, data);
  return response.data;
};

export const deleteBrand = async (id: number): Promise<void> => {
  await api.delete(`brands/${id}/`);
};

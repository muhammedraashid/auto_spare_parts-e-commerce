import api from './api';
import { Banner } from '@/components/admin/banners/BannerForm';

export const fetchBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get<{ results: Banner[] }>('banners/');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const fetchActiveBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get<{ results: Banner[] }>('banners/active/');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching active banners:', error);
    throw error;
  }
};

export const createBanner = async (bannerData: FormData): Promise<Banner> => {
  const response = await api.post('banners/', bannerData);
  return response.data;
};

export const updateBanner = async (id: string, bannerData: FormData): Promise<Banner> => {
  const response = await api.patch(`banners/${id}/`, bannerData);
  return response.data;
};

export const deleteBanner = async (id: string): Promise<void> => {
  await api.delete(`banners/${id}/`);
};

import api from './api';
import { Product } from '../contexts/CartContext';

export interface ProductResponse {
  id: number;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  description?: string;
  descriptionAr?: string;
  isActive?: boolean;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  badgeAr?: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('products/');
    // Transform the response data to match our frontend Product interface
    return response.data.map((item: ProductResponse) => ({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('products/featured/');
    return response.data.map((item: ProductResponse) => ({
      id: item.id,
      name: item.name,
      nameAr: item.nameAr,
      price: item.price,
      image: item.image,
      category: item.category,
      stock: item.stock
    }));
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const fetchTopRatedProducts = async (): Promise<any[]> => {
  try {
    const response = await api.get('products/top-rated/');
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get(`products/${id}/`);
    return {
      id: response.data.id,
      name: response.data.name,
      nameAr: response.data.nameAr,
      price: response.data.price,
      image: response.data.image,
      category: response.data.category,
      stock: response.data.stock
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData: FormData): Promise<Product> => {
  const response = await api.post('products/', productData);
  return response.data;
};

export const updateProduct = async (id: number, productData: FormData): Promise<Product> => {
  const response = await api.put(`products/${id}/`, productData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`products/${id}/`);
};

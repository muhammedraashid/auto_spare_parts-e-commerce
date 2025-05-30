import api from './api';
import { Product } from '../contexts/CartContext';

export interface ProductResponse {
  id: number;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price: string; // Note: it's a string in the API response
  compare_at_price?: string | null; // field name from backend is snake_case
  discount_percentage?: number;
  stock: number;
  brand: number;
  brand_name: string;
  category: number;
  category_name: string;
  image?: string;
  image_thumbnail?: string;
  is_featured: boolean;
  rating: string;
  review_count: number;
  created_at: string;

}
// export const fetchCategories = async (): Promise <CategoryResponse[]> => {
//   try {
//     const response = await api.get('categories/');
//     console.log('Fetched categories:', response.data);
//     return response.data.results; 
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return [];
//   } 
// };
// export const fetchProducts = async (): Promise<ProductResponse[]> => {
//   try {
//     const response = await api.get('products/');
//     // Transform the response data to match our frontend Product interface
//     return response.data.map((item: ProductResponse) => ({
//       id: item.id,
//       name: item.name,
//       nameAr: item.nameAr,
//       price: item.price,
//       image: item.image,
//       category: item.category,
//       stock: item.stock
//     }));
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     throw error;
//   }
// };

export const fetchProducts = async (): Promise<ProductResponse[]> => {
  try {
    const response = await api.get('products/');
    console.log('Fetched Products:', response.data);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('products/featured/');
    return response.data.map((item: ProductResponse) => ({
      id: item.id,
      name: item.name,
      nameAr: item.name.ar,
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
  const response = await api.patch(`products/${id}/`, productData);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`products/${id}/`);
};

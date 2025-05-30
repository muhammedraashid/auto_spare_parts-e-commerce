export interface Product {
  id: number;
  translations: {
    en : {
      name: string;
      description: string;
    };
    ar : {
      name: string;
      description: string;
    };
  };
  price: string;
  compare_at_price?: string | null;
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



export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  isLoaded: boolean;
}


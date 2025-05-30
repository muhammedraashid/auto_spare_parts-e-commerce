export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo: string; 
  logo_thumbnail: string
  description: string;
  is_active: boolean;
  created_at: string; 
}

export interface BrandState{
    brands: Brand[];
    loading: boolean;
    error: string | null;
    isLoaded: boolean;
}
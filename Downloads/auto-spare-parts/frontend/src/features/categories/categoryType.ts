export interface Category {
  id: number;
  slug: string;
  image: string;
  parent: number | null;
  translations: {
    en: { name: string };
    ar: { name: string };
  };
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  isLoaded: boolean;
}



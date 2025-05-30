import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category, CategoryState } from './categoryType';
import { fetchCategories, deleteCategory as apiDeleteCategory, updateCategory as apiUpdateCategory , createCategory as apiCreateCategory} from '@/services/categoryService';

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  isLoaded: false,
};

export const getCategories = createAsyncThunk(
  'categories/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCategories();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async (
    { id, data }: { id: number; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const updated = await apiUpdateCategory(id, data);
      return updated; // return full updated category object
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (data:FormData, {rejectWithValue}) => {
        try{
            const newCategory = await apiCreateCategory(data);
            return newCategory;
        }catch(error:any){
            return rejectWithValue(error.message)
        }
    }
);



const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCategories.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.isLoaded = true;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoaded = false;
      })

      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      })

      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload); 
      })
  },
});

export default categorySlice.reducer;

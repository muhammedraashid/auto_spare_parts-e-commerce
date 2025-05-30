import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Brand, BrandState } from './brandType';  // Define these types similar to categoryType
import { fetchBrands, createBrand as apiCreateBrand, deleteBrand as apiDeleteBrand, updateBrand as apiUpdateBrand } from '@/services/brandServices';

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
  isLoaded: false,
};

export const getBrands = createAsyncThunk(
  'brands/getBrands',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBrands();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteBrand(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async (
    { id, data }: { id: number; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const updated = await apiUpdateBrand(id, data);
      return updated; // Return full updated brand object
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const newBrand = await apiCreateBrand(data);
      return newBrand;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
        state.isLoaded = true;
      })
      .addCase(getBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoaded = false;
      })

      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter((brand) => brand.id !== action.payload);
      })

      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex((brand) => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })

      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.unshift(action.payload);
      });
  },
});

export default brandSlice.reducer;

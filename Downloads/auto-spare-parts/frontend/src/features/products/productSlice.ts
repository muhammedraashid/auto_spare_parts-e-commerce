import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Product, ProductState } from './productType';
import { fetchProducts, createProduct as apiCreateProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from '@/services/productService';

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  isLoaded: false,
};

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProducts();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteProduct(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (
    { id, data }: { id: number; data: FormData },
    { rejectWithValue }
  ) => {
    try {
      const updated = await apiUpdateProduct(id, data);
      return updated; 
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: FormData, { rejectWithValue }) => {
    try {
      const newProduct = await apiCreateProduct(data);
      return newProduct;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.isLoaded = true;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isLoaded = false;
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(prod => prod.id !== action.payload);
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(prod => prod.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      });
  },
});

export default productSlice.reducer;

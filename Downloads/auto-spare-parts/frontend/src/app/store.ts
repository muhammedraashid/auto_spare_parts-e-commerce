import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from '../features/categories/categorySlice'
import productReducer from'../features/products/productSlice'
import brandReducer from '../features/brands/brandSlice'


export const store = configureStore({
    reducer:{
        categories: categoryReducer,
        products:productReducer,
        brands:brandReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
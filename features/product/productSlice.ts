import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductState {
    products: any[];
    selectedProduct: any;
}

const initialState: ProductState = {
    products: [],
    selectedProduct: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<any[]>) => {
            state.products = action.payload;
        },
        setSelectedProduct: (state, action: PayloadAction<any>) => {
            state.selectedProduct = action.payload;
        },
    },
});

export const { setProducts, setSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
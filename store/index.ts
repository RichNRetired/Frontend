import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/product/productSlice';
import cartReducer from '../features/cart/cartSlice';
import { authApi } from '../features/auth/authApi';
import { productApi } from '../features/product/productApi';
import { orderApi } from '../features/order/orderApi';
import { userApi } from '../features/user/userApi';
import { categoryApi } from '../features/category/categoryApi';
import { cartApi } from '../features/cart/cartApi';
import { wishlistApi } from '../features/wishlist/wishlistApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [wishlistApi.reducerPath]: wishlistApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            productApi.middleware,
            orderApi.middleware,
            userApi.middleware,
            categoryApi.middleware,
            cartApi.middleware,
            wishlistApi.middleware
        ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
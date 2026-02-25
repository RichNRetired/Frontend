import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ApiCartItem {
  cartId: number;
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  success?: boolean;
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  tagTypes: ['Cart'],
  baseQuery: fetchBaseQuery({
    baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, ''),
    credentials: 'include',
    prepareHeaders: (headers) => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const tokenType = typeof window !== 'undefined' ? localStorage.getItem('tokenType') || 'Bearer' : 'Bearer';
        if (token) headers.set('Authorization', `${tokenType} ${token}`);
      } catch (e) {
        // ignore on server
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET /api/cart - Get cart items
    getCart: builder.query<ApiCartItem[], void>({
      query: () => ({
        url: 'api/cart',
        method: 'GET'
      }),
      providesTags: ['Cart'],
    }),

    // POST /api/cart/add - Add product to cart
    // Params: productId (int64), qty (int32)
    addToCart: builder.mutation<ApiResponse, { productId: number; qty: number }>({
      query: ({ productId, qty }) => ({
        url: 'api/cart/add',
        method: 'POST',
        params: { productId, qty },
      }),
      invalidatesTags: ['Cart'],
    }),

    // PUT /api/cart/{cartId} - Update cart item quantity
    // Params: qty (int32 in query)
    updateCartItem: builder.mutation<ApiResponse, { cartId: number; qty: number }>({
      query: ({ cartId, qty }) => ({
        url: `api/cart/${cartId}`,
        method: 'PUT',
        params: { qty },
      }),
      invalidatesTags: ['Cart'],
    }),

    // DELETE /api/cart/{cartId} - Remove item from cart
    removeFromCart: builder.mutation<ApiResponse, number>({
      query: (cartId) => ({
        url: `api/cart/${cartId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // POST /api/cart/merge - Merge guest cart with authenticated user cart
    // Body: Array of { productId: int64, quantity: int32 }
    mergeCart: builder.mutation<ApiResponse, Array<{ productId: number; quantity: number }>>({
      query: (items) => ({
        url: 'api/cart/merge',
        method: 'POST',
        body: items,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useMergeCartMutation,
} = cartApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ApiCartItem {
  cartItemId: number;
  productId: number;
  categoryId?: number;
  category?: { id?: number | null } | null;
  variantId: number;
  color: string;
  size: string;
  productName: string;
  imageUrl: string;
  price: number;
  mrp: number;
  quantity: number;
  totalPrice: number;
  discountPercentage: number;
}

export interface CartSummaryResponse {
  items: ApiCartItem[];
  subtotal: number;
  taxAmount: number;
  shippingCharges: number;
  discountAmount: number;
  finalAmount: number;
  appliedCoupon?: string;
  couponApplied: boolean;
  message?: string;
  totalItems: number;
  totalMrp: number;
  totalSavings: number;
}

export interface ApiResponse<T = unknown> {
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
      const browserWindow = globalThis.window;

      if (browserWindow === undefined) {
        return headers;
      }

      const token = browserWindow.localStorage.getItem('accessToken');
      const tokenType = browserWindow.localStorage.getItem('tokenType') || 'Bearer';

      if (token) {
        headers.set('Authorization', `${tokenType} ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET /api/cart - Get cart items
    getCart: builder.query<ApiCartItem[], void>({
      query: () => ({
        url: 'api/cart',
        method: 'GET',
      }),
      providesTags: ['Cart'],
    }),

    // GET /api/cart/summary - Get cart with pricing
    getCartSummary: builder.query<CartSummaryResponse, { couponCode?: string } | void>({
      query: (params) => {
        if (!params) {
          return {
            url: 'api/cart/summary',
            method: 'GET',
          };
        }

        return {
          url: 'api/cart/summary',
          method: 'GET',
          params,
        };
      },
      providesTags: ['Cart'],
    }),

    // POST /api/cart/add - Add product to cart
    // Params: productId (int64), variantId (int64), qty (int32)
    addToCart: builder.mutation<ApiResponse, { productId: number; variantId: number; qty: number }>({
      query: ({ productId, variantId, qty }) => ({
        url: 'api/cart/add',
        method: 'POST',
        params: { productId, variantId, qty },
      }),
      invalidatesTags: ['Cart'],
    }),

    // PUT /api/cart/{cartItemId} - Update cart item quantity/variant
    // Params: qty (int32), variantId (int32)
    updateCartItem: builder.mutation<ApiResponse, { cartItemId: number; qty: number; variantId: number }>({
      query: ({ cartItemId, qty, variantId }) => ({
        url: `api/cart/${cartItemId}`,
        method: 'PUT',
        params: { qty, variantId },
      }),
      invalidatesTags: ['Cart'],
    }),

    // DELETE /api/cart/{cartItemId} - Remove item from cart
    removeFromCart: builder.mutation<ApiResponse, number>({
      query: (cartItemId) => ({
        url: `api/cart/${cartItemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    // POST /api/cart/merge - Merge guest cart with authenticated user cart
    // Body: Array of { productId: int64, variantId: int64, quantity: int32 }
    mergeCart: builder.mutation<ApiResponse, Array<{ productId: number; variantId: number; quantity: number }>>({
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
  useGetCartSummaryQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useMergeCartMutation,
} = cartApi;

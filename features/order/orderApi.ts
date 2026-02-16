import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CheckoutPayload, Order, OrdersResponse, ApiResponse, ReturnRequest, ReturnResponse } from "./orderTypes";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || '').trim()}/api`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null;
            const tokenType = typeof window !== 'undefined' ? localStorage.getItem("tokenType") || "Bearer" : "Bearer";

            if (token) {
                headers.set("Authorization", `${tokenType} ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["Orders", "Returns"],

    endpoints: (builder) => ({

        /** Checkout - Create new order */
        checkout: builder.mutation<Order, CheckoutPayload>({
            query: (body) => ({
                url: "/orders/checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Orders"],
        }),

        /** Get Order Details */
        getOrderDetails: builder.query<Order, number>({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
                method: "GET",
            }),
            providesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }],
        }),

        /** Cancel Order */
        cancelOrder: builder.mutation<ApiResponse, number>({
            query: (orderId) => ({
                url: `/orders/${orderId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["Orders"],
        }),

        /** Reorder - Reorder a previous order */
        reorderOrder: builder.mutation<Order, number>({
            query: (orderId) => ({
                url: `/orders/${orderId}/reorder`,
                method: "POST",
            }),
            invalidatesTags: ["Orders"],
        }),

        /** My Orders - Get all user's orders */
        getMyOrders: builder.query<OrdersResponse, { page?: number; size?: number }>({
            query: ({ page = 0, size = 10 }) =>
                `/orders/my-orders?page=${page}&size=${size}`,
            providesTags: ["Orders"],
        }),

        /** Request Product Return */
        requestReturn: builder.mutation<ReturnResponse, ReturnRequest>({
            query: (body) => ({
                url: "/returns",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Returns", "Orders"],
        }),
    }),
});

export const {
    useCheckoutMutation,
    useGetOrderDetailsQuery,
    useCancelOrderMutation,
    useReorderOrderMutation,
    useGetMyOrdersQuery,
    useRequestReturnMutation,
} = orderApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CheckoutRequest, CheckoutResponse, Order, OrdersResponse, ApiResponse, ReturnRequest, ReturnResponse, InitiatePaymentRequest, InitiatePaymentResponse } from "./orderTypes";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api`,
        credentials: "include",
        prepareHeaders: (headers) => {
            const token = globalThis.window === undefined ? null : localStorage.getItem("accessToken");
            const tokenType = globalThis.window === undefined ? "Bearer" : localStorage.getItem("tokenType") || "Bearer";

            if (token) {
                headers.set("Authorization", `${tokenType} ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["Orders", "Returns"],

    endpoints: (builder) => ({

        /** Checkout summary - returns pricing/details for current cart */
        checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
            query: (body) => ({
                url: "/orders/checkout",
                method: "POST",
                body,
            }),
        }),

        /** Place Order using checkout endpoint */
        placeOrderCheckout: builder.mutation<Order, CheckoutRequest>({
            query: (body) => ({
                url: "/orders/checkout",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Orders"],
        }),

        /** Place Order - used when user completes purchase */
        placeOrder: builder.mutation<Order, { addressId: number; paymentMethod: string }>({
            query: ({ addressId, paymentMethod }) => ({
                url: `/orders/place?addressId=${addressId}&paymentMethod=${paymentMethod}`,
                method: "POST",
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

        /** Initiate Payment for prepaid order */
        initiatePayment: builder.mutation<InitiatePaymentResponse, InitiatePaymentRequest>({
            query: (body) => ({
                url: `/orders/${body.orderId}/payment/initiate`,
                method: "POST",
                body,
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
    usePlaceOrderCheckoutMutation,
    usePlaceOrderMutation,
    useGetOrderDetailsQuery,
    useCancelOrderMutation,
    useReorderOrderMutation,
    useInitiatePaymentMutation,
    useGetMyOrdersQuery,
    useRequestReturnMutation,
} = orderApi;

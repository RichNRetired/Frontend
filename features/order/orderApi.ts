import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CheckoutPayload, Order, OrdersResponse, ApiResponse, ReturnRequest, ReturnResponse, InitiatePaymentRequest, InitiatePaymentResponse } from "./orderTypes";

export const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${(process.env.NEXT_PUBLIC_API_URL || 'https://project-fnwy.onrender.com').trim().replace(/\/$/, '')}/api`,
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

        /** Initiate Payment for prepaid order */
        initiatePayment: builder.mutation<InitiatePaymentResponse, { orderId: number; body: InitiatePaymentRequest } | InitiatePaymentRequest>({
            query: (arg) => {
                // support both (orderId, body) shape and single body containing orderId
                const orderId = (arg as any).orderId;
                const body = (arg as any).body ? (arg as any).body : arg;
                return {
                    url: `/orders/${orderId}/payment/initiate`,
                    method: "POST",
                    body,
                };
            },
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
    useInitiatePaymentMutation,
    useGetMyOrdersQuery,
    useRequestReturnMutation,
} = orderApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
    CheckoutPayload,
    CheckoutRequest,
    CheckoutResponse,
    Order,
    OrdersResponse,
    ApiResponse,
    ReturnRequest,
    ReturnResponse,
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    Coupon,
    CouponValidationRequest,
    CouponValidationResponse,
    AppliedCouponResponse,
    ReturnsResponse,
    ReturnEligibilityRequest,
    ReturnEligibilityResponse,
    ReturnDetails,
    ReturnTrackingResponse,
    ReturnTimelineEntry,
    EligibleReturnItem,
    ReturnStatus,
} from "./orderTypes";

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

    tagTypes: ["Orders", "Returns", "Coupons"],

    endpoints: (builder) => ({

        /** Checkout summary - returns pricing/details for current cart */
        checkout: builder.mutation<CheckoutResponse, CheckoutRequest>({
            query: (body) => ({
                url: "/orders/checkout",
                method: "POST",
                body,
            }),
        }),

        /** Place a direct order with explicit items, used by Buy Now */
        placeOrderCheckout: builder.mutation<Order, CheckoutPayload>({
            query: ({ addressId, paymentMethod, items }) => ({
                url: `/orders/place?addressId=${addressId}&paymentMethod=${paymentMethod || "PREPAID"}`,
                method: "POST",
                body: {
                    addressId,
                    paymentMethod,
                    items,
                },
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
                url: `/admin/orders/${orderId}/cancel`,
                method: "PUT",
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

        /** Validate coupon against the current checkout context */
        validateCoupon: builder.mutation<CouponValidationResponse, CouponValidationRequest>({
            query: (body) => ({
                url: "/user/coupons/validate",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Coupons"],
        }),

        /** Get coupons currently available for the user/order amount */
        getAvailableCoupons: builder.query<Coupon[], number>({
            query: (orderAmount) => ({
                url: "/user/coupons/available",
                method: "GET",
                params: { orderAmount },
            }),
            providesTags: ["Coupons"],
        }),

        /** Lookup public coupon metadata by code */
        getCouponByCode: builder.query<Coupon, string>({
            query: (code) => ({
                url: `/public/coupons/${encodeURIComponent(code)}`,
                method: "GET",
            }),
            providesTags: ["Coupons"],
        }),

        /** Apply a coupon to an existing order */
        applyCouponToOrder: builder.mutation<AppliedCouponResponse, { orderId: number; body: CouponValidationRequest }>({
            query: ({ orderId, body }) => ({
                url: `/user/orders/${orderId}/coupons/apply`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Orders", "Coupons"],
        }),

        /** Remove a coupon from an existing order */
        removeCouponFromOrder: builder.mutation<ApiResponse, number>({
            query: (orderId) => ({
                url: `/user/orders/${orderId}/coupons`,
                method: "DELETE",
            }),
            invalidatesTags: ["Orders", "Coupons"],
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
                url: "/returns/returns",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Returns", "Orders"],
        }),

        /** Get customer returns */
        getMyReturns: builder.query<ReturnsResponse, { status?: ReturnStatus; page?: number; size?: number }>({
            query: ({ status, page = 0, size = 10 }) => ({
                url: "/returns/returns",
                method: "GET",
                params: {
                    page,
                    size,
                    ...(status ? { status } : {}),
                },
            }),
            providesTags: ["Returns"],
        }),

        /** Validate whether an order item can be returned */
        checkReturnEligibility: builder.mutation<ReturnEligibilityResponse, ReturnEligibilityRequest>({
            query: (body) => ({
                url: "/returns/returns/check-eligibility",
                method: "POST",
                body,
            }),
        }),

        /** Fetch a single return with refund and timeline details */
        getReturnDetails: builder.query<ReturnDetails, number>({
            query: (returnId) => ({
                url: `/returns/returns/${returnId}`,
                method: "GET",
            }),
            providesTags: (_result, _error, returnId) => [{ type: "Returns", id: returnId }],
        }),

        /** Track the current progress of a return */
        getReturnTracking: builder.query<ReturnTrackingResponse, number>({
            query: (returnId) => ({
                url: `/returns/returns/${returnId}/track`,
                method: "GET",
            }),
            providesTags: (_result, _error, returnId) => [{ type: "Returns", id: returnId }],
        }),

        /** Read timeline entries for a return */
        getReturnTimeline: builder.query<ReturnTimelineEntry[], number>({
            query: (returnId) => ({
                url: `/returns/returns/${returnId}/timeline`,
                method: "GET",
            }),
            providesTags: (_result, _error, returnId) => [{ type: "Returns", id: returnId }],
        }),

        /** Cancel a pending return */
        cancelReturn: builder.mutation<ReturnResponse, number>({
            query: (returnId) => ({
                url: `/returns/returns/${returnId}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: (_result, _error, returnId) => ["Returns", { type: "Returns", id: returnId }, "Orders"],
        }),

        /** List order items eligible for return */
        getEligibleReturnItems: builder.query<EligibleReturnItem[], number>({
            query: (orderId) => ({
                url: `/returns/orders/${orderId}/eligible-items`,
                method: "GET",
            }),
            providesTags: ["Returns", "Orders"],
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
    useValidateCouponMutation,
    useGetAvailableCouponsQuery,
    useLazyGetAvailableCouponsQuery,
    useGetCouponByCodeQuery,
    useLazyGetCouponByCodeQuery,
    useApplyCouponToOrderMutation,
    useRemoveCouponFromOrderMutation,
    useGetMyOrdersQuery,
    useRequestReturnMutation,
    useGetMyReturnsQuery,
    useCheckReturnEligibilityMutation,
    useGetReturnDetailsQuery,
    useGetReturnTrackingQuery,
    useGetReturnTimelineQuery,
    useCancelReturnMutation,
    useGetEligibleReturnItemsQuery,
} = orderApi;

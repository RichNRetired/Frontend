import type { RootState } from "@/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { createIdempotencyKey } from "@/lib/idempotency";
import {
    CheckoutRequest,
    CheckoutResponse,
    BuyNowCheckoutRequest,
    BuyNowCheckoutResponse,
    CancelOrderRequest,
    Order,
    OrderItem,
    OrdersResponse,
    PlacedOrderResponse,
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
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    OrderTrackingResponse,
    TrackingLookupResponse,
    ShiprocketPickupLocation,
    PlaceBuyNowOrderRequest,
    PlaceOrderRequest,
    ProcessOrderWebhookRequest,
    ProcessShiprocketWebhookRequest,
    ReturnStatusResponse,
} from "./orderTypes";

type RawOrderItem = Partial<OrderItem> & {
    productImage?: string;
    total?: number;
    subtotal?: number;
};

type RawOrder = Partial<Order> & {
    orderStatus?: string;
    deliveryAddressLine1?: string;
    deliveryAddressLine2?: string;
    deliveryCity?: string;
    deliveryState?: string;
    deliveryPostalCode?: string;
    deliveryCountry?: string;
    items?: RawOrderItem[];
};

type RawTrackingEvent = {
    status?: string;
    date?: string;
    location?: string;
};

type RawTrackingLookupResponse = {
    trackingId?: string;
    events?: RawTrackingEvent[];
};

type RawOrderTrackingResponse = {
    orderId?: number;
    status?: string;
    trackingId?: string;
    events?: RawTrackingEvent[];
};

const PREPAID_PAYMENT_METHODS = new Set(["PREPAID", "CARD", "UPI", "NETBANKING"]);
const FINALIZED_PAYMENT_STATUSES = new Set(["PAID", "CAPTURED", "COMPLETED", "SUCCESS", "VERIFIED"]);

function deriveRequiresPayment(order: RawOrder): boolean {
    if (typeof order.requiresPayment === "boolean") {
        return order.requiresPayment;
    }

    const paymentMethod = String(order.paymentMethod ?? "").trim().toUpperCase();
    const paymentStatus = String(order.paymentStatus ?? "").trim().toUpperCase();

    if (!PREPAID_PAYMENT_METHODS.has(paymentMethod)) {
        return false;
    }

    return !FINALIZED_PAYMENT_STATUSES.has(paymentStatus);
}

function normalizeOrderItem(item: RawOrderItem): OrderItem {
    return {
        category: item.category,
        categoryId: item.categoryId,
        cartId: Number(item.cartId ?? 0),
        orderItemId: item.orderItemId,
        productId: Number(item.productId ?? 0),
        productName: item.productName ?? "",
        imageUrl: item.imageUrl ?? item.productImage,
        price: Number(item.price ?? 0),
        quantity: Number(item.quantity ?? 0),
        totalPrice: Number(item.totalPrice ?? item.total ?? item.subtotal ?? 0),
        total: Number(item.total ?? item.totalPrice ?? item.subtotal ?? 0),
        variantId: item.variantId,
        size: item.size,
        color: item.color,
        sku: item.sku,
        mrp: item.mrp,
        discountPercentage: item.discountPercentage,
        subtotal: item.subtotal,
        inStock: item.inStock,
        availableStock: item.availableStock,
    };
}

function normalizeDeliveryAddress(order: RawOrder) {
    if (order.deliveryAddress?.addressLine1) {
        return order.deliveryAddress;
    }

    if (!order.deliveryAddressLine1) {
        return undefined;
    }

    return {
        addressLine1: order.deliveryAddressLine1,
        addressLine2: order.deliveryAddressLine2,
        city: order.deliveryCity ?? "",
        state: order.deliveryState ?? "",
        postalCode: order.deliveryPostalCode ?? "",
        country: order.deliveryCountry ?? "",
    };
}

function normalizeOrder(order: RawOrder): Order {
    return {
        orderId: Number(order.orderId ?? 0),
        status: order.status ?? order.orderStatus ?? "PENDING",
        trackingId: order.trackingId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        userId: order.userId,
        userName: order.userName,
        userEmail: order.userEmail,
        userPhone: order.userPhone,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        shippingCharges: order.shippingCharges,
        discountAmount: order.discountAmount,
        totalAmount: Number(order.totalAmount ?? 0),
        requiresPayment: deriveRequiresPayment(order),
        paymentMessage: order.paymentMessage,
        expectedDelivery: order.expectedDelivery,
        deliveryDays: order.deliveryDays,
        paymentExpiry: order.paymentExpiry,
        message: order.message,
        deliveryAddress: normalizeDeliveryAddress(order),
        items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [],
        createdAt: order.createdAt ?? new Date().toISOString(),
    };
}

function normalizePlacedOrder(order: RawOrder): PlacedOrderResponse {
    return {
        orderId: Number(order.orderId ?? 0),
        status: order.status ?? order.orderStatus,
        orderStatus: order.orderStatus,
        trackingId: order.trackingId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        subtotal: order.subtotal,
        taxAmount: order.taxAmount,
        shippingCharges: order.shippingCharges,
        discountAmount: order.discountAmount,
        totalAmount: Number(order.totalAmount ?? 0),
        requiresPayment: deriveRequiresPayment(order),
        paymentMessage: order.paymentMessage,
        expectedDelivery: order.expectedDelivery,
        deliveryDays: order.deliveryDays,
        paymentExpiry: order.paymentExpiry,
        deliveryAddress: normalizeDeliveryAddress(order),
        message: order.message,
        items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [],
        createdAt: order.createdAt,
    };
}

function normalizeCheckoutResponse(response: CheckoutResponse): CheckoutResponse {
    return {
        ...response,
        isDeliveryAvailable: response.isDeliveryAvailable !== false,
        isCodAvailable: response.isCodAvailable !== false,
        isValidForCheckout: response.isValidForCheckout !== false,
        items: Array.isArray(response.items)
            ? response.items.map((item) => normalizeOrderItem(item as RawOrderItem))
            : [],
        validationErrors: Array.isArray(response.validationErrors)
            ? response.validationErrors
            : [],
    };
}

function normalizeBuyNowCheckoutResponse(response: BuyNowCheckoutResponse): BuyNowCheckoutResponse {
    return {
        ...response,
        validationErrors: Array.isArray(response.validationErrors)
            ? response.validationErrors
            : [],
    };
}

function applyCancelledOrderState(order: Partial<Order> | undefined) {
    if (!order) {
        return;
    }

    order.status = "CANCELLED";
    order.message ??= "Order cancelled successfully";
}

function normalizeTrackingEvent(event: RawTrackingEvent) {
    return {
        status: event.status ?? "",
        date: event.date ?? "",
        location: event.location ?? "",
    };
}

function normalizeTrackingLookupResponse(
    response: RawTrackingLookupResponse,
): TrackingLookupResponse {
    return {
        trackingId: response.trackingId ?? "",
        events: Array.isArray(response.events)
            ? response.events.map(normalizeTrackingEvent)
            : [],
    };
}

function normalizeOrderTrackingResponse(
    response: RawOrderTrackingResponse,
): OrderTrackingResponse {
    return {
        orderId: Number(response.orderId ?? 0),
        status: response.status ?? "",
        trackingId: response.trackingId ?? "",
        events: Array.isArray(response.events)
            ? response.events.map(normalizeTrackingEvent)
            : [],
    };
}

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
            transformResponse: (response: CheckoutResponse) => normalizeCheckoutResponse(response),
        }),

        /** Buy now checkout summary */
        buyNowCheckout: builder.mutation<BuyNowCheckoutResponse, BuyNowCheckoutRequest>({
            query: (body) => ({
                url: "/orders/buy-now/checkout",
                method: "POST",
                body,
            }),
            transformResponse: (response: BuyNowCheckoutResponse) =>
                normalizeBuyNowCheckoutResponse(response),
        }),

        /** Place a direct order with explicit item payload, used by Buy Now */
        placeOrderCheckout: builder.mutation<PlacedOrderResponse, PlaceBuyNowOrderRequest>({
            query: ({ idempotencyKey, ...body }) => ({
                url: "/orders/buy-now/place-order",
                method: "POST",
                body,
                headers: {
                    "Idempotency-Key": idempotencyKey || createIdempotencyKey("buy-now"),
                },
            }),
            transformResponse: (response: RawOrder) => normalizePlacedOrder(response),
            invalidatesTags: ["Orders"],
        }),

        /** Place Order - used when user completes purchase */
        placeOrder: builder.mutation<PlacedOrderResponse, PlaceOrderRequest>({
            query: ({ addressId, paymentMethod, idempotencyKey }) => ({
                url: `/orders/place?addressId=${addressId}&paymentMethod=${paymentMethod}`,
                method: "POST",
                headers: {
                    "Idempotency-Key": idempotencyKey || createIdempotencyKey("checkout"),
                },
            }),
            transformResponse: (response: RawOrder) => normalizePlacedOrder(response),
            invalidatesTags: ["Orders"],
        }),
        /** Get Order Details */
        getOrderDetails: builder.query<Order, number>({
            query: (orderId) => ({
                url: `/orders/${orderId}`,
                method: "GET",
            }),
            transformResponse: (response: RawOrder) => normalizeOrder(response),
            providesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }],
        }),

        /** Cancel Order */
        cancelOrder: builder.mutation<ApiResponse, CancelOrderRequest>({
            query: ({ orderId }) => ({
                url: `/orders/${orderId}/cancel`,
                method: "POST",
                body: { orderId },
            }),
            async onQueryStarted({ orderId }, { dispatch, getState, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(
                        orderApi.util.updateQueryData("getOrderDetails", orderId, (draft) => {
                            applyCancelledOrderState(draft);
                        }),
                    );

                    const cachedOrderQueries = orderApi.util.selectCachedArgsForQuery(
                        getState() as RootState,
                        "getMyOrders",
                    );

                    for (const args of cachedOrderQueries) {
                        dispatch(
                            orderApi.util.updateQueryData("getMyOrders", args, (draft) => {
                                const matchingOrder = draft.content.find(
                                    (order) => order.orderId === orderId,
                                );

                                applyCancelledOrderState(matchingOrder);
                            }),
                        );
                    }
                } catch {
                    // Keep stale data untouched when cancel fails.
                }
            },
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

        /** Verify prepaid order payment */
        verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
            query: (body) => ({
                url: "/orders/verify",
                method: "POST",
                body,
            }),
            invalidatesTags: (_result, _error, body) => [{ type: "Orders", id: body.orderId }, "Orders"],
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
            transformResponse: (response: OrdersResponse) => ({
                ...response,
                content: Array.isArray(response.content)
                    ? response.content.map((order) => normalizeOrder(order as RawOrder))
                    : [],
            }),
            providesTags: ["Orders"],
        }),

        /** Track an order using external tracking id */
        trackOrder: builder.query<TrackingLookupResponse, string>({
            query: (trackingId) => ({
                url: `/orders/track/${encodeURIComponent(trackingId)}`,
                method: "GET",
            }),
            transformResponse: (response: RawTrackingLookupResponse) =>
                normalizeTrackingLookupResponse(response),
        }),

        /** Track an order using internal order id */
        getOrderTracking: builder.query<OrderTrackingResponse, number>({
            query: (orderId) => ({
                url: `/orders/orders/${orderId}/tracking`,
                method: "GET",
            }),
            transformResponse: (response: RawOrderTrackingResponse) =>
                normalizeOrderTrackingResponse(response),
            providesTags: (_result, _error, orderId) => [{ type: "Orders", id: orderId }],
        }),

        /** Get Shiprocket pickup locations */
        getShiprocketPickupLocations: builder.query<ShiprocketPickupLocation[] | Record<string, unknown>, void>({
            query: () => ({
                url: "/orders/shiprocket/pickup-locations",
                method: "GET",
            }),
        }),

        /** Forward the Razorpay webhook payload when needed */
        processOrderWebhook: builder.mutation<string | Record<string, unknown>, ProcessOrderWebhookRequest>({
            query: ({ signature, payload }) => ({
                url: "/orders/webhook",
                method: "POST",
                headers: {
                    "X-Razorpay-Signature": signature,
                    "Content-Type": "application/json",
                },
                body: payload,
            }),
        }),

        /** Forward Shiprocket webhook payload when needed */
        processShiprocketWebhook: builder.mutation<ApiResponse | Record<string, unknown>, ProcessShiprocketWebhookRequest>({
            query: ({ secret, payload }) => ({
                url: `/orders/webhook/shiprocket?secret=${encodeURIComponent(secret)}`,
                method: "POST",
                body: payload,
            }),
        }),

        /** Request Product Return */
        requestReturn: builder.mutation<ReturnResponse, ReturnRequest>({
            query: ({ orderId, orderItemId, quantity, reason, reasonDescription, comments }) => ({
                url: `/returns/${orderId}/return`,
                method: "POST",
                body: {
                    reason,
                    comment: reasonDescription || comments,
                    items: [{ orderItemId, quantity }],
                },
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

        /** Get return status for an order (by orderId) */
        getReturnByOrderId: builder.query<ReturnStatusResponse, number>({
            query: (orderId) => ({
                url: `/returns/${orderId}/return`,
                method: "GET",
            }),
            providesTags: (_result, _error, orderId) => [{ type: "Returns", id: orderId }],
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
    useBuyNowCheckoutMutation,
    usePlaceOrderCheckoutMutation,
    usePlaceOrderMutation,
    useGetOrderDetailsQuery,
    useCancelOrderMutation,
    useReorderOrderMutation,
    useInitiatePaymentMutation,
    useVerifyPaymentMutation,
    useValidateCouponMutation,
    useGetAvailableCouponsQuery,
    useLazyGetAvailableCouponsQuery,
    useGetCouponByCodeQuery,
    useLazyGetCouponByCodeQuery,
    useApplyCouponToOrderMutation,
    useRemoveCouponFromOrderMutation,
    useGetMyOrdersQuery,
    useTrackOrderQuery,
    useLazyTrackOrderQuery,
    useGetOrderTrackingQuery,
    useLazyGetOrderTrackingQuery,
    useGetShiprocketPickupLocationsQuery,
    useProcessOrderWebhookMutation,
    useProcessShiprocketWebhookMutation,
    useRequestReturnMutation,
    useGetMyReturnsQuery,
    useCheckReturnEligibilityMutation,
    useGetReturnDetailsQuery,
    useGetReturnTrackingQuery,
    useGetReturnTimelineQuery,
    useCancelReturnMutation,
    useGetEligibleReturnItemsQuery,
    useGetReturnByOrderIdQuery,
} = orderApi;

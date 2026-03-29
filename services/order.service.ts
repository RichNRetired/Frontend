import axios from "./axios";
import { createIdempotencyKey } from "@/lib/idempotency";
import {
    CheckoutPayload,
    CheckoutRequest,
    CheckoutResponse,
    Order,
    OrdersResponse,
    InitiatePaymentRequest,
    InitiatePaymentResponse,
    Coupon,
    CouponValidationRequest,
    CouponValidationResponse,
    AppliedCouponResponse,
    ApiResponse,
    BuyNowCheckoutRequest,
    BuyNowCheckoutResponse,
    PlaceOrderRequest,
    PlaceBuyNowOrderRequest,
    PlacedOrderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    TrackingLookupResponse,
    OrderTrackingResponse,
    ShiprocketPickupLocation,
    ProcessShiprocketWebhookRequest,
} from "@/features/order/orderTypes";

export const checkoutOrder = async (payload: CheckoutPayload): Promise<Order> => {
    const res = await axios.post("/orders/checkout", payload);
    return res.data;
};

export const checkoutSummary = async (
    payload: CheckoutRequest,
): Promise<CheckoutResponse> => {
    const res = await axios.post("/orders/checkout", payload);
    return res.data;
};

export const buyNowCheckoutSummary = async (
    payload: BuyNowCheckoutRequest,
): Promise<BuyNowCheckoutResponse> => {
    const res = await axios.post("/orders/buy-now/checkout", payload);
    return res.data;
};

export const placeOrder = async (payload: CheckoutPayload): Promise<Order> => {
    const { addressId, paymentMethod } = payload;
    const qp: string[] = [];
    if (addressId !== undefined && addressId !== null) {
        qp.push(`addressId=${encodeURIComponent(addressId)}`);
    }
    if (paymentMethod) {
        qp.push(`paymentMethod=${encodeURIComponent(paymentMethod)}`);
    }
    let url = "/orders/place";
    if (qp.length) {
        url += "?" + qp.join("&");
    }
    const res = await axios.post(url, payload, {
        headers: {
            "Idempotency-Key": createIdempotencyKey("checkout"),
        },
    });
    return res.data;
};

export const placeOrderWithIdempotency = async (
    payload: PlaceOrderRequest,
): Promise<PlacedOrderResponse> => {
    const { addressId, paymentMethod, idempotencyKey } = payload;
    const res = await axios.post(
        `/orders/place?addressId=${encodeURIComponent(addressId)}&paymentMethod=${encodeURIComponent(paymentMethod)}`,
        undefined,
        {
            headers: {
                "Idempotency-Key": idempotencyKey || createIdempotencyKey("checkout"),
            },
        },
    );
    return res.data;
};

export const placeBuyNowOrder = async (
    payload: PlaceBuyNowOrderRequest,
): Promise<PlacedOrderResponse> => {
    const { idempotencyKey, ...body } = payload;
    const res = await axios.post("/orders/buy-now/place-order", body, {
        headers: {
            "Idempotency-Key": idempotencyKey || createIdempotencyKey("buy-now"),
        },
    });
    return res.data;
};

export const cancelOrder = async (orderId: number): Promise<ApiResponse> => {
    const res = await axios.post(`/orders/${orderId}/cancel`, { orderId });
    return res.data;
};

export const getMyOrders = async (
    page = 0,
    size = 10,
): Promise<OrdersResponse> => {
    const res = await axios.get("/orders/my-orders", {
        params: { page, size },
    });
    return res.data;
};

export const getOrderDetails = async (orderId: number): Promise<Order> => {
    const res = await axios.get(`/orders/${orderId}`);
    return res.data;
};

export const initiatePayment = async (
    orderId: number,
    payload: InitiatePaymentRequest,
): Promise<InitiatePaymentResponse> => {
    const res = await axios.post(`/orders/${orderId}/payment/initiate`, payload);
    return res.data;
};

export const verifyPayment = async (
    payload: VerifyPaymentRequest,
): Promise<VerifyPaymentResponse> => {
    const res = await axios.post("/orders/verify", payload);
    return res.data;
};

export const trackOrder = async (
    trackingId: string,
): Promise<TrackingLookupResponse> => {
    const res = await axios.get(`/orders/track/${encodeURIComponent(trackingId)}`);
    return res.data;
};

export const getOrderTracking = async (
    orderId: number,
): Promise<OrderTrackingResponse> => {
    const res = await axios.get(`/orders/orders/${orderId}/tracking`);
    return res.data;
};

export const getShiprocketPickupLocations = async (): Promise<
    ShiprocketPickupLocation[] | Record<string, unknown>
> => {
    const res = await axios.get("/orders/shiprocket/pickup-locations");
    return res.data;
};

export const processShiprocketWebhook = async ({
    secret,
    payload,
}: ProcessShiprocketWebhookRequest): Promise<ApiResponse | Record<string, unknown>> => {
    const res = await axios.post(
        `/orders/webhook/shiprocket?secret=${encodeURIComponent(secret)}`,
        payload,
    );
    return res.data;
};

export const validateCoupon = async (
    payload: CouponValidationRequest,
): Promise<CouponValidationResponse> => {
    const res = await axios.post("/user/coupons/validate", payload);
    return res.data;
};

export const getAvailableCoupons = async (
    orderAmount: number,
): Promise<Coupon[]> => {
    const res = await axios.get("/user/coupons/available", {
        params: { orderAmount },
    });
    return res.data;
};

export const getCouponByCode = async (code: string): Promise<Coupon> => {
    const res = await axios.get(`/public/coupons/${encodeURIComponent(code)}`);
    return res.data;
};

export const applyCouponToOrder = async (
    orderId: number,
    payload: CouponValidationRequest,
): Promise<AppliedCouponResponse> => {
    const res = await axios.post(`/user/orders/${orderId}/coupons/apply`, payload);
    return res.data;
};

export const removeCouponFromOrder = async (
    orderId: number,
): Promise<ApiResponse> => {
    const res = await axios.delete(`/user/orders/${orderId}/coupons`);
    return res.data;
};

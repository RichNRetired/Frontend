import axios from "./axios";
import { CheckoutPayload, Order, OrdersResponse, InitiatePaymentRequest, InitiatePaymentResponse } from "@/features/order/orderTypes";

export const checkoutOrder = async (payload: CheckoutPayload): Promise<Order> => {
    const res = await axios.post("/orders/checkout", payload);
    return res.data;
};

export const cancelOrder = async (orderId: number): Promise<void> => {
    await axios.post(`/orders/${orderId}/cancel`);
};

export const getMyOrders = async (
    page = 0,
    size = 10
): Promise<OrdersResponse> => {
    const res = await axios.get("/orders/my-orders", {
        params: { page, size },
    });
    return res.data;
};

export const initiatePayment = async (
    orderId: number,
    payload: InitiatePaymentRequest
): Promise<InitiatePaymentResponse> => {
    const res = await axios.post(`/orders/${orderId}/payment/initiate`, payload);
    return res.data;
};

export interface OrderItem {
    productId: number;
    productName: string;
    imageUrl?: string;
    price: number;
    quantity: number;
    totalPrice?: number;
    total?: number;
}

export interface DeliveryAddress {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface Order {
    orderId: number;
    status: string;
    paymentMethod?: string;
    paymentStatus?: string;
    subtotal?: number;
    taxAmount?: number;
    shippingCharges?: number;
    discountAmount?: number;
    totalAmount: number;
    deliveryAddress?: DeliveryAddress;
    items: OrderItem[];
    createdAt: string;
}

export interface OrdersResponse {
    content: Order[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface CheckoutPayload {
    addressId: number;
    items: {
        productId: number;
        quantity: number;
    }[];
}

export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
}

export interface ReturnRequest {
    orderItemId: number;
    quantity: number;
    reason: "SIZE_ISSUE" | "DEFECTIVE" | "DAMAGED" | "NOT_AS_DESCRIBED" | "CHANGED_MIND" | "OTHER";
    comment?: string;
}

export interface ReturnResponse {
    returnId: number;
    orderId: number;
    orderItemId: number;
    productName: string;
    quantity: number;
    reason: string;
    status: "INITIATED" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    updatedAt?: string;
}

export interface ReturnDetails extends ReturnResponse {
    refundAmount?: number;
    comment?: string;
    adminComment?: string;
}

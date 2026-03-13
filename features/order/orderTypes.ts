export interface OrderItem {
    productId: number;
    productName: string;
    imageUrl?: string;
    price: number;
    quantity: number;
    totalPrice?: number;
    total?: number;
    // additional optional fields returned during checkout summary
    variantId?: number;
    size?: string;
    color?: string;
    sku?: string;
    mrp?: number;
    discountPercentage?: number;
    subtotal?: number;
    inStock?: boolean;
    availableStock?: number;
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
    requiresPayment?: boolean;
    paymentMessage?: string;
    // additional properties returned by the /place endpoint
    expectedDelivery?: string; // ISO date
    deliveryDays?: number;
    paymentExpiry?: string; // ISO datetime
    message?: string;
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
    paymentMethod?: "COD" | "PREPAID" | "CARD" | "UPI";
    items: {
        productId: number;
        quantity: number;
    }[];
}

// request/response models for the new /orders/checkout summary API
export interface CheckoutRequest {
    addressId?: number;
    paymentMethod?: "COD" | "PREPAID" | "CARD" | "UPI";
    cartId?: number;
}

export interface CheckoutResponse {
    subtotal: number;
    taxAmount: number;
    shippingCharges: number;
    discountAmount: number;
    totalAmount: number;
    items: OrderItem[]; // enhanced with optional fields above
    totalItems: number;
    deliveryAddress: DeliveryAddress;
    deliveryDays: number;
    expectedDelivery: string;
    isDeliveryAvailable: boolean;
    paymentMethod: string;
    requiresPayment: boolean;
    paymentMessage: string;
    isCodAvailable: boolean;
    cartId: number;
    isValidForCheckout: boolean;
    validationErrors: string[];
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

export interface InitiatePaymentRequest {
    orderId: number;
    amount: number;
    currency: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

export interface InitiatePaymentResponse {
    razorpayOrderId?: string;
    razorpayKeyId?: string;
    orderId?: number;
    amount?: number;
    currency?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}

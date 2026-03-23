export interface OrderItem {
    orderItemId?: number;
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
    userId?: number;
    userName?: string;
    userEmail?: string;
    userPhone?: string;
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

export interface PlacedOrderResponse {
    orderId: number;
    status?: string;
    orderStatus?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    subtotal?: number;
    taxAmount?: number;
    shippingCharges?: number;
    discountAmount?: number;
    totalAmount: number;
    requiresPayment?: boolean;
    paymentMessage?: string;
    expectedDelivery?: string;
    deliveryDays?: number;
    paymentExpiry?: string;
    deliveryAddress?: DeliveryAddress;
    message?: string;
    items?: OrderItem[];
    createdAt?: string;
}

export interface OrdersResponse {
    content: Order[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export type OrderPaymentMethod = "COD" | "PREPAID" | "CARD" | "UPI" | "NETBANKING";

export interface CheckoutPayload {
    addressId: number;
    paymentMethod?: OrderPaymentMethod;
    items: {
        productId: number;
        variantId?: number;
        quantity: number;
    }[];
}

// request/response models for the new /orders/checkout summary API
export interface CheckoutRequest {
    addressId?: number;
    paymentMethod?: OrderPaymentMethod;
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

export interface BuyNowCheckoutRequest {
    productId: number;
    variantId: number;
    quantity: number;
    addressId: number;
    paymentMethod: OrderPaymentMethod;
}

export interface BuyNowCheckoutResponse {
    productId: number;
    productName: string;
    productImage?: string;
    variantId: number;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
    mrp?: number;
    discountPercentage?: number;
    subtotal: number;
    deliveryAddress?: DeliveryAddress;
    deliveryDays?: number;
    expectedDelivery?: string;
    taxAmount: number;
    shippingCharges: number;
    discountAmount: number;
    totalAmount: number;
    paymentMethod: string;
    requiresPayment: boolean;
    isCodAvailable?: boolean;
    validationErrors: string[];
    isValid: boolean;
}

export interface Coupon {
    id: number;
    code: string;
    description: string;
    type: string;
    discountValue: number;
    minOrderAmount: number;
    maxDiscountAmount: number;
    validFrom: string;
    validTo: string;
    usageLimit: number;
    usagePerUser: number;
    totalUsedCount?: number;
    status: string;
    applicableCategoryIds?: number[];
    applicableProductIds?: number[];
    excludedCategoryIds?: number[];
    excludedProductIds?: number[];
    isFirstOrderOnly?: boolean;
    isNewUserOnly?: boolean;
    applicablePaymentMethods?: string;
    applicableUserTiers?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    updatedBy?: number;
    version?: number;
}

export interface CouponValidationRequest {
    couponCode: string;
    orderAmount: number;
    userId?: number;
    productIds: number[];
    categoryIds: number[];
    paymentMethod?: string;
    isFirstOrder?: boolean;
    isNewUser?: boolean;
}

export interface CouponValidationResponse {
    valid: boolean;
    message: string;
    discountAmount: number;
    finalAmount: number;
    coupon?: Coupon;
    warnings?: string[];
}

export interface AppliedCouponResponse {
    id: number;
    coupon: Coupon;
    user?: {
        id: number;
        email?: string;
        name?: string;
        role?: string;
        createdAt?: string;
    };
    order?: {
        id: number;
        totalAmount?: number;
        discountAmount?: number;
        paymentMethod?: string;
        status?: string;
        paymentStatus?: string;
    };
    discountAmount: number;
    usedAt?: string;
    orderNumber?: string;
    wasSuccessful: boolean;
    failureReason?: string;
    createdAt?: string;
}

export interface ApiResponse<T = unknown> {
    success?: boolean;
    message?: string;
    data?: T;
}

export interface CancelOrderRequest {
    orderId: number;
}

export type ReturnStatus =
    | "REQUESTED"
    | "APPROVED"
    | "REJECTED"
    | "PICKED_UP"
    | "PENDING_APPROVAL"
    | "PENDING_PICKUP"
    | "PICKUP_SCHEDULED"
    | "PICKUP_COMPLETED"
    | "QC_PENDING"
    | "QC_IN_PROGRESS"
    | "REFUND_PENDING"
    | "REFUND_COMPLETED"
    | "REPLACEMENT_PENDING"
    | "REPLACEMENT_SHIPPED"
    | "REPLACEMENT_DELIVERED"
    | "QC_PASSED"
    | "QC_FAILED"
    | "CANCELLED"
    | "COMPLETED";

export type ReturnReason =
    | "SIZE_ISSUE"
    | "DEFECTIVE"
    | "DAMAGED"
    | "NOT_AS_DESCRIBED"
    | "CHANGED_MIND"
    | "OTHER";

export type RefundStatus =
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

export interface ReturnRequest {
    orderId: number;
    orderItemId: number;
    quantity: number;
    reason: ReturnReason;
    reasonDescription?: string;
    comments?: string;
}

export interface ReturnResponse {
    id: number;
    returnNumber: string;
    status: ReturnStatus;
    reason: ReturnReason;
    reasonDescription?: string;
    quantity: number;
    refundAmount: number;
    restockingFee: number;
    createdAt: string;
    updatedAt: string;
    totalRefundAmount: number;
    userId: number;
    orderId: number;
    orderItemId: number;
    productName: string;
    itemPrice: number;
    refundStatus: RefundStatus;
    approvedAt?: string;
    rejectedAt?: string;
    completedAt?: string;
}

export interface ReturnsResponse {
    content: ReturnResponse[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface ReturnEligibilityRequest {
    orderItemId: number;
    productId: number;
}

export interface ReturnEligibilityResponse {
    isEligible: boolean;
    orderItemId: number;
    productName: string;
    returnDeadline?: string;
    message: string;
}

export interface EligibleReturnItem {
    orderItemId: number;
    orderId: number;
    productName: string;
    productSku?: string;
    productImage?: string;
    price: number;
    quantity: number;
    purchaseDate: string;
    isEligible: boolean;
    eligibilityMessage: string;
    returnDeadline?: string;
    availableReasons: ReturnReason[];
}

export interface ReturnTimelineEntry {
    id: number;
    returnId: number;
    status: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy?: string;
    createdByRole?: string;
    metadata?: string;
}

export interface ReturnRefund {
    id: number;
    amount: number;
    status: RefundStatus;
    refundMethod: string;
    transactionId?: string;
    createdAt: string;
    processedAt?: string;
    updatedAt?: string;
    paymentId?: number;
    paymentTransactionId?: string;
    returnId: number;
    returnNumber: string;
    processedBy?: number;
    processorName?: string;
    failureReason?: string;
    gatewayResponse?: string;
}

export interface ReturnOrderItemSummary {
    productId: number;
    variantId?: number;
    productName: string;
    size?: string;
    color?: string;
    price: number;
    quantity: number;
    total: number;
}

export interface ReturnDetails {
    returnInfo: ReturnResponse;
    orderItem: ReturnOrderItemSummary;
    refund?: ReturnRefund;
    timeline: ReturnTimelineEntry[];
}

export interface ReturnTrackingStep {
    title: string;
    description: string;
    date?: string;
    completed: boolean;
}

export interface ReturnTrackingResponse {
    returnNumber: string;
    currentStatus: ReturnStatus;
    estimatedCompletionDate?: string;
    steps: ReturnTrackingStep[];
}

export interface InitiatePaymentRequest {
    orderId: number;
    amount: number;
    currency: string;
    receipt?: string;
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

export interface VerifyPaymentRequest {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: number;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
}

export interface VerifyPaymentResponse {
    success?: boolean;
    verified?: boolean;
    message?: string;
    orderId?: number;
    paymentStatus?: string;
    status?: string;
    [key: string]: unknown;
}

export interface OrderTrackingResponse {
    status: string;
    location: string;
    estimatedDeliveryDate: string;
}

export interface ShiprocketPickupLocation {
    id?: number | string;
    name?: string;
    city?: string;
    state?: string;
    pincode?: string;
    address?: string;
    [key: string]: unknown;
}

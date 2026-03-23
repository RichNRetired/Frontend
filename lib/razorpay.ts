import type {
  InitiatePaymentRequest,
  VerifyPaymentRequest,
} from "@/features/order/orderTypes";

type PaymentIdentitySource = {
  fullName?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type BuildInitiatePaymentRequestParams = {
  orderId: number;
  amount: number;
  currency?: string;
  receipt?: string;
  orderUserName?: string | null;
  orderUserEmail?: string | null;
  orderUserPhone?: string | null;
  currentUser?: PaymentIdentitySource | null;
};

export function buildInitiatePaymentRequest({
  orderId,
  amount,
  currency = "INR",
  receipt,
  orderUserName,
  orderUserEmail,
  orderUserPhone,
  currentUser,
}: Readonly<BuildInitiatePaymentRequestParams>): InitiatePaymentRequest {
  return {
    orderId,
    amount,
    currency,
    receipt,
    customerName:
      orderUserName || currentUser?.fullName || currentUser?.name || "",
    customerEmail: orderUserEmail || currentUser?.email || "",
    customerPhone: orderUserPhone || currentUser?.phone || "",
  };
}

type BuildVerifyPaymentRequestParams = {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export function buildVerifyPaymentRequest({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: Readonly<BuildVerifyPaymentRequestParams>): VerifyPaymentRequest {
  return {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  };
}
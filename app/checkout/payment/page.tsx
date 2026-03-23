"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Button } from "@/components/ui/Button";
import {
  useGetOrderDetailsQuery,
  useInitiatePaymentMutation,
  useVerifyPaymentMutation,
} from "@/features/order/orderApi";
import {
  InitiatePaymentResponse,
  VerifyPaymentRequest,
} from "@/features/order/orderTypes";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { readBuyNowState, updateBuyNowStatus } from "@/lib/buy-now";
import { getCurrentUser } from "@/lib/auth";
import {
  buildInitiatePaymentRequest,
  buildVerifyPaymentRequest,
} from "@/lib/razorpay";

type RazorpayHandlerResponse = {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error?: { description?: string } }) => void) => void;
};

type RazorpayOptions = {
  key?: string;
  amount?: number;
  currency?: string;
  order_id?: string;
  name: string;
  description: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayHandlerResponse) => void;
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

export default function PaymentPage() {
  const search = useSearchParams();
  const router = useRouter();
  const orderIdParam = search.get("orderId");
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  const initResp = useMemo(() => {
    if (!orderId) {
      return null;
    }

    const data = globalThis.sessionStorage.getItem(`payment_init_${orderId}`);

    return data ? (JSON.parse(data) as InitiatePaymentResponse) : null;
  }, [orderId]);
  const [paymentSession, setPaymentSession] = useState<InitiatePaymentResponse | null>(
    initResp,
  );
  const [scriptReady, setScriptReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [attemptedRecovery, setAttemptedRecovery] = useState(false);
  const [initiatePayment, { isLoading: recoveringPaymentSession }] =
    useInitiatePaymentMutation();
  const [verifyPaymentMutation] = useVerifyPaymentMutation();
  const { data: order } = useGetOrderDetailsQuery(orderId ?? 0, {
    skip: !orderId,
  });

  useEffect(() => {
    setPaymentSession(initResp);
  }, [initResp]);

  useEffect(() => {
    const buyNowState = readBuyNowState();

    if (!buyNowState) {
      return;
    }

    updateBuyNowStatus("payment");

    return () => {
      const currentState = readBuyNowState();

      if (!currentState) {
        return;
      }

      if (currentState.status !== "completed") {
        updateBuyNowStatus("restore-pending");
      }
    };
  }, []);

  useEffect(() => {
    if (!orderId || paymentSession || attemptedRecovery || !order) {
      return;
    }

    const currentUser = globalThis.window === undefined ? null : getCurrentUser();

    if (!order.totalAmount) {
      setAttemptedRecovery(true);
      setPaymentError("Payment session is unavailable for this order.");
      return;
    }

    setAttemptedRecovery(true);

    void initiatePayment(buildInitiatePaymentRequest({
      orderId,
      amount: order.totalAmount,
      receipt: `order-${orderId}-${Date.now()}`,
      orderUserName: order.userName,
      orderUserEmail: order.userEmail,
      orderUserPhone: order.userPhone,
      currentUser,
    }))
      .unwrap()
      .then((response) => {
        setPaymentSession(response);
        globalThis.sessionStorage.setItem(
          `payment_init_${orderId}`,
          JSON.stringify(response),
        );
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to restore your payment session. Please restart checkout.";
        setPaymentError(message);
      });
  }, [attemptedRecovery, initiatePayment, order, orderId, paymentSession]);

  const resolvedOrderId = paymentSession?.orderId || orderId;
  let paymentButtonLabel = "Proceed to Pay";

  if (loading) {
    paymentButtonLabel = "Processing...";
  } else if (recoveringPaymentSession) {
    paymentButtonLabel = "Restoring payment...";
  } else if (!scriptReady) {
    paymentButtonLabel = "Loading Razorpay...";
  }

  const verifyPayment = async (payload: VerifyPaymentRequest) => {
    if (!resolvedOrderId) {
      throw new Error("Missing order information for payment verification.");
    }

    const result = await verifyPaymentMutation({
      ...payload,
      orderId: resolvedOrderId,
    }).unwrap();

    if (result.verified === false || result.success === false) {
      throw new Error(result.message || "Payment could not be verified.");
    }

    return result;
  };

  const handlePaymentVerification = (response: RazorpayHandlerResponse): void => {
    if (
      !response.razorpay_order_id ||
      !response.razorpay_payment_id ||
      !response.razorpay_signature
    ) {
      setLoading(false);
      setPaymentError("Razorpay returned an incomplete payment response.");
      return;
    }

    const razorpayOrderId = response.razorpay_order_id;
    const razorpayPaymentId = response.razorpay_payment_id;
    const razorpaySignature = response.razorpay_signature;

    if (!resolvedOrderId) {
      setLoading(false);
      setPaymentError("Missing order information for payment verification.");
      return;
    }

    const verifiedOrderId = resolvedOrderId;

    void (async () => {
      try {
        const verificationPayload: VerifyPaymentRequest =
          buildVerifyPaymentRequest({
            orderId: verifiedOrderId,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
          });
        const verificationResult = await verifyPayment(verificationPayload);

        updateBuyNowStatus("completed");
        sessionStorage.setItem("lastOrderId", String(verifiedOrderId));
        sessionStorage.setItem(
          `payment_result_${verifiedOrderId}`,
          JSON.stringify({
            ...response,
            verification: verificationResult,
          }),
        );
        globalThis.location.href = `/checkout/success?orderId=${verifiedOrderId}`;
      } catch (error) {
        setLoading(false);
        setPaymentError(
          error instanceof Error
            ? error.message
            : "Payment completed, but verification failed. Contact support if the amount was debited.",
        );
      }
    })();
  };

  const handleProceed = async () => {
    if (!paymentSession) return;
    setPaymentError(null);

    const razorpay = (globalThis as typeof globalThis & { Razorpay?: RazorpayConstructor })
      .Razorpay;

    if (!scriptReady || !razorpay) {
      setPaymentError("Razorpay checkout is still loading. Please try again.");
      return;
    }

    if (!paymentSession.razorpayOrderId || !paymentSession.razorpayKeyId) {
      setPaymentError("Payment session is incomplete. Please restart checkout.");
      return;
    }

    setLoading(true);

    if (razorpay) {
      try {
        const options: RazorpayOptions = {
          key: paymentSession.razorpayKeyId,
          amount: paymentSession.amount,
          currency: paymentSession.currency,
          order_id: paymentSession.razorpayOrderId,
          name: "Rich",
          description: `Payment for order #${resolvedOrderId}`,
          prefill: {
            name: paymentSession.customerName,
            email: paymentSession.customerEmail,
            contact: paymentSession.customerPhone,
          },
          notes: {
            orderId: String(resolvedOrderId),
            customerEmail: paymentSession.customerEmail || "",
          },
          theme: {
            color: "#111111",
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            },
          },
          handler: handlePaymentVerification,
        };

        const rzp = new razorpay(options);
        rzp.on("payment.failed", (response) => {
          setLoading(false);
          setPaymentError(
            response.error?.description ||
              "Payment failed. Please try again or use another method.",
          );
        });
        rzp.open();
        return;
      } catch (err) {
        setLoading(false);
        setPaymentError("Unable to start Razorpay checkout. Please try again.");
        console.error("Razorpay open failed", err);
      }
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-500">No order specified.</p>
          <Link href="/">Go to store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => {
          setScriptReady(false);
          setPaymentError("Failed to load Razorpay checkout. Refresh and try again.");
        }}
      />

      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <CheckCircle2 size={48} className="mx-auto  mb-4 text-green-600" />
          <h1 className="text-2xl font-light text-neutral-600 mb-2">Complete Payment</h1>
          <p className="text-neutral-600">
            Follow the instructions below to complete your payment.
          </p>
        </div>

        {paymentSession ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
            <p className="text-sm text-neutral-700 mb-2">
              Order: <strong>#{paymentSession.orderId}</strong>
            </p>
            <p className="text-sm text-neutral-700 mb-2">
              Amount: <strong>₹{paymentSession.amount}</strong>
            </p>
            <p className="text-sm text-neutral-700 mb-4">
              Currency: <strong>{paymentSession.currency}</strong>
            </p>

            {paymentError && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-left text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-left text-sm text-neutral-600">
              <p className="font-medium text-neutral-900">Secure Razorpay Checkout</p>
              <p className="mt-2">
                You will be redirected to Razorpay to complete this prepaid order using UPI, card, netbanking, or wallet.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleProceed}
                disabled={loading || recoveringPaymentSession || !scriptReady}
              >
                {loading && <Loader2 className="animate-spin" />}
                {paymentButtonLabel}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-neutral-200 rounded-lg">
            <p className="text-neutral-600">
              {recoveringPaymentSession
                ? "Restoring your payment details..."
                : "No payment details found."}
            </p>
            <p className="text-sm text-neutral-500 mt-3">
              {paymentError || "If this is unexpected, contact support."}
            </p>
            <div className="mt-6">
              <Button
                onClick={() =>
                  router.push(`/checkout/success?orderId=${orderId}`)
                }
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function PaymentPage() {
  const search = useSearchParams();
  const router = useRouter();
  const orderIdParam = search.get("orderId");
  const orderId = orderIdParam ? Number(orderIdParam) : null;

  const [initResp, setInitResp] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    const data = sessionStorage.getItem(`payment_init_${orderId}`);
    if (data) setInitResp(JSON.parse(data));
  }, [orderId]);

  const handleProceed = async () => {
    if (!initResp) return;

    // If Razorpay (or other) client SDK is available, you'd open the checkout here.
    // This is a placeholder: in production, load Razorpay script and call new Razorpay(options).open()
    if ((window as any).Razorpay && initResp.razorpayOrderId) {
      try {
        const options = {
          key: initResp.razorpayKeyId,
          amount: initResp.amount,
          currency: initResp.currency,
          order_id: initResp.razorpayOrderId,
          name: "Your Store",
          description: "Order Payment",
          handler: function (response: any) {
            // on successful payment you should verify payment on server
            // For now, redirect to success page
            sessionStorage.setItem("lastOrderId", String(initResp.orderId));
            window.location.href = `/checkout/success?orderId=${initResp.orderId}`;
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (err) {
        console.error("Razorpay open failed", err);
      }
    }

    // Fallback: mark as pending and redirect to success (or show instructions)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem(
        "lastOrderId",
        String(initResp?.orderId || orderId),
      );
      router.push(`/checkout/success?orderId=${initResp?.orderId || orderId}`);
    }, 1000);
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
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="mb-8">
          <CheckCircle2 size={48} className="mx-auto mb-4 text-green-600" />
          <h1 className="text-2xl font-light mb-2">Complete Payment</h1>
          <p className="text-neutral-600">
            Follow the instructions below to complete your payment.
          </p>
        </div>

        {initResp ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-8 mb-8">
            <p className="text-sm text-neutral-700 mb-2">
              Order: <strong>#{initResp.orderId}</strong>
            </p>
            <p className="text-sm text-neutral-700 mb-2">
              Amount: <strong>₹{initResp.amount}</strong>
            </p>
            <p className="text-sm text-neutral-700 mb-4">
              Currency: <strong>{initResp.currency}</strong>
            </p>

            <div className="space-y-3">
              <Button onClick={handleProceed}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Proceed to Pay"
                )}
              </Button>
              <Button
                onClick={() =>
                  router.push(`/checkout/success?orderId=${orderId}`)
                }
              >
                Continue (simulate)
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 border border-neutral-200 rounded-lg">
            <p className="text-neutral-600">No payment details found.</p>
            <p className="text-sm text-neutral-500 mt-3">
              If this is unexpected, contact support.
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

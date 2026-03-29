import Link from "next/link";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-4">
          Shipping Policy
        </h1>
        <p className="text-sm text-neutral-400 mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Processing Time
            </h2>
            <p>
              Orders are processed within <strong>1–2 business days</strong> (Monday–Saturday,
              excluding public holidays). You will receive a shipping confirmation email with a
              tracking number once your order has been dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Domestic Shipping (India)
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse mt-2">
                <thead>
                  <tr className="border-b border-neutral-200 text-[11px] uppercase tracking-widest text-neutral-500">
                    <th className="text-left py-3 pr-8">Method</th>
                    <th className="text-left py-3 pr-8">Estimated Delivery</th>
                    <th className="text-left py-3">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr>
                    <td className="py-4 pr-8 font-medium text-neutral-900">Standard</td>
                    <td className="py-4 pr-8">4–7 business days</td>
                    <td className="py-4">₹99 (Free over ₹2,999)</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-8 font-medium text-neutral-900">Express</td>
                    <td className="py-4 pr-8">2–3 business days</td>
                    <td className="py-4">₹199</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-8 font-medium text-neutral-900">Same Day</td>
                    <td className="py-4 pr-8">Same day (select cities)</td>
                    <td className="py-4">₹299</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Free Shipping
            </h2>
            <p>
              Enjoy free standard shipping on all orders over <strong>₹2,999</strong>. Discount
              is automatically applied at checkout.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Cash on Delivery (COD)
            </h2>
            <p>
              COD is available on select pincodes across India. You can check availability on
              the product page by entering your pincode. A handling fee of ₹49 applies to COD
              orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Track Your Order
            </h2>
            <p>
              Once your order ships, you'll receive a tracking number by email and SMS. You can
              also track it from your{" "}
              <Link href="/account/orders" className="underline underline-offset-2 hover:text-black">
                orders page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Delivery Issues
            </h2>
            <p>
              If your package has not arrived within the estimated window, please{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-black">contact our support team</Link>{" "}
              and we'll investigate immediately.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-neutral-400">
          <Link href="/refund" className="hover:text-black transition-colors">Refund Policy</Link>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

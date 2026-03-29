import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-4">
          Refund Policy
        </h1>
        <p className="text-sm text-neutral-400 mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Overview
            </h2>
            <p>
              We want you to be completely satisfied with your purchase. If you are not happy
              with your order for any reason, we offer a simple and fair refund process.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Return Window
            </h2>
            <p>
              You may return most items within <strong>30 days</strong> of the delivery date.
              Items must be unused, unwashed, and in their original packaging with all tags
              attached.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Non-Returnable Items
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Innerwear, swimwear, and socks (for hygiene reasons)</li>
              <li>Items marked as Final Sale</li>
              <li>Gift cards</li>
              <li>Items that have been worn, washed, or damaged after delivery</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              How to Initiate a Return
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                Log in to your account and navigate to{" "}
                <Link href="/account/orders" className="underline underline-offset-2 hover:text-black">
                  My Orders
                </Link>
                .
              </li>
              <li>Select the order containing the item you wish to return.</li>
              <li>Click "Return Item" next to the eligible product.</li>
              <li>Select a reason and submit the request.</li>
              <li>We will schedule a pickup within 2–3 business days.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Refund Timeline
            </h2>
            <p>
              Once we receive and inspect the returned item, your refund will be processed within
              <strong> 5–7 business days</strong>. Refunds are credited back to your original
              payment method. We'll notify you by email once the refund is issued.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Exchanges
            </h2>
            <p>
              We currently do not support direct exchanges. Please return your item and place a
              new order for the desired product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Damaged or Incorrect Items
            </h2>
            <p>
              If you received a damaged or incorrect item, please{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-black">contact us</Link>{" "}
              within 48 hours of delivery with photos. We will arrange a free pickup and full
              refund or replacement at no additional cost.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-neutral-400">
          <Link href="/shipping" className="hover:text-black transition-colors">Shipping Policy</Link>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

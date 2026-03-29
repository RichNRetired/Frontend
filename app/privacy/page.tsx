import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-400 mb-16">Last updated: March 2026</p>

        <div className="prose prose-neutral max-w-none space-y-10 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              1. Information We Collect
            </h2>
            <p>
              We collect information you provide directly to us — such as your name, email address,
              shipping address, payment information, and any other information you choose to provide
              when registering for an account, placing an order, or contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Process and fulfil your orders</li>
              <li>Send you order confirmations, shipping updates, and support messages</li>
              <li>Personalise your shopping experience</li>
              <li>Improve our website, products, and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              3. Sharing of Information
            </h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your
              information with service providers (payment processors, shipping partners, analytics
              tools) solely to operate our business, and only under strict confidentiality
              agreements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              4. Cookies
            </h2>
            <p>
              We use cookies and similar tracking technologies to provide a better experience,
              remember your preferences, and measure site performance. You can control cookies
              through your browser settings. See our{" "}
              <Link href="/cookies" className="underline underline-offset-2 hover:text-black">
                Cookie Policy
              </Link>{" "}
              for more details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures including 128-bit SSL encryption
              for all transactions. However, no method of transmission over the Internet is 100%
              secure and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              To exercise these rights, please contact us at{" "}
              <a href="mailto:hello@richnretired.com" className="underline underline-offset-2 hover:text-black">hello@richnretired.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              7. Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-black">contact us</Link>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-neutral-400">
          <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          <Link href="/refund" className="hover:text-black transition-colors">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-black transition-colors">Shipping Policy</Link>
          <Link href="/cookies" className="hover:text-black transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}

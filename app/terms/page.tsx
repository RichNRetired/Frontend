import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-neutral-400 mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the Rich N Retired website and services, you agree to be bound by
              these Terms of Service. If you do not agree with any part of these terms, you may
              not access our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              2. Use of the Site
            </h2>
            <p>
              You may use our website for lawful purposes only. You agree not to use it in any way
              that violates applicable laws or regulations, or that harms or interferes with other
              users or our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              3. Account Responsibility
            </h2>
            <p>
              When you create an account, you are responsible for maintaining the confidentiality
              of your credentials and for all activity that occurs under your account. Notify us
              immediately of any unauthorised use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              4. Product Descriptions & Pricing
            </h2>
            <p>
              We make every effort to display products accurately. However, we do not guarantee
              that descriptions are complete or error-free. Prices are subject to change without
              notice. We reserve the right to cancel orders with incorrect pricing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              5. Payments
            </h2>
            <p>
              All payments are processed securely through our payment partners. By placing an
              order, you confirm that the payment information provided is accurate and that you
              are authorised to use the chosen payment method.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              6. Intellectual Property
            </h2>
            <p>
              All content on this website — including text, graphics, logos, images, and software
              — is the property of Rich N Retired and is protected by applicable intellectual property
              laws. You may not reproduce or distribute any content without our prior written
              consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              7. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Rich N Retired shall not be liable for any
              indirect, incidental, special, or consequential damages arising from your use of
              our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              8. Changes to These Terms
            </h2>
            <p>
              We reserve the right to update these terms at any time. Continued use of our
              services after changes constitutes your acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              9. Contact
            </h2>
            <p>
              Questions about these terms? Reach us at{" "}
              <a href="mailto:hello@richnretired.com" className="underline underline-offset-2 hover:text-black">
                hello@richnretired.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-neutral-400">
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/refund" className="hover:text-black transition-colors">Refund Policy</Link>
          <Link href="/shipping" className="hover:text-black transition-colors">Shipping Policy</Link>
          <Link href="/cookies" className="hover:text-black transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </div>
  );
}

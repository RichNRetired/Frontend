import Link from "next/link";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-bold mb-4">
          Legal
        </p>
        <h1 className="text-5xl font-light tracking-tighter uppercase mb-4">
          Cookie Policy
        </h1>
        <p className="text-sm text-neutral-400 mb-16">Last updated: March 2026</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-neutral-700">
          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device when you visit our website.
              They help us deliver a better experience by remembering your preferences, keeping
              you signed in, and understanding how our site is used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Types of Cookies We Use
            </h2>
            <div className="space-y-4 mt-2">
              <div className="border-l-2 border-neutral-900 pl-4">
                <p className="font-semibold text-neutral-900 mb-1">Essential Cookies</p>
                <p>Required for the website to function. These cannot be disabled.</p>
              </div>
              <div className="border-l-2 border-neutral-300 pl-4">
                <p className="font-semibold text-neutral-900 mb-1">Functional Cookies</p>
                <p>Remember your preferences such as language, saved cart, and login state.</p>
              </div>
              <div className="border-l-2 border-neutral-300 pl-4">
                <p className="font-semibold text-neutral-900 mb-1">Analytics Cookies</p>
                <p>
                  Help us understand how visitors interact with our site so we can improve it.
                  Data is aggregated and anonymised.
                </p>
              </div>
              <div className="border-l-2 border-neutral-300 pl-4">
                <p className="font-semibold text-neutral-900 mb-1">Marketing Cookies</p>
                <p>
                  Used to deliver relevant advertisements and track the effectiveness of
                  campaigns. Can be managed in your browser settings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Managing Cookies
            </h2>
            <p>
              You can control and delete cookies through your browser settings at any time.
              Please note that disabling certain cookies may affect the functionality of our
              website. Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>View cookies stored on your device</li>
              <li>Block cookies by default</li>
              <li>Allow cookies only from trusted sites</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Third-Party Cookies
            </h2>
            <p>
              We use third-party services such as Google Analytics and Razorpay which may set
              their own cookies. These are governed by the respective third-party privacy
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold uppercase tracking-widest text-neutral-900 mb-3">
              Questions
            </h2>
            <p>
              If you have questions about our use of cookies, please{" "}
              <Link href="/contact" className="underline underline-offset-2 hover:text-black">contact us</Link>.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-neutral-200 flex flex-wrap gap-6 text-[11px] uppercase tracking-widest text-neutral-400">
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}

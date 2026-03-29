"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";

const FAQ_CATEGORIES = [
  {
    id: "orders",
    label: "Orders & Payment",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse our collections, select your size, and add items to your cart. Proceed to checkout, enter your delivery address, and complete payment via UPI, card, or net banking. You will receive an order confirmation by email immediately.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI, net banking, and popular wallets. All transactions are secured with 256-bit SSL encryption.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "You may cancel an order within 30 minutes of placing it from your Orders page. After dispatch, cancellations are no longer possible — please use our Returns process instead.",
      },
      {
        q: "Why was my payment declined?",
        a: "Payments can fail due to insufficient balance, incorrect card details, or a temporary bank block. Please retry with a different payment method or contact your bank. Your money is never debited on a failed transaction.",
      },
      {
        q: "Will I receive an invoice for my order?",
        a: "Yes. A GST invoice is emailed to you once your order is confirmed. You can also download it from the Orders section of your account at any time.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 4–7 business days across India. Express delivery (1–3 business days) is available at checkout for select pincodes. Metro cities are typically fulfilled faster.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes — all orders above ₹1,999 qualify for free standard shipping. Below that threshold, a flat shipping fee of ₹99 applies.",
      },
      {
        q: "Can I track my shipment?",
        a: "Absolutely. Once your order is dispatched, you will receive a tracking link via email and SMS. You can also visit your Orders page and click Track Shipment for live updates.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within India only. International shipping is on our roadmap — sign up for our newsletter to be notified when it launches.",
      },
      {
        q: "What happens if I am not available at the time of delivery?",
        a: "Our courier partner will attempt delivery twice. If both attempts fail, the package is held at their nearest facility for 3 days before being returned to us. Please contact us to rearrange delivery.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Exchanges",
    questions: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 15 days of delivery, provided items are unworn, unwashed, and in their original packaging with all tags intact. Sale items are excluded from returns.",
      },
      {
        q: "How do I initiate a return?",
        a: "Go to Account → Returns → Request a Return. Select the item(s) you wish to return, choose a reason, and submit. Our team will schedule a free pickup within 48 hours.",
      },
      {
        q: "How long does the refund take?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount is credited back to your original payment method.",
      },
      {
        q: "Can I exchange an item for a different size?",
        a: "Yes. When raising a return request, select 'Exchange' as the resolution type and choose your preferred size. Subject to stock availability. If the size is unavailable, a full refund is issued.",
      },
      {
        q: "What if I receive a damaged or incorrect item?",
        a: "We sincerely apologise. Please contact us within 48 hours of delivery with photographs of the issue. We will arrange an immediate replacement or full refund, with no return pickup required on your part.",
      },
    ],
  },
  {
    id: "products",
    label: "Products & Fit",
    questions: [
      {
        q: "How do I find my correct size?",
        a: "Each product page includes a size recommendation. For detailed measurements, visit our Size Guide. When in doubt, we recommend sizing up — our silhouettes are cut for an intentional drape.",
      },
      {
        q: "How should I care for my garments?",
        a: "Specific care instructions are printed on each garment's label. As a general rule, cold machine wash or hand wash in gentle detergent, and avoid high-heat drying to preserve fabric integrity.",
      },
      {
        q: "Are your fabrics sustainably sourced?",
        a: "Sustainability is central to what we do. We work exclusively with certified mills that follow responsible dyeing and water-treatment practices. More details are on our Sustainability page.",
      },
      {
        q: "A product is out of stock — will it be restocked?",
        a: "Popular pieces are often restocked. Hit the 'Notify Me' button on the product page and we will email you the moment it becomes available again.",
      },
    ],
  },
  {
    id: "account",
    label: "Account & Wishlist",
    questions: [
      {
        q: "Do I need an account to shop?",
        a: "No — you can check out as a guest. However, creating a free account lets you track orders, save addresses, manage returns, and access your wishlist across devices.",
      },
      {
        q: "How do I reset my password?",
        a: "On the login page, click 'Forgot Password' and enter your registered email. You will receive a reset link within a few minutes. Check your spam folder if it does not arrive.",
      },
      {
        q: "How do I save items to my Wishlist?",
        a: "Click the heart icon on any product card or product page. Your Wishlist is accessible from your account, and saves automatically across sessions when you are logged in.",
      },
      {
        q: "How do I update my delivery address?",
        a: "Go to Account → Addresses to add, edit, or remove saved addresses. You can also add a new address directly during checkout.",
      },
    ],
  },
];

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const AccordionItem = ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: AccordionItemProps) => (
  <div className="border-b border-neutral-100 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-start justify-between gap-6 py-6 text-left group"
    >
      <span className="flex items-start gap-5">
        <span className="text-[9px] font-bold tracking-widest text-neutral-300 mt-1 shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-base font-light tracking-wide text-neutral-800 group-hover:text-neutral-500 transition-colors duration-200">
          {question}
        </span>
      </span>
      <span className="shrink-0 mt-1 text-neutral-400">
        {isOpen ? (
          <Minus className="w-4 h-4 stroke-[1.5px]" />
        ) : (
          <Plus className="w-4 h-4 stroke-[1.5px]" />
        )}
      </span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
        isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"
      }`}
    >
      <p className="pl-9 text-sm font-light text-neutral-500 leading-relaxed tracking-wide">
        {answer}
      </p>
    </div>
  </div>
);

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const currentCategory =
    FAQ_CATEGORIES.find((c) => c.id === activeCategory) ?? FAQ_CATEGORIES[0];

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setOpenIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-neutral-900 font-sans antialiased selection:bg-neutral-100">
      {/* Page Header */}
      <header className="pt-48 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[9px] uppercase tracking-[0.8em] text-neutral-400 font-medium mb-6 block">
            Support
          </span>
          <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] uppercase mb-6">
            Frequently Asked{" "}
            <span className="serif lowercase tracking-normal">Questions</span>
          </h1>
          <p className="text-sm text-neutral-400 font-light tracking-wide max-w-md mx-auto">
            Everything you need to know about ordering, shipping, and our
            garments.
          </p>
          <div className="w-px h-16 bg-neutral-200 mx-auto mt-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Sidebar — Category Nav */}
          <aside className="lg:col-span-3">
            <nav className="sticky top-32 space-y-1">
              <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 font-bold mb-6">
                Topics
              </p>
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full text-left py-3 px-4 text-sm font-light tracking-wide transition-all duration-200 rounded-sm ${
                    activeCategory === cat.id
                      ? "bg-neutral-900 text-white"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Accordion — Questions */}
          <section className="lg:col-span-9">
            <div className="mb-10">
              <span className="text-[9px] uppercase tracking-[0.5em] text-neutral-300 font-bold block mb-3">
                {String(currentCategory.questions.length).padStart(2, "0")} Questions
              </span>
              <h2 className="text-3xl md:text-4xl font-extralight tracking-tight serif">
                {currentCategory.label}
              </h2>
            </div>

            <div className="divide-y divide-neutral-100 border-t border-neutral-100">
              {currentCategory.questions.map((item, i) => (
                <AccordionItem
                  key={`${activeCategory}-${i}`}
                  question={item.q}
                  answer={item.a}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  index={i}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Still have questions CTA */}
        <div className="mt-40 border-t border-neutral-100 pt-24 text-center">
          <p className="text-[9px] uppercase tracking-[0.5em] text-neutral-400 font-bold mb-6">
            Still have questions?
          </p>
          <h3 className="text-3xl md:text-4xl font-extralight tracking-tight serif mb-8 text-neutral-800">
            Our team is here to help.
          </h3>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-neutral-900 text-neutral-900 px-10 py-4 text-xs uppercase tracking-[0.3em] font-medium hover:bg-neutral-900 hover:text-white transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;


import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Hero */}
      <section className="bg-neutral-50 border-b border-neutral-100 py-24 px-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-neutral-400 font-bold mb-5">
          Rich N Retired Journal
        </p>
        <h1 className="text-6xl font-light tracking-tighter uppercase mb-5">
          The Blog
        </h1>
        <p className="text-neutral-500 text-sm max-w-md mx-auto">
          Stories on style, sustainability, and the culture of dressing well.
          New editorials coming soon.
        </p>
      </section>

      {/* Coming Soon */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-100 mb-8">
          <span className="text-3xl">✦</span>
        </div>
        <h2 className="text-2xl font-light tracking-tight uppercase mb-4">
          Coming Soon
        </h2>
        <p className="text-neutral-500 text-sm leading-relaxed max-w-sm mx-auto mb-10">
          We are crafting a curated journal of style inspiration, behind-the-scenes stories,
          and the culture behind the brand. Check back soon.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-black text-white text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-neutral-800 transition-all"
        >
          Back to Shop
        </Link>
      </section>
    </div>
  );
}

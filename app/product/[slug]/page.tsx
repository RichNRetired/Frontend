export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Product: {params.slug}</h1>
      <p className="mt-4">Product details here.</p>
    </div>
  );
}

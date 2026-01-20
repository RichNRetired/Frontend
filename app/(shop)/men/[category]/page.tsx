export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold capitalize">{params.category}</h1>
      <p className="mt-4">Browse our {params.category} collection.</p>
    </div>
  );
}

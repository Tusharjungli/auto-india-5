import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Breadcrumb from '@/components/Breadcrumb';

export default async function CategoryProducts({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
    include: { products: true },
  });

  if (!category) return <div>Category not found.</div>;

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-6xl mx-auto">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            { label: category.name, href: `/categories/${category.id}` },
          ]}
        />

        <h1 className="text-3xl font-bold mb-8 text-center">{category.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {category.products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              description={product.description ?? ''}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

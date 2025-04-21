import { prisma } from '@/lib/prisma';
import CategoryCard from '@/components/CategoryCard';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany();

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-3xl font-bold mb-8 text-center">Browse by Category</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} id={cat.id} name={cat.name} />
        ))}
      </div>
    </main>
  );
}

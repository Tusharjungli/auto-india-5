'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import Link from 'next/link';

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  if (!categories.length) return null;

  return (
    <section className="py-12 px-4 bg-[var(--bg)] text-[var(--text)]">
      <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <div className="border rounded-lg p-4 text-center hover:shadow-md transition">
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

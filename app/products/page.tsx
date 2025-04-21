'use client';

import { useEffect, useState, useMemo } from 'react';
import { Product, Category } from '@prisma/client';
import ProductCard from '@/components/ProductCard';
import debounce from 'lodash.debounce';
import ClipLoader from 'react-spinners/ClipLoader';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [priceRange, setPriceRange] = useState(0);
  const [page, setPage] = useState(1);

  // 🧠 Restore scroll position on mount
  useEffect(() => {
    const savedY = sessionStorage.getItem('scrollY');
    if (savedY) window.scrollTo(0, parseInt(savedY));
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.setItem('scrollY', window.scrollY.toString());
    };
  }, []);

  // 💾 Restore filters from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('filters');
    if (saved) {
      const { search, priceRange, selectedCategories } = JSON.parse(saved);
      setSearch(search);
      setPriceRange(priceRange);
      setSelectedCategories(selectedCategories);
    }
  }, []);

  // 💾 Save filters to sessionStorage
  useEffect(() => {
    sessionStorage.setItem(
      'filters',
      JSON.stringify({ search, priceRange, selectedCategories })
    );
  }, [search, priceRange, selectedCategories]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const fetchProducts = async (
    searchQuery: string,
    maxPrice: number,
    categoryIds: string[],
    currentPage: number
  ) => {
    setLoading(true);
    const url = new URL('/api/products', window.location.origin);
    url.searchParams.set('search', searchQuery);
    url.searchParams.set('price', maxPrice.toString());
    url.searchParams.set('page', currentPage.toString());
    categoryIds.forEach((id) => url.searchParams.append('category', id));

    const res = await fetch(url.toString());
    const data = await res.json();
    setProducts(data.products);
    setLoading(false);
  };

  const debouncedFetch = useMemo(() => debounce(fetchProducts, 500), []);

  useEffect(() => {
    debouncedFetch(search, priceRange, selectedCategories, page);
    return () => debouncedFetch.cancel();
  }, [search, priceRange, selectedCategories, page, debouncedFetch]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPage(1);
  };

  return (
    <main className="p-6 bg-[var(--bg)] text-[var(--text)] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">All Products</h1>

      {/* 🔍 Search & Filter UI */}
      <div className="max-w-2xl mx-auto grid gap-4 sm:grid-cols-2 mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-[var(--bg)] text-[var(--text)]"
        />
        <input
          type="range"
          min={0}
          max={5000}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
        <span className="text-sm text-center text-gray-400">
          Price ≤ ₹{priceRange || '∞'}
        </span>
      </div>

      {/* 🧩 Category Chips */}
      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              selectedCategories.includes(cat.id)
                ? 'bg-white text-black'
                : 'bg-transparent border-gray-500 text-gray-400 hover:border-white hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 📦 Product Grid */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <ClipLoader size={40} color="#888" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
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
      )}

      {/* 🧭 Pagination */}
      <div className="flex justify-center mt-10 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-400">Page {page}</span>
        <button
          disabled={products.length < 6}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}

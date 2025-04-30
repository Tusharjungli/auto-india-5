'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import debounce from 'lodash.debounce';

type SearchResult = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Debounced fetch function memoized correctly
  const debouncedFetchResults = useMemo(() => {
    return debounce(async (search: string) => {
      if (!search) {
        setResults([]);
        return;
      }
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(search)}`);
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (error) {
        console.error('❌ Search fetch error:', error);
      }
    }, 300);
  }, []);

  useEffect(() => {
    debouncedFetchResults(query);
    return () => debouncedFetchResults.cancel();
  }, [query, debouncedFetchResults]);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for parts, brands, or vehicles..."
        className="w-full px-4 py-2 rounded bg-[var(--bg)] border dark:border-gray-700 text-[var(--text)]"
      />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 bg-[var(--bg)] text-[var(--text)] w-full mt-2 border border-gray-600 rounded shadow-lg">
          {results.map((result) => (
            <li key={result.id}>
              <Link
                href={`/products/${result.id}`}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-800 transition"
                onClick={() => setShowDropdown(false)}
              >
                <div className="relative w-10 h-10">
                  <Image
                    src={result.imageUrl}
                    alt={result.name}
                    fill
                    className="object-cover rounded"
                    sizes="40px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{result.name}</p>
                  <p className="text-xs text-gray-400">₹{result.price.toLocaleString()}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

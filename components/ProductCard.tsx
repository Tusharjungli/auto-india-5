'use client';

import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  searchQuery?: string; // ✅ Optional prop
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
  searchQuery = '',
}: ProductCardProps) {
  const getSafeImageUrl = (url: string) => {
    if (!url) return '/images/default-placeholder.png';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/images/${url.replace(/^\/+/, '')}`;
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-300 text-black px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <Link href={`/products/${id}`}>
        <div className="relative w-full h-56 mb-4">
          <Image
            src={getSafeImageUrl(imageUrl)}
            alt={name}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <h3 className="text-lg font-semibold mb-1">{highlightText(name)}</h3>
        <p className="text-sm text-gray-500 mb-2">{highlightText(description.slice(0, 60))}...</p>
        <div className="text-xl font-bold">₹{price.toLocaleString()}</div>
      </Link>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
}: ProductCardProps) {
  // 🛠️ Properly handle local and Cloudinary image URLs:
  const getFormattedImageUrl = (url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url; // ✅ Cloudinary or external link
    }
    if (url.startsWith('/')) {
      return url; // ✅ Public folder image
    }
    return `/images/${url.replace(/^\/+/, '')}`; // ✅ Fallback for relative paths
  };

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <Link href={`/products/${id}`}>
        <div className="relative w-full h-56 mb-4">
          <Image
            src={getFormattedImageUrl(imageUrl)}
            alt={name}
            fill
            className="object-cover rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {description.slice(0, 60)}...
        </p>
        <div className="text-xl font-bold">₹{price.toLocaleString()}</div>
      </Link>
    </div>
  );
}

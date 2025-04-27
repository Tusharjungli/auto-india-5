'use client';

import { useCart } from '@/context/CartContext';

type Props = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function ProductDetailClient({ id, name, price, imageUrl }: Props) {
  const { addToCart } = useCart();

  const getSafeImageUrl = (url: string) => {
    if (!url) return '/images/default-placeholder.png';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/')) return url;
    return `/images/${url.replace(/^\/+/, '')}`;
  };

  return (
    <button
      onClick={() => addToCart({ id, name, price, imageUrl: getSafeImageUrl(imageUrl) })}
      className="w-full px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
    >
      Add to Cart
    </button>
  );
}

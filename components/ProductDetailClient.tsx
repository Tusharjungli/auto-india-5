'use client';

import { useCart } from '@/context/CartContext';

type Props = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

export default function ProductDetailClient({
  id,
  name,
  price,
  imageUrl,
}: Props) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      imageUrl: imageUrl.startsWith('http') || imageUrl.startsWith('/')
        ? imageUrl
        : `/images/${imageUrl.replace(/^\/+/, '')}`, // ✅ Ensures correct image format here too!
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
    >
      Add to Cart
    </button>
  );
}

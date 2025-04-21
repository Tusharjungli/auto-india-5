'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

type ProductProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
};

export default function ProductCard({ id, name, price, imageUrl, description }: ProductProps) {
  return (
    <Link href={`/products/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className="bg-[var(--bg)] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 group cursor-pointer"
      >
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-1 text-[var(--text)]">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">{description}</p>
          <div className="text-base font-medium text-gray-700 dark:text-gray-300">
            ₹{price.toLocaleString()}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

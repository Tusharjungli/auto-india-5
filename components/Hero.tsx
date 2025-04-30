'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full text-white">
      <Image
        src="/images/hero-car.jpg"
        alt="Premium Auto Parts"
        fill
        className="object-cover brightness-[0.4]"
        priority
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-xl tracking-wide">
          Find the Perfect Auto Part
        </h1>
        <p className="text-base sm:text-lg max-w-xl drop-shadow-md text-gray-200 mb-4">
          Instantly search by name, brand, or vehicle. Powered by smart matching.
        </p>
        <div className="w-full max-w-xl">
          <SearchBox />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200 font-semibold"
          >
            View All Products
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center py-6 px-4 text-sm text-gray-500 bg-[var(--bg)] border-t dark:border-gray-700">
      <div className="max-w-screen-sm mx-auto space-y-3">
        <p>
          &copy; {new Date().getFullYear()} Auto India Spare Parts. Built for performance and trust.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
          <Link href="/about" className="hover:text-white transition">About Us</Link>
          <Link href="/returns" className="hover:text-white transition">Returns</Link>
          <Link href="/warranty" className="hover:text-white transition">Warranty</Link>
        </div>
      </div>
    </footer>
  );
}

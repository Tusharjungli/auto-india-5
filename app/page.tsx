'use client';

import Hero from '@/components/Hero';
import TrustHighlights from '@/components/TrustHighlights';
import CategoryGrid from '@/components/CategoryGrid';

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustHighlights />
      <CategoryGrid />
    </main>
  );
}

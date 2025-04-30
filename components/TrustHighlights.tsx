'use client';

import { ShieldCheck, Truck, Star } from 'lucide-react';

const highlights = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-green-500" />,
    title: 'Genuine Quality',
    description: 'We source only certified and OEM-grade parts for maximum reliability.',
  },
  {
    icon: <Truck className="w-8 h-8 text-blue-500" />,
    title: 'Fast Delivery',
    description: 'Pan-India shipping with tracking — get parts to your door fast.',
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-500" />,
    title: 'Customer Rated',
    description: 'Loved by car enthusiasts, mechanics, and professional garages alike.',
  },
];

export default function TrustHighlights() {
  return (
    <section className="bg-[var(--bg)] text-[var(--text)] py-12 px-4 border-t border-b dark:border-gray-700">
      <div className="max-w-6xl mx-auto grid gap-8 sm:grid-cols-3 text-center">
        {highlights.map((item, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-center">{item.icon}</div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

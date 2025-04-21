'use client';

import { useState } from 'react';

type Props = {
  description?: string;
};

type Tab = 'description' | 'compatibility' | 'shipping';

export default function ProductTabs({ description }: Props) {
  const [tab, setTab] = useState<Tab>('description');

  return (
    <div className="mt-10">
      <div className="flex space-x-4 border-b border-gray-700 mb-4">
        {['description', 'compatibility', 'shipping'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as Tab)}
            className={`capitalize pb-2 border-b-2 transition ${
              tab === t
                ? 'border-white text-white'
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'description' && (
        <p className="text-gray-400">{description || 'No description available.'}</p>
      )}
      {tab === 'compatibility' && (
        <ul className="text-gray-400 space-y-1 list-disc list-inside">
          <li>Compatible with most Indian sedans and SUVs</li>
          <li>Check with your vehicle model before purchase</li>
          <li>Free return if incompatible</li>
        </ul>
      )}
      {tab === 'shipping' && (
        <ul className="text-gray-400 space-y-1 list-disc list-inside">
          <li>Ships in 1–2 business days</li>
          <li>Delivery across India within 3–7 days</li>
          <li>Free shipping on orders over ₹999</li>
        </ul>
      )}
    </div>
  );
}

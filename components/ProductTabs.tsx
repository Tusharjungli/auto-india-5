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
      {/* 🟢 Tab Buttons */}
      <div className="flex space-x-4 border-b border-gray-700 mb-4">
        {(['description', 'compatibility', 'shipping'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
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

      {/* 🟢 Tab Content */}
      {tab === 'description' && (
        <p className="text-gray-400">
          {description || 'No description available for this product.'}
        </p>
      )}

      {tab === 'compatibility' && (
        <ul className="text-gray-400 space-y-1 list-disc list-inside">
          <li>Compatible with most Indian sedans, hatchbacks, and SUVs.</li>
          <li>Always check with your vehicle model before purchase.</li>
          <li>Free return policy if incompatible (within 7 days).</li>
        </ul>
      )}

      {tab === 'shipping' && (
        <ul className="text-gray-400 space-y-1 list-disc list-inside">
          <li>Ships within 1–2 business days.</li>
          <li>Delivery across India within 3–7 working days.</li>
          <li>Free shipping on orders above ₹999.</li>
        </ul>
      )}
    </div>
  );
}

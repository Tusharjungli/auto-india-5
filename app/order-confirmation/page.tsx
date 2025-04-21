'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderConfirmation() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('lastOrderId');
    setOrderId(id);
    localStorage.removeItem('cart'); // clear cart after order
  }, []);

  return (
    <main className="min-h-screen p-6 flex flex-col items-center justify-center text-center bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-4xl font-bold mb-4">✅ Order Confirmed!</h1>
      {orderId && (
        <p className="text-lg mb-6">
          Your order ID is <span className="font-mono text-gray-500">{orderId}</span>
        </p>
      )}
      <button
        onClick={() => router.push('/products')}
        className="px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
      >
        Continue Shopping
      </button>
    </main>
  );
}

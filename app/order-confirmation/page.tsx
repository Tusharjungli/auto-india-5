'use client';

import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderConfirmationPage() {
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('lastOrderId');
    if (id) {
      setOrderId(id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      localStorage.removeItem('lastOrderId');
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-[var(--bg)] text-[var(--text)]">
      <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Thank you for your order!</h1>
      <p className="text-gray-400 mb-4">
        Your order has been placed successfully.
      </p>
      {orderId && (
        <p className="text-sm text-gray-500">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
    </main>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { PackageOpen } from 'lucide-react';
import Link from 'next/link';

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export default function Dashboard() {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/orders/user?email=${user}`)
      .then((res) => res.json())
      .then(setOrders);
  }, [user]);

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 flex flex-col items-center gap-2 mt-10">
          <PackageOpen className="w-10 h-10" />
          <p>No orders yet.</p>
          <Link href="/products" className="text-blue-500 underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded">
              <div className="text-sm text-gray-400">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="font-semibold mb-1">Total: ₹{order.total.toLocaleString()}</div>
              <ul className="text-sm text-gray-300 list-disc ml-4">
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.name} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

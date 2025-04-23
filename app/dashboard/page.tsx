'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { PackageOpen, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import ClipLoader from 'react-spinners/ClipLoader';

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
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/user?email=${session.user.email}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.warn('⚠ Unexpected order data:', data);
        setOrders([]);
      }
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ✅ Proper access control for regular logged-in users
  if (!session?.user?.email) {
    return (
      <p className="text-center text-red-500 mt-10">
        Please login to view your orders.
      </p>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center space-x-1 text-sm border px-3 py-1 rounded hover:bg-gray-800 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-20">
          <ClipLoader size={40} color="#888" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 flex flex-col items-center gap-2 mt-10">
          <PackageOpen className="w-10 h-10" />
          <p>No orders yet.</p>
          <Link href="/products" className="text-blue-500 underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded">
              <div className="text-sm text-gray-400">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </div>
              <div className="font-semibold mb-1">
                Total: ₹{order.total.toLocaleString()}
              </div>
              <ul className="text-sm text-gray-300 list-disc ml-4">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

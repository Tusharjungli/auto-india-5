'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import ClipLoader from 'react-spinners/ClipLoader';
import { PackageSearch } from 'lucide-react';

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: { email: string | null };
  items: { product: { name: string }; quantity: number }[];
};

export default function AdminOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };

    if (session?.user?.isAdmin) {
      fetchOrders();
    }
  }, [session]);

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } else {
      console.error('❌ Failed to update status');
    }
  };

  if (!session?.user?.isAdmin) {
    return <p className="text-center text-red-500 mt-10">Access denied. Admins only.</p>;
  }

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin - All Orders</h1>

      {loading ? (
        <div className="text-center mt-20">
          <ClipLoader size={40} color="#888" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500 flex flex-col items-center gap-2 mt-10">
          <PackageSearch className="w-10 h-10" />
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 border">Order ID</th>
                <th className="p-3 border">User Email</th>
                <th className="p-3 border">Total (₹)</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="p-3 border">{order.id}</td>
                  <td className="p-3 border">{order.user.email || 'N/A'}</td>
                  <td className="p-3 border">₹{order.total.toLocaleString()}</td>
                  <td className="p-3 border">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 rounded bg-gray-900 border border-gray-600 text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3 border">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="p-3 border">
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.product.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

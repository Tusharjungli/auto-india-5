'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

type Stats = {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user?.isAdmin) {
      router.push('/login');
    } else {
      const fetchStats = async () => {
        try {
          const res = await fetch('/api/admin/stats', { cache: 'no-store' });
          const data = await res.json();
          setStats(data);
        } catch (error) {
          console.error('❌ Failed to load stats:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [session, status, router]);

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={40} color="#888" />
      </div>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* ✅ Quick Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-medium mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{stats?.totalUsers ?? '-'}</p>
        </div>

        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-medium mb-2">Total Orders</h2>
          <p className="text-3xl font-bold">{stats?.totalOrders ?? '-'}</p>
        </div>

        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-medium mb-2">Total Revenue</h2>
          <p className="text-3xl font-bold">₹{stats?.totalRevenue.toLocaleString() ?? '-'}</p>
        </div>

        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-md text-center">
          <h2 className="text-lg font-medium mb-2">Pending Orders</h2>
          <p className="text-3xl font-bold">{stats?.pendingOrders ?? '-'}</p>
        </div>
      </div>
    </main>
  );
}

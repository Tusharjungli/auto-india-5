'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import RequireAdmin from '@/components/RequireAdmin';
import toast from 'react-hot-toast';
import ClipLoader from 'react-spinners/ClipLoader';

type Feedback = {
  id: string;
  rating: number;
  comment: string | null;
  product: { name: string };
  user: { email: string | null };
  createdAt: string;
};

export default function AdminFeedbackPage() {
  const { data: session } = useSession();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const res = await fetch('/api/admin/feedback');
      const data = await res.json();
      setFeedbacks(data);
      setLoading(false);
    };

    if (session?.user?.isAdmin) {
      fetchFeedbacks();
    }
  }, [session]);

  const handleDelete = async (feedbackId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this feedback?');
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/feedback/${feedbackId}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
        toast.success('✅ Feedback deleted successfully!');
      } else {
        toast.error('❌ Failed to delete feedback.');
      }
    } catch (error) {
      console.error('❌ Error deleting feedback:', error);
      toast.error('❌ Error deleting feedback.');
    }
  };

  return (
    <RequireAdmin>
      <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin - Feedback Control</h1>

        {loading ? (
          <div className="text-center mt-20">
            <ClipLoader size={40} color="#888" />
          </div>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No feedback found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-700 text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 border">Feedback ID</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">User Email</th>
                  <th className="p-3 border">Rating</th>
                  <th className="p-3 border">Comment</th>
                  <th className="p-3 border">Created At</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((feedback) => (
                  <tr key={feedback.id} className="border-t">
                    <td className="p-3 border">{feedback.id}</td>
                    <td className="p-3 border">{feedback.product.name}</td>
                    <td className="p-3 border">{feedback.user.email || 'N/A'}</td>
                    <td className="p-3 border">{feedback.rating}</td>
                    <td className="p-3 border">{feedback.comment || '-'}</td>
                    <td className="p-3 border">{new Date(feedback.createdAt).toLocaleString()}</td>
                    <td className="p-3 border">
                      <button
                        onClick={() => handleDelete(feedback.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </RequireAdmin>
  );
}

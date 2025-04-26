'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type FeedbackFormProps = {
  productId: string;
};

export default function FeedbackForm({ productId }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('✅ Feedback submitted successfully!');
        setRating(5);
        setComment('');
      } else {
        toast.error(`❌ ${data.error || 'Failed to submit feedback.'}`);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('❌ Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 p-4 border rounded-lg bg-gray-900 text-white">
      <h3 className="text-lg font-semibold">Leave Your Feedback</h3>
      <div>
        <label htmlFor="rating" className="block mb-1">Rating (1-5)</label>
        <input
          id="rating"
          type="number"
          min={1}
          max={5}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="w-16 px-2 py-1 rounded border dark:border-gray-700 bg-[var(--bg)] text-[var(--text)]"
        />
      </div>
      <div>
        <label htmlFor="comment" className="block mb-1">Comment (optional)</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 rounded border dark:border-gray-700 bg-[var(--bg)] text-[var(--text)]"
          placeholder="Share your experience..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}

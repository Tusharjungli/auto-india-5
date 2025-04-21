import Link from 'next/link';

export default function CategoryCard({ id, name }: { id: string; name: string }) {
  return (
    <Link href={`/categories/${id}`}>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center text-lg font-semibold hover:shadow-md transition cursor-pointer bg-[var(--bg)] text-[var(--text)]">
        {name}
      </div>
    </Link>
  );
}

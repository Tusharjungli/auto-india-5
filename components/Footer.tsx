'use client';

export default function Footer() {
    return (
      <footer className="text-center py-6 px-4 text-sm text-gray-500 bg-[var(--bg)] border-t dark:border-gray-700">
      <div className="max-w-screen-sm mx-auto">
        <p>© {new Date().getFullYear()} Auto India Spare Parts. Built for performance and trust.</p>
      </div>
    </footer>
  );
}
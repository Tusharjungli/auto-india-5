import Link from 'next/link';

type BreadcrumbProps = {
  items: { label: string; href: string }[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            <Link href={item.href} className="hover:underline hover:text-white">
              {item.label}
            </Link>
            {i < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

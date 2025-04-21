'use client';

import Link from 'next/link';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useUser();
  const router = useRouter();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[var(--bg)] text-[var(--text)] shadow-md border-b border-gray-300 dark:border-gray-700 backdrop-blur-md transition-colors">
      <div className="text-2xl font-semibold tracking-widest uppercase">
        <Link href="/">Auto India</Link>
      </div>
      <ul className="flex items-center space-x-6 text-sm font-medium">
        <li><Link href="/products" className="hover:text-gray-500 transition">Products</Link></li>
        <li><Link href="/categories" className="hover:text-gray-500 transition">Categories</Link></li>
        <li className="relative">
          <Link href="/cart" className="flex items-center hover:text-gray-500 transition">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </li>

        {user ? (
          <>
            <li><Link href="/dashboard" className="hover:text-gray-500 transition">My Orders</Link></li>
            <li className="text-xs sm:text-sm text-gray-400">{user}</li>
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-gray-500 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login" className="hover:text-gray-500 transition">Login</Link></li>
            <li><Link href="/signup" className="hover:text-gray-500 transition">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

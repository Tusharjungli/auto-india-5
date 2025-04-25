'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import RequireAuth from '@/components/RequireAuth';
import PayButton from '@/components/PayButton';
import { useSession } from 'next-auth/react';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  return (
    <RequireAuth>
      <main className="min-h-screen p-6 bg-[var(--bg)] text-[var(--text)]">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500 flex flex-col items-center gap-2 mt-10">
            <ShoppingCart className="w-10 h-10" />
            <p>Your cart is empty.</p>
            <Link href="/products" className="text-blue-500 underline">
              Shop now
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <div className="text-sm text-gray-500">
                    ₹{item.price.toLocaleString()}
                  </div>
                  <input
                    type="number"
                    value={item.quantity}
                    min={1}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="mt-2 w-16 px-2 py-1 rounded border dark:border-gray-700 text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[var(--bg)]"
                  />
                </div>
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    toast('🗑️ Item removed from cart');
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="text-right text-xl font-bold">
              Total: ₹{total.toLocaleString()}
            </div>

            {/* ✅ PayButton placed properly without nesting issues */}
            <PayButton cart={cart} total={total} userEmail={userEmail} />
          </div>
        )}
      </main>
    </RequireAuth>
  );
}

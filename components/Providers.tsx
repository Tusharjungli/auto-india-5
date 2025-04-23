'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchInterval={60} refetchOnWindowFocus={true}>
      {/* ✅ refetchInterval helps keep the session alive */}
      <CartProvider>
        {children}
        <Toaster position="top-center" />
      </CartProvider>
    </SessionProvider>
  );
}

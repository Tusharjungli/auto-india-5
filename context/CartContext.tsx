'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const stored = localStorage.getItem('cart');
      if (stored) setCart(JSON.parse(stored));
    } else {
      setCart([]); // ✅ Clear cart if logged out
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, session]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    if (!session?.user) {
      toast.error('❌ Please log in to add items to cart!');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(quantity, 1) } : p))
    );
  };

  const clearCart = () => {
    setCart([]); // ✅ Clears the entire cart
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

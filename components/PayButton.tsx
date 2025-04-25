'use client';

import { CartItem } from '@/types/cart';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';

type PayButtonProps = {
  cart: CartItem[];
  total: number;
  userEmail?: string;
};

export default function PayButton({ cart, total, userEmail }: PayButtonProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { clearCart } = useCart();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCheckout = async () => {
    if (!userEmail) {
      toast.error('❌ Please log in to proceed with payment.');
      return;
    }

    if (!isScriptLoaded || !window.Razorpay) {
      toast.error('❌ Razorpay script not loaded. Please try again.');
      return;
    }

    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      const data = await response.json();

      if (!data.id) {
        throw new Error('Payment initiation failed');
      }

      const options: RazorpayCheckout.RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        prefill: { email: userEmail },
        theme: { color: '#1a1a1a' },
        handler: async (response: RazorpayCheckout.RazorpayResponse) => {
          console.log('✅ Payment response:', response);

          // ✅ NEW: CALL your order creation API here:
          const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail, cart, total }),
          });

          if (!orderResponse.ok) {
            toast.error('❌ Payment done but failed to create order!');
            console.error('❌ Order creation failed after payment.');
            return;
          }

          clearCart();
          toast.success('✅ Payment successful! Order placed!');
          window.location.href = '/order-confirmation';
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('❌ Payment error:', error);
      toast.error('❌ Payment failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={cart.length === 0}
      className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Pay with Razorpay
    </button>
  );
}

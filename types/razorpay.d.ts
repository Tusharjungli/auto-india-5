declare global {
  namespace RazorpayCheckout {
    interface RazorpayResponse {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }

    interface RazorpayOptions {
      key: string;
      amount: number;
      currency: string;
      order_id: string;
      handler: (response: RazorpayResponse) => void;
      prefill?: {
        email?: string;
      };
      theme?: {
        color?: string;
      };
    }

    interface RazorpayInstance {
      open(): void;
    }
  }

  interface Window {
    Razorpay: new (options: RazorpayCheckout.RazorpayOptions) => RazorpayCheckout.RazorpayInstance;
  }
}

export {};

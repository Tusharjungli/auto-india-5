import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { Toaster } from 'react-hot-toast';
import { Manrope } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport = {
  themeColor: '#000000',
};

export const metadata = {
  metadataBase: new URL('https://yourdomain.com'), // 🔁 replace with real domain when deployed
  title: 'Auto India Spare Parts',
  description:
    'Buy premium automobile spare parts online. Fast delivery. Trusted service. Built for India.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Auto India Spare Parts',
    description: 'Premium car spare parts — delivered across India.',
    url: 'https://yourdomain.com',
    siteName: 'Auto India',
    images: [
      {
        url: '/images/og-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Auto India Spare Parts',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans bg-[var(--bg)] text-[var(--text)] transition-colors`}>
        <UserProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            <ThemeToggle />
            <Toaster position="top-center" />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}

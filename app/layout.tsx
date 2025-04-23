import './globals.css';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';
import Providers from '@/components/Providers';
import { Manrope } from 'next/font/google';
import { cookies } from 'next/headers';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const viewport = {
  themeColor: '#000000',
};

export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: 'Auto India Spare Parts',
  description: 'Buy premium automobile spare parts online. Fast delivery. Trusted service. Built for India.',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // ✅ Correct: Await cookies() before calling .get()
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  const theme = themeCookie || 'dark';

  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''}>
      <body
        className={`${manrope.variable} font-sans bg-[var(--bg)] text-[var(--text)] transition-colors`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <NavbarWrapper />
          {children}
          <Footer />
          <ThemeToggle />
        </Providers>
      </body>
    </html>
  );
}

import './globals.css';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import ThemeToggle from '@/components/ThemeToggle';
import { Manrope } from 'next/font/google';
import { cookies } from 'next/headers';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: 'Auto India Spare Parts',
  description: 'Buy premium automobile spare parts online. Fast delivery. Trusted service. Built for India.',
  icons: { icon: '/favicon.ico' },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies(); // ✅ FIX: Await the promise
  const themeCookie = cookieStore.get('theme')?.value;
  const theme = themeCookie || 'dark';

  return (
    <html lang="en" className={theme === 'dark' ? 'dark' : ''} suppressHydrationWarning>
      <body
        className={`${manrope.variable} font-sans bg-[var(--bg)] text-[var(--text)] transition-colors`}
        suppressHydrationWarning
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

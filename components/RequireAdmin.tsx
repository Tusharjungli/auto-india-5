'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login'); // If NOT logged in → redirect to login
    } else if (!session.user.isAdmin) {
      router.push('/'); // If logged in but NOT admin → redirect to home
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center mt-20">
        <ClipLoader size={40} color="#888" />
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || password.length < 6) {
      toast.error('Please enter valid email and password (min 6 chars)');
      return;
    }

    if (mode === 'signup') {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      toast.success('✅ Signed up successfully!');
    }

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast.error('❌ Login failed! Check your credentials.');
    } else {
      toast.success('✅ Logged in successfully!');
      router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <input
        type="email"
        placeholder="Email"
        className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-[var(--bg)] text-[var(--text)]"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-4 py-2 rounded border dark:border-gray-700 bg-[var(--bg)] text-[var(--text)]"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition font-semibold"
      >
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </button>
    </form>
  );
}

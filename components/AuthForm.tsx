'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password.length >= 6) {
      login(email);
      toast.success(`${mode === 'login' ? 'Logged in' : 'Signed up'} successfully!`);
      router.push('/');
    } else {
      toast.error('Please enter valid email and password (min 6 chars)');
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

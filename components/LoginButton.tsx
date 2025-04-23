'use client';

import { signIn } from 'next-auth/react';

export default function LoginButton() {
  return (
    <button
      onClick={() => signIn()}
      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
    >
      Login
    </button>
  );
}

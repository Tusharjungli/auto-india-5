import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen p-6 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <AuthForm mode="login" />
        <p className="text-sm text-gray-500">
          Don’t have an account? <a href="/signup" className="underline hover:text-white">Sign up</a>
        </p>
      </div>
    </main>
  );
}

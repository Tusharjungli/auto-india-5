import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <main className="min-h-screen p-6 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold">Create Your Account</h1>
        <AuthForm mode="signup" />
        <p className="text-sm text-gray-500">
          Already have an account? <a href="/login" className="underline hover:text-white">Login</a>
        </p>
      </div>
    </main>
  );
}

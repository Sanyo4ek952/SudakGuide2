import { authFeature } from '@/features';

export default function SignInPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Вход</h1>
      <authFeature.SignInForm />
    </main>
  );
}

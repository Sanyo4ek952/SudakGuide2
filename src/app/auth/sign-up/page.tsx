import { authFeature } from '@/features';

export default function SignUpPage() {
  return (
    <main className="mx-auto max-w-md px-6 py-10">
      <h1 className="mb-4 text-2xl font-semibold">Регистрация</h1>
      <authFeature.SignUpForm />
    </main>
  );
}

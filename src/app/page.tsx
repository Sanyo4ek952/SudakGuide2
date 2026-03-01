import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12">
      <h1 className="text-3xl font-semibold">SudakGuide2 MVP</h1>
      <p className="text-slate-600">Базовый каркас проекта на Next.js 16 + FSD.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link className="rounded bg-slate-900 px-4 py-2 text-white" href="/listings">
          Каталог
        </Link>
        <Link className="rounded border px-4 py-2" href="/auth/sign-in">
          Вход
        </Link>
        <Link className="rounded border px-4 py-2" href="/auth/sign-up">
          Регистрация
        </Link>
      </div>
    </main>
  );
}

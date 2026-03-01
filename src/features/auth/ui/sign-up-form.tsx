'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpInput } from '@/entities/user';

export function SignUpForm() {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' }
  });

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(() => undefined)}>
      <input className="w-full rounded border p-2" placeholder="Имя" {...form.register('name')} />
      <input className="w-full rounded border p-2" placeholder="Email" {...form.register('email')} />
      <input className="w-full rounded border p-2" type="password" placeholder="Пароль" {...form.register('password')} />
      <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
        Зарегистрироваться
      </button>
    </form>
  );
}

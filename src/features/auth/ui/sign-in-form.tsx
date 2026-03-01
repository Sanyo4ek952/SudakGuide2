'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInInput } from '@/entities/user';

type AuthActionState = { ok: boolean; message?: string };

const initialState: AuthActionState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-60" type="submit" disabled={pending}>
      {pending ? 'Входим...' : 'Войти'}
    </button>
  );
}

export function SignInForm({ action }: { action: (state: unknown, formData: FormData) => Promise<AuthActionState> }) {
  const [state, formAction] = useActionState(action, initialState);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  });

  return (
    <form className="space-y-3" action={formAction}>
      <input className="w-full rounded border p-2" placeholder="Email" {...form.register('email')} />
      <input className="w-full rounded border p-2" type="password" placeholder="Пароль" {...form.register('password')} />
      <SubmitButton />
      {state.message && <p className="text-sm text-rose-700">{state.message}</p>}
    </form>
  );
}

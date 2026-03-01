'use server';

import { signInSchema } from '@/entities/user';
import { signIn } from '@/processes/auth';

export async function signInAction(_: unknown, formData: FormData) {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!parsed.success) {
    return { ok: false, message: 'Проверьте email и пароль' } as const;
  }

  try {
    await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: '/listings'
    });
  } catch {
    return { ok: false, message: 'Не удалось войти' } as const;
  }

  return { ok: true } as const;
}

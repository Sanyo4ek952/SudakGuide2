'use server';

import { registerUserAction } from '@/features/auth';

export async function signUpAction(_: unknown, formData: FormData) {
  const result = await registerUserAction(formData);

  if (!result.ok) {
    return { ok: false, message: 'Не удалось зарегистрироваться' } as const;
  }

  return { ok: true, message: 'Регистрация успешна. Теперь войдите.' } as const;
}

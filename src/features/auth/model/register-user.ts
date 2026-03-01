'use server';

import { signUpSchema } from '@/entities/user';
import { hashPassword, prisma } from '@/shared/lib';

export async function registerUserAction(raw: FormData) {
  const parsed = signUpSchema.safeParse({
    name: raw.get('name'),
    email: raw.get('email'),
    password: raw.get('password')
  });

  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const exists = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) {
    return { ok: false, message: 'Пользователь уже существует' } as const;
  }

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: hashPassword(parsed.data.password)
    }
  });

  return { ok: true } as const;
}

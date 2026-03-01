'use server';

import { z } from 'zod';
import { prisma } from '@/shared/lib';

const roleSchema = z.object({
  adminId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(['USER', 'HOST', 'ADMIN'])
});

const chatSchema = z.object({
  adminId: z.string().min(1),
  userId: z.string().min(1),
  telegramChatId: z.string().min(1)
});

export async function setUserRoleAction(raw: FormData) {
  const parsed = roleSchema.safeParse(Object.fromEntries(raw.entries()));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const admin = await prisma.user.findUnique({ where: { id: parsed.data.adminId } });
  if (!admin || admin.role !== 'ADMIN') {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  const updated = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role }
  });

  return { ok: true, user: updated } as const;
}

export async function setHostChatIdAction(raw: FormData) {
  const parsed = chatSchema.safeParse(Object.fromEntries(raw.entries()));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const admin = await prisma.user.findUnique({ where: { id: parsed.data.adminId } });
  if (!admin || admin.role !== 'ADMIN') {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  const host = await prisma.user.findUnique({ where: { id: parsed.data.userId } });
  if (!host || host.role !== 'HOST') {
    return { ok: false, message: 'Пользователь не HOST' } as const;
  }

  const updated = await prisma.user.update({
    where: { id: host.id },
    data: { telegramChatId: parsed.data.telegramChatId }
  });

  return { ok: true, user: updated } as const;
}

import { prisma } from '@/shared/lib';

export async function setHostTelegramChatId(input: { adminId: string; hostUserId: string; telegramChatId: string }) {
  const admin = await prisma.user.findUnique({ where: { id: input.adminId } });
  if (!admin || admin.role !== 'ADMIN') {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  const host = await prisma.user.findUnique({ where: { id: input.hostUserId } });
  if (!host || host.role !== 'HOST') {
    return { ok: false, message: 'Пользователь не HOST' } as const;
  }

  const updated = await prisma.user.update({
    where: { id: input.hostUserId },
    data: { telegramChatId: input.telegramChatId }
  });

  return { ok: true, user: updated } as const;
}

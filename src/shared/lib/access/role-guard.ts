import { prisma } from '@/shared/lib/prisma';

type RequiredRole = 'USER' | 'HOST' | 'ADMIN';

export async function requireRole(userId: string, role: RequiredRole) {
  if (!userId) {
    return { ok: false, message: 'userId is required' } as const;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { ok: false, message: 'Пользователь не найден' } as const;
  }

  if (user.role !== role && !(role === 'USER' && (user.role === 'HOST' || user.role === 'ADMIN'))) {
    return { ok: false, message: `Требуется роль ${role}` } as const;
  }

  return { ok: true, user } as const;
}

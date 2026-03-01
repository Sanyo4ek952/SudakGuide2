import { auth } from '@/processes/auth';
import { prisma } from '@/shared/lib/prisma';

export async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return prisma.user.findUnique({ where: { email } });
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: 'Требуется авторизация' } as const;
  }

  return { ok: true, user } as const;
}

export async function requireCurrentRole(role: 'USER' | 'HOST' | 'ADMIN') {
  const result = await requireCurrentUser();
  if (!result.ok) {
    return result;
  }

  const { user } = result;
  if (user.role !== role && !(role === 'USER' && (user.role === 'HOST' || user.role === 'ADMIN'))) {
    return { ok: false, message: `Требуется роль ${role}` } as const;
  }

  return { ok: true, user } as const;
}

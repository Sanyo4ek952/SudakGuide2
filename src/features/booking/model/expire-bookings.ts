import { prisma } from '@/shared/lib';

export async function expirePendingBookings() {
  const now = new Date();
  const expired = await prisma.bookingRequest.updateMany({
    where: {
      status: 'PENDING',
      expiresAt: { lte: now }
    },
    data: {
      status: 'EXPIRED'
    }
  });

  return expired.count;
}

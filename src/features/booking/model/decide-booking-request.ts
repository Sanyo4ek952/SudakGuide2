import { bookingEntity } from '@/entities';
import { prisma } from '@/shared/lib';

export async function decideBookingRequest(input: { bookingId: string; hostId: string; approve: boolean }) {
  const parsed = bookingEntity.hostBookingDecisionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id: parsed.data.bookingId },
    include: { listing: true }
  });

  if (!booking) {
    return { ok: false, message: 'Заявка не найдена' } as const;
  }

  if (booking.listing.ownerId !== parsed.data.hostId) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  if (booking.status !== 'PENDING') {
    return { ok: false, message: 'Можно обработать только PENDING заявку' } as const;
  }

  if (booking.expiresAt <= new Date()) {
    await prisma.bookingRequest.update({ where: { id: booking.id }, data: { status: 'EXPIRED' } });
    return { ok: false, message: 'Заявка уже истекла' } as const;
  }

  const nextStatus = parsed.data.approve ? 'APPROVED' : 'REJECTED';
  const updated = await prisma.bookingRequest.update({
    where: { id: booking.id },
    data: { status: nextStatus }
  });

  return { ok: true, booking: updated } as const;
}

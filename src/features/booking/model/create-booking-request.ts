import { differenceInCalendarDays } from 'date-fns';
import { bookingEntity } from '@/entities';
import { telegramApi } from '@/shared/api';
import { prisma } from '@/shared/lib';

const HOLD_HOURS = 2;

function isOverlapping(fromA: Date, toA: Date, fromB: Date, toB: Date) {
  return fromA < toB && toA > fromB;
}

export async function createBookingRequest(input: bookingEntity.CreateBookingRequestInput) {
  const parsed = bookingEntity.createBookingRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const { listingId, userId, dateFrom, dateTo } = parsed.data;
  const nights = differenceInCalendarDays(dateTo, dateFrom);

  if (nights <= 0) {
    return { ok: false, message: 'Некорректный период бронирования' } as const;
  }

  const result = await prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUnique({
      where: { id: listingId },
      include: { pricePeriods: true, owner: true }
    });

    if (!listing || listing.status !== 'PUBLISHED') {
      throw new Error('Listing not found or not published');
    }

    const conflicts = await tx.bookingRequest.count({
      where: {
        listingId,
        dateFrom: { lt: dateTo },
        dateTo: { gt: dateFrom },
        OR: [{ status: 'APPROVED' }, { status: 'PENDING', expiresAt: { gt: new Date() } }]
      }
    });

    if (conflicts > 0) {
      throw new Error('Dates are unavailable');
    }

    let totalPrice = 0;
    for (let i = 0; i < nights; i += 1) {
      const currentNightStart = new Date(dateFrom);
      currentNightStart.setUTCDate(currentNightStart.getUTCDate() + i);
      const currentNightEnd = new Date(currentNightStart);
      currentNightEnd.setUTCDate(currentNightEnd.getUTCDate() + 1);

      const period = listing.pricePeriods.find((value) =>
        isOverlapping(currentNightStart, currentNightEnd, value.dateFrom, value.dateTo)
      );

      if (!period) {
        throw new Error('No price period for selected dates');
      }

      totalPrice += period.pricePerNight;
    }

    const expiresAt = new Date(Date.now() + HOLD_HOURS * 60 * 60 * 1000);

    const booking = await tx.bookingRequest.create({
      data: {
        listingId,
        userId,
        dateFrom,
        dateTo,
        nights,
        totalPrice,
        status: 'PENDING',
        expiresAt
      },
      include: { listing: { include: { owner: true } } }
    });

    return booking;
  });

  if (result.listing.owner.telegramChatId) {
    await telegramApi.sendTelegramMessage(
      result.listing.owner.telegramChatId,
      `Новая заявка #${result.id} на объект "${result.listing.title}". Откройте: /host/bookings/${result.id}`
    );
  }

  return { ok: true, booking: result } as const;
}

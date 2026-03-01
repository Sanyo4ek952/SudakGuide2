'use server';

import { requireCurrentRole } from '@/shared/lib';
import { createBookingRequest } from './create-booking-request';

export async function createBookingRequestAction(raw: FormData) {
  const access = await requireCurrentRole('USER');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const listingId = String(raw.get('listingId') ?? '');
  const dateFrom = String(raw.get('dateFrom') ?? '');
  const dateTo = String(raw.get('dateTo') ?? '');

  return createBookingRequest({
    listingId,
    userId: access.user.id,
    dateFrom: new Date(dateFrom),
    dateTo: new Date(dateTo)
  });
}

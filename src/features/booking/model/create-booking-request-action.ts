'use server';

import { createBookingRequest } from './create-booking-request';

export async function createBookingRequestAction(raw: FormData) {
  const listingId = String(raw.get('listingId') ?? '');
  const userId = String(raw.get('userId') ?? '');
  const dateFrom = String(raw.get('dateFrom') ?? '');
  const dateTo = String(raw.get('dateTo') ?? '');

  return createBookingRequest({
    listingId,
    userId,
    dateFrom: new Date(dateFrom),
    dateTo: new Date(dateTo)
  });
}

'use server';

import { decideBookingRequest } from './decide-booking-request';

export async function decideBookingRequestAction(raw: FormData) {
  const bookingId = String(raw.get('bookingId') ?? '');
  const hostId = String(raw.get('hostId') ?? '');
  const decision = String(raw.get('decision') ?? 'reject');

  return decideBookingRequest({
    bookingId,
    hostId,
    approve: decision === 'approve'
  });
}

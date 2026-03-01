'use server';

import { requireCurrentRole } from '@/shared/lib';
import { decideBookingRequest } from './decide-booking-request';

export async function decideBookingRequestAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const bookingId = String(raw.get('bookingId') ?? '');
  const decision = String(raw.get('decision') ?? 'reject');

  return decideBookingRequest({
    bookingId,
    hostId: access.user.id,
    approve: decision === 'approve'
  });
}

import { bookingFeature } from '@/features';

export async function POST() {
  const expiredCount = await bookingFeature.expirePendingBookings();

  return Response.json({ ok: true, expiredCount });
}

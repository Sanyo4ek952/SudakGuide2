import { bookingFeature } from '@/features';

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') ?? '';

  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return Response.json({ ok: false, message: 'Unauthorized' }, { status: 401 });
  }

  const expiredCount = await bookingFeature.expirePendingBookings();

  return Response.json({ ok: true, expiredCount });
}

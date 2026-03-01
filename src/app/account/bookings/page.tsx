import { prisma } from '@/shared/lib';

export default async function AccountBookingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const userId = typeof query.userId === 'string' ? query.userId : '';

  if (!userId) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Мои бронирования</h1>
        <p className="mt-2 text-slate-600">Передайте ?userId=... для просмотра в MVP режиме.</p>
      </main>
    );
  }

  const bookings = await prisma.bookingRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { listing: true }
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Мои бронирования</h1>
      <div className="mt-4 grid gap-3">
        {bookings.map((booking) => (
          <article key={booking.id} className="rounded border bg-white p-4">
            <p className="font-medium">{booking.listing.title}</p>
            <p className="text-sm text-slate-600">Статус: {booking.status}</p>
            <p className="text-sm text-slate-600">
              {booking.dateFrom.toISOString().slice(0, 10)} → {booking.dateTo.toISOString().slice(0, 10)}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}

import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function AccountBookingsPage() {
  const access = await requireCurrentRole('USER');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Мои бронирования</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const bookings = await prisma.bookingRequest.findMany({
    where: { userId: access.user.id },
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

import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function HostBookingsPage() {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Заявки на бронирование (Host)</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const bookings = await prisma.bookingRequest.findMany({
    where: { listing: { ownerId: access.user.id } },
    orderBy: { createdAt: 'desc' },
    include: { listing: true, user: true }
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Заявки на бронирование (Host)</h1>
      <div className="mt-4 grid gap-3">
        {bookings.map((booking) => (
          <a key={booking.id} href={`/host/bookings/${booking.id}`} className="rounded border bg-white p-4">
            <p className="font-medium">#{booking.id}</p>
            <p className="text-sm text-slate-600">{booking.listing.title}</p>
            <p className="text-sm">Статус: {booking.status}</p>
          </a>
        ))}
      </div>
    </main>
  );
}

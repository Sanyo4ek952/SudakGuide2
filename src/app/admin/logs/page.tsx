import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function AdminLogsPage() {
  const access = await requireCurrentRole('ADMIN');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Админ: логи</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const recentBookings = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { listing: true, user: true }
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Админ: логи</h1>
      <p className="mt-2 text-slate-600">MVP: журнал последних заявок как operational log.</p>
      <div className="mt-4 overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-2 text-left">Дата</th><th className="p-2 text-left">Booking ID</th><th className="p-2 text-left">Пользователь</th><th className="p-2 text-left">Объект</th><th className="p-2 text-left">Статус</th><th className="p-2 text-left">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-2">{booking.createdAt.toISOString()}</td><td className="p-2">{booking.id}</td><td className="p-2">{booking.user.email}</td><td className="p-2">{booking.listing.title}</td><td className="p-2">{booking.status}</td><td className="p-2">{booking.totalPrice} ₽</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

import { bookingFeature } from '@/features';
import { prisma, requireRole } from '@/shared/lib';

export default async function HostBookingDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const hostId = typeof query.hostId === 'string' ? query.hostId : '';

  const roleCheck = await requireRole(hostId, 'HOST');
  if (!roleCheck.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Карточка заявки</h1>
        <p className="mt-2 text-rose-700">{roleCheck.message}</p>
      </main>
    );
  }

  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: { listing: true, user: true }
  });

  if (!booking) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Заявка не найдена</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Карточка заявки #{booking.id}</h1>
      <p className="mt-2 text-slate-600">Объект: {booking.listing.title}</p>
      <p className="text-slate-600">Статус: {booking.status}</p>

      <form className="mt-6 flex gap-3" action={bookingFeature.decideBookingRequestAction}>
        <input type="hidden" name="bookingId" value={booking.id} />
        <input type="hidden" name="hostId" value={hostId} />
        <button className="rounded bg-emerald-700 px-4 py-2 text-white" type="submit" name="decision" value="approve">
          Подтвердить
        </button>
        <button className="rounded bg-rose-700 px-4 py-2 text-white" type="submit" name="decision" value="reject">
          Отклонить
        </button>
      </form>
    </main>
  );
}

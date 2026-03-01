import { bookingFeature } from '@/features';
import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function HostBookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Карточка заявки</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const { id } = await params;

  const booking = await prisma.bookingRequest.findUnique({
    where: { id },
    include: { listing: true, user: true }
  });

  if (!booking || booking.listing.ownerId !== access.user.id) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Заявка не найдена или нет прав</h1>
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

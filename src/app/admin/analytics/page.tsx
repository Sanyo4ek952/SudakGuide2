import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function AdminAnalyticsPage() {
  const access = await requireCurrentRole('ADMIN');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Админ: аналитика</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const [usersCount, hostsCount, listingsTotal, listingsPublished, listingsPending, bookingsPending, bookingsApproved] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'HOST' } }),
    prisma.listing.count(),
    prisma.listing.count({ where: { status: 'PUBLISHED' } }),
    prisma.listing.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.bookingRequest.count({ where: { status: 'PENDING' } }),
    prisma.bookingRequest.count({ where: { status: 'APPROVED' } })
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Админ: аналитика</h1>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded border bg-white p-4">Пользователи: {usersCount}</article>
        <article className="rounded border bg-white p-4">HOST: {hostsCount}</article>
        <article className="rounded border bg-white p-4">Объекты всего: {listingsTotal}</article>
        <article className="rounded border bg-white p-4">Опубликовано: {listingsPublished}</article>
        <article className="rounded border bg-white p-4">На модерации: {listingsPending}</article>
        <article className="rounded border bg-white p-4">PENDING заявок: {bookingsPending}</article>
        <article className="rounded border bg-white p-4">APPROVED заявок: {bookingsApproved}</article>
      </div>
    </main>
  );
}

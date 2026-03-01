import Link from 'next/link';
import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function HostListingsPage() {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Мои объекты (Host)</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const listings = await prisma.listing.findMany({
    where: { ownerId: access.user.id },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Мои объекты (Host)</h1>
        <Link href="/host/listings/new" className="rounded bg-slate-900 px-4 py-2 text-white">
          Новый объект
        </Link>
      </div>

      <div className="mt-4 grid gap-3">
        {listings.map((listing) => (
          <article key={listing.id} className="rounded border bg-white p-4">
            <p className="font-medium">{listing.title}</p>
            <p className="text-sm text-slate-600">Статус: {listing.status}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <Link href={`/host/listings/${listing.id}/edit`} className="text-blue-700">
                Редактировать
              </Link>
              <Link href={`/host/listings/${listing.id}/prices`} className="text-blue-700">
                Цены и фото
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

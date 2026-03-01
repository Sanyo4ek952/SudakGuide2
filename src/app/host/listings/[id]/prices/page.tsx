import { listingFeature } from '@/features';
import { prisma, requireRole } from '@/shared/lib';

export default async function HostListingPricesPage({
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
        <h1 className="text-2xl font-semibold">Цены и фото</h1>
        <p className="mt-2 text-rose-700">{roleCheck.message}</p>
      </main>
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: 'asc' } },
      pricePeriods: { orderBy: { dateFrom: 'asc' } }
    }
  });

  if (!listing) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Объект не найден</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Цены и фото</h1>

      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">Добавить период цены</h2>
        <form className="mt-3 grid gap-2 sm:grid-cols-2" action={listingFeature.addPricePeriodAction}>
          <input type="hidden" name="hostId" value={hostId} />
          <input type="hidden" name="listingId" value={listing.id} />
          <input type="date" name="dateFrom" className="rounded border p-2" required />
          <input type="date" name="dateTo" className="rounded border p-2" required />
          <input type="number" name="pricePerNight" min={1} className="rounded border p-2" required />
          <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
            Добавить
          </button>
        </form>

        <div className="mt-4 grid gap-2">
          {listing.pricePeriods.map((period) => (
            <form key={period.id} className="flex items-center justify-between rounded border p-2" action={listingFeature.deletePricePeriodAction}>
              <input type="hidden" name="hostId" value={hostId} />
              <input type="hidden" name="pricePeriodId" value={period.id} />
              <span>
                {period.dateFrom.toISOString().slice(0, 10)} → {period.dateTo.toISOString().slice(0, 10)}: {period.pricePerNight} ₽
              </span>
              <button className="rounded bg-rose-700 px-3 py-1 text-white" type="submit">
                Удалить
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded border bg-white p-4">
        <h2 className="text-lg font-semibold">Фото URL (MVP)</h2>
        <form className="mt-3 flex gap-2" action={listingFeature.addPhotoUrlAction}>
          <input type="hidden" name="hostId" value={hostId} />
          <input type="hidden" name="listingId" value={listing.id} />
          <input type="url" name="url" className="w-full rounded border p-2" placeholder="https://..." required />
          <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
            Добавить фото
          </button>
        </form>

        <div className="mt-4 grid gap-2">
          {listing.photos.map((photo) => (
            <div key={photo.id} className="rounded border p-2">
              <p className="truncate text-sm text-slate-600">{photo.url}</p>
              <div className="mt-2 flex gap-2">
                <form action={listingFeature.movePhotoAction}>
                  <input type="hidden" name="hostId" value={hostId} />
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button className="rounded bg-slate-700 px-3 py-1 text-white" type="submit">
                    ↑
                  </button>
                </form>
                <form action={listingFeature.movePhotoAction}>
                  <input type="hidden" name="hostId" value={hostId} />
                  <input type="hidden" name="photoId" value={photo.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button className="rounded bg-slate-700 px-3 py-1 text-white" type="submit">
                    ↓
                  </button>
                </form>
                <form action={listingFeature.removePhotoAction}>
                  <input type="hidden" name="hostId" value={hostId} />
                  <input type="hidden" name="photoId" value={photo.id} />
                  <button className="rounded bg-rose-700 px-3 py-1 text-white" type="submit">
                    Удалить
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

import { bookingFeature, listingFeature } from '@/features';

export default async function ListingDetailsPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const listing = await listingFeature.getPublishedListingById(id);

  if (!listing) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Объект не найден или не опубликован</h1>
      </main>
    );
  }

  const dateFrom = typeof query.dateFrom === 'string' ? query.dateFrom : '';
  const dateTo = typeof query.dateTo === 'string' ? query.dateTo : '';

  const pricePreview =
    dateFrom && dateTo
      ? listingFeature.calculateListingPrice({
          dateFrom: new Date(dateFrom),
          dateTo: new Date(dateTo),
          pricePeriods: listing.pricePeriods
        })
      : null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold">{listing.title}</h1>
      <p className="mt-1 text-slate-600">{listing.address}</p>
      <p className="mt-1 text-slate-600">Район: {listing.district}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {listing.photos.map((photo) => (
          <img key={photo.id} alt={listing.title} className="h-48 w-full rounded-lg object-cover" src={photo.url} />
        ))}
      </div>

      <section className="mt-8 rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold">Расчёт и заявка</h2>

        <form className="mt-4 grid gap-3" action="" method="get">
          <input type="date" name="dateFrom" defaultValue={dateFrom} className="rounded border p-2" />
          <input type="date" name="dateTo" defaultValue={dateTo} className="rounded border p-2" />
          <button className="rounded bg-slate-800 px-4 py-2 text-white" type="submit">
            Рассчитать
          </button>
        </form>

        {pricePreview && pricePreview.ok && (
          <p className="mt-3 text-sm text-emerald-700">
            {pricePreview.nights} ночей, итог: {pricePreview.totalPrice} ₽
          </p>
        )}

        {pricePreview && !pricePreview.ok && <p className="mt-3 text-sm text-rose-700">{pricePreview.message}</p>}

        <form className="mt-4 grid gap-3" action={bookingFeature.createBookingRequestAction}>
          <input type="hidden" name="listingId" value={listing.id} />
          <input type="text" name="userId" placeholder="User ID для MVP" className="rounded border p-2" />
          <input type="date" name="dateFrom" className="rounded border p-2" required />
          <input type="date" name="dateTo" className="rounded border p-2" required />
          <button className="rounded bg-blue-700 px-4 py-2 text-white" type="submit">Отправить заявку</button>
          <p className="text-xs text-slate-500">Для MVP укажите userId вручную.</p>
        </form>
      </section>
    </main>
  );
}

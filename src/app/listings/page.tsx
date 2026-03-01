import { listingFeature } from '@/features';

export default async function ListingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const response = await listingFeature.searchPublishedListings({
    q: typeof params.q === 'string' ? params.q : undefined,
    min: typeof params.min === 'string' ? Number(params.min) : undefined,
    max: typeof params.max === 'string' ? Number(params.max) : undefined,
    rooms: typeof params.rooms === 'string' ? Number(params.rooms) : undefined,
    sort: typeof params.sort === 'string' ? (params.sort as 'price_asc' | 'price_desc' | 'newest') : undefined
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Каталог жилья</h1>
      <p className="mt-2 text-slate-600">Показываются только опубликованные объекты.</p>

      {!response.ok && <pre className="mt-4 rounded bg-rose-50 p-3 text-sm">{JSON.stringify(response.errors, null, 2)}</pre>}

      {response.ok && (
        <div className="mt-6 grid gap-4">
          {response.items.map((item) => (
            <article key={item.id} className="rounded-lg border bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-slate-500">{item.district}</p>
              <p className="mt-2 text-sm">Комнат: {item.rooms}, гостей: {item.guests}</p>
              <p className="mt-1 text-sm font-medium">От {item.priceFrom} ₽ / ночь</p>
            </article>
          ))}

          {response.items.length === 0 && <p className="text-slate-500">Ничего не найдено.</p>}
        </div>
      )}
    </main>
  );
}

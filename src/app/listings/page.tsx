import { listingFeature } from '@/features';

export default async function ListingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;

  const dateFrom = typeof params.dateFrom === 'string' ? new Date(params.dateFrom) : undefined;
  const dateTo = typeof params.dateTo === 'string' ? new Date(params.dateTo) : undefined;

  const response = await listingFeature.searchPublishedListings({
    q: typeof params.q === 'string' ? params.q : undefined,
    min: typeof params.min === 'string' ? Number(params.min) : undefined,
    max: typeof params.max === 'string' ? Number(params.max) : undefined,
    rooms: typeof params.rooms === 'string' ? Number(params.rooms) : undefined,
    dateFrom,
    dateTo,
    sort: typeof params.sort === 'string' ? (params.sort as 'price_asc' | 'price_desc' | 'newest') : undefined
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Каталог жилья</h1>
      <p className="mt-2 text-slate-600">Показываются только опубликованные объекты.</p>

      <form className="mt-4 grid gap-2 rounded border bg-white p-3 sm:grid-cols-2 lg:grid-cols-4" method="get">
        <input name="q" placeholder="Поиск по названию" defaultValue={typeof params.q === 'string' ? params.q : ''} className="rounded border p-2" />
        <input name="rooms" type="number" min={1} placeholder="Комнат" defaultValue={typeof params.rooms === 'string' ? params.rooms : ''} className="rounded border p-2" />
        <input name="min" type="number" min={0} placeholder="Цена от" defaultValue={typeof params.min === 'string' ? params.min : ''} className="rounded border p-2" />
        <input name="max" type="number" min={0} placeholder="Цена до" defaultValue={typeof params.max === 'string' ? params.max : ''} className="rounded border p-2" />
        <input name="dateFrom" type="date" defaultValue={typeof params.dateFrom === 'string' ? params.dateFrom : ''} className="rounded border p-2" />
        <input name="dateTo" type="date" defaultValue={typeof params.dateTo === 'string' ? params.dateTo : ''} className="rounded border p-2" />
        <select name="sort" defaultValue={typeof params.sort === 'string' ? params.sort : 'newest'} className="rounded border p-2">
          <option value="newest">Сначала новые</option>
          <option value="price_asc">Цена по возрастанию</option>
          <option value="price_desc">Цена по убыванию</option>
        </select>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Применить
        </button>
      </form>

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

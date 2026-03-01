import { listingFeature } from '@/features';

export default async function HostNewListingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const hostId = typeof query.hostId === 'string' ? query.hostId : '';

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Создать объект</h1>
      <p className="mt-2 text-slate-600">Для MVP передайте hostId через query параметр.</p>

      <form className="mt-6 grid gap-3" action={listingFeature.createListingDraftAction}>
        <input type="hidden" name="hostId" value={hostId} />
        <input name="title" placeholder="Название" className="rounded border p-2" required />
        <input name="address" placeholder="Адрес" className="rounded border p-2" required />
        <input name="district" placeholder="Район" className="rounded border p-2" required />
        <textarea name="description" placeholder="Описание" className="rounded border p-2" />
        <input name="guests" type="number" min={1} placeholder="Гостей" className="rounded border p-2" required />
        <input name="rooms" type="number" min={1} placeholder="Комнат" className="rounded border p-2" required />
        <input name="beds" type="number" min={1} placeholder="Кроватей" className="rounded border p-2" required />
        <input name="amenities" placeholder="Удобства через запятую" className="rounded border p-2" />
        <input name="rules" placeholder="Правила" className="rounded border p-2" />
        <input name="checkInTime" placeholder="14:00" className="rounded border p-2" required />
        <input name="checkOutTime" placeholder="12:00" className="rounded border p-2" required />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Создать DRAFT
        </button>
      </form>
    </main>
  );
}

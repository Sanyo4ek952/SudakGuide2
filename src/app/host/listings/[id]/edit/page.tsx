import { listingFeature } from '@/features';
import { prisma, requireCurrentRole } from '@/shared/lib';

export default async function HostEditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Редактирование объекта</h1>
        <p className="mt-2 text-rose-700">{access.message}</p>
      </main>
    );
  }

  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });

  if (!listing || listing.ownerId !== access.user.id) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Объект не найден или нет прав</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Редактирование объекта</h1>
      <p className="mt-2 text-slate-600">ID: {listing.id}</p>

      <form className="mt-6 grid gap-3" action={listingFeature.updateListingDraftAction}>
        <input type="hidden" name="listingId" value={listing.id} />
        <input name="title" defaultValue={listing.title} className="rounded border p-2" required />
        <input name="address" defaultValue={listing.address} className="rounded border p-2" required />
        <input name="district" defaultValue={listing.district} className="rounded border p-2" required />
        <textarea name="description" defaultValue={listing.description ?? ''} className="rounded border p-2" />
        <input name="guests" type="number" min={1} defaultValue={listing.guests} className="rounded border p-2" required />
        <input name="rooms" type="number" min={1} defaultValue={listing.rooms} className="rounded border p-2" required />
        <input name="beds" type="number" min={1} defaultValue={listing.beds} className="rounded border p-2" required />
        <input name="amenities" defaultValue={listing.amenities.join(', ')} className="rounded border p-2" />
        <input name="rules" defaultValue={listing.rules ?? ''} className="rounded border p-2" />
        <input name="checkInTime" defaultValue={listing.checkInTime} className="rounded border p-2" required />
        <input name="checkOutTime" defaultValue={listing.checkOutTime} className="rounded border p-2" required />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">
          Сохранить
        </button>
      </form>

      <form className="mt-4" action={listingFeature.submitListingForReviewAction}>
        <input type="hidden" name="listingId" value={listing.id} />
        <button className="rounded bg-amber-700 px-4 py-2 text-white" type="submit">
          Отправить на модерацию
        </button>
      </form>
    </main>
  );
}

import { adminFeature } from '@/features';
import { prisma, requireRole } from '@/shared/lib';

export default async function AdminListingsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const adminId = typeof query.adminId === 'string' ? query.adminId : '';

  const roleCheck = await requireRole(adminId, 'ADMIN');
  if (!roleCheck.ok) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-2xl font-semibold">Админ: модерация объектов</h1>
        <p className="mt-2 text-rose-700">{roleCheck.message}</p>
      </main>
    );
  }

  const listings = await prisma.listing.findMany({
    where: { status: 'PENDING_REVIEW' },
    orderBy: { createdAt: 'desc' },
    include: { owner: true }
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Админ: модерация объектов</h1>
      <p className="mt-2 text-slate-600">Для MVP используйте query параметр ?adminId=...</p>

      <div className="mt-4 grid gap-3">
        {listings.map((listing) => (
          <article key={listing.id} className="rounded border bg-white p-4">
            <p className="font-medium">{listing.title}</p>
            <p className="text-sm text-slate-600">Owner: {listing.owner.email}</p>

            <form className="mt-3 flex gap-2" action={adminFeature.moderateListingAction}>
              <input type="hidden" name="adminId" value={adminId} />
              <input type="hidden" name="listingId" value={listing.id} />
              <button className="rounded bg-emerald-700 px-3 py-2 text-white" name="decision" value="publish" type="submit">
                Publish
              </button>
              <button className="rounded bg-rose-700 px-3 py-2 text-white" name="decision" value="reject" type="submit">
                Reject
              </button>
            </form>
          </article>
        ))}

        {listings.length === 0 && <p className="text-slate-500">Нет объектов на модерации.</p>}
      </div>
    </main>
  );
}

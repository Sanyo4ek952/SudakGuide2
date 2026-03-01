import { prisma } from '@/shared/lib';

export async function moderateListing(input: { adminId: string; listingId: string; publish: boolean }) {
  const admin = await prisma.user.findUnique({ where: { id: input.adminId } });
  if (!admin || admin.role !== 'ADMIN') {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  const listing = await prisma.listing.findUnique({ where: { id: input.listingId } });
  if (!listing) {
    return { ok: false, message: 'Listing не найден' } as const;
  }

  if (listing.status !== 'PENDING_REVIEW') {
    return { ok: false, message: 'Модерация доступна только для PENDING_REVIEW' } as const;
  }

  const status = input.publish ? 'PUBLISHED' : 'REJECTED';
  const updated = await prisma.listing.update({ where: { id: input.listingId }, data: { status } });

  return { ok: true, listing: updated } as const;
}

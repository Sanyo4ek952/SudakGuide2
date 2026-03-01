import { prisma } from '@/shared/lib';

export async function getPublishedListingById(id: string) {
  const listing = await prisma.listing.findFirst({
    where: { id, status: 'PUBLISHED' },
    include: {
      photos: { orderBy: { sortOrder: 'asc' } },
      pricePeriods: { orderBy: { dateFrom: 'asc' } }
    }
  });

  return listing;
}

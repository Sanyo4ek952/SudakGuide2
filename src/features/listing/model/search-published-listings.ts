import { listingEntity } from '@/entities';
import { prisma } from '@/shared/lib';

export type SearchListingsInput = {
  q?: string;
  min?: number;
  max?: number;
  rooms?: number;
  dateFrom?: Date;
  dateTo?: Date;
  sort?: 'price_asc' | 'price_desc' | 'newest';
};

export async function searchPublishedListings(input: SearchListingsInput) {
  const parsed = listingEntity.listingFilterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const sort = parsed.data.sort ?? 'newest';
  const now = new Date();

  const listings = await prisma.listing.findMany({
    where: {
      status: 'PUBLISHED',
      title: parsed.data.q ? { contains: parsed.data.q, mode: 'insensitive' } : undefined,
      rooms: parsed.data.rooms,
      pricePeriods: {
        some: {
          pricePerNight: {
            gte: parsed.data.min,
            lte: parsed.data.max
          }
        }
      },
      ...(parsed.data.dateFrom && parsed.data.dateTo
        ? {
            bookings: {
              none: {
                AND: [
                  { dateFrom: { lt: parsed.data.dateTo } },
                  { dateTo: { gt: parsed.data.dateFrom } },
                  {
                    OR: [
                      { status: 'APPROVED' },
                      {
                        AND: [{ status: 'PENDING' }, { expiresAt: { gt: now } }]
                      }
                    ]
                  }
                ]
              }
            }
          }
        : {})
    },
    include: {
      photos: { orderBy: { sortOrder: 'asc' }, take: 1 },
      pricePeriods: { orderBy: { dateFrom: 'asc' } }
    },
    orderBy: sort === 'newest' ? { createdAt: 'desc' } : undefined
  });

  const items = listings.map((listing) => {
    const firstPrice = listing.pricePeriods[0]?.pricePerNight ?? 0;
    return {
      id: listing.id,
      title: listing.title,
      district: listing.district,
      rooms: listing.rooms,
      guests: listing.guests,
      priceFrom: firstPrice,
      coverPhoto: listing.photos[0]?.url ?? null,
      createdAt: listing.createdAt
    };
  });

  if (sort === 'price_asc') {
    items.sort((a, b) => a.priceFrom - b.priceFrom);
  }
  if (sort === 'price_desc') {
    items.sort((a, b) => b.priceFrom - a.priceFrom);
  }

  return { ok: true, items } as const;
}

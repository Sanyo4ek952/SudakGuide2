'use server';

import { z } from 'zod';
import { prisma, requireCurrentRole } from '@/shared/lib';

const hostListingSchema = z.object({
  listingId: z.string().optional(),
  title: z.string().min(3),
  address: z.string().min(3),
  district: z.string().min(2),
  description: z.string().optional(),
  guests: z.coerce.number().int().positive(),
  rooms: z.coerce.number().int().positive(),
  beds: z.coerce.number().int().positive(),
  amenities: z.string().optional(),
  rules: z.string().optional(),
  checkInTime: z.string().min(4),
  checkOutTime: z.string().min(4)
});

export async function createListingDraftAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const parsed = hostListingSchema.safeParse(Object.fromEntries(raw.entries()));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  const listing = await prisma.listing.create({
    data: {
      title: parsed.data.title,
      address: parsed.data.address,
      district: parsed.data.district,
      description: parsed.data.description,
      guests: parsed.data.guests,
      rooms: parsed.data.rooms,
      beds: parsed.data.beds,
      amenities: parsed.data.amenities ? parsed.data.amenities.split(',').map((item) => item.trim()).filter(Boolean) : [],
      rules: parsed.data.rules,
      checkInTime: parsed.data.checkInTime,
      checkOutTime: parsed.data.checkOutTime,
      ownerId: access.user.id,
      status: 'DRAFT'
    }
  });

  return { ok: true, listingId: listing.id } as const;
}

export async function updateListingDraftAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const parsed = hostListingSchema.safeParse(Object.fromEntries(raw.entries()));
  if (!parsed.success || !parsed.data.listingId) {
    return { ok: false, errors: parsed.success ? undefined : parsed.error.flatten(), message: 'listingId is required' } as const;
  }

  const listing = await prisma.listing.findUnique({ where: { id: parsed.data.listingId } });
  if (!listing || listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  await prisma.listing.update({
    where: { id: parsed.data.listingId },
    data: {
      title: parsed.data.title,
      address: parsed.data.address,
      district: parsed.data.district,
      description: parsed.data.description,
      guests: parsed.data.guests,
      rooms: parsed.data.rooms,
      beds: parsed.data.beds,
      amenities: parsed.data.amenities ? parsed.data.amenities.split(',').map((item) => item.trim()).filter(Boolean) : [],
      rules: parsed.data.rules,
      checkInTime: parsed.data.checkInTime,
      checkOutTime: parsed.data.checkOutTime
    }
  });

  return { ok: true } as const;
}

export async function submitListingForReviewAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const listingId = String(raw.get('listingId') ?? '');

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { photos: true }
  });

  if (!listing || listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  if (listing.photos.length === 0) {
    return { ok: false, message: 'Для модерации добавьте хотя бы 1 фото' } as const;
  }

  await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'PENDING_REVIEW' }
  });

  return { ok: true } as const;
}

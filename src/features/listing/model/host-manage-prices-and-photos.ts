'use server';

import { z } from 'zod';
import { prisma, requireCurrentRole } from '@/shared/lib';

const addPriceSchema = z.object({
  listingId: z.string().min(1),
  dateFrom: z.coerce.date(),
  dateTo: z.coerce.date(),
  pricePerNight: z.coerce.number().int().positive()
});

export async function addPricePeriodAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const parsed = addPriceSchema.safeParse(Object.fromEntries(raw.entries()));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten() } as const;
  }

  if (parsed.data.dateFrom >= parsed.data.dateTo) {
    return { ok: false, message: 'dateTo должен быть позже dateFrom' } as const;
  }

  const listing = await prisma.listing.findUnique({ where: { id: parsed.data.listingId } });
  if (!listing || listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  await prisma.pricePeriod.create({
    data: {
      listingId: parsed.data.listingId,
      dateFrom: parsed.data.dateFrom,
      dateTo: parsed.data.dateTo,
      pricePerNight: parsed.data.pricePerNight
    }
  });

  return { ok: true } as const;
}

export async function deletePricePeriodAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const pricePeriodId = String(raw.get('pricePeriodId') ?? '');

  const period = await prisma.pricePeriod.findUnique({ where: { id: pricePeriodId }, include: { listing: true } });
  if (!period || period.listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  await prisma.pricePeriod.delete({ where: { id: pricePeriodId } });
  return { ok: true } as const;
}

export async function addPhotoUrlAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const listingId = String(raw.get('listingId') ?? '');
  const url = String(raw.get('url') ?? '').trim();

  if (!url) {
    return { ok: false, message: 'URL обязателен' } as const;
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId }, include: { photos: true } });
  if (!listing || listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  await prisma.listingPhoto.create({
    data: {
      listingId,
      url,
      sortOrder: listing.photos.length
    }
  });

  return { ok: true } as const;
}

export async function removePhotoAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const photoId = String(raw.get('photoId') ?? '');

  const photo = await prisma.listingPhoto.findUnique({ where: { id: photoId }, include: { listing: true } });
  if (!photo || photo.listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  await prisma.listingPhoto.delete({ where: { id: photoId } });
  return { ok: true } as const;
}

export async function movePhotoAction(raw: FormData) {
  const access = await requireCurrentRole('HOST');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const photoId = String(raw.get('photoId') ?? '');
  const direction = String(raw.get('direction') ?? 'up');

  const photo = await prisma.listingPhoto.findUnique({ where: { id: photoId }, include: { listing: true } });
  if (!photo || photo.listing.ownerId !== access.user.id) {
    return { ok: false, message: 'Недостаточно прав' } as const;
  }

  const neighbor = await prisma.listingPhoto.findFirst({
    where: {
      listingId: photo.listingId,
      sortOrder: direction === 'up' ? { lt: photo.sortOrder } : { gt: photo.sortOrder }
    },
    orderBy: { sortOrder: direction === 'up' ? 'desc' : 'asc' }
  });

  if (!neighbor) {
    return { ok: false, message: 'Нельзя сдвинуть фото дальше' } as const;
  }

  await prisma.$transaction([
    prisma.listingPhoto.update({ where: { id: photo.id }, data: { sortOrder: neighbor.sortOrder } }),
    prisma.listingPhoto.update({ where: { id: neighbor.id }, data: { sortOrder: photo.sortOrder } })
  ]);

  return { ok: true } as const;
}

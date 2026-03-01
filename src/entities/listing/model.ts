import { z } from 'zod';

export const listingStatusSchema = z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED']);
export const listingSortSchema = z.enum(['price_asc', 'price_desc', 'newest']).default('newest');

export const listingFilterSchema = z.object({
  q: z.string().optional(),
  min: z.coerce.number().int().nonnegative().optional(),
  max: z.coerce.number().int().nonnegative().optional(),
  rooms: z.coerce.number().int().positive().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sort: listingSortSchema.optional()
});

export type ListingStatus = z.infer<typeof listingStatusSchema>;
export type ListingSort = z.infer<typeof listingSortSchema>;

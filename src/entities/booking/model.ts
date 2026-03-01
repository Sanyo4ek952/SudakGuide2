import { z } from 'zod';

export const bookingStatusSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'CANCELED']);

export const bookingDatesSchema = z
  .object({
    dateFrom: z.coerce.date(),
    dateTo: z.coerce.date()
  })
  .refine((value) => value.dateFrom < value.dateTo, {
    message: 'dateFrom must be before dateTo',
    path: ['dateTo']
  });

export const createBookingRequestSchema = bookingDatesSchema.extend({
  listingId: z.string().min(1),
  userId: z.string().min(1)
});

export const hostBookingDecisionSchema = z.object({
  bookingId: z.string().min(1),
  hostId: z.string().min(1),
  approve: z.boolean()
});

export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type CreateBookingRequestInput = z.infer<typeof createBookingRequestSchema>;

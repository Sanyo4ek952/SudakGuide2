'use server';

import { requireCurrentRole } from '@/shared/lib';
import { moderateListing } from './moderate-listing';

export async function moderateListingAction(raw: FormData) {
  const access = await requireCurrentRole('ADMIN');
  if (!access.ok) {
    return { ok: false, message: access.message } as const;
  }

  const listingId = String(raw.get('listingId') ?? '');
  const decision = String(raw.get('decision') ?? 'reject');

  return moderateListing({
    adminId: access.user.id,
    listingId,
    publish: decision === 'publish'
  });
}

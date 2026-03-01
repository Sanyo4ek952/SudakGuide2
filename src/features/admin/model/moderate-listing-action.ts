'use server';

import { moderateListing } from './moderate-listing';

export async function moderateListingAction(raw: FormData) {
  const adminId = String(raw.get('adminId') ?? '');
  const listingId = String(raw.get('listingId') ?? '');
  const decision = String(raw.get('decision') ?? 'reject');

  return moderateListing({
    adminId,
    listingId,
    publish: decision === 'publish'
  });
}

import { Listing } from './listing.interface';

export interface Snapshot {
  listings: Listing[];
  createdAt: Date;
}

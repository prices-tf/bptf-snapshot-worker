import { ListingIntent, ListingItem } from './classifieds-search.interface';

export interface Listing {
  steamid64: string;
  item: ListingItem;
  intent: ListingIntent;
  currencies: {
    keys: number;
    metal: number;
  };
  isOffers: boolean;
  isBuyout: boolean;
  isAutomatic: boolean;
  details: string;
  createdAt: Date;
  bumpedAt: Date;
}

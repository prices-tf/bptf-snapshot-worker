export interface ListingCurrencies {
  keys: number;
  metal: number;
}

export enum ListingIntent {
  BUY = 0,
  SELL = 1,
}

export interface ListingItemAttribute {
  defindex: number;
  value: number;
  float_value: number;
}

export interface ListingItem {
  defindex: number;
  quality: number;
  name: string;
  id?: number;
  original_id?: number;
  level?: number;
  inventory?: number;
  quantity?: number;
  origin?: number;
  attributes?: ListingItemAttribute[];
}

export interface Listing {
  id: string;
  steamid64: string;
  item: ListingItem;
  intent: ListingIntent;
  currencies: ListingCurrencies;
  isAutomatic: boolean;
  isOffers: boolean;
  createdAt: Date;
  bumpedAt: Date;
}

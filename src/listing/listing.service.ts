import { HttpService, Injectable } from '@nestjs/common';
import { ItemService } from '../item/item.service';
import * as SKU from 'tf2-sku';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { Listing } from '../listing/interfaces/listing.interface';

@Injectable()
export class ListingService {
  constructor(
    private readonly itemService: ItemService,
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  async saveListings(sku: string, listings: Listing[]): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').listings
    }/listings`;

    await this.httpService
      .post<any>(url, {
        sku: sku,
        listings,
        createdAt: new Date(),
      })
      .toPromise();
  }

  async getListings(sku: string): Promise<Listing[]> {
    const item = SKU.fromString(sku);

    const schemaItem = await this.itemService.getItemByDefindex(item.defindex);

    const qs: { [key: string]: any } = {
      key: this.configService.get('bptfApiKey'),
      page_size: 30,
      item_names: 1,
      item: schemaItem.item_name,
      quality: item.quality,
      tradable: 1,
      craftable: item.craftable === true ? 1 : -1,
      killstreak_tier: item.killstreak,
      australium: item.australium === true ? 1 : -1,
    };

    if (item.effect !== null) {
      qs.particle = item.effect;
    }

    // TODO: Support skins

    if (item.wear !== null) {
      qs.wear_tier = item.wear;
    }

    if (item.quality2 !== null) {
      qs.elevated = item.quality2;
    }

    if (item.target !== null) {
      qs.item_type = 'target';

      const targetSchemaItem = await this.itemService.getItemByDefindex(
        item.target,
      );
      qs.item = targetSchemaItem.item_name;
    } else if (item.output !== null) {
      qs.item_type = 'output';

      const targetSchemaItem = await this.itemService.getItemByDefindex(
        item.output,
      );
      qs.item = targetSchemaItem.item_name;
    }

    return this.httpService
      .get('https://backpack.tf/api/classifieds/search/v1', {
        params: qs,
      })
      .toPromise()
      .then((response) => {
        const listings = response.data.sell.listings.concat(
          response.data.buy.listings,
        );

        return listings.map((listing) => ({
          id: listing.id,
          steamid64: listing.steamid,
          item: listing.item,
          intent: listing.intent,
          currencies: {
            keys: listing.currencies.keys ?? 0,
            metal: listing.currencies.metal ?? 0,
          },
          isAutomatic: listing.automatic === 1,
          createdAt: new Date(listing.created * 1000),
          bumpedAt: new Date(listing.bump * 1000),
        }));
      });
  }
}

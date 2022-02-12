import { HttpService, Injectable, Logger } from '@nestjs/common';
import * as SKU from 'tf2-sku';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { ClassifiedsSearchResponse } from './interfaces/classifieds-search.interface';
import { SchemaService } from '../schema/schema.service';
import { Snapshot } from './interfaces/snapshot.interface';
import { SkinService } from '../skin/skin.service';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    private readonly schemaService: SchemaService,
    private readonly skinService: SkinService,
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  async saveSnapshot(sku: string, snapshot: Snapshot): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').listings
    }/listings`;

    await this.httpService
      .post<any>(url, {
        sku: sku,
        listings: snapshot.listings,
        createdAt: snapshot.createdAt,
      })
      .toPromise();
  }

  async getSnapshot(sku: string): Promise<Snapshot> {
    const bptfNameSKU = await this.createSKU(sku);

    const qs: { [key: string]: any } = {
      appid: 440,
      token: this.configService.get('bptfAccessToken'),
      page_size: 30,
      sku: bptfNameSKU,
    };

    this.logger.log(
      'Getting listings for ' + sku + ' (' + bptfNameSKU + ')...',
    );

    const now = new Date().getTime() / 1000;

    return this.httpService
      .get<ClassifiedsSearchResponse>(
        'https://backpack.tf/api/classifieds/listings/snapshot',
        {
          params: qs,
        },
      )
      .toPromise()
      .then((response) => {
        const listings = (response.data.listings || [])
          .filter((listing) => {
            // Filter out listings not priced in keys and metal
            for (const currency in listing.currencies) {
              if (currency !== 'metal' && currency !== 'keys') {
                return false;
              }
            }

            return true;
          })
          .map((listing) => ({
            steamid64: listing.steamid,
            item: listing.item,
            intent: listing.intent,
            currencies: {
              keys: listing.currencies.keys ?? 0,
              metal: listing.currencies.metal ?? 0,
            },
            isAutomatic:
              listing.userAgent !== undefined &&
              now - listing.userAgent.lastPulse < 5 * 60,
            isBuyout: listing.buyout === 1,
            isOffers: listing.offers === 1,
            details: listing.details,
            createdAt: new Date(listing.timestamp * 1000),
            bumpedAt: new Date(listing.bump * 1000),
          }));

        return {
          listings,
          createdAt: new Date(response.data.createdAt * 1000),
        };
      });
  }

  async createSKU(sku: string): Promise<string> {
    const item: Item = SKU.fromString(sku);
    const schemaItem = await this.schemaService.getItemByDefindex(
      item.defindex,
    );

    let name = '';

    if (item.craftable === false) {
      name += 'Non-Craftable ';
    }

    if (item.outputQuality && item.outputQuality !== 6) {
      name =
        (await this.schemaService.getQualityById(item.outputQuality)).name +
        ' ';
    }

    if (item.quality2) {
      name +=
        (await this.schemaService.getQualityById(item.quality2)).name + ' ';
    }

    if (
      (item.quality !== 6 && item.quality !== 15 && item.quality !== 5) ||
      (item.quality === 5 && !item.effect) ||
      schemaItem.item_quality === 5
    ) {
      name +=
        (await this.schemaService.getQualityById(item.quality)).name + ' ';
    }

    if (item.festive === true) {
      name += 'Festivized ';
    }

    if (item.effect) {
      name += (await this.schemaService.getEffectById(item.effect)).name + ' ';
    }

    if (item.killstreak && item.killstreak > 0) {
      name +=
        ['Killstreak', 'Specialized Killstreak', 'Professional Killstreak'][
          item.killstreak - 1
        ] + ' ';
    }

    if (item.target) {
      name +=
        (await this.schemaService.getItemByDefindex(item.target)).item_name +
        ' ';
    }

    if (item.output) {
      name +=
        (await this.schemaService.getItemByDefindex(item.output)).item_name +
        ' ';
    }

    if (item.australium === true) {
      name += 'Australium ';
    }

    if (item.paintkit !== null) {
      name += (await this.skinService.getSkinByid(item.paintkit)).name + ' ';
    }

    if (name === '' && schemaItem.proper_name == true) {
      name = 'The ';
    }

    name += schemaItem.item_name;

    if (item.wear) {
      name +=
        ' (' +
        [
          'Factory New',
          'Minimal Wear',
          'Field-Tested',
          'Well-Worn',
          'Battle Scarred',
        ][item.wear - 1] +
        ')';
    }

    if (item.crateseries) {
      name += ' #' + item.crateseries;
    }

    return name;
  }
}

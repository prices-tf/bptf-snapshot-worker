import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config, Services } from '../common/config/configuration';
import { Snapshot } from './interfaces/snapshot.interface';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  async saveSnapshot(
    sku: string,
    name: string,
    snapshot: Snapshot,
  ): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').listings
    }/listings`;

    await this.httpService
      .post<any>(url, {
        sku,
        name,
        listings: snapshot.listings ?? [],
        createdAt: snapshot.createdAt,
      })
      .toPromise();
  }

  async getSnapshot(sku: string): Promise<Snapshot> {
    const qs: { [key: string]: any } = {
      appid: 440,
      token: this.configService.get('bptfAccessToken'),
      page_size: 30,
      sku,
    };

    return this.httpService
      .get<any>('https://api.backpack.tf/api/classifieds/listings/snapshot', {
        params: qs,
      })
      .toPromise()
      .then((response) => response.data);
  }

  async getBackpackTFSKU(sku: string): Promise<string> {
    const url = `${
      this.configService.get<Services>('services').listings
    }/listings/${sku}/name`;

    return this.httpService
      .get<any>(url)
      .toPromise()
      .then((response) => response.data.name);
  }
}

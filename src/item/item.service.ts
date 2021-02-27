import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Services } from 'src/common/config/configuration';
import { Item } from './interfaces/item.interface';

@Injectable()
export class ItemService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getItemByDefindex(defindex: number): Promise<Item> {
    const url = `${
      this.configService.get<Services>('services').schema
    }/items/${defindex}`;

    return this.httpService
      .get<Item>(url)
      .toPromise()
      .then((response) => {
        return response.data;
      });
  }
}

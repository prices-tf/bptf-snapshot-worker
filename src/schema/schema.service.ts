import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Services } from '../common/config/configuration';
import { Effect } from './interfaces/effect.interface';
import { SchemaItem } from './interfaces/item.interface';
import { Quality } from './interfaces/quality.interface';

@Injectable()
export class SchemaService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getItemByDefindex(defindex: number): Promise<SchemaItem> {
    const url = `${
      this.configService.get<Services>('services').tf2Schema
    }/items/defindex/${defindex}`;

    return this.httpService
      .get<SchemaItem>(url)
      .toPromise()
      .then((response) => {
        return response.data;
      });
  }

  getQualityById(id: number): Promise<Quality> {
    const url = `${
      this.configService.get<Services>('services').tf2Schema
    }/qualities/id/${id}`;

    return this.httpService
      .get<Quality>(url)
      .toPromise()
      .then((response) => {
        return response.data;
      });
  }

  getEffectById(id: number): Promise<Effect> {
    const url = `${
      this.configService.get<Services>('services').tf2Schema
    }/effects/id/${id}`;

    return this.httpService
      .get<Effect>(url)
      .toPromise()
      .then((response) => {
        return response.data;
      });
  }
}

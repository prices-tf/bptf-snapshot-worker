import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ListingService } from './listing.service';

interface JobData {
  sku: string;
}

@Processor('snapshot')
export class ListingConsumer {
  private readonly logger = new Logger(ListingConsumer.name);

  constructor(private readonly listingService: ListingService) {}

  @Process()
  async getListings(job: Job<JobData>) {
    const sku = job.data.sku;

    const snapshot = await this.listingService.getSnapshot(sku);

    await this.listingService.saveSnapshot(sku, snapshot);

    return {
      listingCount: snapshot.listings.length,
    };
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job<JobData>, result: { listingCount: number }) {
    this.logger.log(
      'Found ' + result.listingCount + ' listing(s) for ' + job.data.sku,
    );
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    this.logger.error('Job with id ' + job.id + ' failed: ' + err.message);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (err?.isAxiosError === true) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(err.response?.data);
    }
  }
}

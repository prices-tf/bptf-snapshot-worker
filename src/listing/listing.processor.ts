import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job, RateLimiter } from 'bull';
import { ListingService } from './listing.service';

interface JobData {
  sku: string;
}

@Processor('snapshot')
export class ListingConsumer {
  constructor(private readonly listingService: ListingService) {}

  @Process()
  async getListings(job: Job<JobData>) {
    const sku = job.data.sku;

    const listings = await this.listingService.getListings(sku);

    await this.listingService.saveListings(sku, listings);

    return {
      listingCount: listings.length,
    };
  }

  @OnQueueActive()
  onQueueActive(job: Job<JobData>) {
    console.log('Getting listings for ' + job.data.sku);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job<JobData>, result: { listingCount: number }) {
    console.log(
      'Found ' + result.listingCount + ' listing(s) for ' + job.data.sku,
    );
  }

  @OnQueueFailed()
  onQueueFailed(job: Job, err: Error) {
    console.log('Job with id ' + job.id + ' failed: ' + err.message);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (err?.isAxiosError === true) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(err.response?.data);
    }
  }
}

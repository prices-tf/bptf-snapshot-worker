import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted,
  InjectQueue,
} from '@nestjs/bull';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { LimiterService } from '../limiter/limiter.service';
import { ListingService } from './listing.service';

interface JobData {
  sku: string;
}

@Processor('snapshot')
export class ListingConsumer implements OnModuleDestroy {
  private readonly logger = new Logger(ListingConsumer.name);

  constructor(
    private readonly listingService: ListingService,
    private readonly limiterService: LimiterService,
    @InjectQueue('snapshot')
    private readonly queue: Queue,
  ) {}

  async onModuleDestroy(): Promise<void> {
    // Pause queue to prevent running more jobs
    await this.queue.pause(true, false);
  }

  @Process({
    concurrency: 2,
  })
  async getListings(job: Job<JobData>) {
    const sku = job.data.sku;

    const snapshot = await this.limiterService.schedule(() => {
      return this.listingService.getSnapshot(sku);
    });

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

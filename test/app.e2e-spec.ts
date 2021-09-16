import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

describe('AppController (e2e)', () => {
  let moduleRef: TestingModule;
  let app: INestApplication;
  let snapshotQueue: Queue;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    snapshotQueue = app.get<Queue>(getQueueToken('snapshot'));
  });

  afterEach(() => {
    return moduleRef.close();
  });

  it('should start properly', async () => {
    const counts = await snapshotQueue.getJobCounts();

    expect(counts.active).toBe(0);
    expect(counts.delayed).toBe(0);
    expect(counts.waiting).toBe(0);
  });
});

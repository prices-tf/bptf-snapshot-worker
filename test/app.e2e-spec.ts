import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let snapshotQueue: Queue;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    snapshotQueue = app.get<Queue>(getQueueToken('snapshot'));
  });

  afterAll(() => {
    return app.close();
  });

  it('should start properly', async () => {
    const counts = await snapshotQueue.getJobCounts();

    expect(counts.active).toBe(0);
    expect(counts.delayed).toBe(0);
    expect(counts.waiting).toBe(0);
  });
});

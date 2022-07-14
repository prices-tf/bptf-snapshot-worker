import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let queue: Queue;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    queue = app.get<Queue>(getQueueToken('snapshot'));
  });

  afterEach(() => {
    return app.close();
  });

  it('should be defined', () => {
    return expect(app).toBeDefined();
  });

  it('should start properly', async () => {
    const counts = await queue.getJobCounts();

    expect(counts.active).toBe(0);
    expect(counts.delayed).toBe(0);
    expect(counts.waiting).toBe(0);
  });
});

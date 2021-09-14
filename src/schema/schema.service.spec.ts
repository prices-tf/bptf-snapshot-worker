import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SchemaService } from './schema.service';

describe('SchemaService', () => {
  let service: SchemaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [SchemaService],
    }).compile();

    service = module.get<SchemaService>(SchemaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

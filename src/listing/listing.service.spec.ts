import { Test, TestingModule } from '@nestjs/testing';
import { ItemModule } from '../item/item.module';
import { ListingService } from './listing.service';

describe('ListingService', () => {
  let service: ListingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ItemModule],
      providers: [
        {
          provide: ListingService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ListingService>(ListingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

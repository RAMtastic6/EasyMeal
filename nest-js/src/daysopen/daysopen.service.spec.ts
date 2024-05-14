import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenService } from './daysopen.service';

describe('DaysopenService', () => {
  let service: DaysopenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DaysopenService],
    }).compile();

    service = module.get<DaysopenService>(DaysopenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

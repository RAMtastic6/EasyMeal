import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenController } from './daysopen.controller';
import { DaysopenService } from './daysopen.service';

describe('DaysopenController', () => {
  let controller: DaysopenController;
  let service: DaysopenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaysopenController],
      providers: [
        {
          provide: DaysopenService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DaysopenController>(DaysopenController);
    service = module.get<DaysopenService>(DaysopenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });
});

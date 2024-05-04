import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenController } from './daysopen.controller';
import { DaysopenService } from './daysopen.service';

describe('DaysopenController', () => {
  let controller: DaysopenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaysopenController],
      providers: [DaysopenService],
    }).compile();

    controller = module.get<DaysopenController>(DaysopenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

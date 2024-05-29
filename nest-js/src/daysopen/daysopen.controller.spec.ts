import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenController } from './daysopen.controller';
import { DaysopenService } from './daysopen.service';
import { CreateDaysopenDto } from './dto/create-daysopen.dto';

describe('DaysopenController', () => {
  let controller: DaysopenController;
  let service: DaysopenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DaysopenController],
      providers: [{
        provide: DaysopenService,
        useValue: {
          create: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<DaysopenController>(DaysopenController);
    service = module.get<DaysopenService>(DaysopenService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call the service with the correct parameters', () => {
      const createDaysopenDto: CreateDaysopenDto = {
        restaurant_id: 0,
        days_open: []
      };

      const createSpy = jest.spyOn(service, 'create');
      controller.create(createDaysopenDto);

      expect(createSpy).toHaveBeenCalledWith(createDaysopenDto);
    });
  });
});
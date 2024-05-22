import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenService } from './daysopen.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Day, Daysopen } from './entities/daysopen.entity';

describe('DaysopenService', () => {
  let service: DaysopenService;
  let daysopenRepository: Repository<Daysopen>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DaysopenService,
        {
          provide: getRepositoryToken(Daysopen),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DaysopenService>(DaysopenService);
    daysopenRepository = module.get<Repository<Daysopen>>(
      getRepositoryToken(Daysopen),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create daysopen entries', async () => {
      const createDaysopenDto = {
        restaurant_id: 1,
        days_open: [
          {
            day_open: Day.MONDAY,
            opening: '09:00',
            closing: '18:00',
          },
          {
            day_open: Day.TUESDAY,
            opening: '09:00',
            closing: '18:00',
          },
        ],
      };

      const daysopen = [
        {
          restaurantId: createDaysopenDto.restaurant_id,
          dayOpen: Day.MONDAY,
          opening: '09:00',
          closing: '18:00',
        } as Daysopen,
        {
          restaurantId: createDaysopenDto.restaurant_id,
          dayOpen: Day.TUESDAY,
          opening: '09:00',
          closing: '18:00',
        } as Daysopen,
      ];

      daysopen.forEach((day) => {
        jest.spyOn(daysopenRepository, 'create').mockReturnValueOnce(day);
        jest.spyOn(daysopenRepository, 'save').mockResolvedValueOnce(day);
      });

      await service.create(createDaysopenDto);

      expect(daysopenRepository.create).toHaveBeenCalledTimes(2);
      expect(daysopenRepository.save).toHaveBeenCalledTimes(2);
      
      daysopen.forEach((day) => {
        expect(daysopenRepository.create).toHaveBeenCalledWith(day);
        expect(daysopenRepository.save).toHaveBeenCalledWith(day);
      });
    });
  });
});
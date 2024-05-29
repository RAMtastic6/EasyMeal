import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenService } from './daysopen.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Day, Daysopen } from './entities/daysopen.entity';

describe('DaysopenService', () => {
  let service: DaysopenService;
  let daysopenRepository: Repository<Daysopen>;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DaysopenService,
        {
          provide: getRepositoryToken(Daysopen),
          useClass: Repository,
        },
        {
          provide: EntityManager,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<DaysopenService>(DaysopenService);
    daysopenRepository = module.get<Repository<Daysopen>>(
      getRepositoryToken(Daysopen),
    );
    manager = module.get<EntityManager>(EntityManager);
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

  describe('create_manager', () => {
    it('should create daysopen entries with a specific manager', async () => {
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
        jest.spyOn(manager, 'create').mockReturnValueOnce(day as any);
        jest.spyOn(manager, 'save').mockResolvedValueOnce(day);
      });

      await service.create_manager(createDaysopenDto, manager);

      expect(manager.create).toHaveBeenCalledTimes(2);
      expect(manager.save).toHaveBeenCalledTimes(2);

      daysopen.forEach((day) => {
        expect(manager.create).toHaveBeenCalledWith(Daysopen, day);
        expect(manager.save).toHaveBeenCalledWith(day);
      });
    });
  });
});
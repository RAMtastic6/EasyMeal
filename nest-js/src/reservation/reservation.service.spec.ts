import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationGruop } from './entities/reservation_group.enity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

describe('ReservationService', () => {
  let service: ReservationService;
  let restaurantService: RestaurantService;
  let reservationRepo: Repository<Reservation>;
  let ReservationGruopRepo: Repository<ReservationGruop>;
  let restaurantRepo: Repository<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService, RestaurantService,
        {
          provide: getRepositoryToken(Reservation),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ReservationGruop),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Restaurant),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        }
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    service = module.get<ReservationService>(ReservationService);
    reservationRepo = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
    ReservationGruopRepo = module.get<Repository<ReservationGruop>>(getRepositoryToken(ReservationGruop));
    restaurantRepo = module.get<Repository<Restaurant>>(getRepositoryToken(Restaurant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a reservation repository', async () => {
    expect(reservationRepo).toBeDefined();
  });

  it('should create a reservation group repository', async () => {
    expect(ReservationGruopRepo).toBeDefined();
  });

  it('should create a restaurant service', async () => {
    expect(restaurantService).toBeDefined();
  });
});

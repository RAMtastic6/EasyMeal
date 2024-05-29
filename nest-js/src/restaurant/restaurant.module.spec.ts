import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from './restaurant.module';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { Restaurant } from './entities/restaurant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('RestaurantModule', () => {
  let restaurantService: RestaurantService;
  let restaurantController: RestaurantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Restaurant]),
        RestaurantModule,
      ],
    })
    .overrideProvider(getRepositoryToken(Restaurant))
    .useValue({
      findOne: jest.fn(),
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    restaurantController = module.get<RestaurantController>(RestaurantController);
  });

  it('RestaurantService should be defined', () => {
    expect(restaurantService).toBeDefined();
  });

  it('RestaurantController should be defined', () => {
    expect(restaurantController).toBeDefined();
  });
});

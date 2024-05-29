import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './entities/menu.entity';
import { Food } from '../food/entities/food.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

describe('MenuService', () => {
  let service: MenuService;
  let menuRepository: Repository<Menu>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new menu', async () => {
      const createMenuDto: CreateMenuDto = {
        name: 'Test Menu',
        foods: [{
          id: 1,
          name: 'Pizza',
          price: 10,
        } as Food, {
          id: 2,
          name: 'Burger',
          price: 15,
        } as Food],
        restaurant_id: 1,
      };

      const menu = new Menu();
      menu.name = createMenuDto.name;
      menu.foods = createMenuDto.foods;
      menu.restaurant = { id: createMenuDto.restaurant_id } as Restaurant;

      jest.spyOn(menuRepository, 'create').mockReturnValue(menu);
      jest.spyOn(menuRepository, 'save').mockResolvedValue(menu);

      const result = await service.create(createMenuDto);

      expect(menuRepository.create).toHaveBeenCalledWith({
        name: createMenuDto.name,
        foods: createMenuDto.foods,
        restaurant: { id: createMenuDto.restaurant_id },
      });
      expect(menuRepository.save).toHaveBeenCalledWith(menu);
      expect(result).toEqual(menu);
    });
  });
});
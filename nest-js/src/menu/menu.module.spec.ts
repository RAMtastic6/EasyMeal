import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from './entities/menu.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuModule } from './menu.module';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Food } from '../food/entities/food.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

describe('MenuModule', () => {
  let menuController: MenuController;
  let menuService: MenuService;
  let menuRepository: Repository<Menu>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Menu]),
        MenuModule,
      ],
    })
    .overrideProvider(getRepositoryToken(Menu))
    .useValue({
      create: jest.fn(),
      save: jest.fn(),
    })
    .compile();

    menuController = module.get<MenuController>(MenuController);
    menuService = module.get<MenuService>(MenuService);
    menuRepository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
  });

  it('should be defined', () => {
    expect(menuController).toBeDefined();
    expect(menuService).toBeDefined();
  });

  describe('create', () => {
    it('should call menuService.create and return the result', async () => {
      const createMenuDto: CreateMenuDto = {
        name: 'Test Menu',
        foods: [{
          id: 1,
          name: 'Pizza',
          price: 10,
        } as Food],
        restaurant_id: 1,
      };

      const menu = new Menu();
      menu.name = createMenuDto.name;
      menu.foods = createMenuDto.foods;
      menu.restaurant = { id: createMenuDto.restaurant_id } as Restaurant;

      jest.spyOn(menuService, 'create').mockResolvedValue(menu);

      const result = await menuController.create(createMenuDto);
      expect(result).toEqual(menu);
      expect(menuService.create).toHaveBeenCalledWith(createMenuDto);
    });

    it('should call menuRepository.create and menuRepository.save', async () => {
      const createMenuDto: CreateMenuDto = {
        name: 'Test Menu',
        foods: [{
          id: 1,
          name: 'Pizza',
          price: 10,
        } as Food],
        restaurant_id: 1,
      };

      const menu = new Menu();
      menu.name = createMenuDto.name;
      menu.foods = createMenuDto.foods;
      menu.restaurant = { id: createMenuDto.restaurant_id } as Restaurant;

      jest.spyOn(menuRepository, 'create').mockReturnValue(menu);
      jest.spyOn(menuRepository, 'save').mockResolvedValue(menu);

      const result = await menuService.create(createMenuDto);

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

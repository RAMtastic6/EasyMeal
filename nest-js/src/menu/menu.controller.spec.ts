import { Test, TestingModule } from '@nestjs/testing';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Food } from '../food/entities/food.entity';

describe('MenuController', () => {
  let controller: MenuController;
  let service: MenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuController],
      providers: [{
        provide: MenuService,
        useValue: {
          create: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<MenuController>(MenuController);
    service = module.get<MenuService>(MenuService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call menuRepository.create with the correct parameters', async () => {
      const createMenuDto: CreateMenuDto = {
        name: 'Test Menu',
        foods: [{
          id: 1,
          name: 'Pizza',
          price: 10,
        } as Food],
        restaurant_id: 1
      };

      const createSpy = jest.spyOn(service, 'create');
      await controller.create(createMenuDto);

      expect(createSpy).toHaveBeenCalledWith(createMenuDto);
    });
  });
});
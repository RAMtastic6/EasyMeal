import { Test, TestingModule } from '@nestjs/testing';
import { MenuService } from './menu.service';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MenuService', () => {
  let service: MenuService;
  let repo: Repository<Menu>;
  const menuToken = getRepositoryToken(Menu);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: menuToken,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    repo = module.get<Repository<Menu>>(menuToken);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repo should be defined', () => {
    expect(repo).toBeDefined();
  });
});

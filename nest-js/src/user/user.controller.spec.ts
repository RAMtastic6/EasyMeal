import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create_user: jest.fn(),
            findOne: jest.fn(),
          }
        }
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('the controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('the service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: UserDto = {
      name: 'user',
      email: 'user@test.com',
      password: 'user123',
      surname: 'user',
    };
    const user = {
      name: 'user',
      email: 'user@test.com',
      password: 'user123',
      surname: 'user',
      id: 1,
    } as User;

    it('should call the service create method with the correct parameters', async () => {
      jest.spyOn(service, 'create_user').mockResolvedValueOnce(user);
      await controller.create(createUserDto);
      expect(service.create_user).toHaveBeenCalledWith(createUserDto);
    });

    it('should return the result of the service create method', async () => {
      jest.spyOn(service, 'create_user').mockResolvedValueOnce(user);
      expect(await controller.create(createUserDto)).toBe(user);
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const user = {
      name: 'user',
      email: 'user@test.com',
      password: 'user123',
      surname: 'user',
      id: userId,
    } as User;

    it('should call the service findOne method with the correct parameter', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      await controller.findOne(userId.toString());
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });

    it('should return the result of the service findOne method', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      expect(await controller.findOne(userId.toString())).toBe(user);
    });
  });
});


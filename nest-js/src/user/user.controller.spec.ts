import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { HttpException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Admin } from 'typeorm';
import { AdminDto } from './dto/create-admin.dto';

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
            create_admin: jest.fn(),
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
      await controller.findOne(userId);
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });

    it('should return the result of the service findOne method', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      expect(await controller.findOne(userId)).toBe(user);
    });
  });

  describe('createAdmin', () => {
    const createAdminDto = {
      name: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
    } as unknown as AdminDto;
    const admin = {
      name: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      id: 1,
    } as unknown as Admin;
  
    it('should call the service create_admin method with the correct parameters', async () => {
      jest.spyOn(service, 'create_admin').mockResolvedValueOnce(true);
      await controller.createAdmin(createAdminDto);
      expect(service.create_admin).toHaveBeenCalledWith(createAdminDto);
    });
  
    it('should return the result of the service create_admin method', async () => {
      jest.spyOn(service, 'create_admin').mockResolvedValueOnce(true);
      expect(await controller.createAdmin(createAdminDto)).toBe(true);
    });

    it('should throw an error if the service create_admin method returns null', async () => {
      jest.spyOn(service, 'create_admin').mockResolvedValueOnce(null);
      await expect(controller.createAdmin(createAdminDto)).rejects.toThrow(HttpException);
    });
  });
});


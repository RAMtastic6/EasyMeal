import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { AdminDto } from './dto/create-admin.dto';
import { User, UserRole } from './entities/user.entity';
import { HttpException } from '@nestjs/common';

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
            create_admin: jest.fn(),
            findOne: jest.fn(),
            login: jest.fn()
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

  describe('createAdmin', () => {
    const createAdminDto: AdminDto = {
      name: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      surname: 'admin',
      restaurant_name: '',
      restaurant_address: '',
      restaurant_city: '',
      restaurant_cuisine: '',
      restaurant_tables: 0,
      restaurant_phone_number: '',
      restaurant_email: ''
    };
    const admin: User = {
      name: 'admin',
      email: 'admin@test.com',
      password: 'admin123',
      surname: 'admin',
      id: 1,
      role: UserRole.USER,
      orders: [],
      reservation_group: [],
      reservations: []
    };

    it('should call the method with correct parameters', async () => {
      jest.spyOn(service, 'create_admin').mockImplementationOnce(async (x) => admin);
      await controller.createAdmin(createAdminDto);
      expect(service.create_admin).toHaveBeenCalledWith(createAdminDto);
    });

    it('should return the result of the service createAdmin method', async () => {
      jest.spyOn(service, 'create_admin').mockResolvedValueOnce(admin);
      expect(await controller.createAdmin(createAdminDto)).toBe(admin);
    });
  });

  describe('create', () => {
    const createUserDto: UserDto = {
      name: 'user',
      email: 'user@test.com',
      password: 'user123',
      surname: 'user',
    };
    const user: User = {
      name: 'user',
      email: 'user@test.com',
      password: 'user123',
      surname: 'user',
      id: 1,
      role: UserRole.USER,
      orders: [],
      reservation_group: [],
      reservations: []
    };

    it('should call the service create method with the correct parameters', async () => {
      jest.spyOn(service, 'create_user').mockImplementationOnce(async (x) => user);
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
    const user: User = {
      name: 'user',
      email: 'user@test.com',
      password: 'user123',
      surname: 'user',
      id: userId,
      role: UserRole.USER,
      orders: [],
      reservation_group: [],
      reservations: []
    };

    it('should call the service findOne method with the correct parameter', async () => {
      jest.spyOn(service, 'findOne').mockImplementationOnce(async (x) => user);
      await controller.findOne(userId.toString());
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });

    it('should return the result of the service findOne method', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      expect(await controller.findOne(userId.toString())).toBe(user);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'user@test.com',
      password: 'user123',
    };

    const result = {
      token: 'token',
      userName: 'user',
      role: UserRole.USER
    }

    it('should call the service login method with the correct parameters', async () => {
      jest.spyOn(service, 'login').mockImplementationOnce(async (x, y) => result);
      await controller.login(loginDto);
      expect(service.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
    });

    it('should return the result of the service login method', async () => {
      jest.spyOn(service, 'login').mockResolvedValueOnce(result);
      expect(await controller.login(loginDto)).toBe(true);
    });

    it('should throw an HttpException if the service login method returns null', async () => {
      jest.spyOn(service, 'login').mockResolvedValueOnce(null);
      expect(async () => {
        await controller.login(loginDto);
      }).rejects.toThrow(HttpException).catch((e) => {
        expect(e.message).toBe('Invalid credentials');
        expect(e.getStatus()).toBe(401);
      });
    });
  });
});


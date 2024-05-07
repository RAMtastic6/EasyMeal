import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  /*describe('create', () => {
    it('should call the service create method with the correct parameters', async () => {
      const createCustomerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      const result = { id: 1, name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(service, 'create').mockImplementation(async () => result as any);
      expect(await controller.create(createCustomerDto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findOne', () => {
    it('should call the service findOne method with the correct parameters', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(async () => 'test');
      expect(await controller.findOne('1')).toBe('test');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call the service update method with the correct parameters', () => {
      const updateCustomerDto = new UpdateCustomerDto();
      jest.spyOn(service, 'update').mockImplementation(async () => 'test');
      expect(controller.update('1', updateCustomerDto)).toBe('test');
      expect(service.update).toHaveBeenCalledWith(1, updateCustomerDto);
    });
  });

  describe('remove', () => {
    it('should call the service remove method with the correct parameters', () => {
      jest.spyOn(service, 'remove').mockImplementation(async () => 'test');
      expect(controller.remove('1')).toBe('test');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('login', () => {
    it('should call the service login method with the correct parameters', async () => {
      const loginCredentials = { email: 'test@test.com', password: 'password' };
      jest.spyOn(service, 'login').mockImplementation(async () => 'test');
      expect(await controller.login(loginCredentials)).toBe('test');
      expect(service.login).toHaveBeenCalledWith(loginCredentials.email, loginCredentials.password);
    });

    it('should throw an HttpException when the service login method returns null', async () => {
      const loginCredentials = { email: 'test@test.com', password: 'password' };
      jest.spyOn(service, 'login').mockImplementation(async () => null);
      await expect(controller.login(loginCredentials)).rejects.toThrow(HttpException);
    });
  });*/

});


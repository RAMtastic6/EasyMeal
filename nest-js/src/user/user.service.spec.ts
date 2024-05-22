import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create_user', () => {
    it('should create a new user', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
        password: 'password',
      };

      const hashedPassword = 'hashedPassword';

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValueOnce({
        ...userDto,
        password: hashedPassword,
      } as User);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...userDto,
        password: hashedPassword,
      } as User);

      const createdUser = await service.create_user(userDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled()
      expect(createdUser).toEqual({ ...userDto, password: hashedPassword });
    });

    it('should return null if email is already registered', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
        password: 'password',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({} as any);

      const createdUser = await service.create_user(userDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(createdUser).toBeNull();
    });

    it('should return null if any required field is missing', async () => {
      const userDto: UserDto = {
        email: '',
        name: 'John',
        surname: 'Doe',
        password: 'password',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      const createdUser = await service.create_user(userDto);

      expect(createdUser).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', name: 'John', surname: 'Doe' } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const foundUser = await service.findOne(userId);

      expect(repository.findOne).toHaveBeenCalled();
      expect(foundUser).toEqual(user);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, name: 'John', surname: 'Doe' } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const foundUser = await service.findUserByEmail(email);

      expect(repository.findOne).toHaveBeenCalled();
      expect(foundUser).toEqual(user);
    });
  });
});
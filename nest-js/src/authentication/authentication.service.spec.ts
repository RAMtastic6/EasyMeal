
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { UserService } from '../user/user.service';
import { AuthenticationDto } from './dto/authentication.dto';
import { comparePasswords } from '../utils';

jest.mock('../utils', () => ({ comparePasswords: jest.fn() }));

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let jwtService: JwtService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('generateToken', () => {
    it('should generate a token', async () => {
      const payload = { id: 1, role: 'admin' };
      const token = 'generated-token';

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

      const result = await service.generateToken(payload);

      expect(jwtService.signAsync).toHaveBeenCalledWith(payload);
      expect(result).toBe(token);
    });
  });

  describe('signinUser', () => {
    it('should return null if user does not exist', async () => {
      // Arrange
      const dto: AuthenticationDto = {
        email: 'nonexistent@example.com',
        password: 'password',
      };
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(null);

      // Act
      const result = await service.signinUser(dto);

      // Assert
      expect(userService.findUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      // Arrange
      const dto: AuthenticationDto = {
        email: 'existing@example.com',
        password: 'wrongpassword',
      };
      const user = { id: 1, password: 'correctpassword', staff: null };
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user as any);
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      // Act
      const result = await service.signinUser(dto);

      // Assert
      expect(userService.findUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(comparePasswords).toHaveBeenCalledWith(dto.password, user.password);
      expect(result).toBeNull();
    });

    it('should return a token if user exists and password matches', async () => {
      // Arrange
      const dto: AuthenticationDto = {
        email: 'existing@example.com',
        password: 'correctpassword',
      };
      const user = { id: 1, password: 'correctpassword', staff: null };
      const token = 'generated-token';
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user as any);
      (comparePasswords as jest.Mock).mockResolvedValue(true);
      jest.spyOn(service, 'generateToken').mockResolvedValue(token);

      // Act
      const result = await service.signinUser(dto);

      // Assert
      expect(userService.findUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(comparePasswords).toHaveBeenCalledWith(dto.password, user.password);
      expect(service.generateToken).toHaveBeenCalledWith({ id: user.id, role: 'customer' });
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should return true if the token is valid', async () => {
      // Arrange
      const accessToken = 'valid-token';
      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: 1, role: 'admin' });

      // Act
      const result = await service.verifyToken(accessToken);

      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith(accessToken);
      expect(result).toEqual({ id: 1, role: 'admin' });
    });

    it('should return false if the token is invalid', async () => {
      // Arrange
      const accessToken = 'invalid-token';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = await service.verifyToken(accessToken);

      // Assert
      expect(jwtService.verify).toHaveBeenCalledWith(accessToken);
      expect(result).toBe(null);
    });
  });
});
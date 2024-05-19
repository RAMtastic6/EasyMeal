import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticationDto } from './dto/authentication.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: {
            signinUser: jest.fn(),
            verifyToken: jest.fn()
          }
        }
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('signin', () => {
    it('should return a token when valid credentials are provided', async () => {
      // Arrange
      const dto: AuthenticationDto = {
        email: 'test',
        password: 'test'
      };
      const expectedToken = 'valid-token';

      jest.spyOn(service, 'signinUser').mockResolvedValue(expectedToken);

      // Act
      const result = await controller.signin(dto);

      // Assert
      expect(result).toEqual({ token: expectedToken });
    });

    it('should throw UnauthorizedException when user is not found or password is incorrect', async () => {
      // Arrange
      const dto: AuthenticationDto = {
        email: '',
        password: ''
      };

      jest.spyOn(service, 'signinUser').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.signin(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('decodeToken', () => {
    it('should return the decoded token when a valid token is provided', async () => {
      // Arrange
      const token = 'valid-token';
      const expectedDecodedToken = { id: 1, role: 'test'};

      jest.spyOn(service, 'verifyToken').mockResolvedValue(expectedDecodedToken);

      // Act
      const result = await controller.decodeToken({ token });

      // Assert
      expect(result).toEqual(expectedDecodedToken);
    });

    it('should throw UnauthorizedException when token is missing', async () => {
      // Arrange
      const token = '';

      // Act & Assert
      await expect(controller.decodeToken({ token })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when an invalid token is provided', async () => {
      // Arrange
      const token = 'invalid-token';

      jest.spyOn(service, 'verifyToken').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.decodeToken({ token })).rejects.toThrow(UnauthorizedException);
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { UnauthorizedException } from '@nestjs/common';

describe('NotificationController', () => {
  let controller: NotificationController;
  let notificationService: NotificationService;
  let authenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            findAllByUserId: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            verifyToken: jest.fn(),
          },
        }],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
    authenticationService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('findAllByUserId', () => {
    it('should return notifications for a valid user', async () => {
      const userId = 1;
      const token = 'valid-token';
      const auth = { id: userId };
      const notifications = [{ id: 1, message: 'Notification 1' }, { id: 2, message: 'Notification 2' }];

      jest.spyOn(authenticationService, 'verifyToken').mockResolvedValue({
        id: userId,
        role: 'customer',
      });
      jest.spyOn(notificationService, 'findAllByUserId').mockResolvedValue(notifications as any);

      const result = await controller.findAllByUserId({ userId, token });

      expect(authenticationService.verifyToken).toHaveBeenCalledWith(token);
      expect(notificationService.findAllByUserId).toHaveBeenCalledWith(userId);
      expect(result).toEqual(notifications);
    });

    it('should throw UnauthorizedException for an invalid token', async () => {
      const userId = 1;
      const token = 'invalid-token';

      jest.spyOn(authenticationService, 'verifyToken').mockResolvedValue(null);

      await expect(controller.findAllByUserId({ userId, token })).rejects.toThrow(UnauthorizedException);
      expect(authenticationService.verifyToken).toHaveBeenCalledWith(token);
      expect(notificationService.findAllByUserId).not.toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a notification for a valid user', async () => {
      const notificationId = 1;
      const token = 'valid-token';
      const auth = { id: notificationId };

      jest.spyOn(authenticationService, 'verifyToken').mockResolvedValue({
        id: notificationId,
        role: 'customer',
      });
      jest.spyOn(notificationService, 'updateStatus').mockResolvedValue({ id: notificationId} as any);

      const result = await controller.updateStatus({ notificationId, token });

      expect(authenticationService.verifyToken).toHaveBeenCalledWith(token);
      expect(notificationService.updateStatus).toHaveBeenCalledWith(notificationId);
    });

    it('should throw UnauthorizedException for an invalid token or notification ID', async () => {
      const notificationId = 1;
      const token = 'invalid-token';

      jest.spyOn(authenticationService, 'verifyToken').mockResolvedValue(null);

      await expect(controller.updateStatus({ notificationId, token })).rejects.toThrow(UnauthorizedException);
      expect(authenticationService.verifyToken).toHaveBeenCalledWith(token);
      expect(notificationService.updateStatus).not.toHaveBeenCalled();
    });
  });
});
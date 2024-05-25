import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationService } from './notification.service';
import { Notification, NotificationStatus } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';

describe('NotificationService', () => {
  let service: NotificationService;
  let repository: Repository<Notification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    repository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new notification', async () => {
      const dto: NotificationDto = {
        id_receiver: 1,
        message: 'message',
        title: 'title',
      };
      const notification = new Notification();
      jest.spyOn(global, 'fetch').mockResolvedValue({ json: async () => notification } as any);
      jest.spyOn(repository, 'create').mockReturnValue(notification);
      jest.spyOn(repository, 'save').mockResolvedValue(notification);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(notification);
      expect(result).toBe(notification);
    });
  });

  describe('findAllByUserId', () => {
    it('should find all notifications by user id', async () => {
      const id = 1;
      const notifications = [new Notification(), new Notification()];
      jest.spyOn(repository, 'find').mockResolvedValue(notifications);

      const result = await service.findAllByUserId(id);

      expect(repository.find).toHaveBeenCalled();
      expect(result).toBe(notifications);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a notification', async () => {
      const idNotification = 1;
      const notification = new Notification();
      notification.status = NotificationStatus.UNREAD;
      jest.spyOn(repository, 'findOne').mockResolvedValue(notification);
      jest.spyOn(repository, 'save').mockResolvedValue(notification);

      const result = await service.updateStatus(idNotification);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: idNotification } });
      expect(notification.status).toBe(NotificationStatus.READ);
      expect(repository.save).toHaveBeenCalledWith(notification);
      expect(result).toBe(notification);
    });

    it('should return null if notification is not found', async () => {
      const idNotification = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.updateStatus(idNotification);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: idNotification } });
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should find a notification by id', async () => {
      const id = 1;
      const notification = new Notification();
      jest.spyOn(repository, 'findOne').mockResolvedValue(notification);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toBe(notification);
    });
  });
});
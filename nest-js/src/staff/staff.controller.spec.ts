import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/create-staff.dto';
import { Staff, StaffRole } from './enities/staff.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('StaffController', () => {
  let controller: StaffController;
  let service: StaffService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [{
        provide: StaffService,
        useValue: {
          create: jest.fn(),
          getAdminByRestaurantId: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    service = module.get<StaffService>(StaffService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a staff', async () => {
      const staffDto = {} as StaffDto;
      const expectedResult = {} as Staff;

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      const result = await controller.create(staffDto);

      expect(service.create).toHaveBeenCalledWith(staffDto);
      expect(result).toEqual(expectedResult);
    });

    it('should throw BadRequestException if staff creation fails', async () => {
      const staffDto = {} as StaffDto;

      jest.spyOn(service, 'create').mockResolvedValue(null);

      await expect(controller.create(staffDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRestaurantIdByAdminId', () => {
    it('should get the admin by restaurant id', async () => {
      const restaurantId = 1;
      const expectedResult = {} as any;

      jest.spyOn(service, 'getAdminByRestaurantId').mockResolvedValue(expectedResult);

      const result = await controller.getRestaurantIdByAdminId(restaurantId);

      expect(service.getAdminByRestaurantId).toHaveBeenCalledWith(restaurantId);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if restaurant is not found', async () => {
      const restaurantId = 1;

      jest.spyOn(service, 'getAdminByRestaurantId').mockResolvedValue(null);

      await expect(controller.getRestaurantIdByAdminId(restaurantId))
        .rejects.toThrow(NotFoundException);
    });
  });
});
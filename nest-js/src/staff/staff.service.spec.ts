import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff, StaffRole } from './enities/staff.entity';
import { StaffDto } from './dto/create-staff.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';

describe('StaffService', () => {
  let service: StaffService;
  let staffRepository: Repository<Staff>;
  const staffToken = getRepositoryToken(Staff);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffService,
        {
          provide: staffToken,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<StaffService>(StaffService);
    staffRepository = module.get<Repository<Staff>>(staffToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a staff repository', async () => {
    expect(staffRepository).toBeDefined();
  });

  describe('create', () => {
    const staff: StaffDto = {
      restaurant_id: 1,
      user_id: 1,
      role: StaffRole.ADMIN,
    };

    beforeEach(() => {
      jest.spyOn(staffRepository, 'create').mockReturnValueOnce(staff as Staff);
      jest.spyOn(staffRepository, 'save').mockResolvedValueOnce(staff as Staff);
      jest.spyOn(staffRepository, 'findOne').mockResolvedValueOnce(null);
    });

    it('should create a new staff member', async () => {
      const createdStaff = await service.create(staff);
      expect(staffRepository.create).toHaveBeenCalledWith(staff);
      expect(staffRepository.save).toHaveBeenCalledWith(createdStaff);
    });

    it('should return null if staffDto is invalid', async () => {
      staff.user_id = null;
      expect(await service.create(staff)).toBeNull();
    });

    it('should return null if staff already exists', async () => {
      jest.spyOn(staffRepository, 'findOne').mockResolvedValueOnce(staff as Staff);
      expect(await service.create(staff)).toBeNull();
    });
  });

  describe('getAdminByRestaurantId', () => {
    it('should return the admin staff member for a given restaurant ID', async () => {
      const restaurantId = 1;
      const adminStaff = {
        id: 1,
        restaurant_id: restaurantId,
        user_id: 1,
        role: StaffRole.ADMIN,
      } as Staff;
      jest.spyOn(staffRepository, 'findOne').mockResolvedValueOnce(adminStaff);
      const result = await service.getAdminByRestaurantId(restaurantId);
      expect(result).toEqual(adminStaff);
    });
  });

  describe('getRestaurantByAdminId', () => {
    it('should return the restaurant staff member for a given admin user ID', async () => {
      const userId = 1;
      const restaurantStaff = {
        id: 1,
        restaurant_id: 1,
        user_id: userId,
        role: StaffRole.ADMIN,
      } as Staff;
      jest.spyOn(staffRepository, 'findOne').mockResolvedValueOnce(restaurantStaff);
      const result = await service.getRestaurantByAdminId(userId);
      expect(result).toEqual(restaurantStaff);
    });
  });

});
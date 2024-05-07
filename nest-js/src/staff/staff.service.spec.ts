import { Test, TestingModule } from '@nestjs/testing';
import { StaffService } from './staff.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Staff, StaffRole } from './enities/staff.entity';
import { StaffDto } from './dto/create-staff.dto';
import { UserRole } from '../user/entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

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

    it('should throw an exception if staffDto is invalid', async () => {
      staff.user_id = null;
      await expect(service.create(staff)).rejects.toThrow(HttpException).catch((e) => {
        expect(e.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    it('should thorw conflic if staff already exists', async () => {
      jest.spyOn(staffRepository, 'findOne').mockResolvedValue(staff as Staff);
      await expect(service.create(staff)).rejects.toThrow(HttpException).catch((e) => {
        expect(e.status).toBe(HttpStatus.CONFLICT);
      });
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/create-staff.dto';
import { StaffRole } from './enities/staff.entity';

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
    it('should call the create method of the staff', async () => {
      const staffDto: StaffDto = {
        restaurant_id: 0,
        role: StaffRole.ADMIN,
        user_id: 0
      };
      await controller.create(staffDto);
      expect(service.create).toHaveBeenCalledWith(staffDto);
    });
  });
});

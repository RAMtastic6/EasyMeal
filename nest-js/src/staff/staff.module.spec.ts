import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffModule } from './staff.module';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './enities/staff.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('StaffModule', () => {
  let staffService: StaffService;
  let staffController: StaffController;
  let staffRepository: Repository<Staff>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Staff]),
        StaffModule,
      ],
    })
    .overrideProvider(getRepositoryToken(Staff))
    .useValue({
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    })
    .compile();

    staffService = module.get<StaffService>(StaffService);
    staffController = module.get<StaffController>(StaffController);
    staffRepository = module.get<Repository<Staff>>(getRepositoryToken(Staff));
  });

  it('StaffService should be defined', () => {
    expect(staffService).toBeDefined();
  });

  it('StaffController should be defined', () => {
    expect(staffController).toBeDefined();
  });

  it('StaffRepository should be defined', () => {
    expect(staffRepository).toBeDefined();
  });
});

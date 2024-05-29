import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DaysopenModule } from './daysopen.module';
import { DaysopenService } from './daysopen.service';
import { DaysopenController } from './daysopen.controller';
import { Daysopen } from './entities/daysopen.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('DaysopenModule', () => {
  let module: TestingModule;
  let daysopenController: DaysopenController;
  let daysopenService: DaysopenService;



  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Daysopen]),
        DaysopenModule
      ],
    })
    .overrideProvider(getRepositoryToken(Daysopen))
    .useValue({
      findOne: jest.fn(),
    })
    .compile();


    daysopenController = module.get<DaysopenController>(DaysopenController);
    daysopenService = module.get<DaysopenService>(DaysopenService);

  });


  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide DaysopenService', () => {
    const service = module.get<DaysopenService>(DaysopenService);
    expect(service).toBeDefined();
  });

  it('should provide DaysopenController', () => {
    const controller = module.get<DaysopenController>(DaysopenController);
    expect(controller).toBeDefined();
  });
});

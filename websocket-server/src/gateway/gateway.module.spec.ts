import { Test, TestingModule } from '@nestjs/testing';
import { GatewayModule } from './gateway.module';
import { MyGateway } from './gateway';

describe('GatewayModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [GatewayModule],
    }).compile();
  });

  it('should be defined', () => {
    const gatewayModule = module.get(GatewayModule);
    expect(gatewayModule).toBeDefined();
  });

  it('should have MyGateway provider', () => {
    const myGateway = module.get(MyGateway);
    expect(myGateway).toBeInstanceOf(MyGateway);
  });
});

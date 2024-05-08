import { Module } from "@nestjs/common";
import { MyGateway } from "./gateway";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
    providers : [MyGateway],
    imports: [CacheModule.register()]
})
export class GatewayModule {}
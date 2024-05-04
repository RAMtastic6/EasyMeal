import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [GatewayModule,
    // questo serve per definire la connessione al db
    // siccome questa connessione la vogliamo fare a livello di tutto il servizio
    // la si mette nel file app.module.ts
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'easy-meal',
      autoLoadEntities: true,
      synchronize: true, //FIXME: NEVER USE THIS IN PRODUCTION (https://docs.nestjs.com/techniques/database#typeorm-transactions)
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

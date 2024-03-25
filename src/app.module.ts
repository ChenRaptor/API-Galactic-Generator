import { Module } from '@nestjs/common';
import { AppController } from './controllers/TestController/app.controller';
import { AppService } from './services/app.service';
import { GalaxyController } from './controllers/GalaxyController/galaxy.controller';
import { GalaxyService } from './services/GalaxyService/galaxy.service';
import { SystemService } from './services/SystemService/system.service';
import { SystemController } from './controllers/SystemController/system.controller';

@Module({
  imports: [],
  controllers: [AppController, GalaxyController, SystemController],
  providers: [AppService, GalaxyService, SystemService],
})
export class AppModule {}

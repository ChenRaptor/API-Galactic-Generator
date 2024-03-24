import { Module } from '@nestjs/common';
import { AppController } from './controllers/TestController/app.controller';
import { AppService } from './services/app.service';
import { GalaxyController } from './controllers/GalaxyController/galaxy.controller';
import { GalaxyService } from './services/GalaxyService/galaxy.service';

@Module({
  imports: [],
  controllers: [AppController, GalaxyController],
  providers: [AppService, GalaxyService],
})
export class AppModule {}

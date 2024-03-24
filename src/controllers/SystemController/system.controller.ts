import { Controller, Get } from '@nestjs/common';
import { SystemService } from 'src/services/SystemService/system.service';

@Controller('system')
export class SystemController {
  constructor(private readonly appService: SystemService) {}

  @Get()
  getSystem(): string {
    return this.appService.getHello();
  }
}

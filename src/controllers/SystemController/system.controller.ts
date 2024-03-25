import { Controller, Get, Req } from '@nestjs/common';
import { SystemService } from 'src/services/SystemService/system.service';
import { Request } from 'express';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get()
  getSystem(@Req() request: Request): object {
    return this.systemService.getSystem(request.query.seed as string);
  }
}

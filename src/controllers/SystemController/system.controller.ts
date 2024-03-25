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

  @Get('/test')
  getSystema(): number {
    const sigma = 5.67e-8;

    // const luminosity = 3.839e26;
    // const radius = 696340000;

    const luminosity = 9.451046970734699e32;
    const radius = 20355451102;

    return (luminosity / (4 * Math.PI * sigma * Math.pow(radius, 2))) ** 0.25;
  }
}

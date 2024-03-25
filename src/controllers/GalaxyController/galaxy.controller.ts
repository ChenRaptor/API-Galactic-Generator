import { Controller, Get, Req } from '@nestjs/common';
import { createNoise2D } from 'simplex-noise';
import { Request } from 'express';
import { GalaxyService } from 'src/services/GalaxyService/galaxy.service';

@Controller('galaxy')
export class GalaxyController {
  constructor(private readonly galaxyService: GalaxyService) {}

  @Get()
  getGalaxy(@Req() request: Request): any {
    const noise2D = createNoise2D(() => 5588);
    const value2d = noise2D(Number(request.query.x), Number(request.query.y));
    return Math.trunc((value2d + 1) * 50);
  }

  @Get('/test-simplex-noise')
  getTestSimplexNoise(): any {
    const arrayNoise = [];

    for (let i = 0; i < 100; i++) {
      const arrayNoise2 = [];
      for (let j = 0; j < 100; j++) {
        const noise2D = createNoise2D(() => 5588);
        const value2d = noise2D(i / 100, j / 100);
        console.log(Math.trunc((value2d + 1) * 50));
        arrayNoise2.push(Math.trunc((value2d + 1) * 50));
      }
      arrayNoise.push(arrayNoise2);
    }
    return arrayNoise;
  }

  @Get('/generate')
  getGenerateGalaxy(@Req() request: Request): any {
    return this.galaxyService.generateGalaxy(
      Number(request.query.xmax),
      Number(request.query.ymax),
      {
        scale: 5,
        spiralDensity: 1,
        seed: '1',
        branch: 3,
      },
    );
  }
}

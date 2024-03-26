import { Injectable } from '@nestjs/common';
import { System } from 'src/class/System';

@Injectable()
export class SystemService {
  getSystem(seed: string): System {
    return System.generateWithSeed(seed, { x: 0, y: 0, z: 0, side: 0 });
  }
}

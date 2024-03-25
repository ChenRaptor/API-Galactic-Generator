import { Injectable } from '@nestjs/common';
import { Star } from 'src/class/Star';

@Injectable()
export class SystemService {
  getSystem(seed: string): object {
    return Star.generate(seed);
  }
}

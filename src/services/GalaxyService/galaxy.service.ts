import { Injectable } from '@nestjs/common';
import alea from 'alea';
import { createNoise2D, NoiseFunction2D } from 'simplex-noise';
import { GenerationOptions } from './galaxy.types';
import Point from 'src/class/Point';

@Injectable()
export class GalaxyService {
  FEATURE_OCTAVE_RANDOM_NOISE = true;
  FEATURE_OCTAVE_SPIRAL_PATTERN = true;
  FEATURE_OCTAVE_CIRCULAR_PATTERN = true;

  generateGalaxy(xmax: number, ymax: number, params: GenerationOptions): any {
    const t0 = performance.now();
    let systemCount = 0;

    // Initialisation de la seed pour le bruit de Perlin
    const noise2D = createNoise2D(alea(params.seed));

    const arrayNoise: number[][] = [];

    for (let i = -xmax; i < xmax; i++) {
      const arrayNoise2: number[] = [];
      for (let j = -ymax; j < ymax; j++) {
        // Ajoute la densité de la galaxie à l'array
        let density = Math.trunc(
          this.getValue2d(i, j, xmax, ymax, params, noise2D) * 50,
        );
        if (density > 8) {
          systemCount++;
          density = 100;
        } else density = 0;
        arrayNoise2.push(density);
      }
      arrayNoise.push(arrayNoise2);
    }
    const t1 = performance.now();
    console.log(`This galaxy is generated in ${t1 - t0} milliseconds.`);
    console.log(`This galaxy has ${systemCount} systems.`);
    return arrayNoise;
  }

  private getValue2d(
    x: number,
    y: number,
    xmax: number,
    ymax: number,
    params: any,
    noise2D: NoiseFunction2D,
  ) {
    const octaves = {
      noise: 0,
      spiral: 0,
      circle: 1,
    };

    // Octave de bruit de Perlin
    if (this.FEATURE_OCTAVE_RANDOM_NOISE) {
      octaves.noise = noise2D(x / 8, y / 8) * 0.5 + 0.5;
    }

    // Octave de spirale logarithmique
    if (this.FEATURE_OCTAVE_SPIRAL_PATTERN) {
      octaves.spiral = this.logarithmicSpiralDensity(
        Point.fromCartesian(
          (x / xmax) * params.scale,
          (y / ymax) * params.scale,
        ),
        params.spiralDensity,
        params.branch,
      );
    }

    // Octave inversement proportionnelle à la distance
    if (this.FEATURE_OCTAVE_CIRCULAR_PATTERN) {
      octaves.circle = this.inverseDistance(x, y);
    }

    // Combine les trois octaves avec des pondérations
    return (
      ((octaves.noise * octaves.spiral * 3 + octaves.spiral) /
        (this.FEATURE_OCTAVE_RANDOM_NOISE && this.FEATURE_OCTAVE_SPIRAL_PATTERN
          ? 4
          : 3)) *
      octaves.circle
    );
  }

  private logarithmicSpiralDensity(
    point: Point,
    spiralDensity: number = 0.5,
    branch: number,
  ) {
    const a = 0.08;
    const k = 0.01;
    const polarPoint = point.toPolar();
    let minDistance = Number.POSITIVE_INFINITY;
    let density = 0;

    const thetaGapBranch = (Math.PI * 2) / branch;

    for (let i = 0; i < 16; i++) {
      const thetaOffset = Math.PI * 2 * i;
      for (let numBranch = 0; numBranch < branch; numBranch++) {
        const r =
          k *
          Math.exp(
            a * (polarPoint.theta + thetaOffset + thetaGapBranch * numBranch),
          );
        const spiralPoint = Point.fromPolar(r, polarPoint.theta);
        const distance = point.distanceTo(spiralPoint);
        if (distance < minDistance) {
          minDistance = distance;
          if (density < (2 - minDistance) * spiralDensity) {
            density = (2 - minDistance) * spiralDensity;
          }
          if (polarPoint.r <= k) {
            density = 0;
          }
        }
      }
    }
    return density;
  }

  // Fonction pour calculer la densité inversement proportionnelle à la distance
  private inverseDistance(x: number, y: number) {
    const distanceToCenter = Math.hypot(x, y);
    return 1 / Math.max(1, distanceToCenter ** 0.52);
  }
}

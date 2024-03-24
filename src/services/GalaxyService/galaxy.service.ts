import { Injectable } from '@nestjs/common';
import alea from 'alea';
import { createNoise2D } from 'simplex-noise';

class Point {
  constructor(
    public x: number,
    public y: number,
  ) {
    this.x = x;
    this.y = y;
  }

  // Crée un point à partir de coordonnées cartésiennes
  static fromCartesian(x: number, y: number): Point {
    return new Point(x, y);
  }

  // Crée un point à partir de coordonnées polaires
  static fromPolar(radius: number, angle: number): Point {
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    return new Point(x, y);
  }

  toPolar() {
    const r = Math.sqrt(this.x ** 2 + this.y ** 2);
    const theta = Math.atan2(this.y, this.x);
    return { r, theta };
  }

  distanceTo(point: Point) {
    return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
  }
}

@Injectable()
export class GalaxyService {
  generateGalaxy(xmax: number, ymax: number): any {
    const options = {
      features: {
        noise: true,
        spiral: true,
        circle: true,
      },
      params: {
        scale: 4,
        spiralDensity: 1,
      },
    };
    const prng = alea('seed');
    const noise2D = createNoise2D(prng);

    const arrayNoise = [];
    for (let i = -Number(xmax); i < Number(xmax); i++) {
      const arrayNoise2 = [];
      for (let j = -Number(ymax); j < Number(ymax); j++) {
        // Octave Simplex Noise
        const octaves = {
          noise: 0,
          spiral: 0,
          circle: 1,
        };

        // Octave de bruit de Perlin
        if (options.features.noise) {
          octaves.noise = noise2D(i / 8, j / 8) * 0.5 + 0.5;
        }

        // Octave de spirale logarithmique
        if (options.features.spiral) {
          octaves.spiral = this.logarithmicSpiralDensity(
            Point.fromCartesian(
              (i / Number(xmax)) * options.params.scale,
              (j / Number(ymax)) * options.params.scale,
            ),
            options.params.spiralDensity,
          );
        }

        // Octave inversement proportionnelle à la distance
        if (options.features.circle) {
          octaves.circle = this.inverseDistance(i, j);
        }

        // Combine les trois octaves avec des pondérations
        const galaxyDensity =
          ((octaves.noise * octaves.spiral + octaves.spiral) /
            (options.features.noise && options.features.spiral ? 2 : 1)) *
          octaves.circle;

        // Ajoute la densité de la galaxie à l'array
        arrayNoise2.push(Math.trunc(galaxyDensity * 50));
      }
      arrayNoise.push(arrayNoise2);
    }
    return arrayNoise;
  }

  private logarithmicSpiralDensity(point: Point, spiralDensity: number = 0.5) {
    const a = 0.1;
    const k = 0.01;
    const polarPoint = point.toPolar();
    let minDistance = Number.POSITIVE_INFINITY;
    let density = 0;

    for (let i = 0; i < 16; i++) {
      const thetaOffset = Math.PI * 2 * i;
      const r = k * Math.exp(a * (polarPoint.theta + thetaOffset));
      const spiralPoint = Point.fromPolar(r, polarPoint.theta);
      const distance = point.distanceTo(spiralPoint);
      if (distance < minDistance) {
        minDistance = distance;
        density = (1 - minDistance) * spiralDensity;

        if (polarPoint.r <= k) {
          density = 0;
        }
      }
    }
    return density;
  }

  // Fonction pour calculer la densité inversement proportionnelle à la distance
  private inverseDistance(x: number, y: number) {
    const distanceToCenter = Math.sqrt(x ** 2 + y ** 2);
    return 1 / Math.max(1, distanceToCenter / 16);
  }
}

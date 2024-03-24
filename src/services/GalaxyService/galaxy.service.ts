import { Injectable } from '@nestjs/common';
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
    const galacticCenterX = 0;
    const galacticCenterY = 0;
    const noise2D = createNoise2D(() => 5588);

    const arrayNoise = [];
    for (let i = -Number(xmax); i < Number(xmax); i++) {
      const arrayNoise2 = [];
      for (let j = -Number(ymax); j < Number(ymax); j++) {
        // Octave Simplex Noise
        const octaveValue1 = noise2D(i / Number(xmax), j / Number(ymax));

        // Octave de spirale logarithmique
        const octaveValue2 = this.logarithmicSpiralDensity(
          Point.fromCartesian(i / Number(xmax), j / Number(ymax)),
        );

        // Octave inversement proportionnelle à la distance
        const octaveValue3 = this.inverseDistance(
          i,
          j,
          galacticCenterX,
          galacticCenterY,
        );

        // Combine les trois octaves avec des pondérations
        const galaxyDensity =
          ((octaveValue1 + 1) / 2) * octaveValue3 + octaveValue2;
        arrayNoise2.push(Math.trunc(galaxyDensity * 50));
      }
      arrayNoise.push(arrayNoise2);
    }
    return arrayNoise;
  }

  private logarithmicSpiralDensity(point: Point) {
    const a = 0.1;
    const k = 0.15;
    const polarPoint = point.toPolar();
    let minDistance = Number.POSITIVE_INFINITY;
    let distanceBetweenPoints = Number.POSITIVE_INFINITY;
    let density = 0;

    for (let i = 0; i < 16; i++) {
      const thetaOffset = Math.PI * 2 * i;
      const r = k * Math.exp(a * (polarPoint.theta + thetaOffset));
      const spiralPoint = Point.fromPolar(r, polarPoint.theta);
      const distance = point.distanceTo(spiralPoint);
      if (distance < minDistance) {
        minDistance = distance;
        distanceBetweenPoints = Point.fromPolar(
          k * Math.exp(a * (polarPoint.theta + Math.PI * 2 * (i + 1))),
          polarPoint.theta,
        ).distanceTo(spiralPoint);
        density = minDistance / (distanceBetweenPoints / 2) / 2;
      }
    }
    return density;
  }

  // Fonction pour calculer la densité inversement proportionnelle à la distance
  private inverseDistance(
    x: number,
    y: number,
    centerX: number,
    centerY: number,
  ) {
    const distanceToCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
    return 1 / Math.max(1, distanceToCenter / 2); // Inversement proportionnelle à la distance
  }
}

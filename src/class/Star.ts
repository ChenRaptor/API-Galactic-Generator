import alea from 'alea';
import { createNoise2D } from 'simplex-noise';
import { Percent } from 'src/services/SystemService/system.types';

interface StarProbasInterface {
  O: Percent;
  B: Percent;
  A: Percent;
  F: Percent;
  G: Percent;
  K: Percent;
  M: Percent;
}

const starProbas = {
  O: 0.5,
  B: 0.1,
  A: 0.1,
  F: 0.1,
  G: 0.05,
  K: 0.05,
  M: 0.05,
} as StarProbasInterface;

type StarType = 'O' | 'B' | 'A' | 'F' | 'G' | 'K' | 'M';

interface MassRanges {
  [key: string]: [number, number]; // Définit une interface pour les plages de masse de chaque type d'étoile
}

const massRanges: MassRanges = {
  O: [16, 120],
  B: [8, 16],
  A: [2.1, 8],
  F: [1.4, 2.1],
  G: [1.04, 1.4],
  K: [0.8, 1.04],
  M: [0.08, 0.8],
};

// const COEFICENTS_RADIUS = 0.945;
const MASS_SOL = 1.989 * 10 ** 30;
const RADIUS_SOL = 6.963 * 10 ** 8;
const CONSTANT_STEFAN_BOLTZMANN = 5.67 * 10 ** -8;
const COEFFICIENT_MASS_LUMINOSITY = 5180;

export class Star {
  constructor(
    public name: string,
    public type: StarType,
    public mass: number,
    public radius: number,
    public temperature: number,
    public luminosity: number,
  ) {
    this.name = name;
    this.type = type;
    this.mass = mass;
    this.radius = radius;
    this.temperature = temperature;
    this.luminosity = luminosity;
  }

  private static calculateType(prob: number): StarType {
    let cumulativeProb = 0;

    for (const [type, proba] of Object.entries(starProbas)) {
      if (prob >= cumulativeProb && prob < cumulativeProb + proba) {
        return type as StarType;
      }
      cumulativeProb += proba;
    }

    return 'O';
  }

  private static calculateStarMass(
    starType: StarType,
    value: number,
  ): number | null {
    const range = massRanges[starType]; // Récupère la plage de masse associée au type d'étoile

    const [minMass, maxMass] = range; // Destructure la plage de masse en [minMass, maxMass]
    const mass = minMass + (maxMass - minMass) * value;

    return mass * MASS_SOL;
  }

  private static calculateRadius(mass: number): number {
    if (mass > MASS_SOL) {
      return (mass / MASS_SOL) ** 0.8 * RADIUS_SOL;
    } else {
      return (mass / MASS_SOL) ** 0.57 * RADIUS_SOL;
    }
  }

  private static calculateLuminosity(mass: number): number {
    return mass / COEFFICIENT_MASS_LUMINOSITY;
  }

  private static calculateTemperature(
    luminosity: number,
    radius: number,
  ): number {
    return Math.pow(
      luminosity /
        (4 * Math.PI * Math.pow(radius, 2) * CONSTANT_STEFAN_BOLTZMANN),
      0.25,
    );
  }

  static generate = (seed: string): Star => {
    const noise2D = createNoise2D(alea(Math.random()));
    const value1 = noise2D(200, 200) * 0.5 + 0.5;
    const value2 = noise2D(400, 400) * 0.5 + 0.5;
    const type = Star.calculateType(value1);
    const mass = Star.calculateStarMass(type, value2);
    const radius = Star.calculateRadius(mass);
    const luminosity = Star.calculateLuminosity(mass);
    const temperature = Star.calculateTemperature(luminosity, radius);

    return new Star(seed, type, mass, radius, temperature, luminosity);
  };
}

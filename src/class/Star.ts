import { PRNG } from 'seedrandom';

// Définition des constantes
const MASS_SOL = 1.989e30;
const RADIUS_SOL = 6.963e8;
const LUMINOSITY_SOL = 3.839e26;
const CONSTANT_STEFAN_BOLTZMANN = 5.67e-8;

// Définition des probabilités des types d'étoiles
const starProbas = {
  O: 0.00003,
  B: 0.0013,
  A: 0.006,
  F: 0.03,
  G: 0.076,
  K: 0.121,
  M: 0.7645,
};

// Définition des plages de masse pour chaque type d'étoile
const massRanges: Record<StarType, [number, number]> = {
  O: [16, 120],
  B: [8, 16],
  A: [2.1, 8],
  F: [1.4, 2.1],
  G: [1.04, 1.4],
  K: [0.8, 1.04],
  M: [0.08, 0.8],
};

type StarType = keyof typeof starProbas;

class Star {
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
    this.mass = Number(mass.toPrecision(3));
    this.radius = Math.trunc(radius);
    this.temperature = Math.trunc(temperature);
    this.luminosity = Number(luminosity.toPrecision(3));
  }

  private static calculateType(prob: number): StarType {
    let cumulativeProb = 0;

    for (const type in starProbas) {
      if (prob >= cumulativeProb && prob < cumulativeProb + starProbas[type]) {
        return type as StarType;
      }
      cumulativeProb += starProbas[type];
    }

    return 'O';
  }

  private static calculateStarMass(starType: StarType, value: number): number | null {
    const [minMass, maxMass] = massRanges[starType];
    const mass = minMass + (maxMass - minMass) * value;
    return mass * MASS_SOL;
  }

  private static calculateRadius(mass: number): number {
    return mass > MASS_SOL ? Math.pow(mass / MASS_SOL, 0.8) * RADIUS_SOL : Math.pow(mass / MASS_SOL, 0.57) * RADIUS_SOL;
  }

  private static calculateLuminosity(mass: number): number {
    return Math.pow(mass / MASS_SOL, 3.5) * LUMINOSITY_SOL;
  }

  private static calculateTemperature(luminosity: number, radius: number): number {
    return Math.pow(luminosity / (4 * Math.PI * Math.pow(radius, 2) * CONSTANT_STEFAN_BOLTZMANN), 0.25);
  }

  static generateWithSeed(rng: PRNG): Star {
    const type = Star.calculateType(rng());
    const mass = Star.calculateStarMass(type, rng());
    const radius = Star.calculateRadius(mass);
    const luminosity = Star.calculateLuminosity(mass);
    const temperature = Star.calculateTemperature(luminosity, radius);

    return new Star('star_name', type, mass, radius, temperature, luminosity);
  }
}

export { Star, StarType };

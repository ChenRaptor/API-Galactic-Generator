import { Planet } from './Planet';
import { Star } from './Star';
import { alea, PRNG } from 'seedrandom';

interface SystemOptions {
  x: number;
  y: number;
  z: number;
  side: number;
}

class System {
  constructor(
    public name: string,
    public stars: Star[],
    public planets: Planet[] = [],
    public position: SystemOptions,
  ) {
    this.name = name;
    this.stars = stars;
    this.planets = planets;
    this.position = position;
  }

  // Fonction pour générer un nombre aléatoire de planètes
  private static generateRandomNumberOfPlanets(rng: number) {
    if (rng < 0.05) {
      return 1;
    } else if (rng < 0.2) {
      return 2;
    } else if (rng < 0.35) {
      return 3;
    } else if (rng < 0.45) {
      return 4;
    } else {
      return 5;
    }
  }

  // Fonction pour générer un nombre aléatoire de d'étoiles
  private static generateRandomNumberOfStars(rng: number) {
    if (rng < 0.95) {
      return 1;
    } else if (rng < 0.99) {
      return 2;
    } else {
      return 3;
    }
  }

  // Fonction pour générer un nom de système stellaire
  private static generateStarSystemName(rng: PRNG) {
    const prefixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega'];
    const suffixes = ['Majoris', 'Minoris', 'Centauri', 'Cygni', 'Pegasi', 'Orionis', 'Lyrae', 'Aquarii', 'Ursae', 'Australis', 'Borealis', 'Crucis', 'Delphini', 'Eridani', 'Gemini', 'Herculis', 'Indi', 'Juno', 'Koronis', 'Lyncis', 'Monocerotis', 'Normae', 'Octantis', 'Pavonis', 'Quadrantis', 'Regulus', 'Serpentis', 'Tauri', 'Umbrae', 'Vela', 'Wolf'];

    const prefix = prefixes[Math.floor(rng() * prefixes.length)];
    const suffix = suffixes[Math.floor(rng() * suffixes.length)];

    return `${prefix} ${suffix}`;
  }

  static generateWithSeed(seed: string, options: SystemOptions): System {
    const rng = alea(seed);
    const stars = [];
    const planets = [];

    const numStars = System.generateRandomNumberOfStars(rng());
    for (let i = 0; i < numStars; i++) {
      stars.push(Star.generateWithSeed(rng));
    }

    const numPlanets = System.generateRandomNumberOfPlanets(rng());
    for (let i = 0; i < numPlanets; i++) {
      planets.push(Planet.generateWithSeed());
    }

    const systemName = System.generateStarSystemName(rng);

    return new System(systemName, stars, planets, options);
  }
}

export { System };

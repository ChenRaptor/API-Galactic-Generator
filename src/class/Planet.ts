class Planet {
  constructor(public name: string) {}

  static generateWithSeed(): Planet {
    return new Planet('planet_name');
  }
}

export { Planet };

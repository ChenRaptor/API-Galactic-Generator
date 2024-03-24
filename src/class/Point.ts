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

export default Point;

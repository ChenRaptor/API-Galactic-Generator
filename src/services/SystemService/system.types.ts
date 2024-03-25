export interface PercentBrand {
  readonly Percent: unique symbol;
}

/**
 * A number between [0, 1]
 */
export type Percent = number & PercentBrand;

function isPercent(n: number): n is Percent {
  return Number.isInteger(n) && n >= 0 && n <= 1;
}

export function Percent(n: number): Percent {
  if (isPercent(n)) {
    return n;
  } else {
    throw new Error(`${n} is not a number between 0 and 1`);
  }
}

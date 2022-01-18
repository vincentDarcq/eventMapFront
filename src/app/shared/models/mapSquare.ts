export class mapSquare {
  latMin: number;
  latMax: number;
  longMin: number;
  longMax: number;

  constructor(
    latMin: number,
    latMax: number,
    longMin: number,
    longMax: number,
  ) {
    this.latMin = latMin;
    this.latMax = latMax;
    this.longMin = longMin;
    this.longMax = longMax;
  }

}
export default class Interaction {

  constructor() {
    this.angleRangeZ = 0.5;
  }


  getAngleRangeZ( angleZ ) {

    const range = map( angleZ, -0.6, 0.6, 0, 1 );
    const clampedRange = clamp( range, 0, 1 );

    this.angleRangeZ = this.angleRangeZ + ( ( clampedRange - this.angleRangeZ ) / 50 );
    return this.angleRangeZ;

  }

}

function map(value, x1, y1, x2, y2) {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

function clamp( value, minVal, maxVal ) {
 return Math.min( Math.max( value, minVal ), maxVal );
}

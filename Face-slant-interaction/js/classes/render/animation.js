export function AnimateCamera( camera, value ) {

  camera.position.set( 0, map( value, 0, 1, 4, 1 ), .5 );
  camera.lookAt( map( value, 0, 1, -9, 6 ), map( value, 0, 1, 0, 1 ), map( value, 0, 1, -5, 0 ) )

}

function map(value, x1, y1, x2, y2) {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

function clamp( value, minVal, maxVal ) {
 return Math.min( Math.max( value, minVal ), maxVal );
}

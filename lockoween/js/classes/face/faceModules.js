import { Vector3 } from 'https://unpkg.com/three@0.121.1/build/three.module.js';

class ReferencePoints {

  constructor( landmarks, videoSize ) {

    this.earL = arrayToVect3( landmarks[ 356 ] );
    this.earR = arrayToVect3( landmarks[ 127 ] );
    this.earVect = this.earL.clone().sub( this.earR );

    this.origin = arrayToVect3( landmarks[ 0 ] );
    this.offset = this.getOffset( this.origin, videoSize );

  }

  getOffset( origin, scale ) {
    const { w, h } = scale;
    const originFromCenter = new Vector3(
      origin.x - ( w / 2 ),
      origin.y - ( h / 2 ),
      0,
    );
    return new Vector3(
      ( originFromCenter.x * 2 ) / w,
      ( originFromCenter.y * 2 ) / h,
      0,
    );
  }

}

class Orientation {

  constructor( normalisedLandmarks ) {

    this.origin = normalisedLandmarks[0].clone();
    this.axes = this.getAxes( normalisedLandmarks, this.origin );
    this.rotation = this.getRotation( this.axes );

  }

  getAxes( landmarks, origin ) {

    const earR = landmarks[ 127 ].clone();
    const earL = landmarks[ 356 ].clone();
    const lip = landmarks[ 0 ].clone();
    const nose = landmarks[ 6 ].clone();

    const up = nose.clone().sub(lip);
    const left = earL.clone().sub(earR);
    const midEar = earR.add( left.clone().divideScalar(2) );
    const forward = nose.sub( midEar );

    return { up: up, left: left, forward: forward };

  }

  getRotation( axes ) {

    const forwardYZ = new Vector3( 0, axes.forward.y, axes.forward.z ).normalize();
    const forwardXZ = new Vector3( axes.forward.x, 0, axes.forward.z ).normalize();
    const upXY = new Vector3( axes.up.x, axes.up.y, 0 ).normalize();

    return new Vector3(
      - Math.asin( forwardYZ.y ),
      - Math.asin( forwardXZ.x ),
      - Math.asin( upXY.x ),
    );

  }

}

class Actions {

  constructor( landmarks ) {
    this.mouth = this.getMouthMetrics( landmarks );
    this.eyes = this.getEyesMetrics( landmarks );
  }

  getMouthMetrics(landmarks) {

    let open = landmarks[13].distanceTo(landmarks[14]);
    open = map( open, 4, 60, 0, 1 );
    open = clamp( open, 0, 1 );

    let width = landmarks[57].distanceTo(landmarks[287]);
    width = map( width, 98, 120, 0, 1 );
    width = clamp( width, 0, 1 );

    return { open: open, width: width };
  }

  getEyesMetrics( landmarks ) {

    let browL = landmarks[ 282 ].distanceTo( landmarks[ 257 ] );
    browL = map( browL, 26, 16, 1, 0 );
    browL = clamp( browL, 0 ), 1 );

    var browR = landmarks[ 52 ].distanceTo( landmarks[ 27 ] );
    browR = map( browR, 26, 16, 1, 0 );
    browR = clamp( browR, 0 ), 1 );

    return {
      leftBrow: browL,
      rightBrow: browR,
    }

  }

}

function WorldPosition( offset, size, videoSize ) {

  function getDistance( facePixel, faceWorld, videoSize, fov ) {

    const scaleInFrame = facePixel / videoSize.w;
    const sizeAtDistance = faceWorld / scaleInFrame;
    return ( sizeAtDistance / Math.cos( fov / 2 ) ) * 0.5;

  }

  function getWorldPoint( offset, z, size, fov ) {

    const widthAtDistance = ( Math.sin( fov / 2 ) * z );
    const offsetPercent = offset / size;
    return offsetPercent * widthAtDistance * 2;

  }

  const { w, h } = videoSize;
  const faceAverageSize = 0.2; // meters
  const fov = 1.4;

  const z = this.getDistance( size, faceAverageSize, videoSize );
  const x = this.getWorldPoint( offset.x, z, w, fov );
  const y = this.getWorldPoint( offset.y, z, h, fov );

  return new Vector3( x, y, z );

}

function NormalisedLandmarks( landmarks, scalingFactor ) {

  const center = [0, 0, 0];
  const origin = landmarks[0];
  const offset = [ center[0] - origin[0], center[1] - origin[1], 0 ]//center[2] - origin[2] ];

  let normalisedLandmarks = [];
  for( let i = 0; i < landmarks.length; i ++ ) {

    normalisedLandmarks[ i ] = new Vector3(
      ( landmarks[ i ][ 0 ] + offset[ 0 ] ) * scalingFactor,
      ( landmarks[ i ][ 1 ] + offset[ 1 ] ) * scalingFactor,
      ( landmarks[ i ][ 2 ] + offset[ 2 ] ) * scalingFactor,
    );

  }

  return normalisedLandmarks;

}

arrayToVect3( a ) {
  return new Vector3( a[0], a[1], a[2] );
}

clamp( value, minVal, maxVal ) {
 return Math.min( Math.max( value, minVal ), maxVal );
}

map(value, x1, y1, x2, y2) {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

exports = { ReferencePoints, Orientation, NormalisedLandmarks, Actions, WorldPosition };

import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import WorldPosition from './face/worldPosition.js'


export default class FaceMetrics {

  constructor( videoSize ) {

    this.videoSize = videoSize;
    this._targetScale = 200;
    this.landmarks = [];

    this.forward = new THREE.Vector3();
    this.left = new THREE.Vector3();
    this.up = new THREE.Vector3();
    this.origin = new THREE.Vector3();

    this.rotation = new THREE.Vector3();

  }

  fromMesh(landmarks) {

    const rightEarVert = this.arrayToVect3( landmarks[ 127 ] );
    const leftEarVert = this.arrayToVect3( landmarks[ 356 ] );

    const referenceVector = leftEarVert.clone().sub( rightEarVert ); // distance between ears
    const scalingFactor = this._targetScale / referenceVector.length();

    const normalisedLandmarks = this.getNormalisedLandmarks( landmarks, scalingFactor );
    const vects = this.getDirections( normalisedLandmarks );
    const rotation = this.getRotation( vects );

    const mouthMetrics = this.getMouthMetrics(normalisedLandmarks);
    const eyesMetrics = this.getEyesMetrics(normalisedLandmarks);

    const worldPos = new WorldPosition( landmarks[0], referenceVector.length(), this.videoSize );
    const worldPosition = worldPos.position;
    const offset = worldPos.offset;

    return {
      vectors: vects,
      rotation: rotation,
      landmarks: normalisedLandmarks,
      mouth: mouthMetrics,
      eyes: eyesMetrics,
      worldPosition: worldPosition,
      offset: offset,
    }

  }

  // screenPos( point, w, h ) {
  //
  //   const offsetX = this.videoSize.w / 2;
  //   const offsetY = this.videoSize.h / 2;
  //
  //   return new THREE.Vector3( point[ 0 ] - offsetX, point[ 1 ] - offsetY, point[ 2 ] );
  //
  // }

  getEyesMetrics( landmarks ) {
    var leftBrow = landmarks[282].distanceTo(landmarks[257])
    leftBrow = this.map( leftBrow, 26, 16, 1, 0 );
    leftBrow = Math.min(Math.max(leftBrow,0),1)

    var rightBrow = landmarks[52].distanceTo(landmarks[27])
    rightBrow = this.map( rightBrow, 26, 16, 1, 0 );
    rightBrow = Math.min(Math.max(leftBrow,0),1)

    return {
      leftBrow: leftBrow,
      rightBrow: rightBrow,
    }
  }

  getMouthMetrics(landmarks) {
    var open = landmarks[13].distanceTo(landmarks[14])
    var width = landmarks[57].distanceTo(landmarks[287])
    open = this.map( open, 4, 60, 0, 1 );
    width = this.map( width, 98, 120, 0, 1 );
    open = Math.min(Math.max(open,0),1)
    width = Math.min(Math.max(width,0),1)
    return { open: open, width: width }
  }

  getDirections( landmarks ) {

    var vects = {
      origin: null,
      up: null,
      left: null,
      forward: null,
    }

    vects.origin = landmarks[ 0 ].clone();

    var rightEarPos = landmarks[ 127 ].clone();
    var leftEarPos = landmarks[ 356 ].clone();
    var upperLipPos = landmarks[ 0 ].clone();
    var nosePos = landmarks[ 6 ].clone();

    // rotation reference axes
    vects.left = leftEarPos.clone().sub( rightEarPos );
    vects.up = nosePos.clone().sub( upperLipPos );

    var middleNose = rightEarPos.add( vects.left.clone().divideScalar( 2 ) );
    vects.forward = nosePos.sub( middleNose );

    return vects;

  }

  getRotation( vects ) {

    var forwardYZ = new THREE.Vector3( 0, vects.forward.y, vects.forward.z ).normalize();
    var forwardXZ = new THREE.Vector3( vects.forward.x, 0, vects.forward.z ).normalize();
    var upXY = new THREE.Vector3( vects.up.x, vects.up.y, 0 ).normalize();

    var x = - Math.asin( forwardYZ.y );
    var y = - Math.asin( forwardXZ.x );
    var z = - Math.asin( upXY.x );

    return new THREE.Vector3( x, y, z );
  }

  getNormalisedLandmarks( landmarks, scalingFactor ) {

    var center = [0, 0, 0];
    var origin = landmarks[0];
    var offset = [ center[0] - origin[0], center[1] - origin[1], 0 ]//center[2] - origin[2] ];

    var outputLandmarks = [];

    for(var i = 0; i < landmarks.length; i ++ ) {

      var v = new THREE.Vector3(0, 0, 0);

      v.x = ( landmarks[ i ][ 0 ] + offset[ 0 ] ) * scalingFactor;
      v.y = ( landmarks[ i ][ 1 ] + offset[ 1 ] ) * scalingFactor;
      v.z = ( landmarks[ i ][ 2 ] + offset[ 2 ] ) * scalingFactor;

      outputLandmarks[ i ] = v;

    }

    return outputLandmarks;
  }

  arrayToVect3( a ) {
    return new THREE.Vector3( a[0], a[1], a[2] );
  }

  map(value, x1, y1, x2, y2) {
    return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
  }

}

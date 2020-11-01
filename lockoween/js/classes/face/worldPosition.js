import { Vector3 } from 'https://unpkg.com/three@0.121.1/build/three.module.js';

export default class WorldPosition {

  constructor( landmark, size, videoSize ) {

    this.videoSize = videoSize;
    this.fov = 1.4;

    const averageFaceSize = 0.2;

    let point = new Vector3( landmark[0], landmark[1], landmark[2] );
    point.x = ( point.x - ( videoSize.w / 2 ) );
    point.y = ( point.y - ( videoSize.h / 2 ) );

    this.offset = new Vector3( ( point.x / videoSize.w ) * 2, ( point.y / videoSize.h ) * 2, 0 );
    this.position = this.getWorldPosition( point, size, this.videoSize, averageFaceSize );

  }

  getWorldPosition( point, faceSize, videoSize, averageFaceSize ) {
    const z = this.estimateDistance( faceSize, averageFaceSize );
    const x = this.getWorldPoint( point.x, z, videoSize.w );
    const y = -this.getWorldPoint( point.y, z, videoSize.h );

    return new Vector3(x,y,z);
  }

  getWorldPoint( offset, z, size ) {

    const widthAtDistance = ( Math.sin( this.fov / 2 ) * z );
    const offsetPercent = offset / size;

    const distance = offsetPercent * widthAtDistance * 2;
    return distance;

  }

  estimateDistance( pixelFaceSize, worldFaceSize ) {

    const sizeInFramePercent = pixelFaceSize / this.videoSize.w;
    const sizeAtDistance = worldFaceSize / sizeInFramePercent;

    const distance = ( sizeAtDistance / Math.cos( this.fov / 2 ) )*0.5;
    return distance;

  }

}

function map(value, x1, y1, x2, y2) {
  return (value - x1) * (y2 - x2) / (y1 - x1) + x2;
}

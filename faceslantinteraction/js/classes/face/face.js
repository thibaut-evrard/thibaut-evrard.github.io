import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { ReferencePoints, Orientation, NormalisedLandmarks, Actions, WorldPosition } from './faceModules.js'
// import WorldPosition from './worldPosition.js'
export default class Face {

  constructor( videoSize, landmarks ) {

    const targetScale = 200;

    this.points = new ReferencePoints( landmarks, videoSize );
    this.scalingFactor = targetScale / this.points.earVect.length();
    this.normalisedLandmarks = NormalisedLandmarks( landmarks, this.scalingFactor );
    this.orientation = new Orientation( this.normalisedLandmarks );
    this.actions = new Actions( this.normalisedLandmarks );
    this.worldPosition = WorldPosition( this.points.offset, this.points.earVect.length(), videoSize );

  }

}

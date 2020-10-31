import FaceMetrics from './faceMetrics.js'

export default class FaceModelManager {

  constructor( video ) {

    this.model = null;
    this.video = video;
    this.metrics = null;

  }

  async init( size ) {

    this.metrics = new FaceMetrics( size );
    this.model = await faceLandmarksDetection.load( faceLandmarksDetection.SupportedPackages.mediapipeFacemesh );
    console.log( this.model );
  }

  async getMetrics() {

    const faces = await this.model.estimateFaces( { input: this.video } );

    if( faces.length > 0 ) {

      if( faces[0].faceInViewConfidence < 0.8 )
        return null

      var scaledMesh = faces[0].scaledMesh
      var metrics = this.metrics.fromMesh( scaledMesh );

      return metrics;

    }
    else return null;

  }

}

import Face from './face/face.js'

export default class FaceModelManager {

  constructor( video ) {

    this.model = null;
    this.video = video;
    this.metrics = null;

  }

  async init( size ) {

    this.metrics = new Face( size );
    this.model = await faceLandmarksDetection.load( faceLandmarksDetection.SupportedPackages.mediapipeFacemesh );

  }

  async getMetrics() {

    const faces = await this.model.estimateFaces( { input: this.video } );

    if( faces.length > 0 ) {

      if( faces[0].faceInViewConfidence < 0.8 )
        return null
      else {

        const scaledMesh = faces[0].scaledMesh
        const metrics = this.metrics.fromMesh( scaledMesh );

        return metrics;

      }

    }
    else return null;

  }

}

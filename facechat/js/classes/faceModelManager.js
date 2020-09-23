class FaceModelManager {

  constructor( video ) {

    this.model = null;
    this.video = null;
    this.metrics = null;
    this.video = video;
    this.metrics = new FaceMetrics();

  }

  async init() {

    this.model = await facemesh.load();

  }

  async getMetrics() {

    const faces = await this.model.estimateFaces( this.video, false, true );

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

class FaceModelManager {

  model = null;
  video = null;
  metrics = null;

  constructor( video ) {

    this.video = video;
    this.metrics = new FaceMetrics();

  }

  async init() {

    this.model = await facemesh.load();

  }

  async getMetrics() {

    const faces = await this.model.estimateFaces( this.video, false, true );

    if( faces.length >= 0 ) {

      var scaledMesh = faces[0].scaledMesh
      var metrics = this.metrics.fromMesh( scaledMesh );

      return metrics;

    }
    else return null;

  }

}

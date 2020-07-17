class FaceControls {

  speed = 0.2;

  constructor() {

  }

  update( camera, metrics ) {

    var step = metrics.rotation.clone().sub(camera.rotation);
    step.multiplyScalar( this.speed );

    camera.rotation.x += step.x;
    camera.rotation.y += step.y;
    camera.rotation.z += step.z;

  }

}

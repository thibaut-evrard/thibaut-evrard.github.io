class FaceControls {

  speed = 0.2;

  constructor() {

  }

  update( obj, metrics ) {

    var step = metrics.rotation.clone().sub(obj.rotation);
    step.multiplyScalar( this.speed );

    obj.rotation.x += step.x;
    obj.rotation.y += step.y;
    obj.rotation.z += step.z;

  }

}

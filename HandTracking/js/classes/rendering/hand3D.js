class Hand3D {

  constructor( canvas ) {

    this.dimentions = {

      width: canvas.width,
      height: canvas.height,

    }

    this.scene = new THREE.Scene();
    this.renderer = this.setupRenderer( canvas );
    this.loader = new THREE.GLTFLoader();
    this.setupScene();

    this.handSkinnedMesh = null;
    this.hand = this.loadMesh( 'assets/hand5.glb' );

    this.debugRender = new HandDebugRender( this.scene );

    this.baseCube = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshStandardMaterial() );
    this.scene.add( this.baseCube );

  }

  setupScene() {

    var camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
    camera.position.z = -10;
    camera.position.y = 0;
    camera.rotation.y = 3.14;

    var light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set( 0, 10, -10 );

    this.scene.add( camera );
    this.scene.add( light );

  }

  setupRenderer( canvas ) {

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize( this.dimentions.width, this.dimentions.height );
    document.body.appendChild( renderer.domElement );

    return renderer;

  }

  loadMesh( path ) {

    var that = this;
    var material = new THREE.MeshStandardMaterial( { color: "rgb(255,255,255)", skinning: true } );

    this.loader.load( path, function( obj ) {

      var model = obj.scene;

      model.traverse( function ( child ) {

        if ( child.type == 'SkinnedMesh' ) {

          that.hand = model;
          that.handSkinnedMesh = child;
          console.log( that.hand );

        }

      });

      that.handSkinnedMesh.material = material;
      that.scene.add( that.hand );

      that.handSkinnedMesh.skeleton.bones.forEach((bone, i) => {
        that.bonesReferenceRotations[ i ] = bone.rotation;
      });

    } );


  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

  updateHandPose( model ) {

    var pos = model.position;
    pos.x = (-pos.x / 25) + 12.5;
    pos.y = (-pos.y / 25) + 12.5;
    pos.z = 1;
    // pos.z = 0;
    this.hand.position.set( pos.x, pos.y, pos.z );
    this.hand.scale.set( 2, 2, 2 );
    this.hand.setRotationFromEuler( new THREE.Euler( -model.rotation.x + 3.14, model.rotation.y, model.rotation.z ) );

    var landmarks = model.landmarks;
    // console.log( landmarks[ 8 ].distanceTo(landmarks[ 5 ]) );

    this.baseCube.setRotationFromEuler( model.rotation );
    var baseCube = this.baseCube;
    var localLandmarks = [];

    landmarks.forEach((landmark, i) => {

      localLandmarks[ i ] = baseCube.worldToLocal( landmark.clone() );

    });
    console.log( localLandmarks[12] );
    console.log( landmarks[12].applyEuler( new THREE.Euler().setFromRotationMatrix( new THREE.Matrix4().getInverse( model.matrix ) ) ) );

    this.moveBones( localLandmarks );

    this.handSkinnedMesh.updateMatrixWorld();

  }

  moveBones( localLandmarks ) {

    this.mapBone( localLandmarks[8].y, [8,7,6] );
    this.mapBone( localLandmarks[12].y, [12,11,10] );
    this.mapBone( localLandmarks[16].y, [16,15,14] );
    this.mapBone( localLandmarks[20].y, [20,19,18] );


    // var rot = handModel.rotation;
    // var inverseRot = new THREE.Euler( -rot.x, -rot.y, -rot.z );
    // var rotation = new THREE.Euler( -rot.x, rot.z, rot.y );
    // var inverseRotation = new THREE.Euler( -rotation.x, -rotation.y, -rotation.z );
    // var bones = this.handSkinnedMesh.skeleton.bones;
    // var landmarks = handModel.landmarks;
    //
    // var group = this.debugRender.group;
    // group.setRotationFromEuler( inverseRot );

  }

  mapBone( v, arr ) {
    var val = Math.min( 0, this.map( v, -7, -3, 0, -1.5 ) );
    arr.forEach((item, i) => {
      this.handSkinnedMesh.skeleton.bones[item].rotation.x = val;
    });

  }

  map( value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

}

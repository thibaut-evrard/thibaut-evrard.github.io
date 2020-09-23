class Scene {

  scene = null;
  camera = null;
  avatar = null;
  renderer = null;
  faceControls = new FaceControls();

  constructor( width, height ) {

    // setup the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xfcca03 );

    // setup the camera
    this.camera = new THREE.PerspectiveCamera( 100, width / height, 0.1, 1000 );
    this.camera.position.z = 5;

    // setup the renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( width, height );
    document.body.appendChild( this.renderer.domElement );

    this.skybox = this.skybox();
    this.scene.add(this.skybox);
    // setup the lights
    this.setupLights();

  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

  skybox() {

    var geometry = new THREE.CubeGeometry( 2, 2, 2 );

    var cubeMaterials = [
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/skybox/posx.jpg' ), side: THREE.DoubleSide }), //front side
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/skybox/negx.jpg' ), side: THREE.DoubleSide }), //back side
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/skybox/posy.jpg' ), side: THREE.DoubleSide }), //up side
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/skybox/negy.jpg' ), side: THREE.DoubleSide }), //down side
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/skybox/posz.jpg' ), side: THREE.DoubleSide }), //right side
      new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load( 'assets/skybox/negz.jpg' ), side: THREE.DoubleSide }) //left side
    ];

    var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
    var cube = new THREE.Mesh( geometry, cubeMaterial );

    return cube;

  }

  setupLights() {

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );

    directionalLight.target = new THREE.Object3D();
    directionalLight.target.position.set(1,0,-1);

    var ambientLight = new THREE.AmbientLight(0xfcca03);

    this.scene.add( directionalLight );
    this.scene.add( ambientLight );

  }

  updateCamera( metrics ) {

    this.faceControls.update( this.skybox, metrics );

  }

}

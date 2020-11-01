import { House, Face } from './skull.js'
import { Scene, PCFSoftShadowMap, Color, PerspectiveCamera, PointLight, Vector3, WebGLRenderer, Object3D, DirectionalLight, AmbientLight } from 'https://unpkg.com/three@0.121.1/build/three.module.js';

// import { Scene, Color, PerspectiveCamera, WebGLRenderer, DirectionalLight, Object3D, AmbientLight } from 'http://unpkg.com/browse/three@0.99.0/build/three.module.js';

export default class ThreeScene {

  constructor( width, height ) {

    // setup the scene
    this.scene = new Scene();
    // this.scene.background = new Color( 0x000000 );

    // setup the camera
    this.camera = new PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 0.5;
    this.cameraTarget = new Vector3( 0,0,-0.5 );

    // setup the renderer
    this.renderer = new WebGLRenderer( { alpha: true } );
    this.renderer.setClearColor( 0x000000, 0 ); // the default
    this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    document.body.appendChild( this.renderer.domElement );

    // setup the lights
    this.setupLights();

    this.face = new Face( this.scene );
    this.text = new House( this.scene );

    console.log("scene setup")

  }

  async load() {


    await this.text.load( this.scene );
    const textScale = 0.03;
    this.text.obj.scale.set( textScale, textScale, textScale );
    this.text.obj.position.set( 0,7,-10)


    await this.face.load( this.scene );

    const faceScale = 0.003;
    this.face.obj.position.set( 0, -0.3, this.cameraTarget.z )
    this.face.obj.scale.set( faceScale, faceScale, faceScale );

  }

  update( metrics ) {

    this.cameraTarget.set( metrics.offset.x / 5, -metrics.offset.y / 5, this.cameraTarget.z );

  }

  animate() {

    const camTranslation = this.cameraTarget.clone().sub( this.camera.position.clone() );
    const step = camTranslation.divideScalar( 10 );
    this.camera.position.x += step.x;
    this.camera.position.y += step.y;
    this.camera.lookAt( new Vector3( 0,0, this.face.obj.position.z ));
    this.face.lookAt( this.camera.position );

  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

  setupLights() {

    const light1 = new PointLight( 0x8888ff, 0.8, 50 );
    light1.position.set( 2, -2, 3 );
    light1.castShadow = true;
    light1.shadow.radius = 3;

    light1.shadow.mapSize.width = 2048; // default
    light1.shadow.mapSize.height = 2048; // default
    light1.shadow.camera.near = 0.5; // default
    light1.shadow.camera.far = 500; // default

    const light2 = new PointLight( 0xff8888, 0.8, 50 );
    light2.position.set( -4, -2, 3 );
    light2.castShadow = true;
    light2.shadow.radius = 3;

    light2.shadow.mapSize.width = 2048; // default
    light2.shadow.mapSize.height = 2048; // default
    light2.shadow.camera.near = 0.5; // default
    light2.shadow.camera.far = 500; // default

    var ambientLight = new AmbientLight(0x333333);

    this.scene.add( light1 );
    this.scene.add( light2 );
    this.scene.add( ambientLight );

  }

  updateCamera( metrics ) {

    this.faceControls.update( this.skybox, metrics );

  }

}

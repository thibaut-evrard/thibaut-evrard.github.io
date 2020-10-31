import { House, Face } from './skull.js'
import { Scene, Color, PerspectiveCamera, PointLight, Vector3, WebGLRenderer, Object3D, DirectionalLight, AmbientLight } from 'https://unpkg.com/three@0.121.1/build/three.module.js';

// import { Scene, Color, PerspectiveCamera, WebGLRenderer, DirectionalLight, Object3D, AmbientLight } from 'http://unpkg.com/browse/three@0.99.0/build/three.module.js';

export default class ThreeScene {

  constructor( width, height ) {

    // setup the scene
    this.scene = new Scene();
    this.scene.background = new Color( 0x000000 );

    // setup the camera
    this.camera = new PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 0.5;
    this.cameraTarget = new Vector3( 0,0,3 );

    // setup the renderer
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    // setup the lights
    this.setupLights();

    this.face = new Face( this.scene );
    // this.house = new House( this.scene );

    console.log("scene setup")

  }

  async load() {

    // await this.house.load( this.scene );
    // this.house.obj.position.set( 0,-0.5,-10)


    await this.face.load( this.scene );

    this.face.obj.position.z = -0.2;
    const size = 0.003;
    this.face.obj.scale.set( size,size,size );

  }

  update( metrics ) {
    // this.eye.obj.lookAt( metrics.worldPosition );
    this.cameraTarget.set( metrics.worldPosition.x, metrics.worldPosition.y, 3 );
    // this.eye.obj.lookAt( this.camera.position );
  }

  animate() {

    const camTranslation = this.cameraTarget.clone().sub( this.camera.position.clone() );
    const step = camTranslation.divideScalar( 10 );
    this.camera.position.x += step.x;
    this.camera.position.y += step.y;
    this.camera.lookAt( new Vector3( 0,0,-0.2 ));

  }

  render() {

    this.face.animate( this.camera );
    this.renderer.render( this.scene, this.camera );

  }

  setupLights() {

    // var directionalLight = new DirectionalLight( 0xffffff, 0.2 );
    // const targetObject = new Object3D();
    // targetObject.position.set(3,1,-1);
    // this.scene.add(targetObject);
    //
    // directionalLight.target = targetObject;

    const light = new PointLight( 0xffffff, 0.8, 20 );
    light.position.set( 0.1, -1, 3 );
    this.scene.add( light );

    var ambientLight = new AmbientLight(0x555555);

    this.scene.add( light );
    this.scene.add( ambientLight );

  }

  updateCamera( metrics ) {

    this.faceControls.update( this.skybox, metrics );

  }

}

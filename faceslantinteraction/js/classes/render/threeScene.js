import { Model } from './models.js'
import { Scene, PCFSoftShadowMap, Color, PerspectiveCamera, PointLight, Vector3, WebGLRenderer, Object3D, DirectionalLight, AmbientLight } from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import { AnimateCamera } from './animation.js'
// import { Scene, Color, PerspectiveCamera, WebGLRenderer, DirectionalLight, Object3D, AmbientLight } from 'http://unpkg.com/browse/three@0.99.0/build/three.module.js';

export default class ThreeScene {

  constructor( width, height, isMobile ) {

    this.isMobile =  isMobile;
    this.scene = new Scene();

    this.camera = new PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.set( 0, 4, .5 );
    this.cameraTarget = new Vector3( -9,0,-5 );
    this.camera.lookAt( this.cameraTarget );

    this.renderer = new WebGLRenderer( { alpha: true } );
    this.renderer.setClearColor( 0x000000, 0 ); // the default
    this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );

    if( this.isMobile == false ) {

      this.renderer.shadowMapEnabled = true;
      this.renderer.shadowMap.type = PCFSoftShadowMap;

    }

    document.body.appendChild( this.renderer.domElement );

    this.setupLights();
    this.cardboard = new Model( this.isMobile, 'cardboard' );
    this.castle = new Model( this.isMobile, 'castle' );

  }

  async load() {

    const scale = 0.2;

    await this.cardboard.load( this.scene );
    this.cardboard.obj.scale.set( scale, scale, scale );
    this.cardboard.obj.position.set( -9, 0, -5 );

    await this.castle.load( this.scene );
    this.castle.obj.scale.set( scale, scale, scale );
    this.castle.obj.position.set( 2, -0.4, 0 );
    this.castle.obj.rotation.set(0, 1.3, 0);

  }

  update( rotationScale ) {
    AnimateCamera( this.camera, rotationScale )
  }

  animate() {

  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

  setupLights() {

    const light1 = new PointLight( 0xffffff, 0.8, 50 );
    light1.position.set( 2, -2, 3 );

    const ambientLight = new AmbientLight(0x333333);

    if( this.isMobile == false) {

      const addShadow = function( lightItem ) {
        light1.castShadow = true;
        light1.shadow.radius = 3;
        light1.shadow.mapSize.width = 2048;
        light1.shadow.mapSize.height = 2048;
        light1.shadow.camera.near = 0.5;
        light1.shadow.camera.far = 500;
      }

      addShadow( light1 );

    }

    this.scene.add( ambientLight );
    this.scene.add( light1 );

  }

  updateCamera( metrics ) {

    this.faceControls.update( this.skybox, metrics );

  }

}

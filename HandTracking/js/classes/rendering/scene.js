class Scene {

  constructor( canvas ) {

    this.canvas = canvas;

    // all the scene elements
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.light = null;

    // setup the THREE Scene
    this.setup();

    this.handMesh = new HandMesh( 'assets/hand8.glb' );
    this.loadHandMesh();

  }

  setup() {

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );
    this.renderer.setSize( this.canvas.width, this.canvas.height );
    document.body.appendChild( this.renderer.domElement );

    this.camera = new THREE.PerspectiveCamera( 60, canvas.width / canvas.height, 0.1, 1000 );
    this.camera.position.z = -10;
    this.camera.position.y = 0;
    this.camera.rotation.y = 3.14;
    this.scene.add( this.camera );

    this.light = new THREE.PointLight( 0xffffff, 1, 100 );
    this.light.position.set( 0, 10, -10 );
    this.scene.add( this.light );

  }

  async loadHandMesh() {

    await this.handMesh.load();
    this.scene.add( this.handMesh.mesh.scene );
    this.scene.add( this.handMesh.referenceCube );

  }

  update( model ) {

    this.handMesh.update( model );

  }

  render() {

    this.renderer.render( this.scene, this.camera );

  }

}

import { OBJLoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/MTLLoader.js'
import { Object3D, Mesh, Matrix4, Vector3 } from 'https://unpkg.com/three@0.121.1/build/three.module.js';

class Model {

  constructor( isMobile, name ) {

    this.obj = null
    this.isMobile = isMobile;
    this.name = name;

  }

  async load( scene ) {

    let that = this;

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath( `./assets/${this.name}/` );

    await new Promise( resolve => {

      mtlLoader.load(`${that.name}.mtl`, function( materials ) {
        const objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( `./assets/${that.name}/` );
        objLoader.load(`${that.name}.obj`, function(object) {

          console.log("object loaded")
          that.obj = object;
          scene.add( that.obj );

          return resolve();
        });
      });

    });

  }

}

export { Model }

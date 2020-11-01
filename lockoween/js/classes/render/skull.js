import { OBJLoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/MTLLoader.js'
import { Object3D, Mesh, Matrix4, Vector3 } from 'https://unpkg.com/three@0.121.1/build/three.module.js';

class House {

  constructor( scene ) {

    this.obj = null

  }

  async load( scene ) {

    let that = this;

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('./assets/text/');

    await new Promise( resolve => {

      mtlLoader.load('text.mtl', function( materials ) {
        const objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath('./assets/text/');
        objLoader.load('text.obj', function(object) {

          console.log("object loaded")
          that.obj = object;
          scene.add( that.obj );

          return resolve();
        });
      });

    });

  }

}

class Face {

  constructor( scene ) {

    this.obj = null
    this.eyes = {
      left: null,
      right: null,
    }
    this.eyesTargetPosition = {
      left: new Vector3(0,0,0.5),
      right: new Vector3(0,0,0.5),
    }

  }

  async load( scene ) {

    let that = this;

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('./assets/face/');
    // mtlLoader.setTexturePath('./assets/skull/textures');

    await new Promise( resolve => {
      mtlLoader.load('face.mtl', function(materials) {

        const objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath('./assets/face/');
        objLoader.load('face.obj', function(object) {

          console.log("object loaded")
          that.obj = object;
          scene.add( that.obj );
          return resolve();

        });

      })

    });

    this.obj.traverse( function ( child ) {

    	if ( child instanceof Object3D  ) {

        if( child instanceof Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }

        if( child.name == 'Eye_L' ) {
          that.centerChild( child );
          that.eyes.left = child;
        }

        if( child.name == 'Eye_R' ) {
          that.centerChild( child );
          that.eyes.right = child;
        }

    	}

    });

  }

  centerChild( child ) {
    child.geometry.computeBoundingBox();
    let matrix = new Vector3();
    let offset = child.geometry.boundingBox.getCenter(matrix);
    child.geometry.applyMatrix(new Matrix4().makeTranslation(-offset.x, -offset.y, -offset.z));
    child.position.copy(offset);
  }

  lookAt( position ) {
    this.eyes.left.lookAt( position );
    this.eyes.right.lookAt( position );
  }

  animate( camera ) {
    this.lookAt( camera.position );
  }

}

export { House, Face }

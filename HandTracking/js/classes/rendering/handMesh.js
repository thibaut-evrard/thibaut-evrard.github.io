class HandMesh {

  constructor( pathToMesh ) {

    this.referenceCube = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshStandardMaterial() );
    this.path = pathToMesh;
    this.mesh = {
      scene: null,
      skinned: null,
    }

    this.ready = false;

  }

  async load() {

    this.mesh = await this.loadMesh( this.path );
    this.mesh.scene.scale.set( 3, 3, 3 );
    this.mesh.skinned.geometry.computeVertexNormals();
    this.ready = true;

  }

  async loadMesh( path ) {

    var obj = null;

    await new Promise( resolve => {

      var loader = new THREE.GLTFLoader();
      loader.load( path, function( loadedObj ) {

        obj = loadedObj;
        resolve();

      });

    });

    var resultSkinnedMesh = null;
    var model = obj.scene;

    model.traverse( function ( child ) {

      if ( child.type == 'SkinnedMesh' )
        resultSkinnedMesh = child;

    });

    var material = new THREE.MeshStandardMaterial( { color: 0xfcba03, skinning: true, transparent: true, opacity: 1 } );

    resultSkinnedMesh.material = material;

    return {
      scene: model,
      skinned: resultSkinnedMesh
    }

  }

  update( model ) {

    this.referenceCube.setRotationFromEuler( model.rotation );
    var meshModel = this.getMeshModel( model );
    // console.log( meshModel );

    var mesh = this.mesh.scene;
    mesh.position.set( meshModel.worldPos.x, meshModel.worldPos.y, meshModel.worldPos.z );
    mesh.setRotationFromEuler( meshModel.worldRot );
    mesh.scale.set( meshModel.scale, meshModel.scale, meshModel.scale );

    this.moveBones( meshModel.fingerStretch );

  }

  getMeshModel( model ) {

    var toScreen = { ratio: 32, offset: 13, };

    var worldPos = new THREE.Vector3( ( -model.position.x / toScreen.ratio ) + 10, ( -model.position.y / toScreen.ratio ) + 8 , 2 );
    var worldRot = new THREE.Euler( -model.rotation.x + 3.14, model.rotation.y, model.rotation.z );
    var localLandmarks = this.getLocalLandmarks( this.referenceCube, model.landmarks );
    var palmSize = localLandmarks[ 0 ].distanceTo( localLandmarks[ 9 ] );
    var scale = 3 * ( 1 / model.scalingFactor );

    var l = localLandmarks;
    var fingerStretch = {
      index: this.getStretch( l[ 0 ], l[ 8 ], palmSize, 1.9, 1 ),
      middle: this.getStretch( l[ 0 ], l[ 12 ], palmSize, 1.9, 0.6 ),
      ring: this.getStretch( l[ 0 ], l[ 16 ], palmSize, 1.8, 0.5 ),
      pinky: this.getStretch( l[ 0 ], l[ 20 ], palmSize, 1.6, 0.5 ),
    }

    return {

      worldPos: worldPos,
      worldRot: worldRot,
      localLandmarks: localLandmarks,
      palmSize: palmSize,
      fingerStretch: fingerStretch,
      scale: scale,

    }

  }

  moveBones( stretch ) {

    this.moveBone( stretch.index, [ 8, 7, 6 ] );
    this.moveBone( stretch.middle, [ 12, 11, 10 ] );
    this.moveBone( stretch.ring, [ 16, 15, 14 ] );
    this.moveBone( stretch.pinky, [ 20, 19, 18 ] );

  }

  moveBone( stretch, indices ) {

    var bones = this.mesh.skinned.skeleton.bones;
    var angle = this.map( stretch, 0, 1, -1.5, 0 );
    indices.forEach( ( index, i ) => {
      bones[ index ].rotation.x = angle;
    });

  }

  getStretch( origin, finger, refSize, max, min ) {
    var val = origin.distanceTo( finger ) / refSize;
    var result = this.map( val, min, max, 0, 1 );
    return Math.min( 1, Math.max( result, 0 ) );
  }

  getLocalLandmarks( referenceCube, landmarks ) {

    var result = [];
    landmarks.forEach((landmark, i) => {

      result[ i ] = referenceCube.worldToLocal( landmark.clone() );

    });

    return result;

  }

  map( value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

}

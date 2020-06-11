class HandMesh {

  constructor( pathToMesh ) {

    this.referenceCube = new THREE.Mesh( new THREE.BoxGeometry( 0.1, 0.1, 0.1 ), new THREE.MeshStandardMaterial( { transparent: true, opacity: 1,opacity: 0 }) );
    this.path = pathToMesh;
    this.mesh = {

      scene: null,
      skinned: null,
      referenceSpreadAngles: {

        index: null,
        middle: null,
        ring: null,
        pinky: null

      }

    }

    this.ready = false;

  }

  async load() {

    this.mesh = await this.loadMesh( this.path );
    this.mesh.scene.scale.set( 3, 3, 3 );
    this.mesh.skinned.geometry.computeVertexNormals();
    this.ready = true;

    var bones = this.mesh.skinned.skeleton.bones;
    this.mesh.referenceSpreadAngles = {
      index: bones[ 7 ].rotation.z,
      middle: bones[ 12 ].rotation.z,
      ring: bones[ 17 ].rotation.z,
      pinky: bones[ 22 ].rotation.z,
    }

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

    var material = new THREE.MeshStandardMaterial( { color: 0xfcba03, skinning: true, transparent: true, opacity: 1, metalness: 0.0 , roughness: 0.1 } );

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

    this.moveBonesX( meshModel.fingerStretch );
    this.applyHandSpread( meshModel.fingerSpread );

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

    var fingerSpread = this.getSpread( l[ 18 ], l[ 6 ], l[ 20 ], l[ 8 ]);
    // -1, 50


    // var fingerSpreadAngles = {
    //   index: this.getSpread(  )
    // }

    return {

      worldPos: worldPos,
      worldRot: worldRot,
      localLandmarks: localLandmarks,
      palmSize: palmSize,
      fingerStretch: fingerStretch,
      fingerSpread: fingerSpread,
      scale: scale,

    }

  }

  applyHandSpread( spread ) {

    var sp = Math.max( -10, Math.min( spread, 45 ) );

    var bones = this.mesh.skinned.skeleton.bones;
    bones[ 7 ].rotation.z = this.mesh.referenceSpreadAngles.index + this.map( sp, -10, 45, -0.1, 0.3);
    bones[ 12 ].rotation.z = this.mesh.referenceSpreadAngles.middle + this.map( sp, -10, 45, -0.0, 0.0);
    bones[ 17 ].rotation.z = this.mesh.referenceSpreadAngles.ring + this.map( sp, -10, 45, 0.07, -0.25);
    bones[ 22 ].rotation.z = this.mesh.referenceSpreadAngles.pinky + this.map( sp, -10, 45, 0.2, -0.4);


  }

  moveBonesX( stretch ) {

    this.moveBoneX( stretch.index, [ 7, 8, 9 ] );
    this.moveBoneX( stretch.middle, [ 12, 13, 14 ] );
    this.moveBoneX( stretch.ring, [ 17, 18, 19 ] );
    this.moveBoneX( stretch.pinky, [ 22, 23, 24 ] );

  }

  moveBoneX( stretch, indices ) {

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

  getSpread( p1, p2, f1, f2 ) {
    var d = p1.x - p2.x;
    var d1 = f1.x - f2.x;
    return d1 - d;
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

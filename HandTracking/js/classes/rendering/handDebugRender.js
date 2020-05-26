class HandDebugRender {

  constructor( scene ) {

    this.joints = [];
    this.scene = scene;
    this.scalingFactor = 30;
    this.group = new THREE.Group();

  }

  initJoints( pose ) {

    var landmarks = pose.landmarks;
    for( var i = 0; i< landmarks.length; i++ ) {

      // console.log(landmarks);
      var r = Math.floor( ( 255 / 21 ) * i );
      var colorCode = "rgb(" + r + ", 255, 255 )"
      var material = new THREE.MeshStandardMaterial( { color: colorCode, flatShading: false, metalness: 0.1, roughness: 1 } );
      var geometry = new THREE.BoxGeometry( .4, .4, .4 );
      this.joints[ i ] = new THREE.Mesh( geometry, material );
      this.joints[ i ].position.set( landmarks[ i ].x / this.scalingFactor, landmarks[ i ].y / this.scalingFactor, landmarks[ i ].z / this.scalingFactor );

      this.group.add( this.joints[ i ] );
    }

    this.scene.add( this.group );

  }

  update( pose ) {

    // console.log(pose.landmarks);
    this.joints[ 0 ].setRotationFromEuler( pose.rotation );

    var landmarks = pose.landmarks;

    landmarks.forEach((landmark, i) => {

      var scaledLandmark = landmark.multiplyScalar( 1 / this.scalingFactor );
      var sp = this.joints[ 0 ].worldToLocal( scaledLandmark );
      this.joints[ i ].position.set( sp.x, sp.y, sp.z );

    });

    var pos = {
      x: Math.floor( this.joints[ 12 ].position.x ),
      y: Math.floor( this.joints[ 12 ].position.y ),
      z: Math.floor( this.joints[ 12 ].position.z ),
    }
    // console.log( pos );


  }

  updateRotations( rotation ) {

    this.joints[ 0 ].setRotationFromEuler( rotation )
    this.joints[0].scale.set(1,1,1);
    // console.log(this.joints[1]);

    // thumb
    this.joints[ 1 ].lookAt( this.joints[ 2 ].position );
    this.joints[ 2 ].lookAt( this.joints[ 3 ].position  );
    this.joints[ 3 ].lookAt( this.joints[ 4 ].position  );

    // index
    this.joints[ 5 ].lookAt( this.joints[ 6 ].position  );
    this.joints[ 6 ].lookAt( this.joints[ 7 ].position  );
    this.joints[ 7 ].lookAt( this.joints[ 8 ].position  );

    // middle
    this.joints[ 9 ].lookAt( this.joints[ 10 ].position  );
    this.joints[ 10 ].lookAt( this.joints[ 11 ].position  );
    this.joints[ 11 ].lookAt( this.joints[ 12 ].position  );

    // ring
    this.joints[ 13 ].lookAt( this.joints[ 14 ].position  );
    this.joints[ 14 ].lookAt( this.joints[ 15 ].position  );
    this.joints[ 15 ].lookAt( this.joints[ 16 ].position  );

    // pinky
    this.joints[ 17 ].lookAt( this.joints[ 17 ].position  );
    this.joints[ 18 ].lookAt( this.joints[ 18 ].position  );
    this.joints[ 19 ].lookAt( this.joints[ 19 ].position  );

    this.joints.forEach((joint, i) => {

      joint.rotation.z = rotation.z;

    });


  }

}

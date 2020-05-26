class HandMetrics {

  constructor() {

    this._referenceScale = 50;
    this._currentEstimationModel;
    this.firstPass = true;

    var pm = this._poseManager;

    // document.getElementById( "modelLog" ).addEventListener( "click", function() {
    //   pm.logModel();
    // });
  }

  getFrame( metrics ) {

    var position = this.arrayToVect3( metrics.annotations.palmBase[0] );

    var landmarksFromOrigin = this.getRelativeLandmarks( metrics.landmarks, position );
    var rawAnnotations = this.getVectorAnnotations( metrics.annotations );
    var annotationsFromOrigin = this.getAnnotationsFromOrigin( metrics.annotations, position );
    var scalingFactor = this.getScalingFactor( annotationsFromOrigin, this._referenceScale );

    var annotations = this.scaleAnnotations( annotationsFromOrigin, scalingFactor );
    var landmarks = this.scaleLandmarks( landmarksFromOrigin, scalingFactor );

    var directions = this.getDirections( annotations );
    var matrix = this.getMatrix( directions );
    var rotation = new THREE.Euler().setFromRotationMatrix( matrix );

    var estimationModel = this.getEstimationModel( annotations );

    var result = {
      scalingFactor: scalingFactor,
      matrix: matrix,
      position: position,
      rotation: rotation,
      landmarks: landmarks,
      annotations: annotations,
    }

    if( this.firstPass == true ) {

      eventManager.dispatchEvent( new CustomEvent( 'firstHandModel', { 'detail': result } ) );
      this.firstPass = false;

    }

    return result

  }

  // computing positions from origin

  getAnnotationsFromOrigin( annotations, basePos ) {

    var annotationsFromOrigin = {};
    for (const [key, annotation] of Object.entries( annotations )) {

      var formatedAnnotation = this.getRelativeLandmarks( annotation, basePos );
      annotationsFromOrigin[ key ] = formatedAnnotation;

    }

    return annotationsFromOrigin;

  }

  getVectorAnnotations( annotations ) {

    var rawAnnotations = {};

    for (const [key, annotation] of Object.entries( annotations )) {

      var currentAnnotation = [];
      annotation.forEach((landmark, i) => {

        currentAnnotation[ i ] = this.arrayToVect3( landmark );

      });

      rawAnnotations[ key ] = currentAnnotation;

    }

    return rawAnnotations;

  }

  getRelativeLandmarks( landmarks, handPos ) {

    landmarks.forEach((elem, i) => {
      landmarks[ i ] = this.getRelativeLandmark( elem, handPos );
    });

    return landmarks;
  }

  getRelativeLandmark( landmark, pos) {
    landmark = this.arrayToVect3( landmark );
    return landmark.sub( pos );
  }

  // scaling from origin

  scaleAnnotations( annotations, scalingFactor ) {

    var scaledAnnotations = {};
    for (const [key, landmarks] of Object.entries( annotations )) {

      var scaledLandmarks = this.scaleLandmarks( landmarks, scalingFactor );
      scaledAnnotations[ key ] = scaledLandmarks;

    }

    return scaledAnnotations;

  }

  scaleLandmarks( landmarks, scalingFactor ) {

    // store the scaled landmarks in a var
    var scaledLandmarks = [];
    landmarks.forEach( ( landmark, i ) => {
      scaledLandmarks[ i ] = landmark.clone().multiplyScalar( scalingFactor );
    });

    return scaledLandmarks;

  }

  // update elements

  getEstimationModel( annotations ) {

    var model = {}

    for (const [key, landmarks] of Object.entries( annotations )) {

      var e = landmarks.length - 1;
      var params = {
        landmarks: [ landmarks[ 0 ], landmarks[ e ] ],
        distance: landmarks[ 0 ].distanceTo( landmarks[ e ] ),
      }

      model[ key ] = params;

    }

    return model;

  }

  getDirections( annotations ) {

    var palmBase = annotations.palmBase[0];
    var pinky = annotations.pinky[0];
    var index = annotations.indexFinger[0];
    var palmFront = pinky.clone().add( index.clone().sub( pinky.clone() ).divideScalar( 2 ) );

    var forward = palmFront.clone().sub( palmBase );
    var right = pinky.clone().normalize().sub( index.clone().normalize() );
    var up =  forward.clone().cross( right.clone().multiplyScalar( -1 ) );

    return {
      forward: forward.normalize(),
      right: right.normalize(),
      up: up.normalize(),
    }

  }

  getMatrix( directions ) {

    var newMatrix = new THREE.Matrix4();

    var xAxis = directions.right.clone();
    var yAxis = directions.up.clone();
    var zAxis = directions.forward.clone();

    newMatrix.makeBasis( xAxis, yAxis, zAxis);
    return newMatrix;

  }

  // utilities functions

  getScalingFactor( annotationsFromOrigin, referenceScale ) {

    // get the key landmarks to calculate current scale
    var base = annotationsFromOrigin.palmBase[0];
    var thumb =  annotationsFromOrigin.thumb[0];
    var currentScale = thumb.distanceTo( base );

    // calculate by which factor the landmarks need to be scaled
    var scalingFactor = referenceScale / currentScale;

    return scalingFactor;

  }

  arrayToVect3( a ) {
    return new THREE.Vector3( a[0], a[1], a[2] );
  }

}

class Sketch {

  constructor( params ) {

    this.faceElements = null
    this.baseOffset = { x: 85, y:20 }
    this.timer = 0

    var elem = document.getElementById('avatar');
    this.two = new Two(params).appendTo(elem)

    var baseOffset = this.baseOffset
    this.offsets = {
      leftBrow: { x: baseOffset.x + 160, y: baseOffset.y + 110 },
      rightBrow: { x: baseOffset.x + 80, y: baseOffset.y + 110 },
      mouth: { x: baseOffset.x + 120, y: baseOffset.y + 220 },
    }

    this.faceElements = this.setupFace();
    // this.two.add( this.faceElements.face, this.faceElements.eyes, this.faceElements.nose )
    this.two.update()
  }

  loadSvg( name, fill=null ) {
    var res = document.getElementById( name );
    res = this.two.interpret( res )
    res.scale = 0.8
    res.translation.set( this.baseOffset.x, this.baseOffset.y )
    return res
  }

  setupFace() {

    var bg = this.loadSvg('bg-svg')
    var bottomHair = this.loadSvg('bottom-hair-svg')
    var hair = this.loadSvg( 'hair-svg', '#dba81d' )
    var ears = this.loadSvg( 'ears-svg' )
    var face = this.loadSvg( 'face-svg' )
    var eyes = this.loadSvg( 'eyes-svg', "#000000" )

    // setup mouth
    var mouth = this.two.makePath( this.getMouthPoints(), 1 );
    mouth.fill = "#ffffff"
    mouth.translation.set( this.offsets.mouth.x, this.offsets.mouth.y )
    mouth.noStroke()

    var nose = this.loadSvg( 'nose-svg')
    var hairTop = this.loadSvg( 'hair-top-svg',"#dba81d" )

    // setup left brow
    var leftBrow = this.two.makeRectangle( -25, 5, 40, 5 )
    leftBrow.fill = "#cc5732"
    leftBrow.translation.set( this.offsets.leftBrow.x, this.offsets.leftBrow.y )
    leftBrow.noStroke()

    // setup right brow
    var rightBrow = this.two.makeRectangle( -25, 5, 40, 5 )
    rightBrow.fill = "#cc5732"
    rightBrow.translation.set( this.offsets.rightBrow.x, this.offsets.rightBrow.y )
    rightBrow.noStroke()

    return {
      bottomHair: bottomHair,
      hair: hair,
      face: face,
      eyes: eyes,
      nose: nose,
      ears: ears,
      hairTop: hairTop,
      mouth: mouth,
      leftBrow: leftBrow,
      rightBrow: rightBrow,
    }

  }

  update( metrics ) {

    var rot = metrics.rotation;
    rot.y *= -1
    var { bottomHair, hair, face, eyes, nose, ears, hairTop, mouth, leftBrow, rightBrow } = this.faceElements

    eyes.translation.set( this.baseOffset.x + rot.y * 20, this.baseOffset.y + rot.x * -10 );
    nose.translation.set( this.baseOffset.x + rot.y * 30, this.baseOffset.y + rot.x * -15 );
    ears.translation.set( this.baseOffset.x + rot.y * -8, this.baseOffset.y + rot.x * 10 );
    bottomHair.translation.set( this.baseOffset.x + rot.y * -15, this.baseOffset.y + rot.x * 15 );
    hair.translation.set( this.baseOffset.x + rot.y * -8, this.baseOffset.y + rot.x * 10 );
    hairTop.translation.set( this.baseOffset.x + rot.y * 10, this.baseOffset.y + rot.x * -10 );


    this.browUpdate( metrics.rotation, metrics.eyes.leftBrow, this.offsets.leftBrow, leftBrow, 1 )
    this.browUpdate( metrics.rotation, metrics.eyes.rightBrow, this.offsets.rightBrow, rightBrow, -1 )
    this.mouthUpdate( metrics )
    this.eyeUpdate( eyes )

    this.two.update()

  }

  eyeUpdate( eyes ) {

    this.timer++
    if( this.timer == 30 )
      eyes.opacity = 0
    if( this.timer ==  32 ) {
      eyes.opacity = 1
      this.timer = 0
    }

  }

  browUpdate( rotation, browMetric ,browOffset, brow, mul ) {

    var faceRot = { x: rotation.y * 20, y: rotation.x * -10 }
    var heightOffset = ( browMetric - 0.3 ) * -50
    var speed = .5

    var positionTarget = {
      x: browOffset.x + faceRot.x,
      y: browOffset.y + faceRot.y + heightOffset
    }
    var rotationTarget = mul * ( browMetric - 0.5 ) + ( 0.3 * mul )

    brow.position.x = positionTarget.x
    brow.position.y = brow.position.y + ( ( positionTarget.y - brow.position.y ) * speed );
    brow.rotation = brow.rotation + ( ( rotationTarget - brow.rotation ) * speed );

  }

  getMouthPoints() {

    var a = new Two.Anchor( -30, 0, 0, 0, 0, 0 );
    var b = new Two.Anchor( 0, 0, 0, 0, 0, 0 );
    var c = new Two.Anchor( 30, 0, 0, 0, 0, 0 );
    var d = new Two.Anchor( 0, 5, 0, 0, 0, 0 );
    var vertices = [ a, b, c, d ]
    return vertices

  }

  mouthUpdate( metrics ) {

    var mouth = this.faceElements.mouth
    var vertices = mouth.vertices;

    var width = metrics.mouth.width;
    var open = metrics.mouth.open;
    var rot = metrics.rotation

    vertices[0].x = width * 40 + 20
    vertices[0].y = - width * 20

    vertices[1].y = - ( width * 10 + open * 20 );

    vertices[2].x = - ( width * 40 + 20 )
    vertices[2].y = - width * 20

    vertices[3].y = open * 40 + 5

    mouth.translation.set( this.offsets.mouth.x + rot.y * 20, this.offsets.mouth.y + rot.x * -10 );

  }

}

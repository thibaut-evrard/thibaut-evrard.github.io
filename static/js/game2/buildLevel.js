var pixelColor = function(src) {
  var color;
  return new Promise(function(res,rej) {
    loadImage(src).then(function(image) {
      var imageData = getImageData(image.image);
      res(getPixel(imageData,0,0));
    });
  });
}

function loadImage(src) {
  return new Promise(function(res,rej) {
    var loader = new THREE.TextureLoader();
    loader.load(src,function(image) {
      res(image);
    });
  });
}

function getImageData( image ) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = image.width; //<--- error here
    canvas.height = image.height;

    var context = canvas.getContext( '2d' );
    context.drawImage( image, 0, 0 );

    return context.getImageData( 0, 0, image.width, image.height );
};

function getPixel( imagedata, x, y ) {
    var position = ( x + imagedata.width * y ) * 4;
    var data = imagedata.data;
    return { r: data[ position ], g: data[ position + 1 ], b: data[ position + 2 ], a: data[ position + 3 ] };
};

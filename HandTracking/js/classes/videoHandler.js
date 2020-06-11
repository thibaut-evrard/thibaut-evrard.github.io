class VideoHandler {
  constructor( video ) {
    this.video = video;
  }

  async startVideo() {

    // var video = this.video;
    navigator.mediaDevices.getUserMedia({ video: {} })
    .then( function(stream) {
      video.srcObject = stream;
    })
    .catch( function(error) {
      console.error(error);
    })

   await new Promise( resolve => {
     videoHandler.video.addEventListener('play', resolve);
   })

  }
}

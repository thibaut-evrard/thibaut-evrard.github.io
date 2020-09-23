class VideoManager {

  constructor( video ) {

    this.video = video;

  }

  async start() {

    var vid = this.video
    var manager = this;

    navigator.mediaDevices.getUserMedia({ video: {} })
    .then( function(stream) {
      vid.srcObject = stream;
    })
    .catch( function(error) {
      console.error(error);
    })

   await new Promise( resolve => {
     manager.video.addEventListener('play', resolve);
   })

  }

}

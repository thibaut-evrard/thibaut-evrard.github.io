export default class VideoManager {

  constructor( video ) {

    this.video = video;
    this.size = null

  }

  async start() {
    console.log("ye")
    var vid = this.video
    var manager = this;

    navigator.mediaDevices.getUserMedia({ video: {} })
    .then( function(stream) {
      vid.srcObject = stream;
    })
    .catch( function(error) {
      console.error(error);
    })

    let that = this;
    await new Promise( resolve => {
     manager.video.addEventListener('play', (event) => {
       that.size = {
         w: event.target.videoWidth,
         h: event.target.videoHeight,
       }
       return resolve();
     });
    })

  }

}

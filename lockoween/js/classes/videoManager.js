export default class VideoManager {

  constructor( video, isMobile ) {

    this.isMobile = isMobile;
    this.video = video;
    this.size = null

  }

  async start() {
    console.log("ye")
    var vid = this.video
    var manager = this;
    const isMobile = this.isMobile;

    navigator.mediaDevices.getUserMedia({ video: {} })
    .then( function(stream) {
      vid.srcObject = stream;
    })
    .catch( function(error) {
      sendErrorEvent(isMobile);
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

function sendErrorEvent( isMobile ) {

  let text;
  if( isMobile == false ) {
    text = 'ERROR! Unable to get webcam feed... make sure you have a webcam and clicked on "allow" else, try on annother browser';
  }
  else {
    text = 'ERROR! Unable to get camera feed... make sure you open this page with your device browser i.e. safari or chrome';
  }

  let evt = new CustomEvent('loading-bar', { 'detail': { 'text': text, 'class': 'error'} } );
  document.dispatchEvent(evt);

}

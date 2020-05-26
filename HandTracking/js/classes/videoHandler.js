class VideoHandler {
  constructor( video ) {
    this.video = video;
  }

  async startVideo() {

    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
     await new Promise( resolve => {
       videoHandler.video.addEventListener('play', resolve);
     })

  }
}

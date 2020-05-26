class ModelHandler {

  constructor() {

    this.model= null;
    this.predictions = null;
    
  }

  async loadModel() {

    this.model = await handpose.load();
    return;

  }

  async getPredictions( video ) {

    const predictions = await this.model.estimateHands( video );
     // drawing function
     if( predictions.length != 0 ) {

       return predictions;

     }
     else return null;

  }

}

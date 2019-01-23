class Menus {
  constructor() {
    this.timer = 0;
    this.available = true;
  }

  playable() {
    $("#loading").animate({opacity: 0}, 1000);
    $("#play").animate({opacity: 1}, 500);
    // $("#loading").animate({opacity: 0}, 1000);
    // $("#play").animate({opacity: 1}, 1000);
  }

  update() {
    if(timeRunning == true) this.timer += 3;
    this.printTime();
  }

  printTime() {
    $("#time").text(this.framesToTime(this.timer));
  }

  framesToTime(time) {
    var cent = time % 100;
    var sec = Math.floor(time/100) % 60;
    var min = Math.floor(Math.floor(time/100)/60);

    if(cent < 10) { cent = "0"+cent; }
    if(sec < 10) { sec = "0"+sec; }
    if(min < 10) { min = "0"+min; }
    var timeString = min+":"+sec+":"+cent;
    return timeString;
  }

  // methods to call from other classes
  changeLaps(lap) {
    // get text
    if(lap==0) this.finishMenu()
    var expression = function() {
      switch(lap) {
        case 3:
        timeRunning = true;
        return "GO!";
        case 2:
        return "1 LAPS LEFT";
        break;
        case 1:
        return "FINAL LAP!";
        break;
        case 0:
        timeRunning = false;
        return "FINISH"
      }
    }
    // set content
    $("#laps").text(expression);

    // start annimation
    $('#laps').animate({opacity: 1}, 200, function()
      {
        $('#laps').animate({opacity: 1},500,function() {
          $('#laps').animate({opacity: 0},600);
        });
    });
  }

  async finishMenu() {
    this.available = false;
    $("#finish-menu").show();
    $("#finish-menu").animate({opacity: 1},4000);
    setTimeout(function(){
      noLoop();
      menu.available = true;
    }, 2000 );
  }

  pause() {
    $("#pause-menu").toggle();
    $("#pause-menu").animate({opacity: 1},500);
    if($("#pause-menu").is(":visible")) noLoop();
    else loop();
  }
}

$("#play").click(async function() {
  $("#load-screen").fadeOut(500);
  play = true;
  loop();
})

$("#restart-race").click(function() {
  if(menu.available) {
    $("#finish-menu").animate({opacity: 0},1000,function() {
      $("#finish-menu").hide();
    });
    menu.timer = 0;
    play = true;
    timeRunning = false;
    loop();
    checkpoint = true;
    lapsLeft = 4;
    car.restart();
  }
})

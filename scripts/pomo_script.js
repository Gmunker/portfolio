$(function() {

//audio alarm
  let aStatus = true;
  let a;
  let audioAlarmSound = document.getElementById('audioAlarm');
  function aPlay() {
    audioAlarmSound.play();
  }

  function aStop() {
    audioAlarmSound.pause();
  }

//Options
  let aRestart = true;
  let aAlarm = false;
  let aAlarmInt;
  let vAlarm = false;
  let vAlarmInt;

  $('.pomo_options_toggle').on('click', function() {
    let id = $(this).attr('id');
    if ($(this).hasClass("toggle-off")) {
      $(this).removeClass('toggle-off', 1000);
      $(this, '.pomo_option_value').text("ON").addClass("pomo_option_value");
      if (id === "auto_reset_toggle") {
        aRestart = true;
      }
      if (id === "audio_alarm_toggle") {
        aAlarm = true;
      }
      if (id === "visual_alarm_toggle") {
        vAlarm = true;
      }
    } 

    else if (!($(this).hasClass('toggle-off'))) {
      $(this).addClass('toggle-off', 1000);
      $(this, '.pomo_option_value').text("OFF").addClass("pomo_option_value");
      if (id === "auto_reset_toggle") {
        aRestart = false;
      }
      if (id === "audio_alarm_toggle") {
        aAlarm = false;
      }
      if (id === "visual_alarm_toggle") {
        vAlarm = false;
      }
    }
  })

  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus()
  });

//Time Total Variables (milliseconds)
  let wDur = 1500000;
  let wDur2 = 1500000;
  let bDur = 300000;
  let bDur2 = 300000;
  let status = false;
  let timer;
  let timerStatus = false;

//Convert Time Functions
  function getHour(h) {
    let seconds = (h / 1000);
    return numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  }

  function getMin(m) {
    let seconds = (m / 1000);
    let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    if (numminutes < 10 && m > 3000000) {numminutes = "0" + numminutes;}
    return numminutes;
  }

  function getSec(s) {
    let seconds = (s / 1000);
    let numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
    if (numseconds < 10) {numseconds = "0" + numseconds;}
    return numseconds;
  }

//DOM Variables
  let $bUp = $('#break-up');
  let $bDown = $('#break-down');
  let $wUp = $('#work-up');
  let $wDown = $('#work-down');
  let $timeChange = $('.time-change-btn');
  let $w = $('#work-value');
  let $b = $('#break-value');
  let $wTime = $('#work-time');
  let $bTime = $('#break-time');
  let $startStop = $('#start-stop-value');

//Time Default Displays
  $wTime.text(getMin(wDur) + ":" + getSec(wDur));
  $bTime.text(getMin(bDur) + ":" + getSec(bDur));
  $startStop.text("Start");

  function startTimer() {
    timer = setInterval(myTimer, 1000);
  }

  function pauseTimer() {
    clearInterval(timer);
  }

//Start / Stop Button
  $startStop.on('click', function() {
    if (status === false) {
      $startStop.text("Pause");
      startTimer();
      status = true;
    } else if (status) {
      $startStop.text("Start");
      pauseTimer();
      clearInterval(vAlarmInt);
      status = false;
    }


  });

//Time Arrow Buttons
  $bUp.on('click', function() {
    if (bDur < 3540000 && bDur >= 0 && timerStatus === false) {
      bDur += 60000;
      bDur2 += 60000;
      $b.text(getMin(bDur));
      $bTime.text(getMin(bDur) + ":" + getSec(bDur));
    } else if (bDur === 3540000) {
      bDur += 60000;
      bDur2 += 60000;
      $b.text(getHour(bDur) + ":" + getMin(bDur));
      $bTime.text(getHour(bDur) + ":" + getMin(bDur) + ":" + getSec(bDur));
    }

  });

  $bDown.on('click', function() {
    if (bDur > 0 && timerStatus === false) {
      bDur -= 60000;
      bDur2 -= 60000;
      $b.text(getMin(bDur));
      $bTime.text(getMin(bDur) + ":" + getSec(bDur));
    }
  });

  $wUp.on('click', function() {
    if (wDur < 3300000 && timerStatus === false) {
      wDur += 300000; 
      wDur2 += 300000;
      $w.text(getMin(wDur));
      $wTime.text(getMin(wDur) + ":" + getSec(wDur));
    }  else if (wDur >= 3300000 && wDur < 87000000 && timerStatus === false) {
      wDur += 300000; 
      wDur2 += 300000;
      $w.text(getHour(wDur) + ":" + getMin(wDur));
      $wTime.text(getHour(wDur) + ":" + getMin(wDur) + ":" + getSec(wDur));
    }
    
  });

  $wDown.on('click', function() {
    if (wDur > 0 && wDur <= 3600000 && timerStatus === false) {
        wDur -= 300000;
        wDur2 -= 300000;
      $w.text(getMin(wDur));
      $wTime.text(getMin(wDur) + ":" + getSec(wDur));
    }   else if (wDur > 0 && wDur > 3600000 && wDur < 87000000 && timerStatus === false) {
        wDur -= 300000;
        wDur2 -= 300000;
      $w.text(getHour(wDur) + ":" + getMin(wDur));
      $wTime.text(getHour(wDur) + ":" + getMin(wDur) + ":" + getSec(wDur));
    }
  });

//Charts

  let data = {
    labels: ["Lapse Time", "Remaining Time"],
    datasets: [
      {
        data: [0, 1500000],
        backgroundColor: [
          "#FF6384",
          "#36A2EB"
        ]
      }]
  };

  let ctx = document.getElementById("myChart");

  let myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {cutoutPercentage: 97}
  });
  let chartData = data.datasets[0].data;
  let chartColors = data.datasets[0].backgroundColor;

//reset function
    function reset() {
        pauseTimer();
          timerStatus = false;
          wDur = wDur2;
          bDur = bDur2;
          chartData[0] = 0;
          chartData[1] = wDur;
          chartColors[0] = "#FF6384";
          chartColors[1] = "#36A2EB";
          myDoughnutChart.update();
          if (wDur < 4500000 && wDur > 0) {
            $wTime.text(getMin(wDur) + ":" + getSec(wDur));
          }   else if (wDur > 3000000 && wDur < 87000000) {
            $wTime.text(getHour(wDur) + ":" + getMin(wDur) + ":" + getSec(wDur));
          }
          if (bDur < 3600000 && bDur > 0) {
            $bTime.text(getMin(bDur) + ":" + getSec(bDur));
          }   else if (bDur > 3000000 && bDur < 87000000) {
            $bTime.text(getHour(bDur) + ":" + getMin(bDur) + ":" + getSec(bDur));
          }
          $('html').css({"backgroundColor": "black"});
          $('body').css({"backgroundColor": "black"});
          $('body').css({'color': "#fff"});
    }

//Timer
  function myTimer() {

    timerStatus = true;

    if (bDur === bDur2 && wDur === 0) {
      chartData[0] = 0;
    }

    if (wDur === 0 && bDur > 0) {
      bDur -= 1000;
      chartColors[0] = "#36A2EB";
      chartColors[1] = "#FF6384";
      chartData[1] = bDur;
      chartData[0] += 1000;
      chartData[1] -= 1000;
      myDoughnutChart.update();
      if (bDur < 3600000 && bDur > 0) {
        $bTime.text(getMin(bDur) + ":" + getSec(bDur));
      }   else if (bDur > 3000000 && bDur < 87000000) {
        $bTime.text(getHour(bDur) + ":" + getMin(bDur) + ":" + getSec(bDur));
      }
    }

    if (wDur < 4500000 && wDur > 0) {
      wDur -= 1000;
      chartData[1] = wDur;
      chartData[0] += 1000;
      chartData[1] -= 1000;
      myDoughnutChart.update();
      $wTime.text(getMin(wDur) + ":" + getSec(wDur));
    }   else if (wDur > 3000000 && wDur < 87000000) {
      $wTime.text(getHour(wDur) + ":" + getMin(wDur) + ":" + getSec(wDur));
    }
    
    
    if ((wDur > 0 && wDur <= 20000 && bDur > 0 && timerStatus === true && aAlarm === true) || (wDur === 0 && bDur <= 20000 && timerStatus === true && aAlarm === true)) {
      
       if (aStatus === true) {
        aPlay();
        aStatus = false;
      } else if (aStatus === false) {
        //aStop();
        aStatus = true;
      }
    }
    
    
    if ((wDur > 0 && wDur <= 20000 && bDur > 0 && timerStatus === true && vAlarm === true) || (wDur === 0 && bDur <= 20000 && timerStatus === true && vAlarm === true)) {
      if (vAlarmTimeStatus === true) {
        $('html').css({"backgroundColor": "red"});
        $('body').css({"backgroundColor": "red"});
        $('body').css({'color': "#000"});
        vAlarmTimeStatus = false;
      } else if (vAlarmTimeStatus === false) {
        $('html').css({"backgroundColor": "black"});
        $('body').css({"backgroundColor": "black"});
        $('body').css({'color': "#fff"});
        vAlarmTimeStatus = true;
      }
    }

    if (wDur === 0 && bDur === 0) {
      reset();
      if (aRestart === true) {
        startTimer();
      } else if (aRestart === false) {
        $startStop.text("Start");
      }
    }
    
    
  }

  let vAlarmTimeStatus = true;

  function vAlarmTimer() {
    
  }

//Reset Button

  $('#reset').on('click', function() {
    reset();
  });

});// Ready Function



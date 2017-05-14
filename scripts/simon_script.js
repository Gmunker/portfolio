//Game Controlling Variables
let pattern = [];
let playerPat = [];
var longestPat = [];
let game = 0;
let skillLevel = 1;
let skillDelay = 1000;
var round = 0;
let playersTurn = false;
let playerPatCnt = 0;
let shotClock;
let gameOnStatus = false;

//UI Variables
const $red = $('#top-left');
const $green = $('#bottom-left');
const $blue = $('#top-right');
const $yellow = $('#bottom-right');

const $redDown = $('#top-left-down'); 
const $blueDown = $('#top-right-down');
const $greenDown = $('#bottom-left-down');
const $yellowDown = $('#bottom-right-down');

const $start = $('#start');
const $last = $('#last');
const $longest = $('#longest');

const $switchToggle = $('.switch-toggle');

const $gameSwitch = $('#game-toggle');
const $gameOffPos = $('#game-off-pos');
const $gamePos = $('.gamePos');
const $game1Pos = $('#game-1-pos');
const $game2Pos = $('#game-2-pos');
const $game3Pos = $('#game-3-pos');

const $skillSwitch = $('#skill-toggle');
const $skill1Pos = $('#skill-1-pos');
const $skill2Pos = $('#skill-2-pos');
const $skill3Pos = $('#skill-3-pos');
const $skill4Pos = $('#skill-4-pos');

/*
  Tone Generator - I give credit to where it's due. 
  I learned alot look at all this code, it was copy pasted and I broke it down from there,
  and made it my own. After learning the very basics of how it works.
  /*

  /*
   * Common tools for use with WebAudio.
   * 
   * This code was based on original code by Boris Smus
   * from: http://www.webaudioapi.com/
   *
   * with extensions and modifications by Phil Burk
   * from http://www.softsynth.com/webaudio/
   */
  /*
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  function createAudioContext()
  {
    var contextClass = (window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext ||
        window.oAudioContext);
    if (contextClass) {
      return new contextClass();
    } else {
      alert("Sorry. WebAudio API not supported. Try using the Google Chrome or Safari browser.");
      return null;
    }
  }

  // Start off by initializing a new audioContext.
  var audioContext =  createAudioContext();

  // shim layer with setTimeout fallback
  window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

  function fixOscillator(osc)
  {
    if (typeof osc.start == 'undefined') {
      osc.start = function(when) {
        osc.noteOn(when);
      }
    }
    if (typeof osc.stop == 'undefined') {
      osc.stop = function(when) {
        osc.noteOff(when);
      }
    }
  }

  var oscillator;
  var amp;

  // Create an oscillator and an amplifier.
  function initAudio()
  {
      // Use audioContext from webaudio_tools.js
      if( audioContext )
      {
          oscillator = audioContext.createOscillator();
          fixOscillator(oscillator);
          oscillator.frequency.value = 440;
          amp = audioContext.createGain();
          amp.gain.value = 0;
      
          // Connect oscillator to amp and amp to the mixer of the audioContext.
          // This is like connecting cables between jacks on a modular synth.
          oscillator.connect(amp);
          amp.connect(audioContext.destination);
          oscillator.start(0);
      }
  }

  // Set the frequency of the oscillator and start it running.
  function startTone( frequency )
  {
      var now = audioContext.currentTime;
      
      oscillator.frequency.setValueAtTime(frequency, now);
      
      // Ramp up the gain so we can hear the sound.
      // We can ramp smoothly to the desired value.
      // First we should cancel any previous scheduled events that might interfere.
      amp.gain.cancelScheduledValues(now);
      // Anchor beginning of ramp at current value.
      amp.gain.setValueAtTime(amp.gain.value, now);
      amp.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
  }

  function stopTone()
  {
      var now = audioContext.currentTime;
      amp.gain.cancelScheduledValues(now);
      amp.gain.setValueAtTime(amp.gain.value, now);
      amp.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + .5);
  }

  // init once the page has finished loading.
  window.onload = initAudio;

$(function() {

  function setSkillDelay() {
    if (skillLevel === 1) {
      if (round === 1) {
        skillDelay = 1000;
      } else if (round === 5) {
        skillDelay = 900;
      } else if (round === 9) {
        skillDelay = 800;
      } else if (round === 13) {
        skillDelay = 700;
      }
    }

    if (skillLevel === 2) {
      if (round === 1) {
        skillDelay = 800;
      } else if (round === 5) {
        skillDelay = 600;
      } else if (round === 9) {
        skillDelay = 400;
      } else if (round === 13) {
        skillDelay = 300;
      }
    }

    if (skillLevel === 3) {
      if (round === 1) {
        skillDelay = 600;
      } else if (round === 5) {
        skillDelay = 400;
      } else if (round === 9) {
        skillDelay = 300;
      } else if (round === 13) {
        skillDelay = 200;
      }
    }

    if (skillLevel === 4 ) {
      if (round === 1) {
        skillDelay = 300;
      } else if (round === 5) {
        skillDelay = 250;
      } else if (round === 9) {
        skillDelay = 200;
      } else if (round === 13) {
        skillDelay = 150;
      }
    }
  }

  function checkForWin() {
    if (round === 31) {
      gameOn();
    }
  }
  //All Functions to run the game

  function patBuilder() {
    pattern.push(Math.floor(Math.random() * 4) + 0);
  }

  function compTurn() {
    if (game !== 0) {
      patBuilder();
      round += 1;
      showPattern(pattern);

      if (playerPat > longestPat) {
        longestPat = playerPat;
      }

      console.log(playerPat);
      console.log(longestPat);

      playerPat = [];
      playerPatCnt = 0;
      setSkillDelay();
      checkForWin();
      
    }
  }

  function sounds(i) {
    switch (i) {
          case 0:
            startTone(310);
            setTimeout(function() {stopTone();}, 50);
            break;
          case 1:
            startTone(209);
            setTimeout(function() {stopTone();}, 50);
            break;
          case 2:
            startTone(252);
            setTimeout(function() {stopTone();}, 50);
            break;
          case 3:
            startTone(415);
            setTimeout(function() {stopTone();}, 50);
            break;
          }
  }

  function buttonLights(i) {
    switch (i) {
          case 0:
            $red.css({background: "#FF0000"});
            setTimeout(function() {$red.css({background: "#BF0000"});}, 200);
            break;
          case 1:
            $blue.css({background: "#2133FF"});
            setTimeout(function() {$blue.css({background: "#0000BF"});}, 200);
            break;
          case 2:
            $yellow.css({background: "#FFFF00"});
            setTimeout(function() {$yellow.css({background: "#BFBF00"});}, 200);
            break;
          case 3:
            $green.css({background: "#00A000"});
            setTimeout(function() {$green.css({background: "#006600"});}, 200);
            break;
          case undefined:
            playersTurn = true;
            break;
          }
  }

  function showPattern(pat) {
      for (let i=0;i<pat.length+1;i++) {
        window.setTimeout(function(){
          buttonLights(pat[i]);
          sounds(pat[i]);
        }, i * skillDelay);
      };
    }

  function checkPlayerMove() {
    if ((pattern[(playerPatCnt - 1)]) === (playerPat[(playerPatCnt - 1)])) { 
        if (pattern.length === playerPat.length) {
          setTimeout(function() {compTurn();}, 1000);
        }
      } else if ((pattern[(playerPatCnt - 1)]) !== (playerPat[(playerPatCnt - 1)])) {
        startTone(165);
        setTimeout(function() {stopTone();}, 200);
        playerPat = [];
        pattern = [];
        playerPatCnt = 0;
        playersTurn = false;
        round = 0;
      }
  }

  $start.on('click', function() {
    if (!(playersTurn)) {
      compTurn();
    }
  });

  $('.gameBtn').on('click', function() {

    if ((playersTurn) && (game === 1)) {

      let id = this.id;

      if (id === "top-left") {
        playerPat.push(0);
        buttonLights(0);
        sounds(0);
      }
      if (id === "top-right") {
        playerPat.push(1);
        buttonLights(1);
         sounds(1);
      }
      if (id === "bottom-right") {
        playerPat.push(2);
        buttonLights(2);
        sounds(2);
      }
      if (id === "bottom-left") {
        playerPat.push(3);
        buttonLights(3);
        sounds(3);
      }
      playerPatCnt += 1;
      checkPlayerMove();
    }//playersTurn
  });

  $last.on('click', function() {
    showPattern(pattern);
  });

  $longest.on('click', function() {
    showPattern(longestPat);
  })

  function gameOn() {
    gameOnStatus = true;
    buttonLights(0);
          sounds(0);
          setTimeout(function() {buttonLights(1);sounds(1);}, 200);
          

          setTimeout(function() {buttonLights(2);sounds(2);}, 400);
          

          setTimeout(function() {buttonLights(3);sounds(3);}, 600);
          

          setTimeout(function() {buttonLights(0);sounds(0);}, 800);
          

          setTimeout(function() {buttonLights(1);sounds(1);}, 1000);
          

          setTimeout(function() {buttonLights(2);sounds(2);}, 1200);
          

          setTimeout(function() {buttonLights(3);sounds(3);}, 1400);
          

          setTimeout(function() {
            buttonLights(0);
            sounds(0);
            buttonLights(1);
            sounds(1);
            buttonLights(2);
            sounds(2);
            buttonLights(3);
            sounds(3);
          }, 1600);

          setTimeout(function() {
            buttonLights(0);
            sounds(0);
            buttonLights(1);
            sounds(1);
            buttonLights(2);
            sounds(2);
            buttonLights(3);
            sounds(3);
          }, 2000);

          setTimeout(function() {
            buttonLights(0);
            sounds(0);
            buttonLights(1);
            sounds(1);
            buttonLights(2);
            sounds(2);
            buttonLights(3);
            sounds(3);
          }, 2400);
  }

  function gameOff() {
    game = 0;
    gameOnStatus = false;
    playerPat = [];
    pattern = [];
    playerPatCnt = 0;
    playersTurn = false;
    round = 0;
    longestPat = [];
  }


  $gameSwitch.on('click', function() {
    if (!(gameOnStatus)) {
      $(this).animate({
        left: 30
      });
      gameOn();
      game = 1;
    } else {
      $(this).animate({
        left: 8
      });
      gameOff();
    }
  });

  $skillSwitch.on('click', function() {
      if (skillLevel === 1) {
        $(this).animate({left: 18});
        skillLevel = 2;
        console.log(skillLevel + " - Skill 2");
      } 

      else if (skillLevel === 2) {
        $(this).animate({left: 30});
        skillLevel = 3;
        console.log(skillLevel + " - Skill 3");
      }

      else if (skillLevel === 3) {
        $(this).animate({left: 40});
        skillLevel = 4;
        console.log(skillLevel + " - Skill 4");
      } 

      else if (skillLevel === 4 ) {
        $(this).animate({left: 8});
        skillLevel = 1
        console.log(skillLevel + " - Skill 1");
      }
  });
});
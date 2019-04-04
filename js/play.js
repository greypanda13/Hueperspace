var numPlayers = 1
var player1;
var player1Stats = {
  color: 4,
  health: 3,
  score: 0,
  highScore: 0,
  powerupsAvailable: 0,
  powerupsUsed: 0
};
var overallHighScore;
var numRandomBarriers = 10;
const barrierSpawnX = 780;
const barriersPerSpawn = [5, 2];
var barrierSpawnStaggerFrames = 80;
class Barrier {
  constructor (color, xPos, yPos)
  {
    this.color = color;
    this.xPos = xPos;
    this.yPos = yPos;
  }
};
const barrierKillerX = -40;
var spaceBounds;
// var score = 0;
var scoreText;
var healthText;
var frame = 0;
var isFlickerPlaying = false;
const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
var currentGamePhase = 0;
const gamePhaseTitles = ["Open Space", "Hyperspace"];
var scoreAtPhaseStart = [];
var ptsBeforePhaseEnd = 6;
var barriersWaited = 0;
var barrierBaseVelocity = 80;
var barrierVelocityPhaseCoef = 3;

var isPhaseChangeUnderway = false;
var isTimeBufferSufficient = false;
var isHyperTranFinishedX = false;
var isHyperTranFinishedY = false;
var isHyperActive = false;
var isReadyForHyper = false;
var noPhaseChangeRequests = 0;
var gamePhaseChangeTotal = 0;
const PLAYER_BASE_SPEED = 250;
// phaseSpeedCoef should be gradually increased at end of round to up speed of player
var phaseSpeedCoef = 1;
const DASH_COEF = 1.4;
// < 0 means fewer pts needed in hyperspace than open space; 0 means same pts needed; > 0 means more pts needed.
var phasePtsCoef = -.5;

var killer;
var sky;
var blur;
var ivisibarriers;
var topGuider;
var bottomGuider;
var rightSideGuider;

function endGame() {

}

function killBarriers (killer, barriers) {
  barriers.kill();
}

function hyperspaceBegin(sprite, animation) {
  isReadyForHyper = true;
}

function triggerPhaseChange() {
  if (isPhaseChangeUnderway) {
    isPhaseChangeUnderway = false;
  } else {
    isPhaseChangeUnderway = true;
  }
  noPhaseChangeRequests++;
}

function switchGamePhases(gamePhase) {
  if (gamePhase < gamePhaseTitles.length - 1) {
    currentGamePhase++;
  } else {
    currentGamePhase = 0;
  }
  isHyperTranFinishedX = false;
  isHyperTranFinishedY = false;
  isTimeBufferSufficient = false;
  isPhaseChangeUnderway = false;
  isHyperActive = false;
  isReadyForHyper = false;
  gamePhaseChangeTotal++;
  scoreAtPhaseStart[currentGamePhase] = player1Stats.score;
  if (gamePhaseChangeTotal % gamePhaseTitles.length === 0) {
    barrierBaseVelocity += 20;
  }
}

var playState = {
  create: function () {
    player1Stats.health = 30;
    player1Stats.score = 0;
    player1Stats.powerupsAvailable = 0;
    player1Stats.powerupsUsed = 0;
    for(i = 0; i < gamePhaseTitles.length; i++){
      scoreAtPhaseStart[i] = 0;
    };
    currentGamePhase = 0;

    this.keyboard = game.input.keyboard;

    // Enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    sky = game.add.sprite(0, 0, "sky");
    sky.animations.add("blur", [1, 2], 1, false);
    sky.animations.add("zoom", [3, 4, 5], 10, true);
    sky.animations.add("unblur", [2, 1, 0], 4, false);

    //  The spaceBounds group contains the ground and the 2 ledges we can jump on
    spaceBounds = game.add.group();

    ends = game.add.group();

    killer = game.add.group();

    spaceBounds.enableBody = true;

    ends.enableBody = true;

    killer.enableBody = true;

    barrierKillerObj = killer.create(50, 0, "barivert");

    topGuider = spaceBounds.create(0, -26, "barihor");
    topGuider.body.immovable = true;

    bottomGuider = spaceBounds.create(0, game.world.height + 1, "barihor");
    bottomGuider.body.immovable = true;

    rightSideGuider = spaceBounds.create(game.world.width + 100, 0, "barivert");
    rightSideGuider.body.immovable = true;

    // The player and its settings
    player1 = game.add.sprite(32, game.world.height - 150, "dude");

    //  We need to enable physics on the player
    game.physics.arcade.enable(player1);

    //  Player physics properties.
    player1.body.collideWorldBounds = true;

    // player movement animations
    // player1.animations.add("lateral", [1, 2], 900, true);
    player1.animations.add("lateral0", [1, 2], 4, true);
    player1.animations.add("lateral1", [7, 8], 4, true);
    player1.animations.add("lateral2", [13, 14], 4, true);
    player1.animations.add("lateral3", [19, 20], 4, true);
    player1.animations.add("lateral4", [25, 26], 4, true);
    player1.animations.add("lateral5", [31, 32], 4, true);

    player1.animations.add("flicker0", [3, 4, 5, 4, 3], 8, false);
    player1.animations.add("flicker1", [9, 10, 11, 10, 9], 8, false);
    player1.animations.add("flicker2", [15, 16, 17, 16, 15], 8, false);
    player1.animations.add("flicker3", [21, 22, 23, 22, 21], 8, false);
    player1.animations.add("flicker4", [27, 28, 29, 28, 27], 8, false);
    player1.animations.add("flicker5", [33, 34, 35, 34, 33], 8, false);

    player1.animations.add("lateral5", [31, 32], 900, true);

    cursors = game.input.keyboard.createCursorKeys();

    keyDash = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    // key1.onDown.add(addPhaserDude, this);

    stars = game.add.group();

    stars.enableBody = true;

    barriers = game.add.group();

    barriers.enableBody = true;

    game.physics.arcade.overlap(killer, barriers, killBarriers, null, this);

      scoreText = game.add.text(180, 8, "score: " + player1Stats.score, { font: "20px Courier", fill: "#fff" });
      healthText = game.add.text(8, 8, "health: " + player1Stats.health, { font: "20px Courier", fill: "#fff" });
  },
  update: function () {
    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    game.physics.arcade.collide(player1, spaceBounds);

    game.physics.arcade.overlap(player1, stars, collideStars, null, this);



    function collideStars (player1, star) {

      star.kill();

      player1Stats.score += 10;
      scoreText.text = "Score: " + player1Stats.score;

    }

    game.physics.arcade.overlap(player1, barriers, collideBarriers, null, this);

    function collideBarriers (player1, barrier) {
      if (barrier.animations.sprite.key === COLORS[player1Stats.color]) {
        barrier.animations.play("pass");
      } else {
        // isFlickerPlaying = true;
        player1.animations.play("flicker" + player1Stats.color);

        // Removes the star from the screen
        barrier.kill();
        player1Stats.health--;
        healthText.text = "health: " + player1Stats.health;

        if (!player1Stats.health) {
          console.log("game is over");
          endGame();
          game.state.start("gameover");
        }
      }
    }

    if (currentGamePhase === 0) {
      if (!isPhaseChangeUnderway) {
        console.log(isPhaseChangeUnderway);
        // creates barriers every so many frames
        if (frame % barrierSpawnStaggerFrames === 0) {
          console.log("currentGamePhase = " + currentGamePhase);
          // console.log(scoreAtPhaseStart[currentGamePhase]);

          player1Stats.score++;
          scoreText.text = "Score: " + player1Stats.score;
          // console.log(COLORS[player1Stats.color]);
          var availableColors = COLORS;
          function isNotPlayerColor(value) {
            return value !== COLORS[player1Stats.color];
          }
          var notPlayerColorArr = availableColors.filter(isNotPlayerColor);
          // console.log(notPlayerColorArr);

          var playerColorBarrierIndex = Math.round(Math.random() * (COLORS.length - (numPlayers + 1)));
          console.log(playerColorBarrierIndex);
          for (var i = 0; i < barriersPerSpawn[currentGamePhase]; i++) {

            if (i === playerColorBarrierIndex) {
              console.log("i " + playerColorBarrierIndex + " color " + COLORS[player1Stats.color]);
              var barrier = new Barrier(COLORS[player1Stats.color], barrierSpawnX, i * (game.world.height / barriersPerSpawn[currentGamePhase]));
              barrier = barriers.create(barrier.xPos, barrier.yPos, barrier.color);
              barrier.body.gravity.x = -10;
              barrier.body.velocity.x = -barrierBaseVelocity * (1 + barrierVelocityPhaseCoef * currentGamePhase);
              barrier.animations.add("pass", [1], 200, true);
              // } else if (!isSameColorIn) {
                // add in condition to ensure same color isn't chosen more than once.

              } else {
                var n = Math.round(Math.random() * (notPlayerColorArr.length - 1));
                var barrier = new Barrier(notPlayerColorArr[n], barrierSpawnX, i * (game.world.height / barriersPerSpawn[currentGamePhase]));
                barrier = barriers.create(barrier.xPos, barrier.yPos, barrier.color);
                barrier.body.gravity.x = -10;
                barrier.body.velocity.x = -barrierBaseVelocity * (1 + barrierVelocityPhaseCoef * currentGamePhase);
                barrier.animations.add("pass", [1], 2000, true);
              }
            }
          }
      } else {
        if (!isTimeBufferSufficient) {
          if (frame % barrierSpawnStaggerFrames === 0) {
            // PASS THIS TEST 5 TIMES TO CLEAR SCREEN...
            barriersWaited++;
            if (barriersWaited > 4) {
              isTimeBufferSufficient = true;
            }
            if (barriersWaited > 0) {
              rightSideGuider.body.velocity.x = -barrierBaseVelocity * (1 + barrierVelocityPhaseCoef * currentGamePhase) * 1.3;
            }
          }
        } else {
          if (isHyperActive) {
            //hyperspace game logic
            switchGamePhases(currentGamePhase);
          } else {
            if (isReadyForHyper) {
              sky.animations.play("zoom");
              isHyperActive = true;
            } else {
              if (isHyperTranFinishedX && isHyperTranFinishedY) {
                sky.animations.play("blur").onComplete.add(hyperspaceBegin, this);
                rightSideGuider.kill();
                rightSideGuider = spaceBounds.create(game.world.width + 100, 0, "barivert");
                rightSideGuider.body.immovable = true;
              } else {
                if (topGuider.position.y > 180) {
                  topGuider.body.velocity.y = 0;
                  bottomGuider.body.velocity.y = 0;
                  isHyperTranFinishedY = true;
                } else {
                  topGuider.body.velocity.y = barrierBaseVelocity;
                  bottomGuider.body.velocity.y = -barrierBaseVelocity;
                }
                if (rightSideGuider.position.x < player1.body.width - rightSideGuider.body.velocity.x) {
                  rightSideGuider.body.velocity.x = 0;
                  isHyperTranFinishedX = true;
                } else {
                  rightSideGuider.body.velocity.x = -barrierBaseVelocity * (1 + barrierVelocityPhaseCoef * currentGamePhase) * 1.3;
                }
              }
            }
          }
        }
      }
    } else if (currentGamePhase === 1) {
      console.log(isPhaseChangeUnderway);
      if (!isPhaseChangeUnderway) {
        console.log(isPhaseChangeUnderway);
        // creates barriers every so many frames
        if (frame % barrierSpawnStaggerFrames === 0) {
          console.log("currentGamePhase = " + currentGamePhase);
          // console.log(scoreAtPhaseStart[currentGamePhase]);

          player1Stats.score++;
          scoreText.text = "Score: " + player1Stats.score;
          // console.log(COLORS[player1Stats.color]);
          var availableColors = COLORS;
          function isNotPlayerColor(value) {
            return value !== COLORS[player1Stats.color];
          }
          var notPlayerColorArr = availableColors.filter(isNotPlayerColor);
          // console.log(notPlayerColorArr);

          var playerColorBarrierIndex = Math.round(Math.random() * (barriersPerSpawn[currentGamePhase] - 1));
          console.log(playerColorBarrierIndex);
          for (var i = 0; i < barriersPerSpawn[currentGamePhase]; i++) {

            if (i === playerColorBarrierIndex) {
              console.log("i " + playerColorBarrierIndex + " color " + COLORS[player1Stats.color]);
              var barrier = new Barrier(COLORS[player1Stats.color], barrierSpawnX, 180 + i * (game.world.height / barriersPerSpawn[0]));
              barrier = barriers.create(barrier.xPos, barrier.yPos, barrier.color);
              barrier.body.gravity.x = -10;
              barrier.body.velocity.x = -barrierBaseVelocity * (1 + barrierVelocityPhaseCoef * currentGamePhase);
              barrier.animations.add("pass", [1], 1, true);
              // } else if (!isSameColorIn) {
                // add in condition to ensure same color isn't chosen more than once.

              } else {
                var n = Math.round(Math.random() * (notPlayerColorArr.length - 1));
                var barrier = new Barrier(notPlayerColorArr[n], barrierSpawnX, 180 + i * (game.world.height / barriersPerSpawn[0]));
                barrier = barriers.create(barrier.xPos, barrier.yPos, barrier.color);
                barrier.body.gravity.x = -10;
                barrier.body.velocity.x = -barrierBaseVelocity * (1 + barrierVelocityPhaseCoef * currentGamePhase);
                barrier.animations.add("pass", [1], 1, true);
              }
            }
          }
      } else {
        console.log(isTimeBufferSufficient);
        if (!isTimeBufferSufficient) {
          if (frame % barrierSpawnStaggerFrames === 0) {
            // PASS THIS TEST 5 TIMES TO CLEAR SCREEN...
            barriersWaited++;
            if (barriersWaited > 4) {
              isTimeBufferSufficient = true;
            }
          }
        } else {
          console.log(isHyperActive);
          if (isHyperActive) {
            //hyperspace game logic
            switchGamePhases(currentGamePhase);
          } else {
            sky.animations.play("unblur");
            isHyperActive = true;
            topGuider.kill();
            bottomGuider.kill();
            topGuider = spaceBounds.create(0, -26, "barihor");
            topGuider.body.immovable = true;
            bottomGuider = spaceBounds.create(0, game.world.height + 1, "barihor");
            bottomGuider.body.immovable = true;
          }
        }
      }
    }


    // PLAYER CONTROLS
    if (cursors.left.isDown) {
      //  Move to the left
      if (keyDash.isDown) {
        player1.body.velocity.x = -PLAYER_BASE_SPEED * DASH_COEF * (1 + currentGamePhase * phaseSpeedCoef);
      } else {
        player1.body.velocity.x = -PLAYER_BASE_SPEED * (1 + currentGamePhase * phaseSpeedCoef);
      }
      if (!isFlickerPlaying) {
        player1.animations.play("lateral" + player1Stats.color);
      }
    } else if (cursors.right.isDown) {
      if (keyDash.isDown) {
        player1.body.velocity.x = PLAYER_BASE_SPEED * DASH_COEF * ((1 + (currentGamePhase * -.5)) * phaseSpeedCoef);
      } else {
        player1.body.velocity.x = PLAYER_BASE_SPEED * ((1 + (currentGamePhase * -.5)) * phaseSpeedCoef);
      }
      if (!isFlickerPlaying) {
        player1.animations.play("lateral" + player1Stats.color);
      }
    } else {
      player1.frame = 0 + player1Stats.color * 6;
    }
    if (cursors.up.isDown) {
      if (keyDash.isDown) {
        player1.body.velocity.y = -PLAYER_BASE_SPEED * DASH_COEF * (1 + currentGamePhase * phaseSpeedCoef * 2);
      } else {
        player1.body.velocity.y = -PLAYER_BASE_SPEED * (1 + currentGamePhase * phaseSpeedCoef * 2);
      }
    } else if (cursors.down.isDown) {
      if (keyDash.isDown) {
        player1.body.velocity.y = PLAYER_BASE_SPEED * DASH_COEF * (1 + currentGamePhase * phaseSpeedCoef * 2);
      } else {
        player1.body.velocity.y = PLAYER_BASE_SPEED * (1 + currentGamePhase * phaseSpeedCoef * 2);
      }
    }


    // TRIGGER FOR GAME PHASE CHANGE
    frame++;
    if ((player1Stats.score - scoreAtPhaseStart[currentGamePhase]) >= ptsBeforePhaseEnd * (1 + phasePtsCoef * currentGamePhase)) {
      if (gamePhaseChangeTotal === noPhaseChangeRequests) {
        console.log("switch!");
        triggerPhaseChange();
      }
    }


  }
}

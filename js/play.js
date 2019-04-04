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
const barriersPerSpawn = 5;
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
var hyperspaceBounds;
// var score = 0;
var scoreText;
var healthText;
var frame = 0;
var isFlickerPlaying = false;
const COLORS = ["red", "orange", "yellow", "green", "blue", "purple"];
var currentGamePhase = 0;
const gamePhaseTitles = ["Open Space", "Hyperspace"];
var scoreAtPhaseStart = [];
var ptsBeforePhaseZeroEnd = 13;
var isHyperspace = false;

var sky;
var blur;

function endGame() {

}

function hyperspaceBegin(sprite, animation) {
  console.log("play zoom");
  sky.animations.play("zoom");
}

function switchGamePhases(gamePhase) {
  if (gamePhase < gamePhaseTitles.length - 1) {
    currentGamePhase++;
  } else {
    currentGamePhase = 0;
  }
  scoreAtPhaseStart[currentGamePhase] = player1Stats.score;
}

var playState = {
  create: function () {
    player1Stats.health = 3;
    player1Stats.score = 0;
    player1Stats.powerupsAvailable = 0;
    player1Stats.powerupsUsed = 0;
    for(i = 0; i < gamePhaseTitles.length; i++){
      scoreAtPhaseStart[i] = 0;
    };
    currentGamePhase = 0;

    this.keyboard = game.input.keyboard;

    console.log();
  	console.log(player1Stats.health);
    console.log("hi");
    console.log("score: " + player1Stats.score);
    //  We"re going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    sky = game.add.sprite(0, 0, "sky");
    sky.animations.add("blur", [1, 2], 2, false);
    sky.animations.add("zoom", [3, 4, 5], 15, true);

    //  The hyperspaceBounds group contains the ground and the 2 ledges we can jump on
    hyperspaceBounds = game.add.group();

    ends = game.add.group();

    //  We will enable physics for any object that is created in this group
    hyperspaceBounds.enableBody = true;

    ends.enableBody = true;

    // game.add.sprite(0, 0, "barrier");


    // NOTE: bring back into the game for hyperspace modec
    // // Here we create the ground.
    // var ground = hyperspaceBounds.create(0, game.world.height - 64, "ground");
    //
    // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // ground.scale.setTo(2, 2);
    //
    // //  This stops it from falling away when you jump on it
    // ground.body.immovable = true;

    ledge = hyperspaceBounds.create(-150, 250, "ground");
    ledge.body.immovable = true;

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

    player1.animations.add("lateral5", [31, 32], 900, true);

    cursors = game.input.keyboard.createCursorKeys();

    keyDash = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    // key1.onDown.add(addPhaserDude, this);

    stars = game.add.group();

    stars.enableBody = true;

    barriers = game.add.group();

    barriers.enableBody = true;

      scoreText = game.add.text(150, 16, "score: " + player1Stats.score, { fontSize: "32px", fill: "#fff" });
      healthText = game.add.text(16, 16, "health: " + player1Stats.health, { fontSize: "32px", fill: "#fff" });
  },
  update: function () {
    player1.body.velocity.x = 0;
    player1.body.velocity.y = 0;

    game.physics.arcade.collide(stars, hyperspaceBounds);

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
      if (cursors.left.isDown) {
        //  Move to the left
        if (keyDash.isDown) {
          player1.body.velocity.x = -350;
        } else {
          player1.body.velocity.x = -250;
        }
        if (!isFlickerPlaying) {
          player1.animations.play("lateral" + player1Stats.color);
        }
      } else if (cursors.right.isDown) {
        //  Move to the right
        if (keyDash.isDown) {
          player1.body.velocity.x = 350;
        } else {
          player1.body.velocity.x = 250;
        }
        if (!isFlickerPlaying) {
          player1.animations.play("lateral" + player1Stats.color);
        }
      } else {
        //  Stay still
        player1.frame = 0 + player1Stats.color * 6;
      }

      if (cursors.up.isDown) {
        if (keyDash.isDown) {
          player1.body.velocity.y = -350;
        } else {
          player1.body.velocity.y = -250;
        }
      } else if (cursors.down.isDown) {
        if (keyDash.isDown) {
          player1.body.velocity.y = 350;
        } else {
          player1.body.velocity.y = 250;
        }
      }

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
        for (var i = 0; i < barriersPerSpawn; i++) {

          if (i === playerColorBarrierIndex) {
            console.log("i " + playerColorBarrierIndex + " color " + COLORS[player1Stats.color]);
            var barrier = new Barrier(COLORS[player1Stats.color], barrierSpawnX, i * (GAME_HEIGHT / barriersPerSpawn));
            barrier = barriers.create(barrier.xPos, barrier.yPos, barrier.color);
            barrier.body.gravity.x = -10;
            barrier.body.velocity.x = -80;
            barrier.animations.add("pass", [1], 200, true);
            // } else if (!isSameColorIn) {
            // add in condition to ensure same color isn't chosen more than once.

          } else {
            var n = Math.round(Math.random() * (notPlayerColorArr.length - 1));
            var barrier = new Barrier(notPlayerColorArr[n], barrierSpawnX, i * (GAME_HEIGHT / barriersPerSpawn));
            barrier = barriers.create(barrier.xPos, barrier.yPos, barrier.color);
            barrier.body.gravity.x = -10;
            barrier.body.velocity.x = -80;
            barrier.animations.add("pass", [1], 2000, true);
          }
        }
      }
      if (player1Stats.score % 25 === 0) {

      }
    } else if (currentGamePhase === 1) {
      // console.log("currentGamePhase is 1");
      if (isHyperspace) {
        //hyperspace game logic

      } else {
        sky.animations.play("blur").onComplete.add(hyperspaceBegin, this);
        isHyperspace = true;
      }

    }
    frame++;
    if ((player1Stats.score - scoreAtPhaseStart[currentGamePhase]) >= ptsBeforePhaseZeroEnd) {
      console.log("switch!");
    	switchGamePhases(currentGamePhase);
    }


  }
}

// the game itself
var game;

var gameOptions = {

    // slices (prizes) placed in the wheel
    slices: 8,

    // prize names, starting from 12 o'clock going clockwise
    slicePrizes: ["A KEY!!!", "50 STARS", "500 STARS", "BAD LUCK!!!", "200 STARS", "100 STARS", "150 STARS", "BAD LUCK!!!"],

    // wheel rotation duration, in milliseconds
    rotationTime: 3000
}

// once the window loads...
window.onload = function() {

    // game configuration object
    var gameConfig = {

        // render type
       type: Phaser.CANVAS,

       // game width, in pixels
       width: 550,

       // game height, in pixels
       height: 550,

       // game background color
       backgroundColor: 0x880044,

       // scenes used by the game
       scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame and scale the game
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

// PlayGame scene
class playGame extends Phaser.Scene{

    // constructor
    constructor(){
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload(){

        // loading assets
        this.load.image("wheel", "wheel.png");
        this.load.image("pin", "pin.png");
    }

    // method to be executed once the scene has been created
    create(){

        // adding the wheel in the middle of the canvas
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");

        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 20, "Spin the wheel", {
            font: "bold 32px Arial",
            align: "center",
            color: "white"
        });

        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
    }

    // function to spin the wheel
    spinWheel(){

        // can we spin the wheel?
        if(this.canSpin){

            // resetting text field
            this.prizeText.setText("");

            // the wheel will spin round from 2 to 4 times. This is just coreography
            var rounds = Phaser.Math.Between(2, 4);

            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 360);

            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            var prize = gameOptions.slices - 1 - Math.floor(degrees / (360 / gameOptions.slices));

            // now the wheel cannot spin because it's already spinning
            this.canSpin = false;

            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // the quadratic easing will simulate friction
            this.tweens.add({

                // adding the wheel to tween targets
                targets: [this.wheel],

                // angle destination
                angle: 360 * rounds + degrees,

                // tween duration
                duration: gameOptions.rotationTime,

                // tween easing
                ease: "Cubic.easeOut",

                // callback scope
                callbackScope: this,

                // function to be executed once the tween has been completed
                onComplete: function(tween){

                    // displaying prize text
                    this.prizeText.setText(gameOptions.slicePrizes[prize]);

                    // player can spin again
                    this.canSpin = true;
                }
            });
        }
    }
}

// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

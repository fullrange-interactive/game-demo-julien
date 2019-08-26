var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game-demo', { preload: preload, create: create });

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    game.load.image('background', '/images/background.jpg');
    game.load.image('ball', '/images/ball.png');
}

function create() {
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    var backgroundImage = game.add.sprite(0, 0, 'background');

    var ball = game.add.sprite(200, 200, 'ball');

    game.physics.enable(ball, Phaser.Physics.ARCADE);

    ball.body.velocity.x = 200;
    ball.body.velocity.y = 200;

    ball.update = ballUpdate;

    ball.inputEnabled = true;
    ball.events.onInputDown.add(ballClick, ball);
}

function ballUpdate() {
    if (this.body.position.y + this.height > game.height) {
        this.body.velocity.y *= -1;
        console.log("Boing!");
    } 
    if (this.body.position.x + this.width > game.width) {
        this.body.velocity.x *= -1;
        console.log("Boing!")
    }
}

function ballClick() {
    this.body.velocity.x *= -1;
}
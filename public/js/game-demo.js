let config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade'
    },
    parent: 'game',
    transparent: true
};

var game = new Phaser.Game(config);

var ball;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    this.load.image('background', '/images/background.jpg');
    this.load.image('ball', '/images/ball.png');
}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    var backgroundImage = this.add.sprite(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);

    ball = this.physics.add.image(200, 200, 'ball');
    ball.setBounce(1);
    ball.setCollideWorldBounds(true);
    ball.body.setVelocity(200, 200);

    ball.setInteractive();
    ball.on('pointerdown', ballClick.bind(ball));
    
    ball.update = ballUpdate.bind(ball);
}

function ballUpdate() {
    if (this.body.position.y + this.height > game.canvas.height) {
        this.body.velocity.y *= -1;
        console.log("Boing!");
    } 
    if (this.body.position.x + this.width > game.canvas.width) {
        this.body.velocity.x *= -1;
        console.log("Boing!")
    }
}

function update() {
    ball.update();
}

function ballClick() {
    this.body.velocity.x *= -1;
}
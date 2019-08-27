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
var posXMouse;
var posYMouse;
var posXBall;
var posYBall;

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
    ball.body.setVelocity(5, 5);

    cursor = this.input.keyboard.createCursorKeys();

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
        console.log("Boing!");
    }
    if (this.body.position.x + this.width < this.width) {
        this.body.velocity.x *= -1;
        console.log("Boing!");
    }
    if (this.body.position.y + this.height < this.height) {
        this.body.velocity.y *= -1;
        console.log("Boing!");
    }


    this.angle +=2;
}

function update() {
    ball.update();

   
}

function ballClick() {
    this.body.velocity.x *= -1;
   
    posXBall= this.body.position.x + this.body.width / 2;
    posYBall = this.body.position.y + this.body.height / 2;
    console.log("posXBall " + posXBall);
    console.log("posYBall " + posYBall);

    var pointer = game.input.activePointer;
    posXMouse = pointer.x;
    posYMouse = pointer.y;
    console.log("PosXMouse " +posXMouse);
    console.log("PosYMouse " +posYMouse);

    if (posXBall < posXMouse && posYBall > posYMouse) { // corner top right
        console.log("cadrant haut droit");
         changevelocity(this.body);
    }
    if (posXBall < posXMouse && posYBall < posYMouse) { // corner bottom right
        console.log("cadrant bas droit");
        changevelocity(this.body);
    }
    if (posXBall > posXMouse && posYBall > posYMouse) { // corner top left
        console.log("cadrant haut gauche");
        changevelocity(this.body);
    }
    if (posXBall > posXMouse && posYBall < posYMouse) { // corner bottom left
        console.log("cadrant bas gauche");
        changevelocity(this.body);
    }
    if (posXBall == posXMouse || posYBall == posYMouse) {  // Middle, nothing happen
        console.log("Au milieu, rien ce se passe");
    }

}

function changevelocity(ball) {
    ball.velocity.x += -1*(posXMouse - posXBall);
    ball.velocity.y += -1*(posYMouse - posYBall);
    
}
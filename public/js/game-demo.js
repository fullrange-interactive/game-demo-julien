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

const ballSpeed = 350;

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
    ball.body.setVelocity(ballSpeed, ballSpeed);

    ball2 = this.physics.add.image(463, 99, 'ball');
    ball2.body.setVelocity(450, 450);

    cursor = this.input.keyboard.createCursorKeys();

    ball.setInteractive();
    ball.on('pointerdown', ballClick.bind(ball));

    ball2.setInteractive();
    ball2.on('pointerdown', ballClick.bind(ball2));
    
    ball.update = ballUpdate.bind(ball);
    ball2.update = ballUpdate.bind(ball2);
}

function ballUpdate() {

    // It checks the ball's position. If it's out border, it brings it back.
    // The speed will remain the same.
    if (this.body.position.y + this.height > game.canvas.height) {
        this.body.velocity.y *= -1;
        this.body.position.y = game.canvas.height - (this.height + 5);
        console.log("bas");
    }
    if (this.body.position.x + this.width > game.canvas.width) {
        this.body.velocity.x *= -1;
        this.body.position.x = game.canvas.width - (this.height + 5);
        console.log("droite");
    }
    if (this.body.position.x + this.width < this.width) {
        this.body.velocity.x *= -1;
        this.body.position.x++;
        console.log("gauche");

    }
    if (this.body.position.y + this.height < this.height) {
        this.body.velocity.y *= -1;
        this.body.position.y++;
        console.log("haut");
        }


    this.angle +=2;
}

function update() {
    ball.update();
    ball2.update();

   
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
    var MBVelocityX = (posXMouse - posXBall); //BSx -> Sx - Bx
    var MBVelocityY = (posYMouse - posYBall); //BSy -> Sy - By
    var vectorX = -1*(MBVelocityX); //Vx -> -Sx + Bx
    var vectorY = -1*(MBVelocityY); //Vy -> -Sy + By
    var lengthVector = Math.sqrt((vectorX*vectorX)+(vectorY*vectorY)); //square root of Vx*Vx + Vy*Vy
    var finalVectorX = vectorX/lengthVector; 
    var finalVectorY = vectorY/lengthVector;
    console.log("finalVectorX " +finalVectorX);
    console.log("finalVectorY " +finalVectorY);
    ball.velocity.x = finalVectorX*ballSpeed;
    ball.velocity.y = finalVectorY*ballSpeed;
   
}

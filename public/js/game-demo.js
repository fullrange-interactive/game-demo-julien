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

const ballSpeed = 100;

var game = new Phaser.Game(config);

var balls;
var newBall;
var ballArray = [];
var ballId = 1;
var posXBall;
var posYBall;

var posXMouse;
var posYMouse;

var scoreText;
var score = 0;

var player;
var posXPlayer;
var posYPlayer;
var rememberX;
var rememberY;

function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    this.load.image('background', '/images/background.jpg');
    this.load.image('ball', '/images/ball.png');
    this.load.image('player', '/images/player.png');
}

function create() {

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen

    var backgroundImage = this.add.sprite(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    
    scoreText = this.add.text(16, 16, 'Score: ' +score, { fontSize: '32px', fill: '#000' });

    let pointer = game.input.activePointer;
    let cursor = this.input.keyboard.createCursorKeys();

    balls = this.physics.add.group({
        key: 'ball',
        setXY: {
            x: 200,
            y: 200,
            stepX: 250,
            stepY: 350
        },
        repeat: 1, 
        velocityX: ballSpeed,
        velocityY: ballSpeed
    });

    let children = balls.getChildren();

    for (let i = 0; i < children.length; i++) {
        children[i].setInteractive();
        children[i].on('pointerdown', ballClick.bind(children[i]));
        ballArray.push(children[i]);
        ballArray[i].setData('ID', ballId);
        ballId++;
    };

    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].update = ballUpdate.bind(ballArray[i]);
    }

    backgroundImage.setInteractive();
    backgroundImage.on('pointerdown', addBall.bind(this));

    player = this.physics.add.sprite(150, 150, 'player');
    player.body.setVelocity(ballSpeed - 50, ballSpeed - 50);
    player.setScale(1.2);

    // This will be useful only the very first time the distance function is entered
    rememberX = 200 - player.body.position.x; // 200 is where the first ball spawn on X
    rememberY = 200 - player.body.position.y; // 200 is where the first ball spawn on Y
    console.log(rememberX);
}

function addBall(world) {

    var pointer = game.input.activePointer;

    newBall = this.physics.add.sprite(pointer.x, pointer.y, 'ball');
    balls.add(newBall);
    newBall.setInteractive();
    newBall.on('pointerdown', ballClick.bind(newBall));
    newBall.body.setVelocity(ballSpeed, ballSpeed);
    ballArray.push(newBall);
    newBall.update = ballUpdate.bind(newBall);
    ballArray[ballArray.length-1].setData('ID', ballId);
    ballId++;
}

function ballUpdate() {
    // It checks the ball's position. If it's out border, it brings it back.
    // The speed will remain the same.

    if(typeof(this.body) === 'undefined')
        return;

    if (this.body.position.y + this.height > game.canvas.height) {
        this.body.position.y = game.canvas.height - (this.height + 5);
        this.body.velocity.y *= -1;
    }
    if (this.body.position.x + this.width > game.canvas.width) {
        this.body.position.x = game.canvas.width - (this.height + 5);
        this.body.velocity.x *= -1;
    }
    if (this.body.position.x + this.width < this.width) {
        this.body.position.x++;
        this.body.velocity.x *= -1;
    
    }
    if (this.body.position.y + this.height < this.height) {
        this.body.position.y += 5;
        this.body.velocity.y *= -1;
    }
    this.angle +=2;
}

function update() {
    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].update();
        distance(ballArray[i], ballArray[i]);
    }
    this.physics.add.collider(balls, balls, ballHit);
}

function distance(ballX, ballY) {
    // If a ball is already deleted when it arrives here
    // we skip this whole function until the next ball comes here
    if(typeof(position) === 'undefined')
    return;

    posXPlayer = player.body.position.x + player.body.width / 2;
    posYPlayer = player.body.position.y + player.body.width / 2;
    var posBallXFollow = ballX.body.position.x + ballX.body.width / 2;
    var posBallYFollow = ballY.body.position.y + ballY.body.width / 2

    var verifX = posBallXFollow - posXPlayer;
    var verifY = posBallYFollow - posYPlayer;

    if (verifX < rememberX || verifY < rememberY) {
        console.log("I'm sure he exists")
    }





}


function ballHit(firstBall, secondBall) {
    score += 50;
    scoreText.setText('Score: ' +score);
    firstBall.destroy();
    secondBall.destroy();
}

function ballClick() {
    this.body.velocity.x *= -1;
   
    posXBall = this.body.position.x + this.body.width / 2;
    posYBall = this.body.position.y + this.body.height / 2;

    let pointer = game.input.activePointer;
    posXMouse = pointer.x;
    posYMouse = pointer.y;
    
    if (posXBall < posXMouse && posYBall > posYMouse) { // corner top right
         changevelocity(this.body);
    }
    if (posXBall < posXMouse && posYBall < posYMouse) { // corner bottom right
        changevelocity(this.body);
    }
    if (posXBall > posXMouse && posYBall > posYMouse) { // corner top left
        changevelocity(this.body);
    }
    if (posXBall > posXMouse && posYBall < posYMouse) { // corner bottom left
        changevelocity(this.body);
    }
    if (posXBall == posXMouse || posYBall == posYMouse) {  // Middle, nothing happen

}

function changevelocity(ball) {
    var MBVelocityX = (posXMouse - posXBall); //BSx -> Sx - Bx
    var MBVelocityY = (posYMouse - posYBall); //BSy -> Sy - By
    var vectorX = -1*(MBVelocityX); //Vx -> -Sx + Bx
    var vectorY = -1*(MBVelocityY); //Vy -> -Sy + By
    var lengthVector = Math.sqrt((vectorX*vectorX)+(vectorY*vectorY)); //square root of Vx*Vx + Vy*Vy
    var finalVectorX = (vectorX/lengthVector)+1; 
    var finalVectorY = (vectorY/lengthVector)+1;

    ball.velocity.x = finalVectorX*ballSpeed+1;
    ball.velocity.y = finalVectorY*ballSpeed+1;
    }
}

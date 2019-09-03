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

var balls;
var newBall;
var ballArray = [];
var posXMouse;
var posYMouse;
var posXBall;
var posYBall;
var scoreText;
var score = 0;


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
    
    scoreText = this.add.text(16, 16, 'Score: ' +score, { fontSize: '32px', fill: '#000' });

    let pointer = game.input.activePointer;
    let cursor = this.input.keyboard.createCursorKeys();

    balls = this.physics.add.group({
        key: 'ball',
        setXY: {
            x: 200,
            y: 200,
            stepX: 25,
            stepY: 75
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
    };
    
    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].update = ballUpdate.bind(ballArray[i]);
    }

    

    backgroundImage.setInteractive();
    backgroundImage.on('pointerdown', addBall.bind(this));
}

function addBall(world) {

    var pointer = game.input.activePointer;
    /* randomSpeedX defines randomly the velocity of newBall.
       When the play add a new ball, it can goes in every direction
       and at any speed
    */ 
    var randomSpeed1 = 0;
    var randomSpeed2 = 0;
    randomSpeed1 = Math.random() * (450 - -150) + -150;
    randomSpeed2 = Math.random() * (450 - -150) + -150;

    while (randomSpeed1 == 0 || randomSpeed2 == 0) {
        randomSpeed1 = Math.random() * (450 - -150) + -150;
        randomSpeed2 = Math.random() * (450 - -150) + -150;
    }

    newBall = this.physics.add.sprite(pointer.x, pointer.y, 'ball');
    balls.add(newBall);
    newBall.setInteractive();
    newBall.on('pointerdown', ballClick.bind(newBall));
    newBall.body.setVelocity(randomSpeed1, randomSpeed2);
    ballArray.push(newBall);
    newBall.update = ballUpdate.bind(newBall);

    console.log(balls);
    console.log(ballArray.length);
}

function ballUpdate() {
    // It checks the ball's position. If it's out border, it brings it back.
    // The speed will remain the same.

    if(typeof(this.body) === 'undefined')
        return;

    let children = balls.getChildren();
    var nbChild = 0;

    for (let i = 0; i < children.length; i++) {
       nbChild++;
    };

    if (nbChild == 0) {
        ballArray = [];
        console.log('Nothing Happen');
    } else {

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
}

function update() {
    for (let i = 0; i < ballArray.length; i++) {
        ballArray[i].update();
    }
    this.physics.add.collider(balls, balls, ballHit);
    
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

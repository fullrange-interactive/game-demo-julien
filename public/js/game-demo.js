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
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    parent: 'game',
    transparent: true
};

const ballSpeed = 350;

var game = new Phaser.Game(config);

var balls;
var newBall;
var ballArray = [];
var ballId = 0;
var posXBall;
var posYBall;

var posXMouse;
var posYMouse;

var scoreText;
var score = 0;

var player;
var posXPlayer;
var posYPlayer;

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

    // Create background and places it
    var backgroundImage = this.add.sprite(0, 0, 'background');
    backgroundImage.setOrigin(0, 0);
    
    // Set the position of the score and show it's value
    scoreText = this.add.text(16, 16, 'Score: ' +score, { fontSize: '32px', fill: '#000' });

    // Allow the player to use the mouse
    let pointer = game.input.activePointer;
    let cursor = this.input.keyboard.createCursorKeys();

    // A group which will contain every ball
    balls = this.physics.add.group({
        key: 'ball',
        setXY: {
            x: 200,
            y: 200,
            stepX: 250,
            stepY: 350
        },
        repeat: 0, 
        velocityX: ballSpeed,
        velocityY: ballSpeed
    });

    let children = balls.getChildren();

    // Initialize all the balls which were created above
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
    
    // The background image is now clickable. It calls the addBall function if clicked
    backgroundImage.setInteractive();
    backgroundImage.on('pointerdown', addBall.bind(this));

    // Create the player and sets it's physics
    player = this.physics.add.sprite(150, 150, 'player');
    player.body.setVelocity(ballSpeed - 50, ballSpeed - 50);
    player.body.setMaxSpeed(ballSpeed - 50);
    player.setScale(1.2);
    player.setBounce(1);
    player.setCollideWorldBounds(true);
}

function addBall(world) {

    var pointer = game.input.activePointer;

    // Create a new ball, puts it in the ballArray and balls group
    // It has the same proprety as the initial balls
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
    var l = ballArray.length
    var shortestDist = null;
    var shortestBall = null;
    for (let i = 0; i < l; i++) {

        // If the ball doesn't exists the rest of the function
        // will not be executed
        if (typeof(ballArray[i].body) === 'undefined'){
            console.log("It stopped");
            continue; // start the for at the next i
        }

        // Update ball
        ballArray[i].update();
        player.update();

        for (let j = 0; j < l; j++) {
            this.physics.add.collider(ballArray[i], ballArray[j], ballHit);
        }

        // Search for the closest ball
        var between = distancePlayerBall(player, ballArray[i]);

        if (shortestDist > between || shortestDist === null) {
            shortestDist = between;
            shortestBall = ballArray[i];
        }
    }

    // Change player's direction when a ball is closer than the last one  
    if (ballArray.length != 0) {
        movePlayer(player, shortestBall); 
    }
     
}

function movePlayer(player, ball) {
    player.body.position.x = ball.body.position.x;
    player.body.position.y = ball.body.position.y;

}

function distancePlayerBall(posPlayer, posBall) {

    // Player's position
    let posPlayerX = posPlayer.body.position.x;
    let posPlayerY = posPlayer.body.position.y;
    
    // Ball's position
    let posBallX = posBall.body.position.x;
    let posBallY = posBall.body.position.y;

    // Distance between the current ball and the player
    let distXPlayerBall = posPlayerX - posBallX;
    let distYPlayerBall = posPlayerY - posBallY;
    let dist = Math.sqrt((distXPlayerBall*distXPlayerBall) + (distYPlayerBall*distYPlayerBall));
    
    return dist;
}


function ballHit(firstBall, secondBall) {
    // Update the score
    score += 50;
    scoreText.setText('Score: ' +score);
 
    // Delete the balls from the ballArray
    ballArray.splice(ballArray.indexOf(firstBall), 1);
    ballArray.splice(ballArray.indexOf(secondBall), 1);
    
    // Delete the balls from the group and the scene
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

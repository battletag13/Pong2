let player, ai, ball;

let downPressed, upPressed;

let width = 1000, height = 500;
let paddleWidth = 40, paddleHeight = 175;
let ballRadius = 25, yVarience = 4, minVarience = 2;
let aiCorrection = 3;
let playerVel = 8;
let aiVel = 7;
let ballVel = 5, ballVelInc = 0.75, maxVel = 50;
let paddleColor, ballColor, backgroundColor;
let aiWins = 0, plrWins = 0;
let rainbowMode = false;

class RectObj
{
	constructor(x, y, width, height)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	draw(isBall = false)
	{
		push();
		fill(paddleColor);
		if (isBall)
			fill(ballColor);
		translate(this.x, this.y);
		rect(0, 0, this.width, this.height);
		pop();
	}
}

class Ball 
{
	constructor(x, y, width, height, velX, velY)
	{
		this.graphics = new RectObj(x, y, width, height);
		this.velX = velX;
		this.velY = velY;
	}

	draw() { this.graphics.draw(true); }
}

function preload() {
	soundFormats('wav', 'mp3');
	plrHitSound = loadSound('playerBounce.wav');
	wallHitSound = loadSound('wallBounce.wav');
  }

function setup()
{
	createCanvas(width, height);
	rectMode(CENTER);
	textAlign(CENTER);
	textSize(30);
	noStroke();
	plrHitSound.setVolume(0.1);
	wallHitSound.setVolume(0.1);
	paddleColor = color(255, 255, 255);
	ballColor = color(255, 255, 255);
	backgroundColor = color(0);
	player = new RectObj(50, height / 2, paddleWidth, paddleHeight);
	ai = new RectObj(width - 50, height / 2, paddleWidth, paddleHeight);
	ball = new Ball(500, height / 2, ballRadius, ballRadius, ballVel, ballVel);
}

function draw()
{
	background(backgroundColor);
	doAI();
	applyForces();
	doCollision();
	drawShapes();
	rect(25, 15, 25, 25);
	rect(width - 25, 15, 25, 25);
	text(plrWins, 25, 25);
	text(aiWins, width - 25, 25);
}

function doAI()
{
	if (ball.graphics.x > width / 3 && ball.velX > 0)
	{
		if (ai.y > ball.graphics.y + aiVel / 2 + aiCorrection)
			ai.y -= aiVel;
		else if (ai.y < ball.graphics.y - aiVel / 2 - aiCorrection)
			ai.y += aiVel;
	}
}

function doCollision()
{
	if (ball.graphics.y < 0 + ball.graphics.height / 2 || ball.graphics.y > height - ball.graphics.height / 2)
	{
		ball.velY = -ball.velY;
		wallHitSound.play();
	}
	if (ball.graphics.x < 0)
	{
		aiWins++;
		resetGame();
	}
	if (ball.graphics.x > width)
	{
		plrWins++;
		resetGame();
	}

	if (ball.graphics.y > player.y - player.height / 2 && ball.graphics.y < player.y + player.height / 2)
		if (ball.graphics.x > player.x - player.width / 2 && ball.graphics.x - ball.graphics.width / 2 < player.x + player.width / 2)
		{
			ball.velX = abs(ball.velX) + ballVelInc;
			ball.velY += random(-yVarience, yVarience);
			if (ball.velY < minVarience && ball.velY > -minVarience)
				ball.velY += random(-yVarience, yVarience);
			if (ball.velY < minVarience && ball.velY > -minVarience)
				ball.velY += random(-yVarience, yVarience);
			if (rainbowMode) { randColor(); };
			plrHitSound.play();
		}
	
	if (ball.graphics.y > ai.y - ai.height / 2 && ball.graphics.y < ai.y + ai.height / 2)
		if (ball.graphics.x + ball.graphics.width / 2 > ai.x - ai.width / 2 && ball.graphics.x < ai.x + ai.width / 2)
		{
			ball.velX = -abs(ball.velX) - ballVelInc;
			ball.velY += random(-yVarience, yVarience);
			if (ball.velY < minVarience && ball.velY > -minVarience)
				ball.velY += random(-yVarience, yVarience);
			if (ball.velY < minVarience && ball.velY > -minVarience)
				ball.velY += random(-yVarience, yVarience);
			if (rainbowMode) { randColor(); };
			plrHitSound.play();
		}

	if (ai.y < ai.height / 2)
		ai.y = ai.height / 2;
	if (ai.y > height - ai.height / 2)
		ai.y = height - ai.height / 2;

	if (player.y < player.height / 2)
		player.y = player.height / 2;
	if (player.y > height - player.height / 2)
		player.y = height - player.height / 2;

	if (ball.velX > maxVel)
		ball.velX = maxVel;
	else if (ball.velX < -maxVel)
		ball.velX = -maxVel;

}

function applyForces()
{
	ball.graphics.x += ball.velX;
	ball.graphics.y += ball.velY;

	if (downPressed)
		player.y = player.y + playerVel;
	if (upPressed)
		player.y -= playerVel;
}

function drawShapes()
{
	player.draw();
	ai.draw();
	ball.draw();
	trail1.draw();
	trail2.draw();
	trail3.draw();
}

function resetGame() { ball = new Ball(500, height / 2, ballRadius, ballRadius, ballVel, ballVel); }

function keyPressed()
{
	if (keyCode == 87 || keyCode === UP_ARROW)
		upPressed = true;
	if (keyCode == 83 || keyCode === DOWN_ARROW)
		downPressed = true;
}

function keyReleased()
{
	if (keyCode == 87 || keyCode === UP_ARROW)
		upPressed = false;
	if (keyCode == 83 || keyCode === DOWN_ARROW)
		downPressed = false;
}

function randColor()
{
	backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
	ballColor = color(random(0, 255), random(0, 255), random(0, 255));
	paddleColor = color(random(0, 255), random(0, 255), random(0, 255));
}


//HTML INTERACTION
let plrSensitivitySlider = document.getElementById('playerSensitivity');
let volumeSlider = document.getElementById('volumeLevel');

function updateVolume()
{
	newVol = parseInt(volumeSlider.value);
	newVol /= 10;
	plrHitSound.setVolume(newVol);
	wallHitSound.setVolume(newVol);
}

function changeColor()
{
	randColor();
}

function rainbowToggle()
{
	rainbowMode = !rainbowMode;
}

function changeDifficulty(newDifficulty)
{
	switch (newDifficulty)
	{
		case "easy":
		aiVel = 10;
		break;
		case "medium":
		aiVel = 12;
		break;
		case "hard":
		aiVel = 14;
		break;
		case "insane":
		aiVel = 17;
		break;
		case "impossible":
		aiVel = 20;
		break;
		default:
		print("easy\nmedium\nhard\ninsane");
		break;
	}
}

function updatePlayerSensitivity()
{
	playerVel = parseInt(plrSensitivitySlider.value)
}
//DEBUG
function SETVEL(newVel)
{
	playerVel = newVel;
}

function SETDIFF(newDiff)
{
	switch (newDiff)
	{
		case "easy":
		aiVel = 4;
		break;
		case "medium":
		aiVel = 4.1;
		break;
		case "hard":
		aiVel = 4.2;
		break;
		case "insane":
		aiVel = 4.3;
		break;
		case "impossible":
		aiVel = 5;
		break;
		default:
		print("easy\nmedium\nhard\ninsane");
		break;
	}
}

function SETACCEL(newAccel)
{
	ballVelInc = newAccel;
}

function PRTDIFF()
{
	print(aiVel);
}

let player, ai, ball;

let downPressed, upPressed;

let width = 1000, height = 500;
let paddleWidth = 40, paddleHeight = 175;
let ballRadius = 25;
let aiCorrection = 10;
let playerVel = 9;
let aiVel = 4;
let ballVel = 5, ballVelInc = 0.75, maxVel = 50;
let paddleColor, ballColor, backgroundColor;
let aiWins = 0, plrWins = 0;

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

	draw()
	{
		this.graphics.draw(true);
	}
}

function setup()
{
	createCanvas(width, height);
	rectMode(CENTER);
	textAlign(CENTER);
	textSize(30);
	noStroke();
	paddleColor = color(255, 255, 255);
	ballColor = color(255, 255, 255);
	backgroundColor = color(0);
	player = new RectObj(50, height / 2, paddleWidth, paddleHeight);
	ai = new RectObj(width - 50, height / 2, paddleWidth, paddleHeight);
	ball = new Ball(500, height / 2, ballRadius, ballRadius, ballVel, ballVel);

	createP("<em>Pong 2 by Matthew Lin</em><br /><br />Pong is one of the earliest arcade games. It was developed by Atari in November 1972 and today is well known as one of the earlies games. <br />The original game featured black and white graphics, but Pong 2, features random color graphics<br />Press v for rainbow mode");
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
	if (ai.y > ball.graphics.y + aiVel + aiCorrection)
		ai.y -= aiVel;
	else if (ai.y < ball.graphics.y - aiVel - aiCorrection)
		ai.y += aiVel;
}

function doCollision()
{
	if (ball.graphics.y < 0 + ball.graphics.height / 2 || ball.graphics.y > height - ball.graphics.height / 2)
		ball.velY = -ball.velY;
	if (ball.graphics.x < 0)
	{
		print("Ai Victory!!!" + ball.velX);
		aiWins++;
		resetGame();
	}
	if (ball.graphics.x > width)
	{
		print("Human Victory!!!\n" + ball.velX);
		plrWins++;
		resetGame();
	}

	if (ball.graphics.y > player.y - player.height / 2 && ball.graphics.y < player.y + player.height / 2)
		if (ball.graphics.x > player.x - player.width / 2 && ball.graphics.x - ball.graphics.width / 2 < player.x + player.width / 2)
		{
			ball.velX = abs(ball.velX) + ballVelInc;
		}
	
	if (ball.graphics.y > ai.y - ai.height / 2 && ball.graphics.y < ai.y + ai.height / 2)
		if (ball.graphics.x + ball.graphics.width / 2 > ai.x - ai.width / 2 && ball.graphics.x < ai.x + ai.width / 2)
		{
			ball.velX = -abs(ball.velX) - ballVelInc;
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
		player.y += playerVel;
	if (upPressed)
		player.y -= playerVel;
}

function drawShapes()
{
	player.draw();
	ai.draw();
	ball.draw();
}

function resetGame()
{
	ball = new Ball(500, height / 2, ballRadius, ballRadius, ballVel, ballVel);
}

function keyPressed()
{
	if (keyCode == 87)
		upPressed = true;
	if (keyCode == 83)
		downPressed = true;
}

function keyReleased()
{
	if (keyCode == 87)
		upPressed = false;
	if (keyCode == 83)
		downPressed = false;
}

function doubleClicked()
{
	backgroundColor = color(random(0, 255), random(0, 255), random(0, 255));
	ballColor = color(random(0, 255), random(0, 255), random(0, 255));
	paddleColor = color(random(0, 255), random(0, 255), random(0, 255));
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
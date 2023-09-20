const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

canvas.addEventListener('mousemove', function(event) {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
    playerY = mouseY;
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(0, playerY, paddleWidth, paddleHeight, 'blue');
    drawRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight, 'red');

    // Draw ball
    drawCircle(ballX, ballY, ballRadius, 'green');

    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collisions with top and bottom walls
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collisions with paddles
    if (
        (ballX - ballRadius < paddleWidth &&
            ballY > playerY &&
            ballY < playerY + paddleHeight) ||
        (ballX + ballRadius > canvas.width - paddleWidth &&
            ballY > computerY &&
            ballY < computerY + paddleHeight)
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds (player scores)
    if (ballX - ballRadius < 0) {
        // Reset ball position
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = 5;
        ballSpeedY = 5;
    }

    // Computer opponent logic (simple tracking)
    const computerYCenter = computerY + paddleHeight / 2;
    if (computerYCenter < ballY - 35) {
        computerY += 5;
    } else if (computerYCenter > ballY + 35) {
        computerY -= 5;
    }
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

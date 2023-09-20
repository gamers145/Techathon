const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerPaddleHeight = 100;
const playerPaddleWidth = 10;
const computerPaddleHeight = 100;
const computerPaddleWidth = 10;
const ballRadius = 10;
const winningScore = 5; // Change this to set the winning score

let playerPaddleY = canvas.height / 2 - playerPaddleHeight / 2;
let computerPaddleY = canvas.height / 2 - computerPaddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let playerScore = 0;
let computerScore = 0;
let gameOver = false;

canvas.addEventListener('mousemove', function(event) {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top - playerPaddleHeight / 2;
    playerPaddleY = mouseY;
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

    if (!gameOver) {
        // Draw paddles
        drawRect(0, playerPaddleY, playerPaddleWidth, playerPaddleHeight, 'blue');
        drawRect(canvas.width - computerPaddleWidth, computerPaddleY, computerPaddleWidth, computerPaddleHeight, 'red');

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
            (ballX - ballRadius < playerPaddleWidth &&
                ballY > playerPaddleY &&
                ballY < playerPaddleY + playerPaddleHeight) ||
            (ballX + ballRadius > canvas.width - computerPaddleWidth &&
                ballY > computerPaddleY &&
                ballY < computerPaddleY + computerPaddleHeight)
        ) {
            ballSpeedX = -ballSpeedX;
        }

        // Ball out of bounds (player scores)
        if (ballX - ballRadius < 0) {
            computerScore++;
            if (computerScore >= winningScore) {
                gameOver = true;
            } else {
                resetBall();
            }
        }

        // Ball out of bounds (computer scores)
        if (ballX + ballRadius > canvas.width) {
            playerScore++;
            if (playerScore >= winningScore) {
                gameOver = true;
            } else {
                resetBall();
            }
        }

        // Computer opponent logic (simple tracking)
        const computerPaddleCenter = computerPaddleY + computerPaddleHeight / 2;
        if (computerPaddleCenter < ballY - 35) {
            computerPaddleY += 5;
        } else if (computerPaddleCenter > ballY + 35) {
            computerPaddleY -= 5;
        }

        // Update the score display
        document.getElementById('playerScore').textContent = playerScore;
        document.getElementById('computerScore').textContent = computerScore;
    } else {
        // Display game over message
        ctx.font = '30px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Game Over', canvas.width / 2 - 75, canvas.height / 2);
    }
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
}

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

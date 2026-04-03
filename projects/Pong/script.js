const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game Constants
const paddleWidth = 12;
const paddleHeight = 100;
const ballRadius = 8;
const initialSpeed = 6;
const WINNING_LIMIT = 7;

// Game State
let gameOver = false;
let winnerText = "";
let gameState = "COUNTDOWN"; 
let countValue = 3;
let countTimer = 0;

// Player Objects
const p1 = { x: 15, y: 200, score: 0, seriesWins: 0, color: "#00ff88" };
const p2 = { x: canvas.width - 27, y: 200, score: 0, seriesWins: 0, color: "#ff0055" };
const ball = { x: 400, y: 250, dx: initialSpeed, dy: initialSpeed };

// Input Handling
const keys = {};
window.addEventListener("keydown", e => {
    keys[e.code] = true;
    if (gameOver && e.code === "Space") startNewMatch();
});
window.addEventListener("keyup", e => keys[e.code] = false);

const winSound = new Audio("assets/winning.mp3");
const blipSound = new Audio("assets/blip.mp3");
blipSound.volume = 0.1;

function resetBall(dir) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = dir * initialSpeed;
    ball.dy = (Math.random() - 0.5) * 10;

    gameState = "PLAYING";
    countValue = 3;
    countTimer = 0;
}

function startNewMatch() {
    p1.score = 0;
    p2.score = 0;
    document.getElementById('p1-match').innerText = "0";
    document.getElementById('p2-match').innerText = "0";
    gameOver = false;
    resetBall(1);

    gameState = "COUNTDOWN";
    countValue = 3;
    countTimer = 0;
}

function checkCollision(b, p) {
    return b.x + ballRadius > p.x && 
           b.x - ballRadius < p.x + paddleWidth &&
           b.y + ballRadius > p.y && 
           b.y - ballRadius < p.y + paddleHeight;
}

function updateCountdown() {
    countTimer++;
    if (countTimer % 60 === 0) {
        countValue--;
    }
    if (countValue <= 0) {
        gameState = "PLAYING";
    }
}

function endGame(txt) {
    gameOver = true;
    winnerText = txt;
    winSound.play();
}

function update() {
    // 1. Check if game is over
    if (gameOver) {
        draw(); // Keep drawing the "Win" screen
        requestAnimationFrame(update);
        return;
    }

    // 2. Handle Countdown
    if (gameState === "COUNTDOWN") {
        updateCountdown();
    } 
    // 3. Handle Active Gameplay
    else if (gameState === "PLAYING") {
        // Paddle Movement
        if (keys['KeyW'] && p1.y > 0) p1.y -= 9;
        if (keys['KeyS'] && p1.y < canvas.height - paddleHeight) p1.y += 9;
        if (keys['ArrowUp'] && p2.y > 0) p2.y -= 9;
        if (keys['ArrowDown'] && p2.y < canvas.height - paddleHeight) p2.y += 9;

        // Ball Physics
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ceiling/Floor Bounce
        if (ball.y + ballRadius > canvas.height || ball.y - ballRadius < 0) {
            blipSound.currentTime = 0; // Reset sound to start
            blipSound.play();
            ball.dy *= -1;
        }

        // Collision Detection
        let player = (ball.dx < 0) ? p1 : p2;
        if (checkCollision(ball, player)) {
            blipSound.currentTime = 0;
            blipSound.play();
            
            let collidePoint = (ball.y - (player.y + paddleHeight/2)) / (paddleHeight/2);
            let angle = (Math.PI/4) * collidePoint;
            let dir = (ball.dx < 0) ? 1 : -1;
            let speed = Math.abs(ball.dx) + 1.1; 

            ball.dx = dir * Math.cos(angle) * speed;
            ball.dy = Math.sin(angle) * speed;
            ball.x = (dir === 1) ? p1.x + paddleWidth + ballRadius : p2.x - ballRadius;
        }

        // Scoring Logic
        if (ball.x < 0) {
            p2.score++;
            document.getElementById('p2-match').innerText = p2.score;
            if (p2.score >= WINNING_LIMIT) {
                p2.seriesWins++;
                document.getElementById('p2-series').innerText = p2.seriesWins;
                endGame("PLAYER 2 WINS THE MATCH");
            } else resetBall(1);
        } else if (ball.x > canvas.width) {
            p1.score++;
            document.getElementById('p1-match').innerText = p1.score;
            if (p1.score >= WINNING_LIMIT) {
                p1.seriesWins++;
                document.getElementById('p1-series').innerText = p1.seriesWins;
                endGame("PLAYER 1 WINS THE MATCH");
            } else resetBall(-1);
        }
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    // Clear Canvas
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Mid-line
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.setLineDash([10, 20]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0); 
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.shadowBlur = 15;
    
    // Draw Players
    ctx.fillStyle = p1.color; ctx.shadowColor = p1.color;
    ctx.fillRect(p1.x, p1.y, paddleWidth, paddleHeight);

    ctx.fillStyle = p2.color; ctx.shadowColor = p2.color;
    ctx.fillRect(p2.x, p2.y, paddleWidth, paddleHeight);

    // Draw Ball
    ctx.fillStyle = "#fff"; ctx.shadowColor = "#fff";
    ctx.beginPath(); 
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI*2); 
    ctx.fill();
    ctx.shadowBlur = 0;

    // UI Overlays
    if (gameState === "COUNTDOWN") {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 100px Courier New";
        ctx.textAlign = "center";
        ctx.fillText(countValue, canvas.width/2, canvas.height/2 + 30);
    }

    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.85)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = "bold 35px Courier New";
        ctx.fillText(winnerText, canvas.width/2, canvas.height/2 - 20);
        ctx.font = "18px Courier New";
        ctx.fillText("PRESS SPACE FOR THE NEXT MATCH", canvas.width/2, canvas.height/2 + 40);
    }
}

startNewMatch();
update();
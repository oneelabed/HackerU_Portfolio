// Game configuration and dimensions
const ROWS = 6;
const COLS = 7;

// Game state variables
let currentPlayer = 1; // 1 for Red, 2 for Yellow
let board = []; // 0: empty, 1: Red, 2: Yellow
let gameActive = true;
let scores = JSON.parse(sessionStorage.getItem('four_in_line_scores')) || { p1: 0, p2: 0 };
let isVsComputer = false;
let isProcessing = false; // Prevents overlapping moves/clicks

// Toggle between Player vs Player and Player vs Computer
document.getElementById('vs-computer-toggle').addEventListener('change', (e) => {
    isVsComputer = e.target.checked;
    resetGame();
});

// Audio effects
const dropSound = new Audio('assets/click.mp3');
const winSound = new Audio('assets/winning.mp3');

// DOM elements
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');

// Initialize the board grid and reset variables
function initGame() {
    updateScoreboardUI();
    boardElement.innerHTML = '';
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    gameActive = true;
    currentPlayer = 1;
    statusElement.innerText = "Player 1's Turn (Red)";

    // Create grid cells and add click listeners
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => handleMove(c));
            boardElement.appendChild(cell);
        }
    }
}

// Logic for dropping a piece into a column
function handleMove(col) {
    // Stop if game is over or computer is currently "thinking"
    if (!gameActive || (isVsComputer && isProcessing)) return;

    // Find the lowest available row in the selected column
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
            if (isVsComputer) 
                isProcessing = true; // Lock the board for AI turn

            board[r][col] = currentPlayer;
            updateUI();
            
            dropSound.currentTime = 0.2; // Skip silence at start of file
            dropSound.play();

            // Check if this move wins the game
            if (checkWin(r, col)) {
                if (currentPlayer === 1) 
                    scores.p1++;
                else 
                    scores.p2++;

                sessionStorage.setItem('four_in_line_scores', JSON.stringify(scores));
                updateScoreboardUI();

                setTimeout(() => {
                    winSound.play();
                    statusElement.innerText = `Player ${currentPlayer} Wins! 🎉`;
                }, 600);

                gameActive = false;
                isProcessing = false;
            } else if (board.flat().every(cell => cell !== 0)) {
                // Check for a full board (Draw)
                statusElement.innerText = "It's a Draw!";
                gameActive = false;
                isProcessing = false;
            } else {
                // Switch players
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                statusElement.innerText = `Player ${currentPlayer}'s Turn (${currentPlayer === 1 ? 'Red' : 'Yellow'})`;
                
                // Trigger computer move if applicable
                if (isVsComputer && currentPlayer === 2) {
                    makeComputerMove();
                }
                else {
                    isProcessing = false; // Unlock board for next human
                }
            }
            break;
        }
    }
}

// Simple AI logic: Picks a random available column
function makeComputerMove() {
    if (!gameActive || currentPlayer !== 2) return;

    const validCols = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === 0) {
            validCols.push(c);
        }
    }

    if (validCols.length > 0) {
        const randomIndex = Math.floor(Math.random() * validCols.length);
        const randomCol = validCols[randomIndex];

        // Delay move so it feels like the computer is "thinking"
        setTimeout(() => {
            isProcessing = false; // Open gate for handleMove
            handleMove(randomCol);
        }, 800);
    }
}

// Synchronizes the visual board with the internal data array
function updateUI() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const r = cell.dataset.row;
        const c = cell.dataset.col;
        if (board[r][c] === 1) 
            cell.classList.add('p1');
        if (board[r][c] === 2) 
            cell.classList.add('p2');
    });
}

// Algorithm to check horizontal, vertical, and diagonal lines
function checkWin(r, c) {
    const directions = [
        [[0, 1], [0, -1]], // Horizontal
        [[1, 0], [-1, 0]], // Vertical
        [[1, 1], [-1, -1]], // Diagonal \
        [[1, -1], [-1, 1]]  // Diagonal /
    ];

    return directions.some(dir => {
        let count = 1;
        dir.forEach(([dr, dc]) => {
            let nr = r + dr;
            let nc = c + dc;
            // Search in both directions of the axis for matching pieces
            while (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc] === currentPlayer) {
                count++;
                nr += dr;
                nc += dc;
            }
        });
        return count >= 4;
    });
}

function resetGame() {
    initGame();
}

// Display current scores from storage
function updateScoreboardUI() {
    document.getElementById('p1-score').innerText = scores.p1;
    document.getElementById('p2-score').innerText = scores.p2;
}

// Wipe scores and storage
function resetScoreboard() {
    scores = { p1: 0, p2: 0 };
    sessionStorage.setItem('four_in_line_scores', JSON.stringify(scores));
    updateScoreboardUI();
}

// Start the app
initGame();
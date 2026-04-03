const gridElement = document.getElementById('grid');
let boardNumberEasy = 0;
let boardNumberMedium = 0;
let boardNumberHard = 0;

let timerInterval = null;
let timeLeft = 0;

const timeLimits = {
    easy: 600 ,
    medium: 1200,
    hard: 2400
};

// Sound for when the user types a number
const typeSound = new Audio('assets/type.mp3');
typeSound.volume = 0.2;
// Sound for a victory
const winSound = new Audio('assets/winning.mp3');
// Sound for an error
const errorSound = new Audio('assets/error.mp3');
errorSound.volume = 0.5;
errorSound.currentTime = 0.2;

const sudokuLibrary = {
    easy: [
        [
            0,0,3,0,2,0,6,0,0,
            9,0,0,3,0,5,0,0,1,
            0,0,1,8,0,6,4,0,0,
            0,0,8,1,0,2,9,0,0,
            7,0,0,0,0,0,0,0,8,
            0,0,6,7,0,8,2,0,0,
            0,0,2,6,0,9,5,0,0,
            8,0,0,2,0,3,0,0,9,
            0,0,5,0,1,0,3,0,0
        ],
        [
            2,0,0,0,8,0,3,0,0,
            0,6,0,0,7,0,0,8,4,
            0,3,0,5,0,0,2,0,9,
            0,0,0,1,0,5,4,0,8,
            0,0,0,0,0,0,0,0,0,
            4,0,2,7,0,6,0,0,0,
            3,0,1,0,0,7,0,4,0,
            7,2,0,0,4,0,0,6,0,
            0,0,4,0,1,0,0,0,3
        ],
        [
            0,0,0,2,6,0,7,0,1,
            6,8,0,0,7,0,0,9,0,
            1,9,0,0,0,4,5,0,0,
            8,2,0,1,0,0,0,4,0,
            0,0,4,6,0,2,9,0,0,
            0,5,0,0,0,3,0,2,8,
            0,0,9,3,0,0,0,7,4,
            0,4,0,0,5,0,0,3,6,
            7,0,3,0,1,8,0,0,0
        ],
        [
            1,0,0,4,8,9,0,0,6,
            7,3,0,0,0,0,0,4,0,
            0,0,0,0,0,1,2,9,5,
            0,0,7,1,2,0,6,0,0,
            5,0,0,7,0,3,0,0,8,
            0,0,6,0,9,5,7,0,0,
            9,1,4,6,0,0,0,0,0,
            0,2,0,0,0,0,0,3,7,
            8,0,0,5,1,2,0,0,4
        ]
    ],
    medium: [
        [
            0,0,0,0,0,0,0,8,0,
            8,0,0,7,0,1,0,4,0,
            0,4,0,0,2,0,0,3,0,
            3,7,4,0,0,0,9,0,0,
            0,0,0,3,0,5,0,0,0,
            0,0,5,0,0,0,3,2,1,
            0,1,0,0,6,0,0,5,0,
            0,5,0,8,0,2,0,0,6,
            0,8,0,0,0,0,0,0,0
        ],
        [
            0,0,0,6,0,0,0,0,0,
            4,0,0,0,5,0,0,0,1,
            0,0,2,0,0,4,5,6,0,
            0,3,0,0,0,0,2,5,0,
            8,0,1,0,0,0,3,0,4,
            0,4,6,0,0,0,0,9,0,
            0,1,9,7,0,0,8,0,0,
            2,0,0,0,8,0,0,0,5,
            0,0,0,0,0,3,0,0,0
        ],
        [
            0,0,0,2,0,0,0,6,3,
            3,0,0,0,0,5,4,0,1,
            0,0,1,0,0,3,9,8,0,
            4,0,0,0,0,0,0,9,7,
            0,0,0,5,3,8,0,0,2,
            0,6,8,0,0,0,0,0,5,
            0,2,6,3,0,0,5,0,0,
            5,0,3,7,0,0,0,0,8,
            4,7,0,0,0,1,0,0,3
        ]
    ],
    hard: [
        [
            0,0,0,0,0,1,0,0,2,
            0,0,0,0,0,0,6,0,4,
            0,0,0,2,0,4,0,0,0,
            8,0,9,0,0,0,1,0,0,
            0,6,0,0,0,0,0,5,0,
            7,0,2,0,0,0,4,0,9,
            0,0,0,5,0,9,0,0,0,
            9,0,4,0,8,0,7,0,0,
            6,0,0,1,0,0,0,0,5
        ],
        [
            0,0,0,6,0,0,4,0,0,
            7,0,0,0,0,3,6,0,0,
            0,0,0,0,9,1,0,8,0,
            0,0,0,0,0,0,0,0,0,
            0,5,0,1,8,0,0,0,3,
            0,0,0,3,0,6,0,4,5,
            0,4,0,2,0,0,0,6,0,
            9,0,3,0,0,0,0,0,0,
            0,2,0,0,0,0,1,0,0
        ],
        [
            0,0,4,0,0,0,0,1,2,
            9,0,0,0,3,5,0,0,0,
            0,0,0,6,0,1,0,7,0,
            7,2,0,0,0,0,3,0,0,
            0,0,0,4,0,0,8,5,0,
            1,0,3,0,0,0,0,0,0,
            6,0,0,1,2,0,0,0,0,
            0,8,0,0,0,0,1,4,0,
            0,5,0,0,7,0,6,0,0
        ]
    ]
};

function createBoard(puzzleArray) {
    gridElement.innerHTML = '';
    puzzleArray.forEach((num) => {
        const input = document.createElement('input');
        input.type = 'number';
        
        // Ensure only numbers 1-9 are entered
        input.oninput = function() {
            typeSound.play()
            if (this.value.length > 1) this.value = this.value.slice(0, 1);
            if (this.value < 1) this.value = '';
        };

        if (num !== 0) {
            input.value = num;
            input.readOnly = true;
            input.classList.add('fixed');
        } else {
            input.classList.add('user-input');
        }
        gridElement.appendChild(input);
    });
}

function checkSolution() {
    const inputs = document.querySelectorAll('#grid input');
    const flatValues = Array.from(inputs).map(input => parseInt(input.value) || 0);

    if (flatValues.includes(0)) {
        alert("The board is incomplete!");
        return;
    }

    // Convert flat array to 2D 9x9 array for validation
    const board2D = [];
    const tempCopy = [...flatValues];
    while(tempCopy.length) board2D.push(tempCopy.splice(0, 9));

    if (validateSudoku(board2D)) {
        setTimeout(() => {
            winSound.play();
            alert("🎉 Perfect! You solved it!");
        }, 100)
        
        stopTimer();
    } else {
        errorSound.play();
        setTimeout(() => {
            
            alert("❌ There are errors. Check your rows, columns, or squares!");
        }, 100);
    }
}

function validateSudoku(board) {
    for (let i = 0; i < 9; i++) {
        let rowSet = new Set(), colSet = new Set(), boxSet = new Set();
        for (let j = 0; j < 9; j++) {
            let rowVal = board[i][j];
            let colVal = board[j][i];
            
            // Box logic: calculates the 3x3 square coordinates
            let boxRow = 3 * Math.floor(i / 3) + Math.floor(j / 3);
            let boxCol = 3 * (i % 3) + (j % 3);
            let boxVal = board[boxRow][boxCol];

            if (rowSet.has(rowVal)) return false; rowSet.add(rowVal);
            if (colSet.has(colVal)) return false; colSet.add(colVal);
            if (boxSet.has(boxVal)) return false; boxSet.add(boxVal);
        }
    }
    return true;
}

function newGame() {
    const difficulty = document.getElementById('difficultySelect').value;
    const puzzles = sudokuLibrary[difficulty];
    
    // Pick a random puzzle from the chosen difficulty
    switch (difficulty) {
        case "easy":
            boardNumberEasy = boardNumberEasy === 3 ? 0 : boardNumberEasy + 1;
            createBoard(puzzles[boardNumberEasy]);
            break;
        case "medium":
            boardNumberMedium = boardNumberMedium === 2 ? 0 : boardNumberMedium + 1;
            createBoard(puzzles[boardNumberMedium]);
            break;
        case "hard":
            boardNumberHard = boardNumberHard === 2 ? 0 : boardNumberHard + 1;
            createBoard(puzzles[boardNumberHard]);
            break;
    }
    
    startTimer();
}

function startTimer() {
    const diff = document.getElementById('difficultySelect').value;
    
    timeLeft = timeLimits[diff];

    if (timerInterval) clearInterval(timerInterval);
    
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            setTimeout(() => {
                gameOver();
            }, 1)
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const displayMins = minutes.toString().padStart(2, '0');
    const displaySecs = seconds.toString().padStart(2, '0');
    
    const timerElement = document.getElementById('timer');
    timerElement.innerText = `${displayMins}:${displaySecs}`;

    if (timeLeft < 60) {
        timerElement.style.color = "red";
    } else {
        timerElement.style.color = "#333";
    }
}

function stopTimer() {
    clearInterval(timerInterval);
}

function gameOver() {
    clearInterval(timerInterval);
    alert("⌛ Time's up! Game Over.");
    const inputs = document.querySelectorAll('#grid input');
    inputs.forEach(input => input.readOnly = true);
}

newGame();
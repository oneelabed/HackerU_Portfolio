const board = Array.from(document.getElementsByClassName("cell"));
let boardStr = [
        '','','',
        '','','',
        '','',''
    ];

let turn = true;
let moveCount = 0;
let lockBoard = false;

// Sound for when the piece hits the bottom
const clickSound = new Audio('assets/click.mp3');
// Sound for a victory
const winSound = new Audio('assets/winning.mp3');

let scoreX = 0;
let scoreO = 0;
const xScoreDisplay = document.getElementById('x-score');
const oScoreDisplay = document.getElementById('o-score');

const gameResult = document.getElementById('result');

board.forEach((element, index) => {
    element.addEventListener('click', () => {
        if (element.innerHTML === "" && !lockBoard) {
            makeMove(element, index)

            setTimeout(() => {
                if (hasWon('X')) 
                    gameWon('X');
                else if (hasWon('O'))
                    gameWon('O')
                else if (moveCount === 9) {
                    gameResult.innerText = 'Tie!';
                    lockBoard = true;
                }
            }, 50);
        }
    })
});

const clearBtn = document.getElementById("clear")

clearBtn.addEventListener('click', () => {
    clearBoard();
})

function makeMove(button, index) {
    if (lockBoard) 
        return;

    button.innerHTML = turn ? "X" : "O";
    console.log(button.innerHTML + " on cell " + (index + 1))
    boardStr[index] = button.innerHTML;
    turn = !turn;
    moveCount++;
    gameResult.innerText = 'Player ' + (turn ? 'X' : 'O') + ' turn';
    clickSound.currentTime = 0.2
    clickSound.play()
}

function hasWon(letter) {
    // check rows
    if (boardStr[0] == letter && boardStr[1] == letter && boardStr[2] == letter) 
        return true;

    if (boardStr[3] == letter && boardStr[4] == letter && boardStr[5] == letter) 
        return true;

    if (boardStr[6] == letter && boardStr[7] == letter && boardStr[8] == letter) 
        return true;

    // check columns
    if (boardStr[0] == letter && boardStr[3] == letter && boardStr[6] == letter) 
        return true;

    if (boardStr[1] == letter && boardStr[4] == letter && boardStr[7] == letter) 
        return true;

    if (boardStr[2] == letter && boardStr[5] == letter && boardStr[8] == letter) 
        return true;

    // check diagonals
    if (boardStr[0] == letter && boardStr[4] == letter && boardStr[8] == letter) 
        return true;

    if (boardStr[2] == letter && boardStr[4] == letter && boardStr[6] == letter) 
        return true;

    return false;
}

function gameWon(letter) {
    if (letter === 'X') {
        scoreX++;
        xScoreDisplay.innerText = scoreX;
    } else {
        scoreO++;
        oScoreDisplay.innerText = scoreO;
    }

    lockBoard = true;

    setTimeout(() => {
        winSound.play();
        gameResult.innerText = letter + ' Won!';
    }, 100);
}

function clearBoard() {
    board.forEach(element => {
        element.innerHTML = '';
    boardStr.fill('');
    });

    moveCount = 0;
    turn = true;
    gameResult.innerText = 'Player X turn';
    lockBoard = false;
}
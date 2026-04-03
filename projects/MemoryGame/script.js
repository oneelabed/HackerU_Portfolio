const board = document.getElementById('game-board');
const icons = [
    '🔥', '🚀', '💻', '🎨', '🍕', '🌈', '🍦', '🎲', '🎸', '👾', '💎', '👻',
    '🦊', '🐳', '🍀', '🍄', '🌍', '⚡', '🏹', '🧪', '🪐', '⚓', '👑', '🏀'
];

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let currentPairs = 0;
let matchedPairs = 0;

let movesCount = document.getElementById("moves");
const diffSelect = document.getElementById('difficulty-select');

const difficulties = {
    easy: { cols: 4, pairs: 6, maxMoves: 12 },
    medium: { cols: 6, pairs: 12, maxMoves: 30 },
    hard: { cols: 8, pairs: 24, maxMoves: 70 }
};

let moveLimit = 0;

const gameResult = document.getElementById("result");

const clickSound = new Audio("assets/click.mp3");
const winSound = new Audio('assets/winning.mp3');
const losingSound = new Audio('assets/losing.mp3');
losingSound.volume = 0.6;

function startNewGame() {
    const level = diffSelect.value;
    const settings = difficulties[level];
    
    gameResult.innerText = 'You only have ' + settings.maxMoves + ' moves!';

    resetVariables(); 
    matchedPairs = 0;
    currentPairs = settings.pairs;
    moveLimit = settings.maxMoves;

    movesCount.innerText = "0";
    board.innerHTML = '';

    board.style.gridTemplateColumns = `repeat(${settings.cols}, 1fr)`;

    const gameIcons = prepareIcons(settings.pairs);
    createBoard(gameIcons);
}

function prepareIcons(pairCount) {
    let selected = icons.slice(0, pairCount);
    let doubled = [...selected, ...selected];
    return doubled.sort(() => 0.5 - Math.random());
}

function createBoard(iconsToRender) {
    iconsToRender.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.dataset.icon = icon;
        card.innerHTML = `
            <div class="front-face">${icon}</div>
            <div class="back-face"></div>
        `;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    clickSound.currentTime = 0.2
    clickSound.play()

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const currentMoves = parseInt(movesCount.innerText) + 1;
    
    setTimeout(() => {
        movesCount.innerText = String(currentMoves);
    }, 400)

    let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
    
    if (isMatch) {
        matchedPairs++;
        disableCards();

        if (matchedPairs === currentPairs) {
            lockBoard = true;
            setTimeout(() => {
                winSound.play();
                gameResult.innerText = '🎉 VICTORY! You cleared the board!';
            }, 500);    
            return;
        }
    } else {
        unflipCards();
    }

    if (currentMoves >= moveLimit && matchedPairs < currentPairs) {
        lockBoard = true;
        setTimeout(() => {
            losingSound.play();
            gameResult.innerText = `💀 GAME OVER! You reached the limit of ${moveLimit} moves.`;
        })
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetVariables();
}

function unflipCards() {
    lockBoard = true;

    const card1 = firstCard;
    const card2 = secondCard;
    
    setTimeout(() => {
        const isGameOver = parseInt(movesCount.innerText) >= moveLimit || matchedPairs === currentPairs;

        if (card1 && card2) {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
        }
        
        if (!isGameOver) {
            resetVariables();
        } else {
            // If game is over, only clear the card references but keep lockBoard true
            [firstCard, secondCard] = [null, null];
            hasFlippedCard = false;
        }
    }, 1000);
}

function resetVariables() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

startNewGame();
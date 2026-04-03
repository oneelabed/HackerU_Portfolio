const SUITS = ['♠', '♥', '♣', '♦'];
const VALUES = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const VAL_MAP = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14};

let playerDeck = [], cpuDeck = [], pot = [];
let isBusy = false;

const table = document.getElementById('game-table');
const message = document.getElementById('message');
const dealBtn = document.getElementById('deal-btn');
const origin = document.getElementById('deck-origin');

const flipSound = new Audio('assets/flipcard.mp3')
flipSound.volume = 0.2;
const shufflingSound = new Audio('assets/cards-shuffling.mp3')
shufflingSound.volume = 0.05;
const winningSound = new Audio('assets/winning.mp3')
const losingSound = new Audio('assets/losing.mp3')

// Initial setup
function init() {
    for(let i=0; i<6; i++) {
        const c = document.createElement('div');
        c.className = 'card back';
        c.style.left = `${i}px`; c.style.top = `${i}px`;
        origin.appendChild(c);
    }
}
init();

dealBtn.onclick = async () => {
    dealBtn.classList.add('hidden');
    let deck = SUITS.flatMap(s => VALUES.map(v => ({s, v, n: VAL_MAP[v]})));
    deck.sort(() => Math.random() - 0.5);
    
    playerDeck = deck.slice(0, 26);
    cpuDeck = deck.slice(26, 52);

    shufflingSound.currentTime = 1.6;
    shufflingSound.play();

    await splitSimultaneous();
    
    message.innerText = "Click your deck to play";
    document.getElementById('player-deck-slot').classList.add('clickable', 'has-cards');
    document.getElementById('cpu-deck-slot').classList.add('has-cards');
    document.getElementById('player-deck-slot').onclick = async () => {
        if (isBusy) return;
        isBusy = true; // Lock it here
        
        await playRound();
        
        // Only unlock after everything (including potential Wars) is finished
        isBusy = false; 
        updateUI();
    };
};

// Simultaneous splitting animation
async function splitSimultaneous() {
    message.innerText = "Dealing cards...";
    origin.innerHTML = '';
    const originRect = origin.getBoundingClientRect();

    for (let i = 0; i < 26; i++) {
        // Create 2 cards at once
        const pCard = createDealtCard(originRect);
        const cCard = createDealtCard(originRect);

        const pTarget = document.getElementById('player-deck-slot').getBoundingClientRect();
        const cTarget = document.getElementById('cpu-deck-slot').getBoundingClientRect();

        // Animate both at the same time
        setTimeout(() => {
            pCard.style.left = `${pTarget.left}px`; pCard.style.top = `${pTarget.top}px`;
            cCard.style.left = `${cTarget.left}px`; cCard.style.top = `${cTarget.top}px`;
            pCard.style.opacity = '0'; cCard.style.opacity = '0';
        }, 50);

        setTimeout(() => { pCard.remove(); cCard.remove(); }, 600);
        await sleep(40); // Controls the speed of the "stream" of cards
    }
    updateUI();
}

function createDealtCard(rect) {
    const card = document.createElement('div');
    card.className = 'card back';
    card.style.left = `${rect.left}px`;
    card.style.top = `${rect.top}px`;
    table.appendChild(card);
    return card;
}

async function playRound() {
    if (playerDeck.length === 0 || cpuDeck.length === 0) {
        checkWinner();
        return;
    }

    // Audio feedback
    flipSound.play();

    // Logic: Pull the top cards and add to the current pot
    const pCard = playerDeck.shift();
    const cCard = cpuDeck.shift();
    pot.push(pCard, cCard);

    // UI: Create the card elements in the DOM
    const pEl = createCardUI(pCard);
    const cEl = createCardUI(cCard);

    // Animation: Slide both cards to the center simultaneously
    await Promise.all([
        animateMove(pEl, 'player-deck-slot', 'player-play-zone'),
        animateMove(cEl, 'cpu-deck-slot', 'cpu-play-zone')
    ]);

    // Pause: Let the user actually see the values
    await sleep(600);

    // Comparison Logic
    if (pCard.n > cCard.n) {
        await resolveRound("You win the hand!", 'player-deck-slot');
    } else if (cCard.n > pCard.n) {
        await resolveRound("Bill wins the hand!", 'cpu-deck-slot');
    } else {
        await handleWar();
    }
}

async function handleWar() {
    message.innerText = "WAR!";
    table.classList.add('war-mode');
    document.getElementById('war-overlay').classList.remove('hidden');
    await sleep(1000);
    document.getElementById('war-overlay').classList.add('hidden');

    const pWarCards = Math.min(playerDeck.length - 1, 3);
    const cWarCards = Math.min(cpuDeck.length - 1, 3);

    // If a player is completely out before playing a decider, they lose
    if (playerDeck.length === 0 || cpuDeck.length === 0) {
        checkWinner();
        return;
    }

    for(let i = 0; i < Math.max(pWarCards, cWarCards); i++) {
        const p = playerDeck.shift(); 
        const c = cpuDeck.shift();
        if (p) pot.push(p);
        if (c) pot.push(c);
        
        // Visuals for hidden cards
        if (p) animateMove(createCardUI(p, true), 'player-deck-slot', 'player-play-zone', (i+1)*12);
        if (c) animateMove(createCardUI(c, true), 'cpu-deck-slot', 'cpu-play-zone', (i+1)*12);
        await sleep(300);
    }
    await playRound();
}

async function resolveRound(msg, winId) {
    message.innerText = msg;
    await sleep(800);
    const cards = document.querySelectorAll('.card');
    const target = document.getElementById(winId).getBoundingClientRect();

    cards.forEach(c => {
        c.style.left = `${target.left}px`;
        c.style.top = `${target.top}px`;
        c.style.opacity = '0';
    });

    await sleep(600);
    cards.forEach(c => c.remove());
    
    const winner = winId.includes('player') ? playerDeck : cpuDeck;
    
    pot.sort(() => Math.random() - 0.5); 
    
    winner.push(...pot);
    pot = [];
    table.classList.remove('war-mode');

    checkWinner();
}

function createCardUI(card, isBack = false) {
    const div = document.createElement('div');
    div.className = `card ${isBack ? 'back' : ''} ${(card.s==='♥'||card.s==='♦') ? 'red' : ''}`;
    if (!isBack) div.innerHTML = `<div>${card.v}</div><div>${card.s}</div>`;
    table.appendChild(div);
    return div;
}

async function animateMove(el, fromId, toId, offset = 0) {
    const from = document.getElementById(fromId).getBoundingClientRect();
    const to = document.getElementById(toId).getBoundingClientRect();
    el.style.left = `${from.left}px`; el.style.top = `${from.top}px`;
    await sleep(50);
    el.style.left = `${to.left + offset}px`; el.style.top = `${to.top}px`;
}

function updateUI() {
    document.getElementById('player-count').innerText = playerDeck.length;
    document.getElementById('cpu-count').innerText = cpuDeck.length;
}

function checkWinner() {
    if (playerDeck.length === 0) {
        message.innerText = "GAME OVER: Bill takes the glory!";
        document.getElementById('player-deck-slot').classList.remove('has-cards');
        losingSound.play();
    } else if (cpuDeck.length === 0) {
        message.innerText = "VICTORY: You defeated Bill!";
        document.getElementById('cpu-deck-slot').classList.remove('has-cards');
        winningSound.play();
    }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
// Initialize Audio
const suspenseMusic = new Audio('assets/suspense.mp3');
const revealSound = new Audio('assets/and-the-correct-answer-is.mp3');
const successChime = new Audio('assets/correct.mp3');
const wrongSound = new Audio('assets/wrong.mp3');
const cheeringAndClapping = new Audio('assets/cheering-and-clapping.mp3');

// Set looping for background music
suspenseMusic.loop = true;
suspenseMusic.volume = 0.4;

const moneyValues = ["$100", "$200", "$300", "$500", "$1,000", "$2,000", "$4,000", "$8,000", "$16,000", "$32,000", "$64,000", "$125,000", "$250,000", "$500,000", "$1,000,000"];
      
const setA = [
  // Easy
  { q: "Which character lives in a pineapple under the sea?", a: ["Mickey Mouse", "Spongebob Squarepants", "Bugs Bunny", "Shrek"], c: 1 },
  { q: "What is the boiling point of water at sea level?", a: ["50°C", "90°C", "100°C", "120°C"], c: 2 },
  { q: "How many colors are there in a standard rainbow?", a: ["5", "6", "7", "8"], c: 2 },
  { q: "Which city is known as the 'Big Apple'?", a: ["Los Angeles", "Chicago", "New York City", "Miami"], c: 2 },
  { q: "In the fairy tale, who did the Three Little Pigs try to hide from?", a: ["A Giant", "A Dragon", "The Big Bad Wolf", "A Witch"], c: 2 },
  // Medium
  { q: "Which of these countries is NOT in Europe?", a: ["Belgium", "Switzerland", "Thailand", "Norway"], c: 2 },
  { q: "Who was the first person to walk on the moon?", a: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], c: 1 },
  { q: "What is the most abundant gas in the Earth's atmosphere?", a: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"], c: 3 },
  { q: "Which musical instrument has 88 keys?", a: ["Guitar", "Violin", "Piano", "Flute"], c: 2 },
  { q: "What is the capital of Brazil?", a: ["Rio de Janeiro", "Sao Paulo", "Brasília", "Salvador"], c: 2 },
  // Hard
  { q: "Which famous artist painted 'The Starry Night'?", a: ["Pablo Picasso", "Vincent van Gogh", "Claude Monet", "Salvador Dalí"], c: 1 },
  { q: "What is the smallest bone in the human body?", a: ["Femur", "Stapes", "Tibia", "Ulna"], c: 1 },
  { q: "In which year did the Titanic sink?", a: ["1905", "1912", "1918", "1923"], c: 1 },
  { q: "Which chemical element has the symbol 'Fe'?", a: ["Gold", "Silver", "Iron", "Fluorine"], c: 2 },
  { q: "Who is the only person to win Nobel Prizes in two different sciences?", a: ["Albert Einstein", "Marie Curie", "Isaac Newton", "Stephen Hawking"], c: 1 }
];

const setB = [
  // Easy
  { q: "How many days are in a leap year?", a: ["364", "365", "366", "367"], c: 2 },
  { q: "Which ocean is located between the USA and Europe?", a: ["Indian", "Pacific", "Arctic", "Atlantic"], c: 3 },
  { q: "What is the primary ingredient in an omelet?", a: ["Flour", "Milk", "Eggs", "Sugar"], c: 2 },
  { q: "Which planet is known for its prominent rings?", a: ["Mars", "Jupiter", "Saturn", "Neptune"], c: 2 },
  { q: "How many hours are in one full day?", a: ["12", "24", "48", "60"], c: 1 },
  // Medium
  { q: "Which country gifted the Statue of Liberty to the United States?", a: ["United Kingdom", "France", "Germany", "Italy"], c: 1 },
  { q: "What is the name of the long sleep animals take during winter?", a: ["Migration", "Hibernation", "Evolution", "Incubation"], c: 1 },
  { q: "Which Shakespeare play features the characters Romeo and Juliet?", a: ["Hamlet", "Macbeth", "Romeo and Juliet", "Othello"], c: 2 },
  { q: "What is the largest organ of the human body?", a: ["Heart", "Brain", "Skin", "Liver"], c: 2 },
  { q: "In which country was the game of Chess invented?", a: ["China", "India", "Russia", "Greece"], c: 1 },
  // Hard
  { q: "What is the capital city of Australia?", a: ["Sydney", "Melbourne", "Canberra", "Perth"], c: 2 },
  { q: "Which vitamin is primarily produced when skin is exposed to sunlight?", a: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], c: 3 },
  { q: "Who was the first woman to fly solo across the Atlantic Ocean?", a: ["Amelia Earhart", "Sally Ride", "Bessie Coleman", "Valentina Tereshkova"], c: 0 },
  { q: "What is the original name of New York City?", a: ["New London", "New Amsterdam", "New Paris", "New York Town"], c: 1 },
  { q: "Which metal is liquid at room temperature?", a: ["Mercury", "Lead", "Aluminum", "Copper"], c: 0 }
];

const setC = [
    // Easy
    { q: "Which of these is NOT a programming language?", a: ["Python", "Java", "HTML", "C++"], c: 2 },
    { q: "What is the capital of Japan?", a: ["Seoul", "Beijing", "Tokyo", "Bangkok"], c: 2 },
    { q: "In THIS 'Millionaire' show, how many lifelines do you start with?", a: ["0", "1", "2", "3"], c: 0 },
    { q: "What is the chemical symbol for Gold?", a: ["Gd", "Ag", "Fe", "Au"], c: 3 },
    { q: "Which tech giant created the Android OS?", a: ["Apple", "Google", "Microsoft", "Samsung"], c: 1 },
    // Medium
    { q: "What is the largest mammal in the world?", a: ["African Elephant", "Blue Whale", "Great White Shark", "Giraffe"], c: 1 },
    { q: "How many bits are in a single byte?", a: ["4", "8", "16", "32"], c: 1 },
    { q: "Which planet is known as the 'Red Planet'?", a: ["Venus", "Mars", "Saturn", "Jupiter"], c: 1 },
    { q: "Who painted the 'Mona Lisa'?", a: ["Da Vinci", "Van Gogh", "Picasso", "Monet"], c: 0 },
    { q: "In chess, which piece can only move diagonally?", a: ["Rook", "Knight", "Bishop", "King"], c: 2 },
    // Hard
    { q: "What is the square root of 144?", a: ["10", "11", "14", "12"], c: 3 },
    { q: "Which country gifted the Statue of Liberty to the USA?", a: ["UK", "France", "Germany", "Italy"], c: 1 },
    { q: "What is the currency of the United Kingdom?", a: ["Pound", "Euro", "Dollar", "Yen"], c: 0 },
    { q: "Who wrote 'The Odyssey'?", a: ["Socrates", "Plato", "Homer", "Aristotle"], c: 2 },
    { q: "What is the official name of the '15th' level of this game?", a: ["The Jackpot", "The Big One", "The Million", "The Final Hurdle"], c: 2 }
];

const allPools = [setA, setB, setC];
let setNumber = parseInt(localStorage.getItem('millionaire_set')) || 0;
let questions = allPools[setNumber];

let currentLevel = 0;
let canClick = true;

function initLadder() {
    const ladderEl = document.getElementById('ladder');
    moneyValues.forEach((val, i) => {
        const div = document.createElement('div');
        div.className = 'ladder-item';
        if (i === 4 || i === 9 || i === 14) div.classList.add('milestone');
        div.id = `level-${i}`;
        div.innerHTML = `<span>${i + 1}</span> <span>${val}</span>`;
        ladderEl.appendChild(div);
    });
    updateLadder();
}

function updateLadder() {
    document.querySelectorAll('.ladder-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`level-${currentLevel}`).classList.add('active');
}

function loadQuestion() {
    suspenseMusic.play();
    const data = questions[currentLevel];
    document.getElementById('question-text').innerText = data.q;
    data.a.forEach((text, i) => {
        document.getElementById(`ans${i}`).innerText = text;
        const btn = document.querySelectorAll('.answer-btn')[i];
        btn.className = 'answer-btn'; // reset colors
    });
    canClick = true;
}

async function handleAnswer(index) {
    if (!canClick) return;
    canClick = false;

    // Pause background suspense and play the reveal voiceover
    suspenseMusic.pause();

    const btns = document.querySelectorAll('.answer-btn');
    const correctIndex = questions[currentLevel].c;
    
    // Select (Orange)
    btns[index].classList.add('selected');

    // Dramatic Pause (1 second)
    await new Promise(r => setTimeout(r, 1000));

    revealSound.play();

    // Dramatic Pause (2 seconds)
    await new Promise(r => setTimeout(r, 2500));

    if (index === correctIndex) {
        // Correct!
        successChime.play(); // Play victory sound!
        btns[index].classList.remove('selected');
        btns[index].classList.add('correct');
        
        await new Promise(r => setTimeout(r, 1500));
        
        if (currentLevel === 14) {
            showEndGame("CONGRATULATIONS!", "You are a Millionaire!");
            cheeringAndClapping.play();
        } else {
            currentLevel++;
            updateLadder();
            loadQuestion();
        }
    } else {
        // Wrong!
        wrongSound.play();
        btns[index].classList.remove('selected');
        btns[index].classList.add('wrong');
        btns[correctIndex].classList.add('correct');
        
        await new Promise(r => setTimeout(r, 2000));
        showEndGame("GAME OVER", `You leave with ${ 
            currentLevel >= 10 ? moneyValues[9] : 
            currentLevel >= 5 ? moneyValues[4] : '$0'}`
        );
    }
}

function showEndGame(title, sub) {
    let nextSet = (setNumber >= 2) ? 0 : setNumber + 1;
    localStorage.setItem('millionaire_set', nextSet);
    
    document.getElementById('message-overlay').style.display = 'flex';
    document.getElementById('overlay-title').innerText = title;
    document.getElementById('overlay-sub').innerText = sub;
}

document.getElementById('start-btn').addEventListener('click', () => {
    // 1. Hide the overlay
    document.getElementById('start-overlay').style.display = 'none';
    
    // 2. Play the suspense music
    suspenseMusic.play();
    
    // 3. Start the game logic
    initLadder();
    loadQuestion();
});
const projects = [
    {
        id: "CountriesAPI",
        title: "Countries API",
        description: "A comprehensive data-fetching application using REST APIs. Features dynamic filtering, region sorting, and detailed country views with asynchronous JavaScript.",
        tags: ["Fetch API", "JSON", "DOM Logic"],
        image: "images/countries.png",
        link: "projects/CountriesAPI/index.html"
    },
    {
        id: "FourInALine",
        title: "Four in a Line",
        description: "Strategy board game built with a 2D array matrix system. Features complex win-condition algorithms and a gravity-based chip drop logic.",
        tags: ["Algorithms", "Matrix", "CSS Grid"],
        image: "images/four-in-a-line.png",
        link: "projects/FourInALine/index.html"
    },
    {
        id: "MemoryGame",
        title: "Memory Game",
        description: "Interactive card-matching game focusing on state management, event delegation, and CSS-based flip animations.",
        tags: ["State Mgmt", "Transitions", "UI"],
        image: "images/memory.png",
        link: "projects/MemoryGame/index.html"
    },
    {
        id: "Pong",
        title: "Pong Classic",
        description: "Physics-based collision detection system. Implements coordinate-based movement and real-time paddle-ball interaction math.",
        tags: ["Math", "Physics", "Loop"],
        image: "images/pong.png",
        link: "projects/Pong/index.html"
    },
    {
        id: "Sudoku",
        title: "Sudoku",
        description: "A logical grid validator that checks board integrity in real-time. Demonstrates advanced input validation and backtracking principles.",
        tags: ["Logic Gate", "Validation", "JS"],
        image: "images/sudoku.png",
        link: "projects/Sudoku/index.html"
    },
    {
        id: "TicTacToe",
        title: "Tic Tac Toe",
        description: "The classic logic game implementation. Focuses on modular code structure and a responsive UI that adapts to any device.",
        tags: ["Clean Code", "OOP", "Responsive"],
        image: "images/ttt.png",
        link: "projects/TicTacToe/index.html"
    },
    { 
        id: "WhoWantsToBeAMillionaire",
        title: "Who Wants to be a Millionaire",
        description: `A high-stakes quiz game featuring tiered difficulty logic, 
            dynamic audio integration, and LocalStorage-based state persistence.`, 
        tags: ["State Management", "Audio API", "Logic Flow", "Asynchronous JS"], 
        image: "images/millionaire.png",
        link: "projects/WhoWantsToBeAMillionaire/index.html" 
    }, 
    { 
        id: "WarCardGame",
        title: "War", 
        description: `A logic-heavy card game featuring recursive tie-breaking and synchronized asynchronous animations
            for a polished gameplay experience.`, 
        tags: ["State Management", "Asynchronous JS", "Game Logic", "DOM Animation"], 
        image: "images/war.png",
        link: "projects/WarCardGame/index.html" 
    },
    {
        id: "ToDoList",
        title: "Pro ToDoList",
        description: `A high-performance CRUD application featuring real-time state synchronization, 
                  persistent local storage, and a custom-engineered Drag & Drop interface 
                  for intuitive task reordering.`,
        tags: ["LocalStorage", "State Management", "DOM Manipulation", "UX/UI Design", "JSON"],
        image: "images/todolist.png",
        link: "projects/ToDoList/index.html"
    }
];

const container = document.getElementById('project-container');
const detailPage = document.getElementById('project-detail-page');
const mainContent = document.getElementById('main-content');
const statusBox = document.getElementById('status-msg');

// Handle Contact Form Submission
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get values
        const name = document.getElementById('name').value;
        
        // PDF Requirement: Success/Error messages for the user
        notify(`Thanks, ${name}! Your message has been sent.`);
        
        // Clear the form
        contactForm.reset();
    });
}

// PDF Requirement: Success/Error feedback
function notify(msg) {
    statusBox.innerText = msg;
    statusBox.classList.remove('hidden');
    setTimeout(() => statusBox.classList.add('hidden'), 3000);
}

// Render Gallery Cards (Appendix 1)
function render() {
    container.innerHTML = '';
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.image}" alt="${p.title}">
            <div class="card-content">
                <div class="tag-row">${p.tags.slice(0, 2).map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <h3>${p.title}</h3>
                <p style="color: #a1a1aa; font-size: 0.8rem; margin-top: 10px;">Click to view details →</p>
            </div>
        `;
        card.onclick = () => showDetail(p);
        container.appendChild(card);
    });
}

// Function to download a ZIP on the fly
function downloadProjectZip(projectId, projectTitle) {
    notify(`Starting download for ${projectTitle}...`);
    
    const link = document.createElement('a');
    link.href = `projects/${projectId}/${projectId}.zip`; 
    link.download = `${projectId}.zip`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("Download successful!");
}

// Logic for dedicated Project Page (Appendix 2)
function showDetail(p) {
    document.getElementById('detail-title').innerText = p.title;
    document.getElementById('detail-description').innerText = p.description;
    document.getElementById('detail-image').src = p.image;
    document.getElementById('view-live').href = p.link;
    document.getElementById('detail-tags').innerHTML = p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('');
    
    const downloadBtn = document.getElementById('download-zip');

    downloadBtn.onclick = (e) => {
        e.preventDefault();
        downloadProjectZip(p.id, p.title);
    };

    mainContent.classList.add('hidden');
    detailPage.classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Return to Gallery
function goHome() {
    detailPage.classList.add('hidden');
    mainContent.classList.remove('hidden');
}

const navWork = document.getElementById('nav-projects');
const navContact = document.querySelector('.contact-btn');

if (navWork) navWork.addEventListener('click', goHome);
if (navContact) navContact.addEventListener('click', goHome);

document.getElementById('close-detail').onclick = goHome;
document.getElementById('logo-home').onclick = goHome;

render();
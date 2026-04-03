// --- Elements ---
const input = document.getElementById('todo-input');
const dateInput = document.getElementById('todo-date');
const priorityInput = document.getElementById('todo-priority');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clear-completed');
const progressFill = document.getElementById('progress-fill');
const taskCountText = document.getElementById('task-count');
const percentText = document.getElementById('percent-text');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const emptyState = document.getElementById('empty-state');

// --- State Management ---
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];
let editIndex = null;
let currentFilter = 'all';

// --- Theme Initialization & persistence ---
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// --- Data Migration & Safety (Ensures consistent object structure) ---
tasks = tasks.map(task => {
    // If it's a legacy string, convert it
    if (typeof task === 'string') return { text: task, completed: false, priority: 'Medium', date: '' };
    // Otherwise, ensure all properties exist with defaults
    return {
        text: task.text || "Unnamed Task",
        completed: task.completed || false,
        priority: task.priority || "Medium",
        date: task.date || ""
    };
});

// Sounds
const addSound = new Audio('assets/add-task.mp3');
const doneSound = new Audio('assets/complete-task.mp3');
doneSound.volume = 0.3;
const removeSound = new Audio('assets/delete-task.mp3');

// --- Core Logic ---

const save = () => {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    updateStats();
};

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    // Update Text elements with full path check for safety
    if (taskCountText) taskCountText.innerText = `${remaining} tasks left`;
    if (percentText) percentText.innerText = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    
    // Toggle empty state
    if (emptyState) emptyState.classList.toggle('hidden', total > 0);
    if (clearBtn) clearBtn.classList.toggle('hidden', completed === 0);
}

function renderTasks() {
    if (!todoList) return;
    todoList.innerHTML = '';
    const searchTerm = (searchInput.value || "").toLowerCase();

    tasks.forEach((task, index) => {
        // Filter & Search logic
        const matchesSearch = task.text.toLowerCase().includes(searchTerm);
        const matchesFilter = currentFilter === 'all' || 
            (currentFilter === 'active' && !task.completed) || 
            (currentFilter === 'completed' && task.completed);
        
        if (!matchesSearch || !matchesFilter) return;

        const li = document.createElement('li');
        li.className = 'task-row draggable';
        li.draggable = true;
        li.dataset.index = index;

        if (editIndex === index) {
            // --- Inline Edit Mode ---
            li.innerHTML = `
                <input type="text" id="edit-inp" value="${task.text}" style="flex:1; padding:10px;">
                <button class="edit-btn" onclick="saveEdit(${index})" style="background:var(--success); color:white; margin-left:10px; padding: 10px;"><i class="fas fa-check"></i></button>
                <button class="edit-btn" onclick="cancelEdit()" style="margin-left:5px; padding: 10px;"><i class="fas fa-times"></i></button>
            `;
        } else {
            // --- Display Mode (Updated Structure with custom Checkbox and Icons) ---
            const priorityClass = `priority-${task.priority.toLowerCase()}`;
            li.innerHTML = `
                <label class="completion-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggle(${index})">
                    <span class="checkmark"></span>
                </label>
                <span class="task-text ${task.completed ? 'completed' : ''}" onclick="toggle(${index})">
                    ${task.text}
                </span>
                <span class="badge ${priorityClass}">${task.priority}</span>
                <span class="task-date">${task.date || ''}</span>
                <div class="actions">
                    <button class="edit-btn" onclick="setEdit(${index})" title="Edit Task"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="remove(${index})" title="Delete Task"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
        }

        // --- Drag & Drop Listeners ---
        li.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', index);
            // Visual feedback on start
            requestAnimationFrame(() => li.style.opacity = '0.3');
        };

        li.ondragover = (e) => {
            e.preventDefault(); // Required to allow drop
            li.classList.add('drag-over'); // Add drop indicator
        };
        
        li.ondragleave = () => li.classList.remove('drag-over');

        li.ondrop = (e) => {
            e.preventDefault();
            const fromIndex = e.dataTransfer.getData('text/plain');
            const toIndex = index;
            // Remove drop indicator
            li.classList.remove('drag-over');
            
            // Mutation
            const movedItem = tasks.splice(fromIndex, 1)[0];
            tasks.splice(toIndex, 0, movedItem);
            
            save();
            renderTasks();
        };

        li.ondragend = () => {
            li.style.opacity = '1';
            // Clean up any remaining drop indicators from other rows
            document.querySelectorAll('.task-row').forEach(row => row.classList.remove('drag-over'));
        };

        todoList.appendChild(li);
    });
    updateStats();
}

// --- Action Handlers ---

function addTask() {
    const text = input.value.trim();
    if (!text) {
        input.style.borderColor = "var(--danger)";
        input.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.2)";
        setTimeout(() => {
            input.style.borderColor = "var(--border)";
            input.style.boxShadow = "none";
        }, 2000);
        return;
    }

    tasks.push({
        text: text,
        date: dateInput.value || null,
        priority: priorityInput.value || 'Medium',
        completed: false
    });

    addSound.play();

    // Reset fields
    input.value = '';
    dateInput.value = '';
    priorityInput.value = 'Medium';
    save();
    renderTasks();
}

function remove(index) {
    tasks.splice(index, 1);
    save();
    removeSound.play();
    renderTasks();
}

function toggle(index) {
    tasks[index].completed = !tasks[index].completed;
    save();

    if (tasks[index].completed)
        doneSound.play();
    
    renderTasks();
}

function setEdit(index) {
    editIndex = index;
    renderTasks();
}

function saveEdit(index) {
    const editInput = document.getElementById('edit-inp');
    if (editInput && editInput.value.trim()) {
        tasks[index].text = editInput.value.trim();
        editIndex = null;
        save();
        renderTasks();
    }
}

function cancelEdit() {
    editIndex = null;
    renderTasks();
}

// --- Event Listeners ---

addBtn.onclick = addTask;

input.onkeypress = (e) => {
    if (e.key === 'Enter') addTask();
};

searchInput.oninput = renderTasks;

themeToggle.onclick = () => {
    const isDark = document.body.classList.toggle('dark-mode');
    
    // persistence
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Update icon
    if (isDark) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
};

filterBtns.forEach(btn => {
    btn.onclick = () => {
        // Toggle active class on buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update filter state and render
        currentFilter = btn.dataset.filter;
        renderTasks();
    };
});

clearBtn.onclick = () => {
    tasks = tasks.filter(t => !t.completed);
    save();
    removeSound.play();
    renderTasks();
};

// --- Initial Render ---
renderTasks();
🔴 Four in a Line (Connect Four)
A modern, responsive, and interactive Connect Four game built with a focus on CSS Stacking Contexts and Vanilla JavaScript game logic. This project features a unique "Swiss Cheese" board design where pieces physically drop behind the board frame.

🚀 Features
VS Computer Mode: Toggle between local 1v1 play or a random-agent AI opponent.

"Swiss Cheese" UI: Advanced CSS layering using radial-gradients and z-index to simulate a 3D board where pieces fall through holes.
Persistent Scoreboard: Tracks wins for both players using sessionStorage, ensuring scores survive page refreshes.
Responsive Audio: Synchronized "clink" sound effects that trigger based on animation timing for a tactile feel.
Input Protection: Intelligent "Processing Lock" prevents race conditions and double-clicks while the AI is thinking or animations are playing.

🛠️ Tech Stack
HTML5: Semantic structure and layout.
CSS3: Custom properties (variables), grid, radial-gradient masks, and complex z-index management.
JavaScript (ES6+): 2D array manipulation, DOM manipulation, and asynchronous setTimeout logic for game states.
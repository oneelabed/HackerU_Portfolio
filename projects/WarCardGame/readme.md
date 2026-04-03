🃏 War: The Card Game
A fully responsive, logic-driven recreation of the classic "War" card game.

This project was developed as a core part of my software engineering student portfolio at HackerU to demonstrate advanced DOM manipulation and state management using only vanilla web technologies.

🚀 Key Engineering Highlights
Asynchronous Animation Engine: Utilized async/await and Promise.all to synchronize complex card movements, ensuring the CPU and Player actions occur simultaneously for a polished, professional feel.

Robust State Machine: Designed logic to handle difficult edge cases, such as "short-handed wars" (when a player has fewer than 4 cards during a tie) and back-to-back ties using recursive function calls.

FIFO Queue Logic: Implemented a First-In-First-Out (FIFO) system using JavaScript arrays to manage deck flow, ensuring won cards return to the bottom of the stack to prevent immediate re-play.

Dynamic UI & Theming: Built a responsive "Vegas-style" table using CSS Grid that stays contained within the viewport. Includes a "War Mode" that dynamically swaps the table to a camouflage theme and triggers high-impact overlays during ties.

🛠️ Technical Stack
JavaScript (ES6+): Logic, recursion, and asynchronous event handling.

CSS3: Grid/Flexbox for layout, custom animations, and complex 3D stack effects.

HTML5: Semantic structure and dynamic DOM element generation.
Who Wants to be a Millionaire 💰
A high-stakes, interactive quiz application built to replicate the tension and excitement of the iconic game show. This project focuses on managing complex game states, asynchronous timing for dramatic effect, and persistent data handling.

🛠️ Tech Stack
Frontend: HTML5, CSS3 (Flexbox/Grid, Clip-path)

Logic: Vanilla JavaScript (ES6+)

Persistence: LocalStorage API

Media: HTML5 Audio API

✨ Key Features
Tiered Difficulty: 15 levels of increasing stakes, from $100 to $1,000,000.

Dynamic Audio System: Integrated suspense music and sound stings that react to user choices (Thinking, Reveal, Success).

Question Set Cycling: Logic that rotates between three entirely unique, 15-question pools using localStorage so the game stays fresh on every restart.

Dramatic "Final Answer" Logic: Uses async/await and setTimeout to create intentional pauses, mimicking the show’s high-pressure environment.

Responsive UI: A custom-designed interface using CSS clip-path to achieve the classic hexagonal button shapes.

🧠 Technical Highlights
State Persistence
To ensure variety, the application tracks which question set was last played. By storing a setNumber in localStorage, the game survives page reloads and follows a sequential loop (0 -> 1 -> 2 -> 0).

Asynchronous Game Flow
The "Reveal" phase uses asynchronous logic to coordinate UI changes with audio cues:
1. Selection: Button turns orange; "Thinking" music stops; "Reveal" audio starts.
2. The Pause: A 3-second delay builds tension.
3. The Reveal: Button turns green/red; "Success" chime plays if correct.
🕹️ Pong
A retro-style, 2-player arcade game built strictly with HTML5, CSS3, and Vanilla JavaScript. This version features a match system (first to 7), a global series tracker, and dynamic physics.

✨ Features
Tournament Mode: Tracks "Series Wins" across multiple matches.

Dynamic Physics: Ball angle and speed change based on where it hits the paddle.

Visual Countdown: A 3-2-1 timer at the start of every new match to prepare players.

Neon Aesthetic: Cyberpunk-inspired glow effects and high-contrast UI.

Custom Audio: Integrated sound effects for bounces, scoring, and victory.

🛠️ Technical Details
Engine: HTML5 Canvas API using a requestAnimationFrame 60fps loop.

Collision: Axis-Aligned Bounding Box (AABB) detection with a radial bounce algorithm.

State Management: Uses a gameState variable to toggle between COUNTDOWN, PLAYING, and GAMEOVER.

Scoring: The game logic checks for boundaries; if the ball exceeds the canvas width, a point is awarded and the ball is reset toward the scorer.
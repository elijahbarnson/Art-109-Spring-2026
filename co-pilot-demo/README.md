# Co-Pilot Demo Project

## Overview
This project is a creative web application designed to explore journal prompts through interactive pages. It features sound effects and a dream-like aesthetic to enhance the user experience.

## Project Structure
```
co-pilot-demo
├── index.html
├── paint-yourself.html
├── find-again.html
├── css
│   └── style.css
├── js
│   ├── main.js
│   ├── starting-point.js
│   ├── paint-yourself.js
│   └── find-again.js
├── audio
│   ├── background-music.mp3
│   ├── key-press.wav
│   ├── drag-sfx.wav
│   └── type-loop.wav
├── libs
│   └── p5.min.js
└── README.md
```

## Pages

### 1. A Starting Point
- **File:** `index.html`
- **Description:** This is the main entry point of the website. It allows users to input journal prompts and triggers sound effects for key presses. The page includes navigation links to the other two pages.

### 2. Paint Yourself
- **File:** `paint-yourself.html`
- **Description:** This page features a canvas where users can drag their mouse to display the words they typed on the first page. It includes sound effects for mouse dragging, enhancing the interactive experience.

### 3. Find Again
- **File:** `find-again.html`
- **Description:** This page allows users to randomly reorganize the words typed on the first page. It supports indefinite typing and disappearing effects, with sound effects for typing to create an engaging atmosphere.

## Audio Files
- **background-music.mp3:** Plays indefinitely as background music while navigating the website.
- **key-press.wav:** Triggered every time a key is pressed on the "A Starting Point" page.
- **drag-sfx.wav:** Triggered when the user drags the mouse across the canvas on the "Paint Yourself" page.
- **type-loop.wav:** Used for the typing sound effect on the "Find Again" page.

## Libraries
- **p5.min.js:** This library is used for creative coding and canvas manipulation, enabling dynamic interactions on the canvas.

## Setup Instructions
1. Clone the repository to your local machine.
2. Open `index.html` in a web browser to start the application.
3. Ensure that all audio files are correctly linked and accessible for sound effects to function properly.

## Acknowledgments
This project is inspired by the desire to create an interactive journaling experience that combines creativity with technology. Enjoy exploring your thoughts and ideas!
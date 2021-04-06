# Going Home

Going Home game for Project 1 Ironhack

## Description

A game about a Slime trying to get home. You are a slime and have to jump up on platforms until you reach home(100th platform). There are harsher conditions depending on difficulty.

## MVP

- Arrow keys control slime
- 100 platforms showing up going top to bottom
- Collision
- Platform types
- Area types

## Backlog

- Conditions like wind and slippery platforms
- Different difficulties
- Music

## Data Structure

### main.js

- buildSplashScreen () {}
- buildGameScreen () {}
- buildGameOverScreen () {}

### game.js

- let animationId;
- Arrow key event listeners
- Slime object
- Platform class
- Timer
- draw()
- drawBackground()
- drawSlime()
- drawPlatform()
- moveSlime()
- collisions()
- addPlatform()
- if (gameOver) {}
- restart() {}
- window.addEventListener("load", () => {});

### slime.js

- X and Y coordinates

### Platform class

class Platform {
this.x;
this.y;
type;
width;
}

## States y States Transitions

- splashScreen
- gameScreen
- loseScreen
- winScreen

## Additional Links

### Trello

### Slides

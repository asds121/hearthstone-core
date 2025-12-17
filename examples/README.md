# Examples

This directory contains example code demonstrating how to use the Hearthstone Game Engine.

## Available Examples

### JavaScript Examples

- **basic-game.js**: A basic game setup using JavaScript

### TypeScript Examples

- **basic-game.ts**: A comprehensive game setup using TypeScript with full type safety

## Running the Examples

### JavaScript Example

```bash
node examples/basic-game.js
```

### TypeScript Example

First, build the project:
```bash
npm run build
```

Then run the example:
```bash
ts-node examples/basic-game.ts
```

## What the Examples Demonstrate

1. **Game Creation**: How to set up a new game with two players
2. **Deck Building**: How to define card decks for each player
3. **Event Handling**: How to listen for and respond to game events
4. **Game Flow**: How to simulate turns and game actions
5. **State Management**: How to access and modify game state
6. **Entity Management**: How to work with game entities (cards, heroes, etc.)

## Creating Your Own Example

1. Copy one of the existing examples
2. Modify the game configuration (players, decks, etc.)
3. Add your own game logic
4. Run and test your example

## Tips for Examples

- Keep examples focused on specific features
- Use descriptive variable names
- Add comments explaining complex logic
- Include error handling
- Test your examples before submitting

## Contributing Examples

If you have a good example that demonstrates a specific feature or use case, feel free to submit a pull request!

Example contributions should:
- Be well-commented
- Follow the project's coding style
- Include a brief description of what it demonstrates
- Be tested and working
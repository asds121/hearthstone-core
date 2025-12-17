# Hearthstone Game Engine

A comprehensive Hearthstone game engine implementation in TypeScript, featuring event-driven architecture and domain-driven design.

## Features

- **Complete Game Logic**: Implements all core Hearthstone game mechanics
- **Event-Driven Architecture**: Flexible and extensible event system
- **TypeScript**: Full type safety and modern development experience
- **Domain-Driven Design**: Clean separation of concerns
- **High Performance**: Optimized for speed and memory efficiency
- **Extensible**: Easy to add new cards and mechanics
- **Testable**: Comprehensive test coverage

## Architecture

This game engine follows a layered architecture:

- **Core Layer**: Base entities, events, and game state
- **System Layer**: Entity management, event handling, zone management
- **Application Layer**: Game logic, rules, and sequences
- **API Layer**: External interfaces and communication

## Installation

```bash
npm install hearthstone-game-engine
```

## Quick Start

```typescript
import { Game, EntityManager, EventManager } from 'hearthstone-game-engine';

// Create a new game
const game = new Game({
  player1: {
    id: 'player1',
    name: 'Player 1',
    heroClass: 'MAGE',
    deck: [
      // Your deck definition
    ]
  },
  player2: {
    id: 'player2',
    name: 'Player 2',
    heroClass: 'WARRIOR',
    deck: [
      // Your deck definition
    ]
  }
});

// Start the game
game.start();

// Perform game actions
// ...
```

## Documentation

- [API Documentation](docs/)
- [Game Rules](docs/rules.md)
- [Development Guide](docs/development.md)

## Testing

```bash
npm test
npm run test:coverage
```

## Building

```bash
npm run build
```

## Development

```bash
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the original Hearthstone game by Blizzard Entertainment
- Built with modern TypeScript and Node.js
- Architecture based on domain-driven design principles
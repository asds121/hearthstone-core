# Contributing to Hearthstone Game Engine

Thank you for your interest in contributing to the Hearthstone Game Engine! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing opinions and experiences

## How to Contribute

### Reporting Issues

1. Check if the issue has already been reported
2. Create a new issue with a clear title and description
3. Include steps to reproduce the problem
4. Mention your environment (Node.js version, OS, etc.)

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with the "enhancement" label
3. Describe the feature and its benefits
4. Provide examples of how it would be used

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hearthstone-game-engine.git
   cd hearthstone-game-engine
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

4. Start development:
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Use ESLint and Prettier for formatting
- Write meaningful variable and function names
- Add comments for complex logic

### Testing

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Test both success and failure cases

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb in present tense
- Keep the first line under 50 characters
- Add detailed description if needed

Example:
```
Add damage calculation system

- Implement base damage calculation
- Add spell damage modifier
- Include unit tests
```

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates

Example: `feature/add-spell-damage-system`

## Architecture Overview

The project follows a layered architecture:

- **Core Layer**: Base entities, events, and interfaces
- **System Layer**: Entity, event, and zone management
- **Application Layer**: Game logic and rules
- **API Layer**: External interfaces

### Key Design Principles

1. **Event-Driven**: Use events for communication between components
2. **Domain-Driven**: Separate business logic from infrastructure
3. **Type Safety**: Use TypeScript for better type checking
4. **Testability**: Design components to be easily testable
5. **Performance**: Optimize for speed and memory usage

## Common Tasks

### Adding a New Card

1. Create the card data structure
2. Implement card effects (if any)
3. Add tests for the card
4. Update documentation

### Adding a New Game Mechanic

1. Define the mechanic in the core types
2. Implement the mechanic in the appropriate system
3. Add event types and triggers if needed
4. Write comprehensive tests
5. Update documentation

### Debugging

1. Use the debug mode in game configuration
2. Enable detailed logging
3. Use breakpoints in your IDE
4. Check the event queue for issues

## Getting Help

- Check the documentation first
- Search existing issues
- Ask questions in discussions
- Contact maintainers if needed

## Recognition

Contributors will be recognized in:
- The README file
- Release notes
- GitHub contributor graphs

Thank you for contributing!
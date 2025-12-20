# Changelog

## [Unreleased]

### Fixed
- **CI/CD Pipeline Issues**: Resolved critical CI workflow failures affecting all Node.js versions (18.x, 20.x, 22.x)
  - Fixed "No tests found" error in Jest test discovery
  - Resolved ESLint operation cancellation and timeout issues
  - Fixed file path resolution problems in GitHub Actions Linux environment

### Technical Details

#### Jest Configuration Issues
- **Problem**: Jest could not discover test files due to TypeScript configuration conflicts
- **Root Cause**: `tsconfig.json` excluded `**/*.test.ts` files, preventing Jest from finding tests
- **Solution**: Created dedicated `jest.final.config.js` with proper TypeScript configuration using `tsconfig.test.json`

#### ESLint Timeout Issues  
- **Problem**: ESLint operations were cancelled due to HttpClient timeout (100 seconds)
- **Root Cause**: Complex file processing and configuration conflicts in CI environment
- **Solution**: Implemented timeout controls and simplified ESLint execution with better error handling

#### File Path Resolution
- **Problem**: CI environment (Linux) had different file structure expectations than local development
- **Root Cause**: Path matching patterns and file discovery commands were platform-specific
- **Solution**: Added comprehensive file structure debugging and cross-platform compatible commands

### Configuration Changes
- Updated `package.json` test script to use explicit Jest configuration
- Created `jest.final.config.js` for CI-specific Jest settings
- Modified `.github/workflows/ci.yml` with detailed debugging and error handling
- Added timeout controls and step-by-step execution for better reliability

### Verification
- ✅ All Node.js versions (18.x, 20.x, 22.x) now pass CI successfully
- ✅ Jest discovers and runs all 37 tests (36 passed, 1 skipped as expected)
- ✅ ESLint completes linting without timeout or cancellation
- ✅ Detailed logging provides clear visibility into CI execution

## [0.0.1] - Previous Release

### Added
- Initial project setup with TypeScript configuration
- Comprehensive Hearthstone core implementation
- Jest testing framework with 37 tests covering core functionality
- ESLint and Prettier code quality tools
- GitHub Actions CI/CD pipeline
- Core game systems:
  - Entity management system
  - Event management system  
  - Zone management system
  - Sequence management system
- Base game components:
  - Player management
  - Hero entities with health and powers
  - Card system with deck management
  - Game state management
- JSON serialization support for game state persistence

### Technical Features
- TypeScript-based architecture with strict type checking
- Event-driven architecture using EventEmitter3
- Comprehensive test coverage with Jest
- Modular system design for extensibility
- Winston logging integration
- UUID-based entity identification
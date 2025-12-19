module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Use the simplest possible pattern that works across platforms
  testMatch: [
    '**/*.test.ts',
    '*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  moduleFileExtensions: ['ts', 'js'],
  // Minimal ignore patterns - don't ignore anything in src
  testPathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage'
  ],
  // Search from root
  roots: ['.'],
  // Ensure we can find modules
  modulePaths: ['.'],
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  // CI optimizations
  maxWorkers: 2,
  detectOpenHandles: true,
  forceExit: true,
  // Ensure passWithNoTests is false to catch real issues
  passWithNoTests: false
};
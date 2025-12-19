module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/src/tests/**/*.test.ts',
    '**/src/tests/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  moduleFileExtensions: ['ts', 'js'],
  passWithNoTests: false,
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  // Additional CI-specific settings
  maxWorkers: 2, // Limit workers for CI environment
  detectOpenHandles: true,
  forceExit: true,
  // Ensure tests are found even with different path resolutions
  roots: ['<rootDir>/src'],
  // Add explicit module paths
  modulePaths: ['<rootDir>/src'],
  // Handle potential case sensitivity issues
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/logs/'
  ]
};
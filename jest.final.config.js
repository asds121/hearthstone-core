module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/tests/*.test.ts'
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
  resetMocks: true
};
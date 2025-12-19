module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Linux环境下使用最简化的配置
  testMatch: [
    '**/src/tests/*.test.ts',
    'src/tests/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage'
  ],
  roots: ['<rootDir>'],
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  maxWorkers: 2,
  detectOpenHandles: true,
  forceExit: true,
  passWithNoTests: false
};
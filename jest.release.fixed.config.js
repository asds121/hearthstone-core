module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // 使用更明确的路径模式，避免跨平台问题
  testMatch: [
    '<rootDir>/src/tests/*.test.ts',
    '<rootDir>/src/tests/**/*.test.ts',
    '**/src/tests/*.test.ts',
    '**/src/tests/**/*.test.ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }],
  },
  moduleFileExtensions: ['ts', 'js'],
  // 最小化忽略模式
  testPathIgnorePatterns: [
    'node_modules',
    'dist',
    'coverage'
  ],
  // 明确指定根目录
  roots: ['<rootDir>/src', '<rootDir>'],
  // 确保模块解析
  modulePaths: ['<rootDir>'],
  verbose: true,
  testTimeout: 30000,
  clearMocks: true,
  resetMocks: true,
  // CI优化
  maxWorkers: 2,
  detectOpenHandles: true,
  forceExit: true,
  // 确保passWithNoTests为false以捕获真实问题
  passWithNoTests: false
};
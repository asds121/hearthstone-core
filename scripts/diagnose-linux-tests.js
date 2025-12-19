#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Linux Jest Test Diagnostic Tool ===');
console.log('Working directory:', process.cwd());
console.log('Platform:', process.platform);
console.log('Node version:', process.version);
console.log('');

// Linux特定的路径处理
function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

// 检查文件是否存在（区分大小写）
function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (e) {
    return false;
  }
}

// 查找测试文件，使用Linux友好的方法
function findTestFilesLinux(dir) {
  const results = [];
  function walk(currentDir) {
    try {
      const files = fs.readdirSync(currentDir);
      files.forEach(file => {
        const fullPath = path.join(currentDir, file);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist')) {
            walk(fullPath);
          } else if (file.endsWith('.test.ts')) {
            results.push(normalizePath(fullPath));
          }
        } catch (e) {
          console.log(`Error accessing ${fullPath}: ${e.message}`);
        }
      });
    } catch (e) {
      console.log(`Error reading directory ${dir}: ${e.message}`);
    }
  }
  walk(dir);
  return results;
}

console.log('=== Linux-specific File Search ===');
const testFiles = findTestFilesLinux('.');
console.log(`Found ${testFiles.length} test files:`);
testFiles.forEach(file => {
  console.log(`  - ${file}`);
  // 检查文件内容
  try {
    const content = fs.readFileSync(file, 'utf8');
    const hasDescribe = content.includes('describe(');
    const hasTest = content.includes('it(') || content.includes('test(');
    console.log(`    Valid test file: describe=${hasDescribe}, test=${hasTest}`);
  } catch (e) {
    console.log(`    Error reading file: ${e.message}`);
  }
});
console.log('');

// 检查目录结构
console.log('=== Directory Structure Check ===');
const checkPaths = [
  'src',
  'src/tests',
  'src/tests/entity.test.ts',
  'src/tests/event.test.ts', 
  'src/tests/game.test.ts'
];

checkPaths.forEach(p => {
  const exists = checkFileExists(p);
  console.log(`${p}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});
console.log('');

// 模拟不同Jest配置的效果
console.log('=== Jest Configuration Simulation (Linux) ===');
const linuxConfigs = [
  {
    name: 'Standard Release Config',
    testMatch: ['**/*.test.ts', '*.test.ts'],
    testPathIgnorePatterns: ['node_modules', 'dist', 'coverage'],
    roots: ['.']
  },
  {
    name: 'Fixed Release Config', 
    testMatch: ['<rootDir>/src/tests/*.test.ts', '**/src/tests/*.test.ts'],
    testPathIgnorePatterns: ['node_modules', 'dist', 'coverage'],
    roots: ['<rootDir>/src', '<rootDir>']
  },
  {
    name: 'Linux Config',
    testMatch: ['**/src/tests/*.test.ts'],
    testPathIgnorePatterns: ['node_modules', 'dist', 'coverage'],
    roots: ['<rootDir>']
  }
];

linuxConfigs.forEach(config => {
  console.log(`\nConfig: ${config.name}`);
  console.log(`  testMatch: ${JSON.stringify(config.testMatch)}`);
  
  const matches = [];
  testFiles.forEach(file => {
    config.testMatch.forEach(pattern => {
      const normalizedPattern = pattern.replace('<rootDir>', '.');
      if (file.includes(normalizedPattern.replace('*.test.ts', '.test.ts').replace('**/', ''))) {
        if (!matches.includes(file)) matches.push(file);
      }
    });
  });
  
  console.log(`  Would find: ${matches.length} files`);
  matches.forEach(match => console.log(`    - ${match}`));
});

console.log('\n=== Linux-specific Recommendations ===');
if (testFiles.length === 0) {
  console.log('❌ No test files found!');
} else {
  console.log('✅ Test files found');
  console.log('');
  console.log('For Linux/GitHub Actions environment:');
  console.log('1. Use forward slashes in paths');
  console.log('2. Consider case sensitivity');
  console.log('3. Use explicit directory patterns');
  console.log('4. Avoid ** patterns when possible');
  console.log('');
  console.log('Suggested Jest config for Linux:');
  console.log(JSON.stringify({
    testMatch: ['**/src/tests/*.test.ts'],
    testPathIgnorePatterns: ['node_modules', 'dist', 'coverage'],
    roots: ['<rootDir>']
  }, null, 2));
}
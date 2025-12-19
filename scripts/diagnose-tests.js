#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('=== Jest Test Diagnostic Tool ===');
console.log('Working directory:', process.cwd());
console.log('Script directory:', __dirname);
console.log('');

// Check for Jest config files
console.log('=== Jest Configuration Files ===');
const configFiles = ['jest.config.js', 'jest.final.config.js', 'jest.ci.config.js', 'jest.release.config.js'];
configFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  if (exists) {
    try {
      const config = require(path.resolve(file));
      console.log(`  - testMatch: ${JSON.stringify(config.testMatch || 'not set')}`);
      console.log(`  - testPathIgnorePatterns: ${JSON.stringify(config.testPathIgnorePatterns || 'not set')}`);
      console.log(`  - roots: ${JSON.stringify(config.roots || 'not set')}`);
    } catch (e) {
      console.log(`  - Error reading config: ${e.message}`);
    }
  }
  console.log('');
});

// Check for TypeScript config files
console.log('=== TypeScript Configuration Files ===');
const tsConfigFiles = ['tsconfig.json', 'tsconfig.test.json', 'tsconfig.eslint.json'];
tsConfigFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${file}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  console.log('');
});

// Check for test files
console.log('=== Test Files Search ===');
function findTestFiles(dir, pattern = /.test.ts$/) {
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
          } else if (pattern.test(file)) {
            results.push(fullPath);
          }
        } catch (e) {
          // Ignore permission errors
        }
      });
    } catch (e) {
      console.log(`Error reading directory ${dir}: ${e.message}`);
    }
  }
  walk(dir);
  return results;
}

const testFiles = findTestFiles('.');
console.log(`Found ${testFiles.length} test files:`);
testFiles.forEach(file => {
  console.log(`  - ${file}`);
  // Check if file content looks like a valid test
  try {
    const content = fs.readFileSync(file, 'utf8');
    const hasDescribe = content.includes('describe(') || content.includes('describe (');
    const hasTest = content.includes('it(') || content.includes('test(') || content.includes('it (');
    console.log(`    Has describe: ${hasDescribe}, Has test: ${hasTest}`);
  } catch (e) {
    console.log(`    Error reading file: ${e.message}`);
  }
});
console.log('');

// Check specific directories
console.log('=== Specific Directory Checks ===');
const checkDirs = ['src', 'src/tests', 'tests', 'test'];
checkDirs.forEach(dir => {
  const exists = fs.existsSync(dir);
  console.log(`${dir}/: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
  if (exists) {
    try {
      const files = fs.readdirSync(dir);
      const tsFiles = files.filter(f => f.endsWith('.ts'));
      const testFiles = files.filter(f => f.endsWith('.test.ts'));
      console.log(`  - Total files: ${files.length}`);
      console.log(`  - TypeScript files: ${tsFiles.length}`);
      console.log(`  - Test files: ${testFiles.length}`);
      if (testFiles.length > 0) {
        console.log(`  - Test files: ${testFiles.join(', ')}`);
      }
    } catch (e) {
      console.log(`  - Error reading directory: ${e.message}`);
    }
  }
  console.log('');
});

// Simulate Jest test matching
console.log('=== Jest Pattern Matching Simulation ===');
const patterns = [
  '<rootDir>/src/tests/**/*.test.ts',
  '<rootDir>/src/tests/*.test.ts',
  '**/src/tests/**/*.test.ts',
  '**/src/tests/*.test.ts',
  '*.test.ts',
  '**/*.test.ts'
];

patterns.forEach(pattern => {
  console.log(`Pattern: ${pattern}`);
  const matches = testFiles.filter(file => {
    // Simple pattern matching simulation
    const normalizedPattern = pattern.replace('<rootDir>', '.').replace(/\\/g, '/');
    const normalizedFile = file.replace(/\\/g, '/');
    
    if (normalizedPattern.includes('**')) {
      const parts = normalizedPattern.split('**');
      return parts.every(part => normalizedFile.includes(part));
    } else {
      return normalizedFile.endsWith(normalizedPattern.replace('*.test.ts', '.test.ts'));
    }
  });
  console.log(`  Matches: ${matches.length} files`);
  if (matches.length > 0) {
    matches.forEach(match => console.log(`    - ${match}`));
  }
  console.log('');
});

console.log('=== Recommendations ===');
if (testFiles.length === 0) {
  console.log('❌ No test files found! Check your directory structure.');
} else {
  console.log('✅ Test files found. If Jest still cannot find them, check:');
  console.log('  1. testPathIgnorePatterns in your Jest config');
  console.log('  2. roots configuration');
  console.log('  3. Working directory in CI environment');
  console.log('  4. File permissions and case sensitivity');
}
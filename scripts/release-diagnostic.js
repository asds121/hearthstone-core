#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== GitHub Release Diagnostic Tool ===');
console.log('Working directory:', process.cwd());
console.log('Repository:', process.env.GITHUB_REPOSITORY || 'Unknown');
console.log('Ref:', process.env.GITHUB_REF || 'Unknown');
console.log('Actor:', process.env.GITHUB_ACTOR || 'Unknown');
console.log('');

// 检查环境变量
console.log('=== Environment Variables Check ===');
const importantVars = [
  'GITHUB_TOKEN',
  'GITHUB_REPOSITORY', 
  'GITHUB_REF',
  'GITHUB_REF_NAME',
  'GITHUB_ACTOR',
  'NODE_AUTH_TOKEN'
];

importantVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ SET' : '❌ MISSING'}`);
  if (value && varName.includes('TOKEN')) {
    console.log(`  Length: ${value.length} characters`);
  }
});
console.log('');

// 检查Git状态
console.log('=== Git Status Check ===');
try {
  const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
  console.log('Git status:', gitStatus || 'Clean working directory');
  
  const gitLog = execSync('git log --oneline -5', { encoding: 'utf8' });
  console.log('Recent commits:');
  console.log(gitLog);
} catch (e) {
  console.log('Git command failed:', e.message);
}
console.log('');

// 检查标签
console.log('=== Git Tags Check ===');
try {
  const tags = execSync('git tag --sort=-version:refname | head -10', { encoding: 'utf8' });
  console.log('Recent tags:');
  console.log(tags || 'No tags found');
  
  const currentTag = process.env.GITHUB_REF_NAME;
  if (currentTag) {
    console.log(`Current tag: ${currentTag}`);
    try {
      const tagInfo = execSync(`git show ${currentTag} --quiet`, { encoding: 'utf8' });
      console.log('Tag info found');
    } catch (e) {
      console.log(`Tag ${currentTag} does not exist locally`);
    }
  }
} catch (e) {
  console.log('Tag check failed:', e.message);
}
console.log('');

// 检查构建产物
console.log('=== Build Artifacts Check ===');
const checkDirs = ['dist', 'docs'];
checkDirs.forEach(dir => {
  console.log(`\n--- ${dir} directory ---`);
  if (fs.existsSync(dir)) {
    const stats = fs.statSync(dir);
    console.log(`✅ ${dir} exists`);
    console.log(`  Type: ${stats.isDirectory() ? 'directory' : 'file'}`);
    console.log(`  Size: ${stats.size} bytes`);
    
    try {
      const files = execSync(`find ${dir} -type f | wc -l`, { encoding: 'utf8' });
      console.log(`  File count: ${files.trim()}`);
      
      const size = execSync(`du -sh ${dir} 2>/dev/null || echo "Unknown"`, { encoding: 'utf8' });
      console.log(`  Total size: ${size.trim()}`);
      
      // 列出前几个文件
      const fileList = execSync(`find ${dir} -type f | head -5`, { encoding: 'utf8' });
      console.log(`  Sample files:`);
      fileList.split('\n').filter(f => f).forEach(file => {
        console.log(`    - ${file}`);
        const fileStats = fs.statSync(file);
        console.log(`      Size: ${fileStats.size} bytes`);
      });
    } catch (e) {
      console.log(`  Error checking contents: ${e.message}`);
    }
  } else {
    console.log(`❌ ${dir} does not exist`);
  }
});
console.log('');

// 检查GitHub API连接（如果token可用）
if (process.env.GITHUB_TOKEN) {
  console.log('=== GitHub API Check ===');
  try {
    const repo = process.env.GITHUB_REPOSITORY;
    if (repo) {
      console.log(`Checking repository: ${repo}`);
      
      // 尝试获取release信息
      const currentTag = process.env.GITHUB_REF_NAME;
      if (currentTag) {
        try {
          const releaseCheck = execSync(
            `curl -s -H "Authorization: token ${process.env.GITHUB_TOKEN}" ` +
            `-H "Accept: application/vnd.github.v3+json" ` +
            `https://api.github.com/repos/${repo}/releases/tags/${currentTag}`,
            { encoding: 'utf8' }
          );
          
          const release = JSON.parse(releaseCheck);
          if (release.id) {
            console.log(`✅ Release exists for tag ${currentTag}`);
            console.log(`  Release ID: ${release.id}`);
            console.log(`  Release name: ${release.name}`);
            console.log(`  Assets count: ${release.assets.length}`);
          } else {
            console.log(`ℹ️ No existing release for tag ${currentTag}`);
          }
        } catch (e) {
          console.log(`ℹ️ Could not check release for ${currentTag}: ${e.message}`);
        }
      }
    }
  } catch (e) {
    console.log('GitHub API check failed:', e.message);
  }
} else {
  console.log('=== GitHub API Check ===');
  console.log('❌ GITHUB_TOKEN not available for API checks');
}
console.log('');

// 权限检查
console.log('=== Token Permissions Check ===');
if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPOSITORY) {
  try {
    const repo = process.env.GITHUB_REPOSITORY;
    const permissionsCheck = execSync(
      `curl -s -H "Authorization: token ${process.env.GITHUB_TOKEN}" ` +
      `-H "Accept: application/vnd.github.v3+json" ` +
      `https://api.github.com/repos/${repo}`,
      { encoding: 'utf8' }
    );
    
    const repoInfo = JSON.parse(permissionsCheck);
    console.log(`Repository access: ✅ Success`);
    console.log(`Private repo: ${repoInfo.private ? 'Yes' : 'No'}`);
    console.log(`Permissions: ${repoInfo.permissions ? JSON.stringify(repoInfo.permissions) : 'Unknown'}`);
  } catch (e) {
    console.log(`Repository access: ❌ Failed - ${e.message}`);
  }
}
console.log('');

// 建议
console.log('=== Recommendations ===');
const recommendations = [];

if (!process.env.GITHUB_TOKEN) {
  recommendations.push('❌ Set GITHUB_TOKEN environment variable');
}

if (!fs.existsSync('dist')) {
  recommendations.push('❌ Build the project first (npm run build)');
}

if (!fs.existsSync('docs')) {
  recommendations.push('❌ Generate documentation first (npm run docs)');
}

if (recommendations.length === 0) {
  console.log('✅ All prerequisites appear to be met');
} else {
  recommendations.forEach(rec => console.log(rec));
}

console.log('\n=== Release Action Debugging ===');
console.log('For softprops/action-gh-release troubleshooting:');
console.log('1. Check token has contents:write permission');
console.log('2. Verify tag exists: git tag -l');
console.log('3. Check if release already exists for this tag');
console.log('4. Verify files exist before upload');
console.log('5. Use fail_on_unmatched_files: false to be more permissive');
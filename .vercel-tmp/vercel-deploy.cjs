#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const isWindows = os.platform() === 'win32';

const VERECL_CMD = 'D:\\nodejs_lx-1\\nodejs\\node_globals\\node_modules\\vercel\\dist\\vc.js';

function log(msg) { console.error(msg); }

function checkVercel() {
  if (!fs.existsSync(VERECL_CMD)) {
    log('Error: Vercel CLI not found');
    process.exit(1);
  }
}

function checkLogin() {
  log('Checking login status...');
  try {
    const result = spawnSync('node', [VERECL_CMD, 'whoami'], { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    const output = (result.stdout || '').trim();
    if (result.status === 0 && output && !output.includes('Error')) {
      log(`Logged in as: ${output}`);
      return true;
    }
  } catch {}
  return false;
}

function parseArgs(args) {
  const result = { projectPath: '.', prod: true, yes: false, skipBuild: false };
  for (const arg of args) {
    if (arg === '--prod') result.prod = true;
    else if (arg === '--yes' || arg === '-y') result.yes = true;
    else if (arg === '--skip-build') result.skipBuild = true;
    else if (!arg.startsWith('-')) result.projectPath = arg;
  }
  return result;
}

function doDeploy(projectPath, options) {
  log('Starting Vercel deployment...');
  log('');
  const absPath = path.resolve(projectPath);
  
  const cmdParts = ['-y', '--prod'];
  
  log(`Project: ${absPath}`);
  log(`Environment: Production`);
  log('');
  
  try {
    const result = spawnSync('node', [VERECL_CMD, ...cmdParts], {
      cwd: absPath,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe'],
      timeout: 300000,
      shell: false
    });
    
    const output = (result.stdout || '') + (result.stderr || '');
    log(output);
    
    if (result.status !== 0) {
      throw new Error('Deployment failed');
    }
    
    // Extract URL
    const aliasedMatch = output.match(/Aliased:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const deploymentMatch = output.match(/Production:\s*(https:\/\/[a-zA-Z0-9.-]+\.vercel\.app)/i);
    const finalUrl = aliasedMatch ? aliasedMatch[1] : (deploymentMatch ? deploymentMatch[1] : null);
    
    if (finalUrl) {
      log(`Deployment successful! URL: ${finalUrl}`);
      console.log(JSON.stringify({ status: 'success', url: finalUrl }));
    } else {
      console.log(JSON.stringify({ status: 'success', message: 'Deployment completed' }));
    }
  } catch (error) {
    log(`Deployment error: ${error.message}`);
    process.exit(1);
  }
}

function main() {
  log('Vercel Deploy');
  checkVercel();
  if (!checkLogin()) {
    log('Error: Not logged in');
    process.exit(1);
  }
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  const projectPath = options.projectPath || '.';
  doDeploy(projectPath, options);
}

main();
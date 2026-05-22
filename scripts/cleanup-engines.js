const fs = require('fs');
const path = require('path');

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Removed directory:', dir);
  } catch(e) {}
}

function removeFile(file) {
  if (!fs.existsSync(file)) return;
  try {
    fs.unlinkSync(file);
    console.log('Removed file:', file);
  } catch(e) {}
}

console.log('Cleaning up for Linux deployment...');

// Remove Windows-specific binaries
const windowsDirs = [
  'node_modules/@img/sharp-win32-x64',
  'node_modules/@next/swc-win32-x64-msvc',
  'node_modules/@tailwindcss/oxide-win32-x64-msvc',
  'node_modules/@unrs/resolver-binding-win32-x64-msvc',
  'node_modules/lightningcss-win32-x64-msvc'
];

windowsDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  removeDir(fullPath);
});

// Remove macOS-specific binaries
const macDirs = [
  'node_modules/@img/sharp-darwin-x64',
  'node_modules/@img/sharp-darwin-arm64',
  'node_modules/@next/swc-darwin-x64',
  'node_modules/@next/swc-darwin-arm64',
  'node_modules/@tailwindcss/oxide-darwin-x64',
  'node_modules/@tailwindcss/oxide-darwin-arm64',
  'node_modules/lightningcss-darwin-x64',
  'node_modules/lightningcss-darwin-arm64'
];

macDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  removeDir(fullPath);
});

// Clean @prisma/engines - keep only what's needed
const enginesDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'engines');
if (fs.existsSync(enginesDir)) {
  console.log('Cleaning @prisma/engines...');
  const files = fs.readdirSync(enginesDir);
  files.forEach(f => {
    if (f.includes('darwin') || f.includes('windows') || f.includes('debian') || 
        f.includes('rhel') || f.includes('arm64') || f.includes('musl') ||
        f.includes('mysql') || f.includes('sqlite') || f.includes('cockroachdb') || 
        f.includes('sqlserver') || f.includes('libquery_engine') || f.includes('schema-engine')) {
      const fullPath = path.join(enginesDir, f);
      try {
        fs.unlinkSync(fullPath);
        console.log('Removed:', fullPath);
      } catch(e) {}
    }
  });
}

console.log('\nCleanup complete.');

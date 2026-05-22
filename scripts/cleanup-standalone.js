const fs = require('fs');
const path = require('path');

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Removed directory:', dir);
  } catch(e) {}
}

console.log('Cleaning standalone directory...');

const standaloneDir = path.join(__dirname, '..', '.next', 'standalone');

if (!fs.existsSync(standaloneDir)) {
  console.log('No standalone directory found');
  process.exit(0);
}

// Remove Windows-specific binaries
const windowsDirs = [
  'node_modules/@img/sharp-win32-x64',
  'node_modules/@next/swc-win32-x64-msvc',
  'node_modules/@tailwindcss/oxide-win32-x64-msvc',
  'node_modules/@unrs/resolver-binding-win32-x64-msvc',
  'node_modules/lightningcss-win32-x64-msvc'
];

windowsDirs.forEach(dir => {
  const fullPath = path.join(standaloneDir, dir);
  removeDir(fullPath);
});

// Remove unnecessary packages from standalone
const unnecessaryPackages = [
  'node_modules/@esbuild',
  'node_modules/@babel',
  'node_modules/eslint',
  'node_modules/eslint-config-next',
  'node_modules/eslint-plugin-react',
  'node_modules/eslint-plugin-react-hooks',
  'node_modules/eslint-plugin-jsx-a11y',
  'node_modules/eslint-plugin-import',
  'node_modules/eslint-plugin-react-refresh',
  'node_modules/@typescript-eslint',
];

unnecessaryPackages.forEach(dir => {
  const fullPath = path.join(standaloneDir, dir);
  removeDir(fullPath);
});

console.log('Cleanup complete.');

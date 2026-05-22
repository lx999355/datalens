const fs = require('fs');
const path = require('path');

const enginesDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'engines');

if (!fs.existsSync(enginesDir)) {
  console.log('No @prisma/engines directory found');
  process.exit(0);
}

const files = fs.readdirSync(enginesDir);
let removed = 0;

files.forEach(f => {
  // 只保留 postgresql 和 wasm-engine-edge 相关文件
  if (f.includes('mysql') || f.includes('sqlite') || f.includes('cockroachdb') || f.includes('sqlserver')) {
    const fullPath = path.join(enginesDir, f);
    fs.unlinkSync(fullPath);
    console.log('Removed:', f);
    removed++;
  }
});

console.log(`Cleanup complete. Removed ${removed} unnecessary engine files.`);

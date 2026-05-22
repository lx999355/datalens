const fs = require('fs');
const path = require('path');

function cleanDir(dir) {
  if (!fs.existsSync(dir)) return 0;
  
  const files = fs.readdirSync(dir);
  let removed = 0;
  
  files.forEach(f => {
    // 删除 mysql/sqlite/cockroachdb/sqlserver 相关引擎文件
    if (f.includes('mysql') || f.includes('sqlite') || f.includes('cockroachdb') || f.includes('sqlserver')) {
      const fullPath = path.join(dir, f);
      try {
        fs.unlinkSync(fullPath);
        console.log('Removed:', path.join(dir, f));
        removed++;
      } catch(e) {}
    }
  });
  
  return removed;
}

// 清理 @prisma/engines
const enginesDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'engines');
console.log('Cleaning @prisma/engines...');
let total = cleanDir(enginesDir);

// 清理 @prisma/client
const clientDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'client');
console.log('Cleaning @prisma/client...');
total += cleanDir(clientDir);

// 清理 .prisma
const dotPrismaDir = path.join(__dirname, '..', 'node_modules', '.prisma');
console.log('Cleaning .prisma...');
total += cleanDir(dotPrismaDir);

console.log(`\nCleanup complete. Removed ${total} files.`);

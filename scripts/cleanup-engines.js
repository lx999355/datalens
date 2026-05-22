const fs = require('fs');
const path = require('path');

function cleanDir(dir, patterns) {
  if (!fs.existsSync(dir)) return 0;
  
  const files = fs.readdirSync(dir);
  let removed = 0;
  
  files.forEach(f => {
    const shouldRemove = patterns.some(pattern => f.includes(pattern));
    if (shouldRemove) {
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

function removeDir(dir) {
  if (!fs.existsSync(dir)) return;
  try {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Removed directory:', dir);
  } catch(e) {}
}

// 清理 @prisma/engines - 只保留 linux 版本
const enginesDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'engines');
console.log('Cleaning @prisma/engines...');
let total = cleanDir(enginesDir, [
  'darwin', 'windows', 'debian', 'rhel', 'arm64', 'musl',
  'mysql', 'sqlite', 'cockroachdb', 'sqlserver',
  'libquery_engine', 'schema-engine'
]);

// 清理 @prisma/client - 只保留 linux postgresql 引擎
const clientDir = path.join(__dirname, '..', 'node_modules', '@prisma', 'client');
console.log('Cleaning @prisma/client...');
total += cleanDir(clientDir, [
  'darwin', 'windows', 'debian', 'rhel', 'arm64', 'musl',
  'mysql', 'sqlite', 'cockroachdb', 'sqlserver',
  'libquery_engine', 'schema-engine'
]);

// 清理 .prisma - 只保留 linux postgresql 引擎
const dotPrismaDir = path.join(__dirname, '..', 'node_modules', '.prisma');
console.log('Cleaning .prisma...');
total += cleanDir(dotPrismaDir, [
  'darwin', 'windows', 'debian', 'rhel', 'arm64', 'musl',
  'mysql', 'sqlite', 'cockroachdb', 'sqlserver',
  'libquery_engine', 'schema-engine'
]);

// 删除客户端库的 node_modules 目录（它们已被 Next.js 打包到客户端 JS bundle 中，运行时不再需要）
const clientLibs = ['recharts', 'html2canvas', 'xlsx'];
clientLibs.forEach(lib => {
  const libDir = path.join(__dirname, '..', 'node_modules', lib);
  if (fs.existsSync(libDir)) {
    removeDir(libDir);
    total++;
  }
});

// 删除客户端库的依赖（这些库的依赖也可能很大）
const clientDeps = [
  'd3', 'd3-scale', 'd3-shape', 'd3-array', 'd3-interpolate', 'd3-format', 'd3-time', 'd3-time-format',
  'd3-color', 'd3-ease', 'd3-interpolate', 'd3-path', 'd3-geo', 'd3-geo-projection',
  'internmap', 'robust-predicates', ' delaunator',
  'canvg', 'css-line-break', 'html2canvas-pro'
];
clientDeps.forEach(dep => {
  const depDir = path.join(__dirname, '..', 'node_modules', dep);
  if (fs.existsSync(depDir)) {
    removeDir(depDir);
    total++;
  }
});

console.log(`\nCleanup complete. Removed ${total} files/directories.`);

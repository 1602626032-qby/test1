const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const indexHtml = path.join(dist, 'index.html');
const assetsDir = path.join(dist, 'assets');
const outHtml = path.join(root, '个人工作台.html');
const outAssets = path.join(root, 'assets');

if (!fs.existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run build first.');
  process.exit(1);
}

fs.copyFileSync(indexHtml, outHtml);
console.log('Created 个人工作台.html');

if (fs.existsSync(assetsDir)) {
  if (fs.existsSync(outAssets)) fs.rmSync(outAssets, { recursive: true });
  fs.cpSync(assetsDir, outAssets, { recursive: true });
  console.log('Created assets/');
}

console.log('Done. Double-click 个人工作台.html to open in browser.');

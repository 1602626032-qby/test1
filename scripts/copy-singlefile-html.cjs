const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexHtml = path.join(root, 'dist', 'index.html');
const outHtml = path.join(root, '个人工作台.html');

if (!fs.existsSync(indexHtml)) {
  console.error('dist/index.html not found. Run build:singlefile first.');
  process.exit(1);
}

fs.copyFileSync(indexHtml, outHtml);
console.log('Created 个人工作台.html (single file, double-click to open)');

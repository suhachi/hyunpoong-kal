// scripts/print-dist-size.cjs
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function getDirSize(dir) {
  let total = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      total += getDirSize(fullPath);
    } else {
      total += fs.statSync(fullPath).size;
    }
  }

  return total;
}

if (!fs.existsSync(distPath)) {
  console.error('dist 디렉터리가 없습니다. 먼저 `npm run build`를 실행해주세요.');
  process.exit(1);
}

const distSize = getDirSize(distPath);

console.log('📦 dist 전체 크기:', formatBytes(distSize));

const assetsPath = path.join(distPath, 'assets');
if (fs.existsSync(assetsPath)) {
  console.log('\n📁 dist/assets 파일별 크기:');
  const assets = fs.readdirSync(assetsPath);
  const assetFiles = [];
  
  for (const file of assets) {
    const fullPath = path.join(assetsPath, file);
    const size = fs.statSync(fullPath).size;
    assetFiles.push({ name: file, size });
  }
  
  // 크기 순으로 정렬 (큰 것부터)
  assetFiles.sort((a, b) => b.size - a.size);
  
  for (const asset of assetFiles) {
    console.log(`- ${asset.name}: ${formatBytes(asset.size)}`);
  }
  
  // JS 파일만 필터링하여 요약
  const jsFiles = assetFiles.filter(f => f.name.endsWith('.js'));
  if (jsFiles.length > 0) {
    const totalJsSize = jsFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(`\n📊 JS 파일 총합: ${formatBytes(totalJsSize)} (${jsFiles.length}개 파일)`);
  }
  
  // CSS 파일만 필터링하여 요약
  const cssFiles = assetFiles.filter(f => f.name.endsWith('.css'));
  if (cssFiles.length > 0) {
    const totalCssSize = cssFiles.reduce((sum, f) => sum + f.size, 0);
    console.log(`📊 CSS 파일 총합: ${formatBytes(totalCssSize)} (${cssFiles.length}개 파일)`);
  }
} else {
  console.log('\n(dist/assets 디렉터리가 없습니다.)');
}

console.log('\n✅ 분석 완료');


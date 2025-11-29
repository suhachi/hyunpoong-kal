#!/usr/bin/env node
/**
 * 빌드 산출물에서 appspot.com 검색 및 검증
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_DIR = join(__dirname, '..', 'dist');
const PATTERN = /appspot\.com/;

function searchInDirectory(dir) {
  const results = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...searchInDirectory(fullPath));
    } else if (stat.isFile()) {
      try {
        const content = readFileSync(fullPath, 'utf8');
        if (PATTERN.test(content)) {
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            if (PATTERN.test(line)) {
              // FATAL 가드 메시지 내부의 appspot.com은 허용
              // "appspot.com"이 FATAL 에러 메시지나 가드 로직 내부에 있는지 확인
              const isFatalGuard = 
                line.includes('FATAL') ||
                line.includes('WRONG STORAGE BUCKET') ||
                line.includes('INVALID_STORAGE_BUCKET') ||
                line.includes('includes("appspot.com")') ||
                line.includes("includes('appspot.com')") ||
                line.includes('.includes("appspot.com")') ||
                line.includes(".includes('appspot.com')");
              
              // FATAL 가드가 아닌 경우에만 결과에 추가
              if (!isFatalGuard) {
                results.push({
                  file: fullPath.replace(DIST_DIR + '\\', '').replace(DIST_DIR + '/', ''),
                  line: index + 1,
                  content: line.trim().substring(0, 100),
                });
              }
            }
          });
        }
      } catch (err) {
        // 바이너리 파일 등은 무시
      }
    }
  }

  return results;
}

console.log('======================================');
console.log('빌드 산출물 검증: appspot.com 검색');
console.log('======================================\n');

try {
  const results = searchInDirectory(DIST_DIR);

  if (results.length > 0) {
    console.error('❌ 빌드 산출물에 appspot.com 발견!');
    console.error('\n발견된 위치:');
    results.slice(0, 10).forEach((result) => {
      console.error(`  - ${result.file}:${result.line}`);
      console.error(`    ${result.content}`);
    });
    if (results.length > 10) {
      console.error(`  ... 외 ${results.length - 10}개 더`);
    }
    console.error('\n💡 조치:');
    console.error('  1. 소스 코드에서 appspot.com 사용 여부 확인');
    console.error('  2. 환경 변수 VITE_FIREBASE_STORAGE_BUCKET 확인');
    console.error('  3. 빌드 캐시 삭제 후 재빌드: rm -rf dist && npm run build');
    process.exit(1);
  } else {
    console.log('✅ 빌드 검증 통과: appspot.com 없음');
    console.log('✅ 배포 준비 완료');
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('❌ dist 폴더를 찾을 수 없습니다.');
    console.error('💡 먼저 npm run build를 실행하세요.');
    process.exit(1);
  } else {
    console.error('❌ 검증 중 오류 발생:', err.message);
    process.exit(1);
  }
}


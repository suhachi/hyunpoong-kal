#!/usr/bin/env node
import { Storage } from '@google-cloud/storage';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('======================================');
console.log('Firebase Storage CORS 설정');
console.log('프로젝트: hyun-poong');
console.log('======================================\n');

// 버킷 이름과 프로젝트 ID를 명시적으로 지정
const BUCKET_NAME = process.env.STORAGE_BUCKET_NAME || 'hyun-poong.firebasestorage.app';
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT || 'hyun-poong';
const CORS_FILE = join(__dirname, '..', 'cors.json');

console.log('📋 설정 정보:');
console.log(`   프로젝트 ID: ${PROJECT_ID}`);
console.log(`   버킷 이름  : ${BUCKET_NAME}\n`);

async function applyCors() {
    try {
        // 1. CORS 파일 읽기
        console.log('🔍 Step 1: CORS 설정 파일 읽기...');
        const corsConfig = JSON.parse(readFileSync(CORS_FILE, 'utf8'));
        console.log('✅ cors.json 파일 로드 완료\n');

        // 2. Storage 클라이언트 초기화 (프로젝트 ID 명시)
        console.log('🔍 Step 2: Google Cloud Storage 클라이언트 초기화...');
        const storage = new Storage({
            projectId: PROJECT_ID,
        });
        const bucket = storage.bucket(BUCKET_NAME);
        console.log(`✅ 버킷 연결: ${BUCKET_NAME}`);
        console.log(`✅ 프로젝트 ID: ${PROJECT_ID}\n`);

        // 3. 현재 CORS 설정 확인
        console.log('🔍 Step 3: 현재 CORS 설정 확인...');
        try {
            const [metadata] = await bucket.getMetadata();
            if (metadata.cors && metadata.cors.length > 0) {
                console.log('⚠️  기존 CORS 설정이 있습니다:');
                console.log(JSON.stringify(metadata.cors, null, 2));
                console.log('');
            } else {
                console.log('✅ 기존 CORS 설정 없음\n');
            }
        } catch (err) {
            console.log('⚠️  CORS 설정 확인 실패 (무시하고 계속)\n');
        }

        // 4. CORS 설정 적용
        console.log('🚀 Step 4: CORS 설정 적용 중...');
        await bucket.setCorsConfiguration(corsConfig);
        console.log('✅ CORS 설정이 성공적으로 적용되었습니다!\n');

        // 5. 적용된 설정 확인
        console.log('🔍 Step 5: 적용된 CORS 설정 확인...');
        const [updatedMetadata] = await bucket.getMetadata();
        console.log('======================================');
        console.log(JSON.stringify(updatedMetadata.cors, null, 2));
        console.log('======================================\n');

        // 6. 완료
        console.log('======================================');
        console.log('✨ CORS 설정 완료!');
        console.log('======================================\n');
        console.log('📌 다음 도메인에서 Storage 접근 가능:');
        console.log('  ✅ https://hyun-poong.web.app');
        console.log('  ✅ https://hyun-poong.firebaseapp.com');
        console.log('  ✅ http://localhost:5173');
        console.log(`\n📦 적용된 버킷: ${BUCKET_NAME}\n`);
        console.log('🧪 테스트 방법:');
        console.log('  1. 관리자 페이지 > 메뉴 관리 > 이미지 업로드');
        console.log('  2. 고객 앱 > 리뷰 작성 > 사진 추가');
        console.log('  3. 브라우저 개발자 도구 > Network 탭 확인\n');

    } catch (error) {
        console.error('\n❌ CORS 설정 적용 실패:');
        console.error('에러 메시지:', error.message);
        if (error.code) {
            console.error('에러 코드:', error.code);
        }
        if (error.stack) {
            console.error('\n스택 트레이스:');
            console.error(error.stack);
        }

        if (error.code === 'ENOENT') {
            console.error('\n💡 cors.json 파일을 찾을 수 없습니다.');
            console.error('   프로젝트 루트에 cors.json 파일이 있는지 확인하세요.');
        } else if (error.code === 403) {
            console.error('\n💡 권한 오류: Firebase 프로젝트에 대한 Storage Admin 권한이 필요합니다.');
            console.error('   다음 명령어를 순서대로 실행하세요:');
            console.error('   1. gcloud config set project hyun-poong');
            console.error('   2. gcloud auth application-default login');
        } else if (error.code === 404) {
            console.error('\n💡 버킷을 찾을 수 없습니다.');
            console.error(`   버킷 이름: ${BUCKET_NAME}`);
            console.error(`   프로젝트 ID: ${PROJECT_ID}`);
            console.error('\n   다음을 확인하세요:');
            console.error('   1. Firebase Console에서 버킷 이름 확인');
            console.error('   2. gcloud config set project hyun-poong 실행');
            console.error('   3. gsutil ls gs://hyun-poong.firebasestorage.app 로 버킷 존재 확인');
        } else if (error.message && error.message.includes('User project specified in the request is invalid')) {
            console.error('\n💡 프로젝트 ID 불일치 오류');
            console.error(`   현재 프로젝트 ID: ${PROJECT_ID}`);
            console.error(`   버킷 이름: ${BUCKET_NAME}`);
            console.error('\n   다음을 확인하세요:');
            console.error('   1. gcloud config set project hyun-poong');
            console.error('   2. gcloud auth application-default login');
            console.error('   3. gcloud config get-value project 로 현재 프로젝트 확인');
        }

        process.exit(1);
    }
}

applyCors();

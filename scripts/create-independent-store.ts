#!/usr/bin/env node
/**
 * 완전 독립 앱 복제 스크립트
 * 
 * 현풍닭칼국수 PWA 템플릿을 기반으로 새 가게 전용 앱을 clones/{storeId}/ 아래에 생성합니다.
 * 
 * 사용법:
 *   npx tsx scripts/create-independent-store.ts
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 경고 메시지
console.log(`
⚠️  이 스크립트는 "현풍닭칼국수 템플릿"을 기반으로
    완전히 독립된 새 가게 전용 앱을 clones/{storeId}/ 아래에 생성합니다.

- 원본 Firebase 프로젝트/키는 복제하지 않습니다.
- 새 사장님은 README_STORE.md를 보고 직접 Firebase 프로젝트를 만들고 배포해야 합니다.
`);

interface StoreConfig {
  storeId: string;
  storeName: string;
  ownerName: string;
  defaultLocale: string;
  baseDomain?: string;
}

/**
 * CLI 질문을 통해 스토어 설정을 수집
 */
async function collectStoreConfig(): Promise<StoreConfig> {
  const response = await prompts([
    {
      type: 'text',
      name: 'storeId',
      message: '스토어 ID를 입력하세요 (예: hp_store_gangnam)',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return '스토어 ID는 필수입니다.';
        }
        if (!/^[a-z0-9_]+$/.test(value)) {
          return '스토어 ID는 소문자, 숫자, 언더스코어만 사용 가능합니다.';
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'storeName',
      message: '가게 이름을 입력하세요 (예: 현풍닭칼국수 강남점)',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return '가게 이름은 필수입니다.';
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'ownerName',
      message: '사장님 이름을 입력하세요 (예: 홍길동)',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return '사장님 이름은 필수입니다.';
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'defaultLocale',
      message: '기본 로케일을 입력하세요',
      initial: 'ko-KR',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return '기본 로케일은 필수입니다.';
        }
        return true;
      },
    },
    {
      type: 'text',
      name: 'baseDomain',
      message: '기본 도메인을 입력하세요 (선택, 나중에 설정 가능)',
      initial: '',
    },
  ]);

  if (!response.storeId || !response.storeName || !response.ownerName || !response.defaultLocale) {
    console.error('❌ 필수 입력값이 누락되었습니다.');
    process.exit(1);
  }

  return {
    storeId: response.storeId.trim(),
    storeName: response.storeName.trim(),
    ownerName: response.ownerName.trim(),
    defaultLocale: response.defaultLocale.trim(),
    baseDomain: response.baseDomain?.trim() || undefined,
  };
}

/**
 * 출력 경로 결정 및 중복 확인
 */
async function resolveTargetDir(storeId: string): Promise<string> {
  const targetDir = path.join(rootDir, 'clones', storeId);

  // 이미 디렉터리가 존재하는지 확인
  if (await fs.pathExists(targetDir)) {
    const response = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `clones/${storeId} 디렉터리가 이미 존재합니다. 덮어쓰시겠습니까? (기본값: 아니오)`,
      initial: false,
    });

    if (!response.overwrite) {
      console.log('❌ 작업이 취소되었습니다.');
      process.exit(0);
    }

    // 덮어쓰기 선택 시 기존 디렉터리 삭제
    console.log(`🗑️  기존 디렉터리 삭제 중: ${targetDir}`);
    await fs.remove(targetDir);
  }

  return targetDir;
}

/**
 * 작업 요약 출력 및 최종 확인
 */
async function confirmOperation(config: StoreConfig, targetDir: string): Promise<boolean> {
  console.log('\n📋 작업 요약:');
  console.log(`   스토어 ID: ${config.storeId}`);
  console.log(`   가게 이름: ${config.storeName}`);
  console.log(`   사장님: ${config.ownerName}`);
  console.log(`   출력 경로: ${targetDir}`);
  console.log('\n예상 작업:');
  console.log('  ✓ clones/{storeId} 디렉터리 생성');
  console.log('  ✓ 원본 코드/설정 복사');
  console.log('  ✓ package.json / README / env 예시 재작성');
  console.log('  ✓ 가게 정보 초기화\n');

  const response = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: '위 작업을 진행하시겠습니까?',
    initial: true,
  });

  return response.proceed === true;
}

// 복제 대상 파일/디렉터리
const COPY_INCLUDE = [
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
  'public',
  'src',
  'postcss.config.cjs',
  'tailwind.config.cjs',
  '.gitignore',
] as const;

const COPY_EXCLUDE = [
  'node_modules',
  'dist',
  '.firebase',
  '.git',
  '.turbo',
  '.vscode',
  'clones',
];

/**
 * 파일 복사 (필터 적용)
 */
async function copyFiles(sourceDir: string, targetDir: string): Promise<void> {
  for (const item of COPY_INCLUDE) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    if (!(await fs.pathExists(sourcePath))) {
      console.log(`⚠️  경고: ${item} 파일/디렉터리가 없습니다. 건너뜁니다.`);
      continue;
    }

    const stat = await fs.stat(sourcePath);
    if (stat.isDirectory()) {
      await fs.copy(sourcePath, targetPath, {
        filter: (src) => {
          const relativePath = path.relative(sourceDir, src);
          return !COPY_EXCLUDE.some(exclude => relativePath.includes(exclude));
        },
      });
    } else {
      await fs.copy(sourcePath, targetPath);
    }
    console.log(`  ✓ ${item}`);
  }
}

/**
 * package.json 재작성
 */
async function rewritePackageJson(targetDir: string, config: StoreConfig): Promise<void> {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);

  packageJson.name = `hp-store-${config.storeId}`;
  packageJson.version = '0.1.0';
  packageJson.description = `${config.storeName} 전용 현풍닭칼국수 PWA 앱`;

  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  console.log('  ✓ package.json 재작성 완료');
}

/**
 * .env.local.example 생성
 */
async function createEnvExample(targetDir: string, config: StoreConfig): Promise<void> {
  const envExamplePath = path.join(targetDir, '.env.local.example');
  const envContent = `# ${config.storeName} 전용 앱용 환경변수 예시
VITE_APP_NAME="${config.storeName}"
VITE_STORE_ID="${config.storeId}"

# Firebase 설정 (새 프로젝트 생성 후 여기 채워 넣기)
VITE_FIREBASE_API_KEY=__FILL_ME__
VITE_FIREBASE_AUTH_DOMAIN=__FILL_ME__
VITE_FIREBASE_PROJECT_ID=__FILL_ME__
VITE_FIREBASE_STORAGE_BUCKET=__FILL_ME__
VITE_FIREBASE_MESSAGING_SENDER_ID=__FILL_ME__
VITE_FIREBASE_APP_ID=__FILL_ME__
VITE_FIREBASE_MEASUREMENT_ID=__OPTIONAL__

# 지도 API 키
VITE_KAKAO_MAP_KEY=__OPTIONAL__
VITE_GOOGLE_MAPS_API_KEY=__OPTIONAL__

# 모드
VITE_USE_FIREBASE=true
`;

  await fs.writeFile(envExamplePath, envContent, 'utf-8');
  console.log('  ✓ .env.local.example 생성 완료');
}

/**
 * src/config/env.ts 수정 (가게 정보 초기화)
 */
async function updateStoreConfig(targetDir: string, config: StoreConfig): Promise<void> {
  const envTsPath = path.join(targetDir, 'src', 'config', 'env.ts');
  
  if (!(await fs.pathExists(envTsPath))) {
    console.log(`⚠️  경고: ${envTsPath} 파일이 없습니다. 건너뜁니다.`);
    return;
  }

  let content = await fs.readFile(envTsPath, 'utf-8');
  
  // APP_CONFIG.name 수정
  content = content.replace(
    /name:\s*['"](?:현풍닭칼국수|.*?)['"]/,
    `name: import.meta.env.VITE_APP_NAME || '${config.storeName}'`
  );
  
  // APP_CONFIG.company 수정
  content = content.replace(
    /company:\s*['"](?:KS컴퍼니|.*?)['"]/,
    `company: '${config.ownerName}'`
  );
  
  // APP_CONFIG.version을 0.1.0으로
  content = content.replace(
    /version:\s*['"](?:1\.0\.0|.*?)['"]/,
    `version: '0.1.0'`
  );

  await fs.writeFile(envTsPath, content, 'utf-8');
  console.log('  ✓ src/config/env.ts 수정 완료');
}

/**
 * 메뉴 초기 데이터 초기화 (menus.json을 빈 배열로)
 */
async function initializeMenuData(targetDir: string): Promise<void> {
  const menusJsonPath = path.join(targetDir, 'src', 'data', 'menus.json');
  
  if (!(await fs.pathExists(menusJsonPath))) {
    // menus.json이 없으면 생성
    await fs.ensureDir(path.dirname(menusJsonPath));
    await fs.writeJson(menusJsonPath, [], { spaces: 2 });
  } else {
    // 기존 파일을 빈 배열로 교체
    await fs.writeJson(menusJsonPath, [], { spaces: 2 });
  }
  console.log('  ✓ 메뉴 초기 데이터 초기화 완료 (빈 배열)');
}

/**
 * README_STORE.md 생성
 */
async function createStoreReadme(targetDir: string, config: StoreConfig): Promise<void> {
  const readmePath = path.join(targetDir, 'README_STORE.md');
  const readmeContent = `# ${config.storeName} 전용 주문 앱

이 리포지토리는 **${config.storeName}** 사장님 전용 현풍닭칼국수 주문앱입니다.  
원본 템플릿과 완전히 분리된 독립 앱입니다.

## 📋 준비물

- Firebase 계정
- Firebase 새 프로젝트 생성 권한
- Node.js 18+ 설치

## 🚀 설치 방법

\`\`\`bash
# 1. 의존성 설치
npm install

# 2. 환경변수 파일 생성
cp .env.local.example .env.local

# 3. .env.local 파일을 열어서 Firebase 설정값 채우기
# (Firebase 콘솔에서 새 프로젝트 생성 후 설정값 복사)

# 4. 개발 서버 실행
npm run dev
\`\`\`

## 📦 빌드 및 배포

\`\`\`bash
# 1. 프로덕션 빌드
npm run build

# 2. Firebase Hosting 배포
firebase deploy --only hosting
\`\`\`

## 🔐 관리자 로그인

초기 관리자 계정은 Firebase 콘솔에서 생성해야 합니다:

1. Firebase Console → Authentication → Users
2. "Add user" 클릭
3. 이메일/비밀번호로 계정 생성
4. Firestore에서 해당 사용자의 \`role\` 필드를 \`owner\`로 설정

자세한 내용은 \`docs/STORE_SETUP_GUIDE_${config.storeId}.md\`를 참고하세요.

## 📚 추가 문서

- [상세 설정 가이드](./docs/STORE_SETUP_GUIDE_${config.storeId}.md)
- [원본 템플릿 문서](../docs/STORE_CLONER_SPEC.md)

## ⚠️ 주의사항

- 이 앱은 원본 현풍닭칼국수 앱과 완전히 독립되어 있습니다.
- Firebase 프로젝트는 새로 생성해야 합니다.
- 메뉴는 관리자 대시보드에서 직접 등록해야 합니다.

## 📞 문의

설정 중 문제가 발생하면 원본 템플릿 관리자에게 문의하세요.
`;

  await fs.writeFile(readmePath, readmeContent, 'utf-8');
  console.log('  ✓ README_STORE.md 생성 완료');
}

/**
 * 상세 셋업 가이드 생성
 */
async function createSetupGuide(targetDir: string, config: StoreConfig): Promise<void> {
  const docsDir = path.join(targetDir, 'docs');
  await fs.ensureDir(docsDir);
  
  const guidePath = path.join(docsDir, `STORE_SETUP_GUIDE_${config.storeId}.md`);
  const guideContent = `# ${config.storeName} 설정 가이드

이 문서는 ${config.storeName} 앱을 처음 설정하는 방법을 안내합니다.

## 1. Firebase 프로젝트 생성

### 1-1. Firebase Console 접속

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: "${config.storeName.replace(/"/g, '')}")
4. Google Analytics 설정 (선택 사항)
5. 프로젝트 생성 완료

### 1-2. Firebase 서비스 활성화

다음 서비스를 활성화해야 합니다:

- **Authentication** (인증)
  - 이메일/비밀번호 로그인 활성화
- **Firestore Database** (데이터베이스)
  - 프로덕션 모드로 시작 (나중에 보안 규칙 설정)
- **Storage** (파일 저장소, 선택)
  - 메뉴 이미지 업로드용
- **Hosting** (웹 호스팅)
  - 웹 앱 배포용

### 1-3. Firebase 설정값 확인

Firebase Console → 프로젝트 설정 → 일반 탭에서 다음 값을 확인:

- API 키
- Auth 도메인
- 프로젝트 ID
- Storage 버킷
- 메시징 발신자 ID
- 앱 ID
- 측정 ID (선택)

## 2. 환경변수 설정

\`\`\`bash
# .env.local 파일 열기
# (Windows: notepad .env.local)
# (Mac/Linux: nano .env.local)
\`\`\`

Firebase Console에서 확인한 값들을 아래 형식으로 입력:

\`\`\`env
VITE_APP_NAME="${config.storeName}"
VITE_STORE_ID="${config.storeId}"

VITE_FIREBASE_API_KEY=여기에_API_키_입력
VITE_FIREBASE_AUTH_DOMAIN=여기에_AUTH_도메인_입력
VITE_FIREBASE_PROJECT_ID=여기에_프로젝트_ID_입력
VITE_FIREBASE_STORAGE_BUCKET=여기에_STORAGE_버킷_입력
VITE_FIREBASE_MESSAGING_SENDER_ID=여기에_메시징_발신자_ID_입력
VITE_FIREBASE_APP_ID=여기에_앱_ID_입력
VITE_FIREBASE_MEASUREMENT_ID=여기에_측정_ID_입력 (선택)

# 지도 API 키 (선택)
VITE_KAKAO_MAP_KEY=여기에_Kakao_지도_키_입력
VITE_GOOGLE_MAPS_API_KEY=여기에_Google_지도_키_입력

# Firebase 사용 모드
VITE_USE_FIREBASE=true
\`\`\`

## 3. Firestore 보안 규칙 설정

Firebase Console → Firestore Database → 규칙 탭에서 다음 규칙을 설정:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 주문: 인증된 사용자만 읽기/쓰기
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    
    // 메뉴: 모든 사용자 읽기, 관리자만 쓰기
    match /menus/{menuId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'owner';
    }
    
    // 사용자: 자신의 데이터만 읽기/쓰기
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 기타 컬렉션은 필요에 따라 설정
  }
}
\`\`\`

> ⚠️ **주의**: 위 규칙은 기본 예시입니다. 실제 운영 환경에 맞게 수정해야 합니다.

## 4. 초기 관리자 계정 생성

### 4-1. Firebase Authentication에서 사용자 생성

1. Firebase Console → Authentication → Users
2. "사용자 추가" 클릭
3. 이메일/비밀번호 입력 (예: admin@${config.storeId}.com)
4. 사용자 생성

### 4-2. Firestore에서 관리자 권한 부여

1. Firebase Console → Firestore Database → 데이터 탭
2. \`users\` 컬렉션 생성 (없는 경우)
3. 문서 ID를 방금 생성한 사용자의 UID로 설정
4. 다음 필드 추가:
   \`\`\`json
   {
     "email": "admin@${config.storeId}.com",
     "role": "owner",
     "displayName": "${config.ownerName}",
     "createdAt": "2025-11-21T00:00:00Z"
   }
   \`\`\`

## 5. Firebase Hosting 설정

### 5-1. Firebase CLI 설치 (아직 안 했다면)

\`\`\`bash
npm install -g firebase-tools
firebase login
\`\`\`

### 5-2. Firebase 프로젝트 연결

\`\`\`bash
firebase init hosting
\`\`\`

질문에 답변:
- 프로젝트 선택: 방금 만든 Firebase 프로젝트
- Public directory: \`dist\`
- Single-page app: \`Yes\`
- GitHub Actions: \`No\` (또는 원하는 대로)

### 5-3. 배포

\`\`\`bash
npm run build
firebase deploy --only hosting
\`\`\`

배포 완료 후 제공되는 URL로 앱에 접속할 수 있습니다.

## 6. 초기 메뉴 등록

1. 배포된 앱에 접속
2. 관리자 계정으로 로그인
3. 관리자 대시보드 → 메뉴 관리
4. "메뉴 추가" 버튼으로 메뉴 등록

## 7. (선택) 지도 API 설정

### Kakao Maps API

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 애플리케이션 생성
3. JavaScript 키 발급
4. 플랫폼 등록 (도메인 추가)
5. \`.env.local\`에 \`VITE_KAKAO_MAP_KEY\` 추가

### Google Maps API

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Maps JavaScript API 활성화
3. Geocoding API 활성화
4. API 키 생성
5. \`.env.local\`에 \`VITE_GOOGLE_MAPS_API_KEY\` 추가

## 8. 체크리스트

배포 전 확인 사항:

- [ ] Firebase 프로젝트 생성 완료
- [ ] Authentication 활성화 및 이메일/비밀번호 로그인 설정
- [ ] Firestore Database 생성 및 보안 규칙 설정
- [ ] Storage 활성화 (이미지 업로드용)
- [ ] Hosting 활성화
- [ ] \`.env.local\` 파일에 모든 Firebase 설정값 입력
- [ ] 초기 관리자 계정 생성 및 \`role: owner\` 설정
- [ ] \`npm run build\` 성공
- [ ] \`firebase deploy --only hosting\` 성공
- [ ] 배포된 앱에서 관리자 로그인 성공
- [ ] 메뉴 등록 테스트 성공

## 문제 해결

### 빌드 실패

- \`.env.local\` 파일이 올바르게 설정되었는지 확인
- \`npm install\` 재실행
- Node.js 버전 확인 (18+ 필요)

### 로그인 실패

- Firebase Authentication에서 이메일/비밀번호 로그인이 활성화되었는지 확인
- Firestore에 사용자 문서가 생성되었는지 확인
- \`role\` 필드가 \`owner\`로 설정되었는지 확인

### 배포 실패

- Firebase CLI 로그인 상태 확인: \`firebase login\`
- 프로젝트 연결 확인: \`firebase projects:list\`
- \`firebase.json\` 파일 확인

## 추가 지원

설정 중 문제가 발생하면 원본 템플릿 관리자에게 문의하세요.
`;

  await fs.writeFile(guidePath, guideContent, 'utf-8');
  console.log(`  ✓ docs/STORE_SETUP_GUIDE_${config.storeId}.md 생성 완료`);
}

/**
 * 메인 함수
 */
async function main() {
  let targetDir: string | null = null;
  
  try {
    // 1. 스토어 설정 수집
    const config = await collectStoreConfig();

    // 2. 출력 경로 결정
    targetDir = await resolveTargetDir(config.storeId);

    // 3. 작업 확인
    const shouldProceed = await confirmOperation(config, targetDir);
    if (!shouldProceed) {
      console.log('❌ 작업이 취소되었습니다.');
      process.exit(0);
    }

    // 4. 디렉터리 생성
    console.log(`\n📁 디렉터리 생성 중: ${targetDir}`);
    await fs.ensureDir(targetDir);

    // 5. 파일 복사
    console.log('\n📋 파일 복사 중...');
    await copyFiles(rootDir, targetDir);

    // 6. package.json 재작성
    console.log('\n✏️  설정 파일 수정 중...');
    await rewritePackageJson(targetDir, config);

    // 7. .env.local.example 생성
    await createEnvExample(targetDir, config);

    // 8. 가게 정보 초기화
    await updateStoreConfig(targetDir, config);

    // 9. 메뉴 초기 데이터 초기화
    await initializeMenuData(targetDir);

    // 10. README 및 가이드 생성
    console.log('\n📝 문서 생성 중...');
    await createStoreReadme(targetDir, config);
    await createSetupGuide(targetDir, config);

    console.log('\n✅ 복제 완료!');
    console.log(`\n생성된 디렉터리: ${targetDir}`);
    console.log('\n다음 단계:');
    console.log(`  1. cd ${path.relative(rootDir, targetDir)}`);
    console.log('  2. npm install');
    console.log('  3. cp .env.local.example .env.local');
    console.log('  4. .env.local 파일을 채워 넣기');
    console.log('  5. npm run build');
    console.log('  6. firebase deploy --only hosting');

  } catch (error) {
    console.error('❌ 에러 발생:', error);
    
    // 롤백: 생성된 디렉터리 삭제
    if (targetDir && await fs.pathExists(targetDir)) {
      console.log(`\n🗑️  롤백: 생성된 디렉터리 삭제 중: ${targetDir}`);
      await fs.remove(targetDir);
      console.log('✅ 롤백 완료');
    }
    
    process.exit(1);
  }
}

// 스크립트 실행
main();


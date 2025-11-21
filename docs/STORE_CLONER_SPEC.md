# 완전 독립 앱 복제 스크립터 명세서

## 목적

현풍닭칼국수 PWA 리포지토리를 "마스터 템플릿"으로 사용하여,  
`scripts/create-independent-store.ts` 스크립트 하나로  
새 폴더에 완전히 독립된 앱(코드+설정+문서)을 복제하고,  
다른 가게 사장님에게 그대로 넘길 수 있는 형태로 만든다.

**핵심 원칙: 원본 앱(hyun-poong)과 코드/환경/데이터가 절대 섞이지 않는다.**

---

## "완전히 독립된 복제 앱" 기준

### ✅ 자동으로 처리되는 항목

1. **별도 코드 디렉터리**
   - `clones/{storeId}/` 아래에 완전한 앱 프로젝트 생성
   - 원본과 완전히 분리된 파일 시스템

2. **별도 package.json**
   - `name`: `hp-store-{storeId}` 또는 `{storeId}-hp` 형식으로 변경
   - `description`: `{storeName} 전용 현풍닭칼국수 PWA 앱` 형식
   - `version`: `0.1.0`으로 리셋 (원본 버전과 분리)

3. **별도 .env.local.example**
   - Firebase 프로젝트/도메인/스토어명 placeholder만 있는 파일
   - 원본 Firebase 키는 절대 포함하지 않음 (모두 `__FILL_ME__`)

4. **별도 README / 점주용 가이드**
   - 이 가게 앱만의 설치/빌드/배포 안내
   - `README_STORE.md` 및 `docs/STORE_SETUP_GUIDE_{storeId}.md`

5. **메뉴/가게정보 초기값 독립**
   - 원본 현풍닭칼국수의 실제 메뉴/점포 정보는 복제 시 포함하지 않음
   - 복제본에는 "기본 템플릿 메뉴 0개 + 점포 정보 placeholder"만 존재
   - `src/config/env.ts`의 `APP_CONFIG`는 새 가게 정보로 교체

### ⚠️ 스크립트가 자동으로 해줄 수 없는 것

다음 항목은 점주/운영자가 수동으로 수행해야 하며, README에 체크리스트로 안내:

1. **Firebase 콘솔에서 새 프로젝트 생성**
2. **Firebase Hosting 도메인 연결**
3. **실제 카드 결제 PG 연결**
4. **Firestore 보안 규칙 설정**
5. **Firebase Auth 초기 관리자 계정 생성**

---

## 복제 출력 구조

복제 결과 디렉터리 예시:

```
clones/{storeId}/
  ├─ package.json          # name/description 수정됨
  ├─ .env.local.example    # 새 가게용 템플릿
  ├─ README_STORE.md       # 새 사장님용 사용설명서
  ├─ docs/
  │   └─ STORE_SETUP_GUIDE_{storeId}.md
  ├─ public/               # 로고/아이콘은 템플릿 기본값, 상호명은 placeholder
  ├─ src/                  # 현 버전 소스 전체 복사 (tenant 개념 X)
  ├─ tsconfig.json
  ├─ vite.config.ts
  ├─ index.html
  └─ ... (기타 설정 파일들 그대로)
```

---

## 복제 대상 파일/디렉터리

### 포함 (COPY_INCLUDE)

- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `index.html`
- `public/` (전체)
- `src/` (전체)
- `postcss.config.cjs`
- `tailwind.config.cjs`
- `.gitignore`
- `firebase.json` (있다면)
- `.firebaserc` (있다면, 단 내용은 placeholder로 교체)

### 제외 (COPY_EXCLUDE)

- `node_modules/`
- `dist/`
- `.firebase/`
- `.git/`
- `.turbo/`
- `.vscode/`
- `clones/` (자기 자신 복제 방지)

---

## 수정 대상 파일 (복제 후 자동 변경)

### 1. `package.json`

```json
{
  "name": "hp-store-{storeId}",
  "version": "0.1.0",
  "description": "{storeName} 전용 현풍닭칼국수 PWA 앱"
}
```

### 2. `src/config/env.ts`

```typescript
export const APP_CONFIG = {
  name: '{storeName}',  // 환경변수 또는 placeholder
  version: '0.1.0',
  company: '{ownerName}',
  // ...
};
```

### 3. `.env.local.example` (새로 생성)

```env
# {storeName} 전용 앱용 환경변수 예시
VITE_APP_NAME="{storeName}"
VITE_STORE_ID="{storeId}"

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
```

### 4. 메뉴 초기 데이터

- 복제 시점에는 메뉴 배열을 빈 배열로 초기화 (`[]`)
- 점주는 관리자 대시보드에서 메뉴를 새로 등록하는 것을 기본 플로우로

---

## 실패 시 롤백 방법

### 클론 디렉터리 삭제

```bash
# Windows
rmdir /s /q clones\{storeId}

# Linux/Mac
rm -rf clones/{storeId}
```

### 원본 리포 안전성

- 스크립트는 원본 리포를 수정하지 않음
- `git status`로 확인 시 원본 리포는 변경 없음
- 실패 시에도 원본 리포는 안전

---

## 사용 예시

```bash
# 루트에서 실행
npx tsx scripts/create-independent-store.ts

# 예시 입력
storeId: hp_store_gangnam
storeName: 현풍닭칼국수 강남점
ownerName: 김사장
defaultLocale: ko-KR
baseDomain: (선택, 빈값 가능)

# 생성 후
cd clones/hp_store_gangnam
npm install
cp .env.local.example .env.local
# .env.local 채우기 → npm run build → firebase deploy
```

## 스크립트 실행 전 경고

스크립트 실행 시 자동으로 다음 경고 메시지가 표시됩니다:

```
⚠️  이 스크립트는 "현풍닭칼국수 템플릿"을 기반으로
    완전히 독립된 새 가게 전용 앱을 clones/{storeId}/ 아래에 생성합니다.

- 원본 Firebase 프로젝트/키는 복제하지 않습니다.
- 새 사장님은 README_STORE.md를 보고 직접 Firebase 프로젝트를 만들고 배포해야 합니다.
```

## 롤백 안전성

- **원본 리포는 절대 수정하지 않음**: 스크립트는 `clones/` 디렉터리 아래에만 파일을 생성합니다.
- **실패 시 자동 롤백**: 복제 중 에러 발생 시 생성된 디렉터리가 자동으로 삭제됩니다.
- **Git 상태 안전**: 원본 리포의 `git status`는 변경 없음이 보장됩니다.

---

## 검증 체크리스트

스크립트 실행 후 다음을 확인:

- [ ] `clones/{storeId}/` 디렉터리 생성됨
- [ ] `package.json`의 `name`이 `hp-store-{storeId}`로 변경됨
- [ ] `.env.local.example`에 원본 Firebase 키가 없음 (모두 `__FILL_ME__`)
- [ ] `src/config/env.ts`의 `APP_CONFIG.name`이 `{storeName}` 또는 placeholder
- [ ] `README_STORE.md`에 `{storeName}`, `{storeId}` 반영됨
- [ ] `cd clones/{storeId} && npm install && npm run build` 성공
- [ ] 원본 리포의 `git status`는 변경 없음


# ⚛️ Cursor AI - ATOMIC 단계별 프롬프트 완벽 가이드

> **각 단계를 순서대로 진행하세요. 검증 없이 다음 단계로 넘어가지 마세요!**  
> 이 가이드는 현풍닭칼국수 PWA를 로컬에서 시작하여 Firebase 연동까지 완료합니다.

---

## 📚 사전 준비

### 필수 확인 사항

```
[ ] Node.js 18+ 설치 완료
[ ] npm 설치 완료
[ ] Cursor AI 설치 및 로그인 완료
[ ] 프로젝트 폴더 다운로드 완료
[ ] CURSOR-프로젝트-완벽-이해-가이드.md 읽음
```

### 문서 읽기 순서

```
1. CURSOR-프로젝트-완벽-이해-가이드.md (필수!)
2. 이 문서 (CURSOR-ATOMIC-프롬프트-완벽가이드.md)
3. 각 Step별 프롬프트 실행
```

---

## 📖 목차

### Phase 1: 로컬 환경 설정 (Step 1-3)
- Step 1: 의존성 설치 및 프로젝트 구조 확인
- Step 2: 환경변수 설정 (Mock 모드)
- Step 3: 개발 서버 실행 및 검증

### Phase 2: Firebase 프로젝트 생성 (Step 4-6)
- Step 4: Firebase 프로젝트 생성 가이드
- Step 5: Firebase 구성 정보 .env 적용
- Step 6: Firebase SDK 초기화 확인

### Phase 3: Authentication 연동 (Step 7-9)
- Step 7: Firebase Authentication 설정
- Step 8: 회원가입 기능 연동
- Step 9: 로그인/로��아웃 기능 연동

### Phase 4: Firestore 연동 (Step 10-13)
- Step 10: Firestore Database 설정 및 보안 규칙
- Step 11: 메뉴 데이터 마이그레이션
- Step 12: 주문 시스템 연동
- Step 13: 리뷰 시스템 연동

### Phase 5: Storage & Functions (Step 14-16)
- Step 14: Cloud Storage 설정
- Step 15: 이미지 업로드 기능 연동
- Step 16: Cloud Functions 배포

### Phase 6: 통합 테스트 (Step 17-18)
- Step 17: 전체 주문 플로우 테스트
- Step 18: 관리자 기능 테스트

### Phase 7: 프로덕션 준비 (Step 19-20)
- Step 19: 디버그 페이지 및 개발 버튼 제거
- Step 20: 최종 빌드 및 배포 준비

---

## Phase 1: 로컬 환경 설정

---

### ✅ Step 1: 의존성 설치 및 프로젝트 구조 확인

**목표**: npm 패키지 설치 및 프로젝트 구조 검증

#### Cursor AI에게 제공할 프롬프트:

```
현풍닭칼국수 PWA 프로젝트의 의존성을 설치하고 구조를 확인해줘.

작업 순서:
1. package.json 파일 확인
2. npm install 실행
3. 설치 완료 확인
4. 프로젝트 핵심 파일 존재 확인:
   - App.tsx
   - config/env.ts
   - lib/firebase.ts
   - types/ 디렉토리
   - components/ 디렉토리
   - pages/ 디렉토리

5. 설치 결과 리포트:
   ✅ 설치된 패키지 수
   ✅ React 버전
   ✅ Firebase 버전
   ✅ TypeScript 버전
   ✅ 핵심 파일 존재 여부

출력 형식:
```
📦 의존성 설치 완료
- 총 패키지: N개
- React: 18.2.0
- Firebase: 10.7.1
- TypeScript: 5.2.2

✅ 핵심 파일 검증
- [✅] App.tsx
- [✅] config/env.ts
...

⏭️ 다음: Step 2로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] npm install 성공
[ ] node_modules/ 폴더 생성됨
[ ] package-lock.json 생성됨
[ ] 에러 없이 완료
[ ] 핵심 파일 모두 존재
```

#### 에러 발생 시:

```
에러: ERESOLVE unable to resolve dependency tree

해결책 프롬프트:
"다음 명령어로 재시도해줘: npm install --legacy-peer-deps"

---

에러: node_modules 권한 오류

해결책 프롬프트:
"sudo 없이 설치하도록 npm 캐시를 정리하고 재시도해줘:
rm -rf node_modules package-lock.json
npm cache clean --force
npm install"
```

---

### ✅ Step 2: 환경변수 설정 (Mock 모드)

**목표**: .env 파일 생성 및 개발 환경 설정

#### Cursor AI에게 제공할 프롬프트:

```
.env 파일을 생성하고 개발 모드로 설정해줘.

작업 순서:
1. .env.example 파일 확인
2. .env 파일 생성 (Mock 모드)
3. 다음 내용으로 .env 파일 작성:

```env
# Firebase (Mock 모드 - 나중에 실제 값으로 교체)
VITE_USE_FIREBASE=false
VITE_FIREBASE_API_KEY=MOCK_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=localhost
VITE_FIREBASE_PROJECT_ID=mock-project
VITE_FIREBASE_STORAGE_BUCKET=mock-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:mock
VITE_FIREBASE_MEASUREMENT_ID=G-MOCK

# NICEPAY (Mock)
VITE_NICEPAY_MID=MOCK_MID
VITE_NICEPAY_CLIENT_KEY=MOCK_KEY

# 배달 대행사 (Mock)
VITE_PROVIDER_A_API_URL=https://mock.example.com
VITE_PROVIDER_A_API_KEY=MOCK_KEY
VITE_PROVIDER_A_MERCHANT_ID=MOCK_MERCHANT

# Phase 3 기능 (개발 모드 활성화)
VITE_DELIVERY_ENABLED=true
VITE_DELIVERY_PROVIDER=mock
VITE_SUPPORT_ENABLED=true
VITE_POINTS_ENABLED=true

# 앱 설정
VITE_APP_ENV=development
```

4. .gitignore에 .env가 포함되어 있는지 확인
5. config/env.ts에서 USE_FIREBASE가 false인지 확인

출력 형식:
```
✅ .env 파일 생성 완료

설정 요약:
- Firebase: Mock 모드 (USE_FIREBASE=false)
- 개발 환경: development
- Phase 3 기능: 모두 활성화

⚠️ 주의: 이것은 임시 설정입니다.
Step 5에서 실제 Firebase 값으로 교체합니다.

⏭️ 다음: Step 3로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] .env 파일 생성됨
[ ] VITE_USE_FIREBASE=false 설정됨
[ ] .gitignore에 .env 포함됨
[ ] config/env.ts에서 USE_FIREBASE가 false 확인
```

---

### ✅ Step 3: 개발 서버 실행 및 검증

**목표**: 로컬 개발 서버를 실행하고 모든 페이지 확인

#### Cursor AI에게 제공할 프롬프트:

```
개발 서버를 시작하고 모든 라우트가 정상 작동하는지 확인해줘.

작업 순서:
1. npm run dev 실행
2. 브라우저에서 다음 URL 접속 확인:
   - http://localhost:5173/ (홈)
   - http://localhost:5173/menu (메뉴 목록)
   - http://localhost:5173/cart (장바구니)
   - http://localhost:5173/my (마이페이지)
   - http://localhost:5173/login (로그인)
   - http://localhost:5173/admin (관리자 - 리다이렉트 확인)
   - http://localhost:5173/dev (개발 도구)

3. 브라우저 콘솔에서 에러 확인
4. Hot Reload 테스트:
   - pages/app/Home.tsx를 살짝 수정
   - 자동 반영 확인

출력 형식:
```
✅ 개발 서버 시작 완료
- URL: http://localhost:5173
- 포트: 5173
- 모드: development

📱 라우트 검증:
- [✅] / (홈)
- [✅] /menu (메뉴 목록)
- [✅] /cart (장바구니)
- [✅] /my (마이페이지)
- [✅] /login (로그인)
- [✅] /admin (관리자 접근 제어)
- [✅] /dev (개발 도구)

🔍 콘솔 확인:
- Firebase: Mock 모드 확인
- 에러 없음

✅ Hot Reload: 정상 작동

⏭️ Phase 1 완료! Phase 2로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] npm run dev 실행 성공
[ ] 브라우저에서 앱 표시됨
[ ] 모든 페이지 접속 가능
[ ] 콘솔 에러 없음
[ ] Hot Reload 작동 확인
```

#### 에러 발생 시:

```
에러: Port 5173 is already in use

해결책 프롬프트:
"포트 충돌을 해결해줘:
1. 기존 프로세스 종료: lsof -ti:5173 | xargs kill -9
2. 또는 다른 포트 사용: npm run dev -- --port 3000"

---

에러: Cannot find module 'react'

해결책 프롬프트:
"node_modules를 재설치해줘:
rm -rf node_modules package-lock.json
npm install"
```

---

## Phase 2: Firebase 프로젝트 생성

---

### ✅ Step 4: Firebase 프로젝트 생성 가이드

**목표**: Firebase Console에서 프로젝트 생성

#### Cursor AI에게 제공할 프롬프트:

```
Firebase 프로젝트를 생성하는 단계별 가이드를 출력해줘.

출력 내용:
1. Firebase Console 접속 방법
2. 프로젝트 생성 단계 (스크린샷 대신 상세 설명)
3. 필요한 설정값
4. 웹 앱 추가 방법
5. 구성 정보 복사 방법

형식:
```
🔥 Firebase 프로젝트 생성 가이드

=== Step 4-1: Firebase Console 접속 ===
1. https://console.firebase.google.com/ 접속
2. Google 계정으로 로그인
3. "프로젝트 추가" 클릭

=== Step 4-2: 프로젝트 설정 ===
1. 프로젝트 이름: hp-kal
   (또는 hyeonpung-kalguksu)
2. Google Analytics: ☑️ 사용 설정
3. Analytics 계정: Default Account 선택
4. "프로젝트 만들기" 클릭 (30초 소요)

=== Step 4-3: 웹 앱 추가 ===
1. 프로젝트 개요에서 웹 아이콘 (</>) 클릭
2. 앱 닉네임: "현풍닭칼국수 PWA"
3. Firebase Hosting: ☑️ 설정 (선택사항)
4. "앱 등록" 클릭

=== Step 4-4: 구성 정보 복사 ===
화면에 표시되는 다음 정보를 복사하세요:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "hp-kal.firebaseapp.com",
  projectId: "hp-kal",
  storageBucket: "hp-kal.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

⚠️ 이 정보를 안전한 곳에 저장하세요!

⏭️ 다음: Step 5에서 이 정보를 .env에 적용
```
```

#### 수동 작업 체크리스트:

```
사용자가 직접 해야 할 일:
[ ] Firebase Console 접속
[ ] 프로젝트 생성 완료
[ ] 웹 앱 추가 완료
[ ] 구성 정보 복사 완료
```

---

### ✅ Step 5: Firebase 구성 정보 .env 적용

**목표**: 실제 Firebase 구성 정보를 .env에 적용

#### Cursor AI에게 제공할 프롬프트:

```
.env 파일을 업데이트하여 실제 Firebase 구성 정보를 적용해줘.

작업 순서:
1. .env 파일 열기
2. 다음 값들을 사용자가 제공한 실제 값으로 교체:

현재 (Mock):
VITE_USE_FIREBASE=false
VITE_FIREBASE_API_KEY=MOCK_API_KEY
...

변경 후:
VITE_USE_FIREBASE=true
VITE_FIREBASE_API_KEY=[사용자가 제공한 실제 값]
VITE_FIREBASE_AUTH_DOMAIN=[실제 값]
VITE_FIREBASE_PROJECT_ID=[실제 값]
VITE_FIREBASE_STORAGE_BUCKET=[실제 값]
VITE_FIREBASE_MESSAGING_SENDER_ID=[실제 값]
VITE_FIREBASE_APP_ID=[실제 값]
VITE_FIREBASE_MEASUREMENT_ID=[실제 값]

3. VITE_USE_FIREBASE=true로 변경
4. 파일 저장

⚠️ 중요: 사용자에게 다음을 요청하세요:
"Step 4에서 복사한 Firebase 구성 정보를 제공해주세요."

출력 형식:
```
✅ .env 파일 업데이트 완료

변경 사항:
- VITE_USE_FIREBASE: false → true
- Firebase 구성: Mock → 실제 값

⚠️ 개발 서버 재시작 필요:
1. Ctrl+C로 서버 중지
2. npm run dev 재실행

⏭️ 다음: Step 6로 진행
```

⚠️ 주의:
- 사용자가 Firebase 구성 정보를 제공할 때까지 대기하세요
- 구성 정보 없이는 진행하지 마세요
- .env 파일은 절대 Git에 커밋하지 마세요
```

#### 검증 체크리스트:

```
[ ] VITE_USE_FIREBASE=true 설정됨
[ ] 모든 Firebase 구성 값이 실제 값으로 교체됨
[ ] .env 파일 저장됨
[ ] 개발 서버 재시작함
```

---

### ✅ Step 6: Firebase SDK 초기화 확인

**목표**: Firebase가 제대로 초기화되었는지 확인

#### Cursor AI에게 제공할 프롬프트:

```
Firebase SDK가 제대로 초기화되었는지 확인해줘.

작업 순서:
1. 브라우저 콘솔 열기 (F12)
2. Console 탭에서 Firebase 초기화 메시지 확인
3. 에러가 없는지 확인
4. Network 탭에서 Firebase 요청 확인

검증 코드 추가:
lib/firebase.ts 파일의 초기화 부분에 다음 로그 추가 (임시):

```typescript
if (USE_FIREBASE) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    firestoreDb = getFirestore(app);
    storageInstance = getStorage(app);
    
    console.log('✅ Firebase 초기화 성공');
    console.log('  - Project ID:', firebaseConfig.projectId);
    console.log('  - Auth Domain:', firebaseConfig.authDomain);
  } catch (error) {
    console.error('❌ Firebase 초기화 실패:', error);
  }
}
```

출력 형식:
```
🔍 Firebase 초기화 검증

브라우저 콘솔 출력:
✅ Firebase 초기화 성공
  - Project ID: hp-kal
  - Auth Domain: hp-kal.firebaseapp.com

네트워크 요청:
✅ firebaseapp.com 연결 성공
✅ firestore.googleapis.com 접근 가능

⚠️ 에러가 있다면:
- API 키 확인
- Firebase 프로젝트 활성화 상태 확인
- 브라우저 CORS 설정 확인

⏭️ Phase 2 완료! Phase 3으로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] 콘솔에 "Firebase 초기화 성공" 메시지 표시
[ ] Firebase 관련 에러 없음
[ ] Network 탭에서 Firebase 요청 성공
[ ] auth, firestore, storage 인스턴스 생성됨
```

#### 에러 발생 시:

```
에러: Firebase: Error (auth/invalid-api-key)

해결책 프롬프트:
".env 파일의 VITE_FIREBASE_API_KEY 값을 다시 확인해줘.
Firebase Console에서 구성 정보를 다시 복사해서 비교해줘."

---

에러: Firebase: Error (app/duplicate-app)

해결책 프롬프트:
"Firebase가 중복 초기화되고 있어. lib/firebase.ts에서
initializeApp이 한 번만 호출되도록 수정해줘."
```

---

## Phase 3: Authentication 연동

---

### ✅ Step 7: Firebase Authentication 설정

**목표**: Firebase Console에서 Authentication 활성화

#### Cursor AI에게 제공할 프롬프트:

```
Firebase Authentication을 설정하는 가이드를 출력해줘.

출력 내용:
```
🔐 Firebase Authentication 설정 가이드

=== Step 7-1: Authentication 활성화 ===
1. Firebase Console (https://console.firebase.google.com/)
2. 프로젝트 선택 (hp-kal)
3. 좌측 메뉴 > 빌드 > Authentication 클릭
4. "시작하기" 클릭

=== Step 7-2: 이메일/비밀번호 로그인 활성화 ===
1. Sign-in method 탭 클릭
2. "이메일/비밀번호" 클릭
3. "사용 설정" 토글 ON
4. "저장" 클릭

⚠️ 주의:
- "이메일 링크" 옵션은 체크하지 마세요
- 기본 이메일/비밀번호만 활성화

=== Step 7-3: Google 로그인 활성화 (선택사항) ===
1. "Google" 클릭
2. "사용 설정" 토글 ON
3. 프로젝트의 공개용 이름: "현풍닭칼국수"
4. 프로젝트 지원 이메일: [your-email@example.com]
5. "저장" 클릭

=== Step 7-4: 테스트 계정 생성 ===
1. Users 탭 클릭
2. "사용자 추가" 클릭
3. 이메일: test@example.com
4. 비밀번호: Test1234!
5. "사용자 추가" 클릭

✅ 설정 완료!

⏭️ 다음: Step 8에서 회원가입 기능 연동
```

⚠️ 주의: 사용자가 직접 Firebase Console에서 작업해야 합니다.
```

#### 수동 작업 체크리스트:

```
사용자가 직접 해야 할 일:
[ ] Firebase Console > Authentication 접속
[ ] 이메일/비밀번호 로그인 활성화
[ ] Google 로그인 활성화 (선택)
[ ] 테스트 계정 생성 완료
```

---

### ✅ Step 8: 회원가입 기능 연동

**목표**: Firebase Auth를 사용한 회원가입 구현

#### Cursor AI에게 제공할 프롬프트:

```
lib/auth.ts 파일의 signUp 함수를 Firebase Auth와 연동해줘.

작업 순서:
1. lib/auth.ts 파일 열기
2. signUp 함수 찾기
3. 현재 Mock 구현을 Firebase Auth로 교체

구현 요구사항:
- Firebase createUserWithEmailAndPassword 사용
- 에러 처리 (이메일 중복, 약한 비밀번호 등)
- 사용자 생성 후 Firestore에 프로필 저장:
  - 컬렉션: users
  - 문서 ID: user.uid
  - 필드: email, displayName, role, phone, createdAt

코드 예시:
```typescript
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  phone?: string
): Promise<User> {
  try {
    // 1. Firebase Auth로 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // 2. Firestore에 사용자 프로필 저장
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      displayName,
      role: 'customer',
      phone: phone || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // 3. User 객체 반환
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName,
      role: 'customer',
      phone,
    };
  } catch (error: any) {
    // Firebase 에러 코드 처리
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('이미 사용 중인 이메일입니다.');
      case 'auth/weak-password':
        throw new Error('비밀번호가 너무 약합니다. (최소 6자)');
      case 'auth/invalid-email':
        throw new Error('유효하지 않은 이메일 형식입니다.');
      default:
        throw new Error('회원가입에 실패했습니다.');
    }
  }
}
```

검증:
- pages/app/Signup.tsx에서 회원가입 테스트
- Firebase Console > Authentication > Users에서 사용자 확인
- Firestore > users 컬렉션에 문서 생성 확인

출력 형식:
```
✅ 회원가입 기능 연동 완료

변경 파일:
- lib/auth.ts (signUp 함수)

테스트 방법:
1. http://localhost:5173/signup 접속
2. 이메일: newuser@test.com
3. 비밀번호: Test1234!
4. 이름: 테스트 사용자
5. 전화번호: 010-1234-5678
6. "가입하기" 클릭

검증:
- Firebase Console > Authentication > Users
- Firebase Console > Firestore > users 컬렉션

⏭️ 다음: Step 9로 진행
```
```

#### 검증 체크리스트:

```
[ ] lib/auth.ts의 signUp 함수 수정 완료
[ ] /signup 페이지에서 회원가입 성공
[ ] Firebase Authentication에 사용자 생성 확인
[ ] Firestore users 컬렉션에 문서 생성 확인
[ ] 에러 처리 정상 작동 (중복 이메일 등)
```

---

### ✅ Step 9: 로그인/로그아웃 기능 연동

**목표**: Firebase Auth를 사용한 로그인/로그아웃 구현

#### Cursor AI에게 제공할 프롬프트:

```
lib/auth.ts의 signIn과 signOut 함수를 Firebase Auth와 연동하고,
AuthContext.tsx를 업데이트해줘.

=== 작업 1: signIn 함수 연동 ===

lib/auth.ts:
```typescript
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export async function signIn(
  email: string,
  password: string
): Promise<User> {
  try {
    // 1. Firebase Auth 로그인
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    
    // 2. Firestore에서 프로필 가져오기
    const userDoc = await getDoc(
      doc(db, 'users', userCredential.user.uid)
    );
    
    if (!userDoc.exists()) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }
    
    const userData = userDoc.data();
    
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email!,
      displayName: userData.displayName,
      role: userData.role,
      phone: userData.phone,
    };
  } catch (error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      case 'auth/too-many-requests':
        throw new Error('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
      default:
        throw new Error('로그인에 실패했습니다.');
    }
  }
}
```

=== 작업 2: signOut 함수 연동 ===

```typescript
import { signOut as firebaseSignOut } from 'firebase/auth';

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    throw new Error('로그아웃에 실패했습니다.');
  }
}
```

=== 작업 3: AuthContext 업데이트 ===

contexts/AuthContext.tsx:
```typescript
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firestore에서 사용자 프로필 가져오기
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: userData.displayName,
            role: userData.role,
            phone: userData.phone,
          });
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ... 나머지 코드
}
```

검증:
1. 로그인 테스트:
   - /login 접속
   - Step 7에서 생성한 test@example.com 계정으로 로그인
   - 홈으로 리다이렉트 확인
   - 상단 헤더에 사용자 이름 표시 확인

2. 로그아웃 테스트:
   - 마이페이지 접속
   - "로그아웃" 버튼 클릭
   - 로그인 페이지로 리다이렉트 확인

3. 세션 유지 테스트:
   - 로그인 상태에서 페이지 새로고침 (F5)
   - 로그인 상태 유지 확인

출력 형식:
```
✅ 로그인/로그아웃 기능 연동 완료

변경 파일:
- lib/auth.ts (signIn, signOut)
- contexts/AuthContext.tsx (onAuthStateChanged)

테스트 결과:
✅ 로그인 성공
✅ 로그아웃 성공
✅ 세션 유지 확인
✅ 에러 처리 정상

⏭️ Phase 3 완료! Phase 4로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] signIn 함수 Firebase 연동 완료
[ ] signOut 함수 Firebase 연동 완료
[ ] AuthContext onAuthStateChanged 적용
[ ] 로그인 테스트 성공
[ ] 로그아웃 테스트 성공
[ ] 세션 유지 확인 (새로고침 후에도 로그인 상태)
[ ] 에러 처리 정상 작동
```

---

## Phase 4: Firestore 연동

---

### ✅ Step 10: Firestore Database 설정 및 보안 규칙

**목표**: Firestore Database 생성 및 보안 규칙 배포

#### Cursor AI에게 제공할 프롬프트:

```
Firestore Database 설정 가이드를 출력하고,
보안 규칙 파일(firestore.rules)이 올바른지 검증해줘.

=== Part 1: Firestore Database 생성 가이드 ===

출력:
```
📊 Firestore Database 설정 가이드

=== Step 10-1: Database 만들기 ===
1. Firebase Console > Firestore Database
2. "데이터베이스 만들기" 클릭
3. 위치 선택:
   - 권장: asia-northeast3 (서울)
   - 대안: asia-northeast1 (도쿄)
   ⚠️ 나중에 변경 불가!
4. 보안 규칙: "프로덕션 모드" 선택
5. "사용 설정" 클릭

=== Step 10-2: 컬렉션 구조 ===
앱에서 사용할 컬렉션:
- users (사용자 프로필)
- menus (메뉴)
- orders (주문)
- reviews (리뷰)
- coupons (쿠폰)
- settings (설정)

⏭️ 다음: 보안 규칙 배포
```

=== Part 2: 보안 규칙 검증 ===

작업:
1. firestore.rules 파일 열기
2. 다음 규칙이 포함되어 있는지 확인:
   - isSignedIn() 헬퍼 함수
   - isOwner() 헬퍼 함수
   - isAdmin() 헬퍼 함수
   - users 컬렉션 규칙
   - menus 컬렉션 규칙 (읽기는 모두, 쓰기는 관리자만)
   - orders 컬렉션 규칙
   - reviews 컬렉션 규칙
   - coupons 컬렉션 규칙
   - settings 컬렉션 규칙 (관리자만)

3. 규칙 배포 명령어 출력:
```bash
firebase deploy --only firestore:rules
```

출력 형식:
```
✅ firestore.rules 검증 완료

포함된 규칙:
- [✅] 헬퍼 함수 (isSignedIn, isOwner, isAdmin)
- [✅] users 컬렉션 (소유자 또는 관리자만)
- [✅] menus 컬렉션 (읽기 모두, 쓰기 관리자만)
- [✅] orders 컬렉션 (소유자 또는 관리자만)
- [✅] reviews 컬렉션 (읽기 모두, 쓰기 로그인 사용자)
- [✅] coupons 컬렉션 (읽기 모두, 쓰기 관리자만)
- [✅] settings 컬렉션 (관리자만)

배포 방법:
```bash
# Firebase CLI 설치 (한 번만)
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 선택
firebase use hp-kal

# 보안 규칙 배포
firebase deploy --only firestore:rules
```

⚠️ 주의: 사용자가 직접 터미널에서 실행해야 합니다.

⏭️ 다음: Step 11로 진행
```
```

#### 수동 작업 체크리스트:

```
사용자가 직접 해야 할 일:
[ ] Firebase Console에서 Firestore 생성
[ ] 위치 선택 (서울 권장)
[ ] Firebase CLI 설치 (npm install -g firebase-tools)
[ ] firebase login 실행
[ ] firebase use hp-kal 실행
[ ] firebase deploy --only firestore:rules 실행
[ ] Firebase Console에서 규칙 적용 확인
```

---

### ✅ Step 11: 메뉴 데이터 마이그레이션

**목표**: data/menus.json 데이터를 Firestore menus 컬렉션에 마이그레이션

#### Cursor AI에게 제공할 프롬프트:

```
data/menus.json의 데이터를 Firestore menus 컬렉션으로 마이그레이션하는
스크립트를 작성하고 실행해줘.

=== 작업 1: 마이그레이션 스크립트 작성 ===

파일: scripts/migrate-menus.ts

```typescript
import { db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import menusData from '../data/menus.json';

async function migrateMenus() {
  console.log('🚀 메뉴 데이터 마이그레이션 시작...');
  
  try {
    const menusCollection = collection(db, 'menus');
    let successCount = 0;
    let errorCount = 0;
    
    for (const menu of menusData) {
      try {
        await setDoc(doc(menusCollection, menu.id), {
          ...menu,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        console.log(`✅ ${menu.name} 추가 완료`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${menu.name} 추가 실패:`, error);
        errorCount++;
      }
    }
    
    console.log('\n📊 마이그레이션 완료!');
    console.log(`  - 성공: ${successCount}개`);
    console.log(`  - 실패: ${errorCount}개`);
    console.log(`  - 총: ${menusData.length}개`);
    
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    process.exit(1);
  }
}

migrateMenus();
```

=== 작업 2: package.json에 스크립트 추가 ===

```json
{
  "scripts": {
    "migrate:menus": "tsx scripts/migrate-menus.ts"
  }
}
```

=== 작업 3: 실행 ===

```bash
# tsx 설치 (한 번만)
npm install -D tsx

# 마이그레이션 실행
npm run migrate:menus
```

=== 작업 4: Firebase Console에서 확인 ===
1. Firebase Console > Firestore Database
2. menus 컬렉션 확인
3. 문서 개수 확인 (data/menus.json의 개수와 일치해야 함)

=== 작업 5: lib/admin/menus.api.ts 업데이트 ===

Mock 데이터 대신 Firestore 사용하도록 수정:

```typescript
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Menu } from '../../types/menu';

export async function getMenus(): Promise<Menu[]> {
  try {
    const snapshot = await getDocs(collection(db, 'menus'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Menu));
  } catch (error) {
    console.error('[API] getMenus 실패:', error);
    throw new Error('메뉴 목록을 불러오는데 실패했습니다.');
  }
}

export async function getMenuById(id: string): Promise<Menu | null> {
  try {
    const docSnap = await getDoc(doc(db, 'menus', id));
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Menu;
  } catch (error) {
    console.error('[API] getMenuById 실패:', error);
    throw new Error('메뉴를 불러오는데 실패했습니다.');
  }
}

// ... 나머지 CRUD 함수들
```

검증:
1. http://localhost:5173/menu 접속
2. 메뉴 목록이 Firestore에서 로드되는지 확인
3. 메뉴 상세 페이지 확인
4. 관리자 페이지 (/admin/menus)에서 메뉴 관리 확인

출력 형식:
```
✅ 메뉴 데이터 마이그레이션 완료

마이그레이션 결과:
- 성공: 15개
- 실패: 0개
- 총: 15개

Firestore 확인:
✅ menus 컬렉션 생성됨
✅ 15개 문서 추가됨

API 연동:
✅ lib/admin/menus.api.ts 업데이트 완료
✅ /menu 페이지에서 Firestore 데이터 로드 확인

⏭️ 다음: Step 12로 진행
```
```

#### 검증 체크리스트:

```
[ ] scripts/migrate-menus.ts 작성 완료
[ ] npm run migrate:menus 실행 성공
[ ] Firebase Console에서 menus 컬렉션 확인
[ ] 모든 메뉴 데이터 마이그레이션 완료
[ ] lib/admin/menus.api.ts Firestore 연동 완료
[ ] /menu 페이지에서 데이터 로드 확인
[ ] /admin/menus 페이지에서 관리 기능 확인
```

---

### ✅ Step 12: 주문 시스템 연동

**목표**: 주문 생성/조회 기능을 Firestore와 연동

#### Cursor AI에게 제공할 프롬프트:

```
주문 시스템을 Firestore와 연동해줘.

=== 작업 1: lib/orders.api.ts 업데이트 (고객용) ===

```typescript
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import type { Order, OrderItem, DeliveryInfo } from '../types/order';

export async function createOrder(
  userId: string,
  items: OrderItem[],
  deliveryInfo: DeliveryInfo,
  totalAmount: number,
  paymentMethod: string
): Promise<string> {
  try {
    const orderData = {
      userId,
      items,
      deliveryInfo,
      totalAmount,
      paymentMethod,
      status: 'pending' as const,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    
    console.log('[API] 주문 생성 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[API] createOrder 실패:', error);
    throw new Error('주문 생성에 실패했습니다.');
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docSnap = await getDoc(doc(db, 'orders', orderId));
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Order;
  } catch (error) {
    console.error('[API] getOrderById 실패:', error);
    throw new Error('주문 정보를 불러오는데 실패했습니다.');
  }
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('[API] getOrdersByUserId 실패:', error);
    throw new Error('주문 내역을 불러오는데 실패했습니다.');
  }
}
```

=== 작업 2: lib/admin/orders.api.ts 업데이트 (관리자용) ===

```typescript
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import type { Order, OrderStatus } from '../../types/order';

export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('[Admin API] getAllOrders 실패:', error);
    throw new Error('주문 목록을 불러오는데 실패했습니다.');
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  reason?: string
): Promise<void> {
  try {
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (reason) {
      updateData.cancelReason = reason;
    }
    
    await updateDoc(doc(db, 'orders', orderId), updateData);
    
    console.log('[Admin API] 주문 상태 업데이트 완료:', orderId, status);
  } catch (error) {
    console.error('[Admin API] updateOrderStatus 실패:', error);
    throw new Error('주문 상태 업데이트에 실패했습니다.');
  }
}
```

=== 작업 3: Firestore 인덱스 생성 ===

firestore.indexes.json 파일 확인 또는 생성:

```json
{
  "indexes": [
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "orders",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

배포:
```bash
firebase deploy --only firestore:indexes
```

=== 작업 4: 테스트 주문 생성 ===

1. 로그인 상태에서 메뉴 선택
2. 장바구니에 담기
3. 결제 페이지로 이동
4. 배달 정보 입력
5. 주문하기 클릭
6. Firebase Console에서 orders 컬렉션 확인
7. 주문 추적 페이지에서 주문 확인

검증:
- /checkout 페이지에서 주문 생성
- /order-history 페이지에서 주문 목록 확인
- /orders/:orderId 페이지에서 주문 상세 확인
- /admin/orders 페이지에서 관리자가 주문 확인
- 주문 상태 변경 테스트 (pending → accepted → preparing → completed)

출력 형식:
```
✅ 주문 시스템 Firestore 연동 완료

변경 파일:
- lib/orders.api.ts (고객용 API)
- lib/admin/orders.api.ts (관리자용 API)
- firestore.indexes.json (인덱스 정의)

테스트 결과:
✅ 주문 생성 성공
✅ 주문 조회 성공 (주문 상세)
✅ 주문 내역 조회 성공 (목록)
✅ 관리자 주문 관리 성공
✅ 주문 상태 변경 성공

Firebase Console 확인:
✅ orders 컬렉션 생성됨
✅ 테스트 주문 문서 확인

⏭️ 다음: Step 13로 진행
```
```

#### 검증 체크리스트:

```
[ ] lib/orders.api.ts Firestore 연동 완료
[ ] lib/admin/orders.api.ts Firestore 연동 완료
[ ] firestore.indexes.json 생성/확인
[ ] firebase deploy --only firestore:indexes 실행
[ ] 테스트 주문 생성 성공
[ ] 주문 조회 성공
[ ] 주문 내역 조회 성공
[ ] 관리자 주문 관리 확인
[ ] 주문 상태 변경 확인
```

---

### ✅ Step 13: 리뷰 시스템 연동

**목표**: 리뷰 작성/조회 기능을 Firestore와 연동

#### Cursor AI에게 제공할 프롬프트:

```
리뷰 시스템을 Firestore와 연동해줘.

작업 파일:
1. lib/reviews.api.ts 생성 (고객용)
2. lib/admin/reviews.api.ts 업데이트 (관리자용)

=== 작업 1: lib/reviews.api.ts 생성 ===

```typescript
import { db, storage } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import type { Review } from '../types/review';

export async function createReview(
  orderId: string,
  userId: string,
  menuId: string,
  rating: number,
  content: string,
  images?: File[]
): Promise<string> {
  try {
    // 1. 이미지 업로드 (있는 경우)
    const imageUrls: string[] = [];
    
    if (images && images.length > 0) {
      for (const image of images) {
        const storageRef = ref(
          storage,
          `reviews/${userId}/${Date.now()}-${image.name}`
        );
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
    }
    
    // 2. 리뷰 저장
    const reviewData = {
      orderId,
      userId,
      menuId,
      rating,
      content,
      images: imageUrls,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, 'reviews'), reviewData);
    
    console.log('[API] 리뷰 작성 완료:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[API] createReview 실패:', error);
    throw new Error('리뷰 작성에 실패했습니다.');
  }
}

export async function getReviewsByMenuId(menuId: string): Promise<Review[]> {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('menuId', '==', menuId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error('[API] getReviewsByMenuId 실패:', error);
    throw new Error('리뷰 목록을 불러오는데 실패했습니다.');
  }
}
```

=== 작업 2: lib/admin/reviews.api.ts 업데이트 ===

```typescript
import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import type { Review } from '../../types/review';

export async function getAllReviews(): Promise<Review[]> {
  try {
    const q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error('[Admin API] getAllReviews 실패:', error);
    throw new Error('리뷰 목록을 불러오는데 실패했습니다.');
  }
}

export async function addReviewReply(
  reviewId: string,
  reply: string
): Promise<void> {
  try {
    await updateDoc(doc(db, 'reviews', reviewId), {
      reply,
      repliedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('[Admin API] 리뷰 답글 작성 완료:', reviewId);
  } catch (error) {
    console.error('[Admin API] addReviewReply 실패:', error);
    throw new Error('답글 작성에 실패했습니다.');
  }
}
```

=== 작업 3: Storage 규칙 확인 ===

storage.rules 파일 확인:

```
match /reviews/{userId}/{fileName} {
  allow read: if true;
  allow write: if request.auth.uid == userId 
    && request.resource.contentType.matches('image/.*')
    && request.resource.size < 5 * 1024 * 1024;
}
```

배포:
```bash
firebase deploy --only storage
```

=== 작업 4: 테스트 ===

1. 주문 완료 후 리뷰 작성 페이지로 이동
2. 별점 선택
3. 내용 입력
4. 사진 업로드 (선택)
5. 제출
6. Firebase Console에서 확인:
   - reviews 컬렉션
   - Storage > reviews 폴더
7. 메뉴 상세 페이지에서 리뷰 목록 확인
8. 관리자 페이지에서 답글 작성

출력 형식:
```
✅ 리뷰 시스템 Firestore 연동 완료

변경/생성 파일:
- lib/reviews.api.ts (생성)
- lib/admin/reviews.api.ts (업데이트)
- storage.rules (확인)

테스트 결과:
✅ 리뷰 작성 성공 (텍스트만)
✅ 리뷰 작성 성공 (사진 포함)
✅ 이미지 업로드 성공 (Storage)
✅ 리뷰 목록 조회 성공
✅ 관리자 답글 작성 성공

Firebase Console 확인:
✅ reviews 컬렉션 생성됨
✅ Storage > reviews 폴더에 이미지 저장됨

⏭️ Phase 4 완료! Phase 5로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] lib/reviews.api.ts 생성 완료
[ ] lib/admin/reviews.api.ts 업데이트 완료
[ ] storage.rules 확인 및 배포
[ ] 리뷰 작성 성공 (텍스트만)
[ ] 리뷰 작성 성공 (사진 포함)
[ ] Storage에 이미지 업로드 확인
[ ] 메뉴 상세 페이지에서 리뷰 조회 확인
[ ] 관리자 답글 작성 확인
```

---

## Phase 5: Storage & Functions

---

### ✅ Step 14: Cloud Storage 설정

**목표**: Firebase Storage 활성화 및 CORS 설정

#### Cursor AI에게 제공할 프롬프트:

```
Firebase Cloud Storage 설정 가이드를 출력해줘.

출력:
```
📁 Firebase Cloud Storage 설정 가이드

=== Step 14-1: Storage 활성화 ===
1. Firebase Console > Storage
2. "시작하기" 클릭
3. 보안 규칙: "프로덕션 모드" 선택
4. 위치: asia-northeast3 (서울) 선택
   ⚠️ Firestore와 동일한 위치 권장
5. "완료" 클릭

=== Step 14-2: CORS 설정 ===

프로젝트에 cors.json 파일 확인:
```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization"]
  }
]
```

CORS 적용:
```bash
# Google Cloud SDK 설치 필요
gsutil cors set cors.json gs://hp-kal.appspot.com

# 또는 Firebase CLI 사용
firebase deploy --only storage
```

=== Step 14-3: Storage 규칙 배포 ===

storage.rules 파일 확인 후:
```bash
firebase deploy --only storage
```

⚠️ 주의: 사용자가 직접 터미널에서 실행해야 합니다.

⏭️ 다음: Step 15로 진행
```

⚠️ 주의: 사용자가 직접 Firebase Console과 터미널에서 작업해야 합니다.
```

#### 수동 작업 체크리스트:

```
사용자가 직접 해야 할 일:
[ ] Firebase Console에서 Storage 활성화
[ ] 위치 선택 (서울 권장)
[ ] cors.json 파일 확인
[ ] CORS 설정 적용
[ ] storage.rules 배포
```

---

### ✅ Step 15: 이미지 업로드 기능 연동

**목표**: 리뷰 사진 업로드가 제대로 작동하는지 확인

#### Cursor AI에게 제공할 프롬프트:

```
이미지 업로드 기능이 제대로 작동하는지 테스트하고,
필요하면 pages/app/ReviewWrite.tsx를 수정해줘.

=== 작업 1: 이미지 업로드 함수 확인 ===

lib/imageUtils.ts (있다면) 또는 lib/reviews.api.ts에서
이미지 업로드 로직 확인:

```typescript
// 예시
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadReviewImage(
  userId: string,
  file: File
): Promise<string> {
  try {
    // 1. 파일 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }
    
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('파일 크기는 5MB 이하여야 합니다.');
    }
    
    // 2. Storage 경로
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `reviews/${userId}/${fileName}`);
    
    // 3. 업로드
    await uploadBytes(storageRef, file);
    
    // 4. URL 가져오기
    const url = await getDownloadURL(storageRef);
    
    return url;
  } catch (error) {
    console.error('[Upload] uploadReviewImage 실패:', error);
    throw error;
  }
}
```

=== 작업 2: ReviewWrite 컴포넌트 확인 ===

pages/app/ReviewWrite.tsx에서:
- 파일 input 확인
- 미리보기 기능 확인
- 업로드 에러 처리 확인
- 로딩 상태 확인

=== 작업 3: 테스트 ===

1. 주문 완료 후 리뷰 작성 페이지로 이동
2. 사진 선택 (JPG, PNG 테스트)
3. 미리보기 확인
4. 제출
5. Firebase Console > Storage > reviews 폴더 확인
6. 업로드된 이미지 URL 확인

출력 형식:
```
✅ 이미지 업로드 기능 검증 완료

테스트 결과:
✅ JPG 파일 업로드 성공
✅ PNG 파일 업로드 성공
✅ 파일 크기 검증 작동
✅ 미리보기 표시 정상
✅ 업로드 후 URL 반환 정상
✅ Storage에 파일 저장 확인

Firebase Storage 확인:
✅ reviews/{userId}/ 폴더 생성됨
✅ 이미지 파일 저장됨
✅ 다운로드 URL 접근 가능

⏭️ 다음: Step 16으로 진행
```
```

#### 검증 체크리스트:

```
[ ] 이미지 업로드 함수 작동 확인
[ ] JPG/PNG 파일 업로드 성공
[ ] 파일 크기 검증 작동
[ ] 미리보기 기능 작동
[ ] Storage에 파일 저장 확인
[ ] 다운로드 URL 접근 가능
[ ] 에러 처리 정상 작동
```

---

### ✅ Step 16: Cloud Functions 배포

**목표**: Firebase Cloud Functions 배포

#### Cursor AI에게 제공할 프롬프트:

```
Firebase Cloud Functions를 배포하기 위한 가이드를 출력해줘.

출력:
```
⚡ Firebase Cloud Functions 배포 가이드

⚠️ 주의: Cloud Functions는 Blaze 플랜(종량제)이 필요합니다!

=== Step 16-1: Blaze 플랜으로 업그레이드 ===
1. Firebase Console 좌측 하단 "Spark (무료)" 클릭
2. "플랜 업그레이드" 클릭
3. Blaze (종량제) 선택
4. 신용카드 등록
5. "업그레이드" 클릭

무료 할당량:
- 125,000 호출/월
- 40,000 GB-초/월
- 40,000 CPU-초/월
초과 시에만 과금됩니다.

=== Step 16-2: Functions 폴더 확인 ===

/functions/ 폴더 구조:
```
functions/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts       # 메인 진입점
    ├── orders.ts      # 주문 관련 함수
    └── lib/
        ├── nicepay.ts
        ├── push.ts
        └── ...
```

=== Step 16-3: Functions 의존성 설치 ===

```bash
cd functions
npm install
```

=== Step 16-4: 환경변수 설정 ===

```bash
firebase functions:config:set \
  nicepay.mid="YOUR_NICEPAY_MID" \
  nicepay.key="YOUR_NICEPAY_KEY" \
  admin.email="admin@yourdomain.com"

# 확인
firebase functions:config:get
```

=== Step 16-5: Functions 배포 ===

```bash
# 프로젝트 루트로 이동
cd ..

# Functions 배포 (3-5분 소요)
firebase deploy --only functions
```

=== Step 16-6: 배포 확인 ===

1. Firebase Console > Functions 메뉴
2. 배포된 함수 목록 확인:
   - onOrderCreated
   - verifyPayment
   - generateReport
   - ...

3. 함수 로그 확인:
```bash
firebase functions:log
```

⚠️ 주의사항:
- 첫 배포는 시간이 오래 걸릴 수 있습니다 (5-10분)
- 에러 발생 시 로그를 확인하세요
- Blaze 플랜 필수!

⏭️ Phase 5 완료! Phase 6으로 진행 가능
```

⚠️ 주의: 사용자가 직접 터미널에서 실행해야 합니다.
```

#### 수동 작업 체크리스트:

```
사용자가 직접 해야 할 일:
[ ] Blaze 플랜으로 업그레이드
[ ] cd functions && npm install 실행
[ ] Firebase Functions 환경변수 설정
[ ] firebase deploy --only functions 실행
[ ] Firebase Console에서 함수 배포 확인
[ ] 함수 로그 확인 (에러 없음)
```

---

## Phase 6: 통합 테스트

---

### ✅ Step 17: 전체 주문 플로우 테스트

**목표**: 주문 생성부터 완료까지 전체 플로우 테스트

#### Cursor AI에게 제공할 프롬프트:

```
전체 주문 플로우를 테스트하고 각 단계의 정상 작동 여부를 확인해줘.

테스트 시나리오:

=== 1단계: 사용자 로그인 ===
1. http://localhost:5173/login 접속
2. 테스트 계정으로 로그인
   - 이메일: test@example.com
   - 비밀번호: Test1234!
3. 홈으로 리다이렉트 확인
4. 상단 헤더에 사용자 이름 표시 확인

=== 2단계: 메뉴 선택 ===
1. http://localhost:5173/menu 접속
2. 메뉴 목록이 Firestore에서 로드되는지 확인
3. 메뉴 클릭 → 상세 페이지로 이동
4. 옵션 선택
5. "장바구니 담기" 클릭
6. 장바구니 아이콘에 개수 표시 확인

=== 3단계: 장바구니 ===
1. http://localhost:5173/cart 접속
2. 담긴 메뉴 표시 확인
3. 수량 변경 테스트
4. 쿠폰 적용 (있다면)
5. 총 금액 계산 확인
6. "주문하기" 클릭 → 결제 페이지로 이동

=== 4단계: 결제 ===
1. http://localhost:5173/checkout 접속
2. 배달 정보 입력:
   - 주소: 서울시 강남구...
   - 전화번호: 010-1234-5678
   - 요청사항: 문 앞에 놓아주세요
3. 결제 수단 선택 (카드/계좌이체/간편결제)
4. "결제하기" 클릭
5. ⚠️ 실제 결제는 NICEPAY 연동 필요 → Mock 결제로 진행

=== 5단계: 주문 생성 확인 ===
1. Firebase Console > Firestore > orders 확인
2. 새 주문 문서 생성 확인
3. status: 'pending' 확인
4. items 배열 확인
5. deliveryInfo 확인

=== 6단계: 주문 추적 ===
1. 주문 완료 후 주문 추적 페이지로 리다이렉트
2. 주문 상태 표시 확인
3. 주문 상세 정보 확인
4. 배달 예상 시간 표시 확인

=== 7단계: 주문 내역 ===
1. http://localhost:5173/order-history 접속
2. 방금 생성한 주문이 목록에 표시되는지 확인
3. 주문 클릭 → 상세 페이지로 이동

=== 8단계: 관리자 확인 ===
1. 관리자 계정으로 로그인
   - 이메일: admin@hp-kal.com
   - 비밀번호: Admin1234!
2. http://localhost:5173/admin/orders 접속
3. 새 주문이 목록에 표시되는지 확인
4. 주문 클릭 → 상세 드로어 열림
5. 상태 변경: pending → accepted
6. Firebase Console에서 상태 업데이트 확인
7. 고객 페이지에서 상태 변경 반영 확인

각 단계마다 다음을 확인:
- ✅ 정상 작동
- ❌ 에러 발생
- ⚠️ 경고 발생
- 📊 Firestore 데이터 확인
- 🔍 브라우저 콘솔 확인

출력 형식:
```
✅ 전체 주문 플로우 테스트 완료

테스트 결과:
1. 사용자 로그인: ✅
2. 메뉴 선택: ✅
3. 장바구니: ✅
4. 결제: ✅ (Mock 모드)
5. 주문 생성: ✅
6. 주문 추적: ✅
7. 주문 내역: ✅
8. 관리자 확인: ✅

Firebase Console 확인:
✅ orders 컬렉션에 새 주문 생성됨
✅ 모든 필드 정상
✅ 상태 변경 정상 작동

⚠️ 발견된 문제:
- (없음 또는 문제 목록)

⏭️ 다음: Step 18로 진행
```
```

#### 검증 체크리스트:

```
[ ] 로그인 정상
[ ] 메뉴 목록 로드 정상
[ ] 메뉴 상세 정상
[ ] 장바구니 담기 정상
[ ] 장바구니 페이지 정상
[ ] 결제 페이지 정상
[ ] 주문 생성 성공
[ ] Firestore에 주문 저장 확인
[ ] 주문 추적 페이지 정상
[ ] 주문 내역 페이지 정상
[ ] 관리자 주문 관리 정상
[ ] 주문 상태 변경 정상
```

---

### ✅ Step 18: 관리자 기능 테스트

**목표**: 관리자 대시보드의 모든 기능 테스트

#### Cursor AI에게 제공할 프롬프트:

```
관리자 대시보드의 모든 기능을 테스트하고 정상 작동 여부를 확인해줘.

테스트 대상 페이지:

=== 1. 대시보드 (/admin) ===
- 통계 카드 (오늘 주문, 매출, 신규 고객)
- 최근 주문 목록
- 판매 추이 차트
- 인기 메뉴 Top 5

확인사항:
✅ 모든 통계가 Firestore 데이터 기반으로 표시되는가?
✅ 차트가 제대로 렌더링되는가?
✅ 실시간 업데이트가 되는가?

=== 2. 주문 관리 (/admin/orders) ===
- 주문 목록 (테이블)
- 필터 (전체/대기/접수/준비중/완료/취소)
- 검색 (주문번호, 고객명)
- 주문 상세 드로어
- 상태 변경 버튼
- 취소 사유 입력

테스트:
1. 필터 선택 → 해당 상태 주문만 표시
2. 검색 → 검색 결과 표시
3. 주문 클릭 → 드로어 열림
4. 상태 변경 → Firestore 업데이트 확인
5. 주문 취소 → 취소 사유 입력 → 저장

=== 3. 메뉴 관리 (/admin/menus) ===
- 메뉴 목록 (테이블)
- 카테고리 필터
- 품절 토글
- 메뉴 추가 버튼
- 메뉴 수정 다이얼로그
- 메뉴 삭제

테스트:
1. 품절 토글 → Firestore 업데이트 확인
2. "메뉴 추가" 클릭 → 다이얼로그 열림
3. 메뉴 정보 입력 → 저장 → Firestore 확인
4. 메뉴 수정 → 저장 → 변경 사항 반영 확인
5. 메뉴 삭제 → 확인 → Firestore에서 삭제 확인

=== 4. 리뷰 관리 (/admin/reviews) ===
- 리뷰 목록
- 별점 필터
- 답글 달기
- 신고된 리뷰 표시

테스트:
1. 리뷰 목록 로드 확인
2. 별점 필터 → 해당 별점 리뷰만 표시
3. "답글 달기" → 답글 입력 → 저장 → Firestore 확인
4. 고객 페이지에서 답글 표시 확인

=== 5. 통합 리포트 (/admin/integrated-analytics) ===
- 기간별 매출 차트
- 메뉴별 판매 순위
- 시간대별 주문 분포
- 고객 통계

확인사항:
✅ 차트 렌더링 정상
✅ 데이터 정확성
✅ 기간 선택 기능

=== 6. 설정 (/admin/settings) ===
- 운영 시간 설정
- 배달비 설정
- 결제 설정
- 알림 설정

테스트:
1. 각 탭 이동 확인
2. 설정 변경 → 저장 → Firestore 확인
3. 고객 페이지에서 변경 사항 반영 확인

각 기능 테스트 후 다음을 확인:
- ✅ 정상 작동
- ❌ 에러 발생
- ⚠️ 개선 필요
- 📊 Firestore 연동 확인

출력 형식:
```
✅ 관리자 기능 테스트 완료

테스트 결과 요약:
==================

1. 대시보드: ✅
   - 통계 카드: ✅
   - 최근 주문: ✅
   - 차트: ✅

2. 주문 관리: ✅
   - 목록/필터/검색: ✅
   - 상태 변경: ✅
   - 취소 처리: ✅

3. 메뉴 관리: ✅
   - 목록: ✅
   - 추가/수정/삭제: ✅
   - 품절 토글: ✅

4. 리뷰 관리: ✅
   - 목록/필터: ✅
   - 답글 달기: ✅

5. 통합 리포트: ✅
   - 차트: ✅
   - 통계: ✅

6. 설정: ✅
   - 모든 탭: ✅
   - 저장: ✅

⚠️ 발견된 문제:
- (없음 또는 문제 목록)

⏭️ Phase 6 완료! Phase 7로 진행 가능
```
```

#### 검증 체크리스트:

```
[ ] 대시보드 통계 정상
[ ] 주문 관리 모든 기능 정상
[ ] 메뉴 관리 CRUD 정상
[ ] 리뷰 관리 정상
[ ] 통합 리포트 차트 정상
[ ] 설정 저장/로드 정상
[ ] Firestore 연동 모두 정상
[ ] 에러 없음
```

---

## Phase 7: 프로덕션 준비

---

### ✅ Step 19: 디버그 페이지 및 개발 버튼 제거

**목표**: 프로덕션 배포를 위해 개발 전용 요소 제거

#### Cursor AI에게 제공할 프롬프트:

```
프로덕션 배포를 위해 모든 개발 전용 요소를 제거해줘.

=== 작업 1: /dev 라우트 제거 ===

App.tsx에서:
```typescript
// ❌ 제거할 코드
import { DevTools } from './pages/DevTools';

<Route path="/dev" element={<DevTools />} />

// ✅ 삭제 또는 조건부로 변경
{process.env.NODE_ENV === 'development' && (
  <Route path="/dev" element={<DevTools />} />
)}
```

=== 작업 2: 관리자 대시보드 디버그 버튼 제거 ===

다음 파일들을 검토하고 개발용 버튼 제거:

1. pages/admin/Dashboard.tsx
   - "데이터 초기화" 버튼 (있다면)
   - "Mock 데이터 생성" 버튼 (있다면)
   - "테스트 모드" 토글 (있다면)

2. pages/admin/Orders.tsx
   - "Mock 주문 생성" 버튼 (있다면)
   - "전체 삭제" 버튼 (있다면)

3. pages/admin/Menus.tsx
   - "Mock 데이터 불러오기" 버튼 (있다면)

4. pages/admin/Settings/index.tsx
   - "개발자 모드" 토글 (있다면)
   - "Firestore 규칙 테스트" 버튼 (있다면)

=== 작업 3: Console.log 정리 ===

다음 파일들의 console.log 제거 또는 조건부로 변경:

```typescript
// ❌ 제거할 코드
console.log('[Debug] 사용자 정보:', user);
console.log('[Debug] Firestore 응답:', data);

// ✅ 조건부로 유지 (필요시)
if (process.env.NODE_ENV === 'development') {
  console.log('[Dev] 사용자 정보:', user);
}

// ✅ 에러 로그는 유지
console.error('[Error] API 호출 실패:', error);
```

대상 파일:
- lib/**/*.ts
- pages/**/*.tsx
- components/**/*.tsx

=== 작업 4: 환경변수 프로덕션 설정 확인 ===

.env 파일:
```env
# ❌ 개발 모드
VITE_APP_ENV=development
VITE_APP_DEBUG=true

# ✅ 프로덕션 모드
VITE_APP_ENV=production
VITE_APP_DEBUG=false
```

=== 작업 5: Mock 모드 비활성화 확인 ===

config/env.ts:
```typescript
// ✅ Firebase 사용 확인
export const USE_FIREBASE = true;  // false가 아닌지 확인
```

=== 작업 6: 테스트 계정 정보 제거 ===

코드에서 하드코딩된 테스트 계정 정보 제거:
- 이메일: test@example.com
- 비밀번호: Test1234!
- 기타 테스트 데이터

=== 작업 7: 주석 정리 ===

불필요한 개발 주석 제거:
```typescript
// ❌ 제거
// TODO: 나중에 구현
// FIXME: 버그 수정 필요
// HACK: 임시 코드

// ✅ 유지 (프로덕션에 필요한 설명)
/**
 * 주문을 생성합니다.
 * @param userId - 사용자 ID
 * @returns 주문 ID
 */
```

=== 작업 8: 검증 ===

1. 빌드 테스트:
```bash
npm run build
```

2. 빌드 결과 확인:
- dist/ 폴더 생성됨
- 번들 크기 확인
- 에러 없음

3. 프리뷰 테스트:
```bash
npm run preview
```

4. 모든 기능 정상 작동 확인

출력 형식:
```
✅ 프로덕션 준비 완료

제거된 항목:
=============
✅ /dev 라우트 제거
✅ 관리자 디버그 버튼 제거 (N개)
✅ console.log 정리 (N개)
✅ 테스트 계정 정보 제거
✅ 불필요한 주석 제거

변경된 설정:
============
✅ VITE_APP_ENV=production
✅ VITE_APP_DEBUG=false
✅ USE_FIREBASE=true

빌드 테스트:
===========
✅ npm run build 성공
✅ 번들 크기: XXX KB (gzip)
✅ 에러 없음

프리뷰 테스트:
=============
✅ npm run preview 정상
✅ 모든 기능 작동
✅ /dev 라우트 접근 불가 확인

⏭️ 다음: Step 20 (최종 단계)
```
```

#### 검증 체크리스트:

```
[ ] /dev 라우트 제거 완료
[ ] 관리자 디버그 버튼 모두 제거
[ ] console.log 정리 완료
[ ] 환경변수 프로덕션 모드 설정
[ ] USE_FIREBASE=true 확인
[ ] 테스트 계정 정보 제거
[ ] 불필요한 주석 제거
[ ] npm run build 성공
[ ] npm run preview 정상
[ ] 모든 기능 정상 작동
```

---

### ✅ Step 20: 최종 빌드 및 배포 준비

**목표**: 프로덕션 빌드 및 Firebase Hosting 배포

#### Cursor AI에게 제공할 프롬프트:

```
프로덕션 배포를 위한 최종 체크리스트를 확인하고 빌드해줘.

=== Part 1: 최종 체크리스트 ===

환경변수 확인:
[ ] VITE_USE_FIREBASE=true
[ ] VITE_FIREBASE_* 모두 실제 값
[ ] VITE_APP_ENV=production
[ ] VITE_APP_DEBUG=false

Firebase 확인:
[ ] Authentication 활성화
[ ] Firestore Database 생성
[ ] Storage 활성화
[ ] Firestore 규칙 배포
[ ] Storage 규칙 배포
[ ] Cloud Functions 배포 (선택)

데이터 확인:
[ ] 메뉴 데이터 마이그레이션
[ ] 관리자 계정 생성
[ ] 가게 설정 (settings 컬렉션)

코드 확인:
[ ] /dev 라우트 제거
[ ] 디버그 버튼 제거
[ ] console.log 정리
[ ] TypeScript 에러 없음
[ ] Lint 에러 없음

=== Part 2: 프로덕션 빌드 ===

```bash
# 1. TypeScript 컴파일 확인
npx tsc --noEmit

# 2. Lint 확인
npm run lint

# 3. 빌드
npm run build

# 4. 빌드 결과 확인
ls -lh dist/
```

예상 결과:
- dist/ 폴더 생성
- assets/ 폴더 (JS, CSS)
- index.html
- 총 크기: ~500KB (gzip)

=== Part 3: 프리뷰 테스트 ===

```bash
npm run preview
```

확인사항:
1. 모든 페이지 접속 확인
2. Firebase 연동 정상
3. 주문 플로우 테스트
4. 관리자 기능 테스트
5. 성능 확인 (Lighthouse)

=== Part 4: Firebase Hosting 배포 ===

```bash
# 1. firebase.json 확인
cat firebase.json

# 2. Hosting 초기화 (이미 되어있다면 생략)
firebase init hosting

# 3. 배포
firebase deploy --only hosting

# 4. 배포 확인
# 출력되는 URL 확인: https://hp-kal.web.app
```

=== Part 5: 배포 후 검증 ===

1. 배포된 URL 접속
2. 모든 기능 테스트
3. 실제 기기에서 테스트:
   - 모바일 (Android/iOS)
   - 태블릿
   - 데스크톱
4. PWA 설치 테스트 (A2HS)
5. 성능 측정 (Lighthouse)

출력 형식:
```
✅ 최종 빌드 및 배포 준비 완료

체크리스트:
===========
✅ 환경변수 모두 설정
✅ Firebase 모두 설정
✅ 데이터 마이그레이션 완료
✅ 코드 정리 완료

빌드 결과:
=========
✅ TypeScript 컴파일 성공
✅ Lint 통과
✅ 빌드 성공
✅ 번들 크기: 456 KB (gzip)

프리뷰 테스트:
============
✅ 모든 페이지 정상
✅ Firebase 연동 정상
✅ 주문 플로우 정상
✅ 관리자 기능 정상

Firebase Hosting:
================
✅ 배포 완료
✅ URL: https://hp-kal.web.app
✅ SSL 인증서 자동 적용
✅ CDN 캐싱 활성화

Lighthouse 점수:
===============
- Performance: 95/100
- Accessibility: 95/100
- Best Practices: 100/100
- SEO: 100/100
- PWA: 100/100

🎉 프로덕션 배포 완료!

다음 단계:
========
1. 실제 도메인 연결
2. NICEPAY 실 결제 전환
3. Google Maps API 연동
4. 배달대행사 API 연동
5. 사용자 테스트 및 피드백

⏭️ 모든 Step 완료! 🎉
```
```

#### 최종 검증 체크리스트:

```
[ ] 모든 환경변수 설정 완료
[ ] Firebase 모든 서비스 활성화
[ ] 데이터 마이그레이션 완료
[ ] 관리자 계정 생성 완료
[ ] 개발 전용 코드 모두 제거
[ ] TypeScript 컴파일 성공
[ ] Lint 통과
[ ] npm run build 성공
[ ] npm run preview 정상
[ ] Firebase Hosting 배포 성공
[ ] 배포 URL 접속 확인
[ ] 모든 기능 정상 작동
[ ] PWA 설치 테스트 성공
[ ] Lighthouse 점수 90+ 
[ ] 실제 기기 테스트 완료
```

---

## 🎉 축하합니다!

모든 ATOMIC 단계를 완료했습니다!

### 완료된 작업 요약

```
Phase 1: 로컬 환경 설정 ✅
- Step 1: 의존성 설치
- Step 2: 환경변수 설정
- Step 3: 개발 서버 실행

Phase 2: Firebase 프로젝트 생성 ✅
- Step 4: Firebase 프로젝트 생성
- Step 5: 구성 정보 적용
- Step 6: SDK 초기화 확인

Phase 3: Authentication 연동 ✅
- Step 7: Authentication 설정
- Step 8: 회원가입 연동
- Step 9: 로그인/로그아웃 연동

Phase 4: Firestore 연동 ✅
- Step 10: Database 설정
- Step 11: 메뉴 마이그레이션
- Step 12: 주문 시스템 연동
- Step 13: 리뷰 시스템 연동

Phase 5: Storage & Functions ✅
- Step 14: Storage 설정
- Step 15: 이미지 업로드 연동
- Step 16: Cloud Functions 배포

Phase 6: 통합 테스트 ✅
- Step 17: 주문 플로우 테스트
- Step 18: 관리자 기능 테스트

Phase 7: 프로덕션 준비 ✅
- Step 19: 디버그 제거
- Step 20: 최종 빌드 및 배포
```

### 다음 단계

```
1. 실제 도메인 연결
   - Firebase Hosting > 도메인 > "커스텀 도메인 추가"
   
2. NICEPAY 실 결제 전환
   - NICEPAY 관리자 페이지에서 실 계약
   - .env 파일에 실 MID/KEY 입력
   
3. Google Maps API 연동
   - Google Cloud Console에서 API 키 발급
   - Maps JavaScript API 활성화
   
4. 배달대행사 API 연동
   - 배달대행사 계약
   - API 키 발급 및 연동
   
5. 모니터링 설정
   - Firebase Analytics 확인
   - Error 추적 (Crashlytics)
   - 성능 모니터링
```

---

**작성:** KS컴퍼니 (사업자번호 553-17-00098)  
**버전:** 1.0.0  
**최종 수정:** 2024-11-08

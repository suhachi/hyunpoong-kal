# 🔧 미리보기 화면 문제 해결 가이드

**작성일**: 2025-10-30  
**작성자**: KS컴퍼니 개발팀  
**사업자번호**: 553-17-00098

---

## 🚨 긴급 해결 방법

### 1단계: 브라우저 확인

```bash
# 개발 서버가 실행 중인지 확인
# 터미널에서 다음 명령어 실행
npm run dev
```

**기대 출력:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2단계: 테스트 페이지 접속

브라우저에서 다음 URL을 차례대로 시도하세요:

1. **테스트 페이지** (가장 간단한 HTML)
   ```
   http://localhost:5173/test-app.html
   ```
   
2. **간단한 React 앱** (React만 테스트)
   ```
   http://localhost:5173/
   ```
   단, `main.tsx`를 먼저 수정해야 합니다:
   
   ```typescript
   // main.tsx 수정
   import App from './App.simple';  // ⭐ 변경
   ```

3. **디버그 페이지**
   ```
   http://localhost:5173/debug
   ```

### 3단계: 브라우저 콘솔 확인

1. **F12** 키 누르기 (또는 오른쪽 클릭 → 검사)
2. **Console** 탭 선택
3. 빨간색 에러 메시지 확인

---

## 📋 체크리스트

### A. 서버 상태

- [ ] `npm run dev` 실행 중
- [ ] 포트 5173이 사용 가능
- [ ] 터미널에 에러 없음
- [ ] `http://localhost:5173` 접속 가능

### B. 파일 상태

- [ ] `index.html` 존재
- [ ] `main.tsx` 존재
- [ ] `App.tsx` 존재
- [ ] `node_modules` 폴더 존재

### C. 브라우저 상태

- [ ] 최신 Chrome/Edge/Firefox 사용
- [ ] 캐시 삭제 (Ctrl+Shift+Del)
- [ ] 시크릿 모드로 테스트
- [ ] 콘솔에 에러 없음

---

## 🔍 문제별 해결 방법

### 문제 1: 빈 화면 (흰 화면)

**증상:**
- 아무것도 표시되지 않음
- 로딩 스피너도 없음

**해결:**

#### 1.1 캐시 삭제
```
Ctrl + Shift + Del → 캐시된 이미지 및 파일 삭제
```

#### 1.2 강제 새로고침
```
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

#### 1.3 시크릿 모드로 테스트
```
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
```

### 문제 2: 로딩 중 상태로 멈춤

**증상:**
- 로딩 스피너만 계속 표시
- 페이지가 렌더링되지 않음

**해결:**

#### 2.1 브라우저 콘솔 확인
```
F12 → Console 탭
```

예상 에러:
- `AuthContext` 관련 에러
- `Firebase` 초기화 에러
- 라우팅 에러

#### 2.2 임시 우회 (간단한 App 사용)

```bash
# 1. main.tsx 백업
cp main.tsx main.tsx.backup

# 2. main.tsx 수정
```

```typescript
// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.simple';  // ⭐ 변경
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

브라우저 새로고침 → 화면이 보이면 App.tsx에 문제가 있는 것

### 문제 3: 404 Not Found

**증상:**
- "Cannot GET /" 메시지
- 페이지를 찾을 수 없음

**해결:**

#### 3.1 개발 서버 재시작
```bash
# Ctrl+C로 서버 중지
npm run dev
```

#### 3.2 포트 변경
```bash
# vite.config.ts 수정
export default defineConfig({
  server: {
    port: 3000  // 5173 → 3000
  }
});
```

### 문제 4: Module not found

**증상:**
- "Module not found" 에러
- "Cannot find module" 에러

**해결:**

#### 4.1 의존성 재설치
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4.2 캐시 삭제
```bash
rm -rf .vite
npm run dev
```

---

## 🛠️ 단계별 진단

### 1단계: HTML 테스트

```
http://localhost:5173/test-app.html
```

**✅ 성공:** HTML이 정상 작동
**❌ 실패:** 서버가 실행되지 않음 → 개발 서버 확인

### 2단계: 간단한 React 테스트

```bash
# main.tsx 수정
import App from './App.simple';
```

**✅ 성공:** React가 정상 작동
**❌ 실패:** React 설정 문제 → package.json 확인

### 3단계: 전체 앱 테스트

```bash
# main.tsx 복구
import App from './App';
```

**✅ 성공:** 전체 앱이 정상 작동
**❌ 실패:** App.tsx에 문제 → 콘솔 에러 확인

---

## 🔧 수동 수정 가이드

### 상황 1: AuthContext 에러

**에러 메시지:**
```
Cannot read properties of null (reading 'currentUser')
```

**해결:**

1. `/contexts/AuthContext.tsx` 열기
2. 54번째 줄 찾기:
```typescript
if (USE_FIREBASE && auth) {  // ⭐ auth 체크 추가
```

### 상황 2: Firebase 초기화 에러

**에러 메시지:**
```
Firebase: Error (auth/invalid-api-key)
```

**해결:**

1. `/config/env.ts` 열기
2. 58번째 줄 확인:
```typescript
export const USE_FIREBASE = getEnv('VITE_USE_FIREBASE') === 'true';
```

3. `.env` 파일 생성 또는 확인:
```bash
# .env (없으면 생성)
VITE_USE_FIREBASE=false
```

### 상황 3: 라우팅 에러

**에러 메시지:**
```
No routes matched location "/"
```

**해결:**

1. `/App.tsx` 열기
2. 기본 라우트 확인:
```typescript
<Route index element={<Home />} />
```

---

## 📞 긴급 지원

### 자동 진단 스크립트

```bash
# 프로젝트 루트에서 실행
npm run dev

# 새 터미널 창에서
curl http://localhost:5173/test-app.html
```

**성공 시:** HTML 코드가 출력됨
**실패 시:** 서버가 실행되지 않음

### 로그 확인

```bash
# 개발 서버 로그
npm run dev 2>&1 | tee dev.log

# 빌드 로그
npm run build 2>&1 | tee build.log
```

---

## 🎯 빠른 해결 순서

```
1. npm run dev 확인
   ↓
2. http://localhost:5173/test-app.html 접속
   ↓ (성공)
3. F12 → Console 확인
   ↓ (에러 있음)
4. 에러 메시지 확인
   ↓
5. 위의 "문제별 해결 방법" 참고
   ↓
6. 해결 안 되면 App.simple.tsx 사용
   ↓
7. 문제 격리 후 원인 파악
```

---

## 📊 진단 결과 기록

### 테스트 1: 서버 실행
- [ ] ✅ 성공
- [ ] ❌ 실패 → 에러: _____________

### 테스트 2: test-app.html
- [ ] ✅ 성공
- [ ] ❌ 실패 → 에러: _____________

### 테스트 3: App.simple
- [ ] ✅ 성공
- [ ] ❌ 실패 → 에러: _____________

### 테스트 4: 전체 앱
- [ ] ✅ 성공
- [ ] ❌ 실패 → 에러: _____________

---

## 💡 예방 조치

### 1. 정기 캐시 삭제
```bash
# 개발 중 주기적으로 실행
rm -rf .vite node_modules/.vite
```

### 2. 의존성 업데이트
```bash
# 주 1회 실행
npm update
```

### 3. 브라우저 개발자 도구 활용
- Network 탭: 요청 실패 확인
- Console 탭: 에러 메시지 확인
- Application 탭: 캐시/Storage 확인

---

## 📚 관련 문서

- [로컬 환경 설정 가이드](/docs/03-development/31-로컬-환경-설정-실행가이드.md)
- [미리보기 로딩 문제 해결](/docs/03-development/35-미리보기-로딩-문제-해결.md)
- [환경변수 설정 가이드](/docs/03-development/환경변수-설정가이드.md)

---

## ✅ 최종 체크

해결되었습니까?

- [ ] ✅ 화면이 정상적으로 표시됨
- [ ] ✅ 로그인/회원가입 작동
- [ ] ✅ 메뉴 목록이 표시됨
- [ ] ✅ 관리자 페이지 접근 가능

**모두 체크되었다면 성공입니다! 🎉**

---

**KS컴퍼니**  
사업자번호: 553-17-00098  
대표: 석경선 / 공동대표: 배종수

**END OF GUIDE**

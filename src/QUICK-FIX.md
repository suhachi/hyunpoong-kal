# ⚡ 미리보기 화면 빠른 해결

**현풍닭칼국수 PWA - 긴급 문제 해결**

---

## 🚨 화면이 안 보일 때 (60초 해결)

### 1️⃣ 터미널 확인 (10초)

```bash
# 개발 서버 실행 중인가?
npm run dev
```

**✅ 정상:** `Local: http://localhost:5173/` 표시  
**❌ 비정상:** 에러 메시지 → 단계 2로

---

### 2️⃣ 브라우저 테스트 (20초)

다음 URL을 **순서대로** 시도:

#### A. 테스트 페이지 (가장 간단)
```
http://localhost:5173/test-app.html
```
- ✅ **보임**: React 문제 → 단계 3
- ❌ **안 보임**: 서버 문제 → 단계 4

#### B. 디버그 페이지
```
http://localhost:5173/debug
```
- ✅ **보임**: App.tsx 문제
- ❌ **안 보임**: 라우팅 문제

---

### 3️⃣ 캐시 삭제 (15초)

```
1. Ctrl + Shift + Del (캐시 삭제 창 열기)
2. "캐시된 이미지 및 파일" 체크
3. 삭제 버튼 클릭
4. Ctrl + Shift + R (강제 새로고침)
```

**✅ 해결:** 화면이 보임!  
**❌ 안됨:** 단계 4로

---

### 4️⃣ 의존성 재설치 (15초)

```bash
npm run reset
```

또는:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 🔍 상세 진단

위 방법으로 해결되지 않으면:

### F12 → Console 확인

**에러별 해결:**

#### 에러 1: `auth/invalid-api-key`
```bash
# .env 파일 생성
echo "VITE_USE_FIREBASE=false" > .env
npm run dev
```

#### 에러 2: `Cannot read properties of null`
→ AuthContext 문제 (이미 수정됨)

#### 에러 3: `Module not found`
```bash
npm run reset
```

---

## 💊 긴급 우회 방법

### 간단한 버전으로 실행

```typescript
// main.tsx 수정
import App from './App.simple';  // 추가된 파일 사용
```

```bash
npm run dev
```

→ 화면이 보이면 `App.tsx`에 문제

---

## 📞 즉시 확인 체크리스트

- [ ] 터미널에서 `npm run dev` 실행 중
- [ ] `http://localhost:5173/test-app.html` 접속됨
- [ ] 브라우저 F12 → Console에 에러 없음
- [ ] 캐시 삭제 완료
- [ ] 시크릿 모드로 테스트

**모두 체크 → 성공! 🎉**

---

## 🎯 가장 흔한 원인 TOP 3

### 1. 캐시 문제 (70%)
**해결:** Ctrl+Shift+Del → 캐시 삭제

### 2. 의존성 문제 (20%)
**해결:** `npm run reset`

### 3. 포트 충돌 (10%)
**해결:** 5173 포트 사용 중인 프로그램 종료

---

## 📚 자세한 가이드

더 자세한 내용은 다음 문서를 참고하세요:
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 전체 문제 해결 가이드
- [docs/03-development/35-미리보기-로딩-문제-해결.md](./docs/03-development/35-미리보기-로딩-문제-해결.md)

---

## ✅ 해결 완료!

화면이 보이면:

1. **홈 화면** → ✅ 작동
2. **로그인** → `customer@example.com` / `test1234`
3. **관리자** → 홈 하단 "관리자 대시보드" 버튼

---

**KS컴퍼니** (사업자번호: 553-17-00098)  
대표: 석경선 / 공동대표: 배종수

**END**

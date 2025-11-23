# Firestore Security Rules - 메뉴 관리 가이드

**작성일**: 2025-11-23  
**목적**: 관리자 메뉴 등록 기능이 Firestore에 정상적으로 메뉴 문서를 생성하도록 Security Rules 설정 가이드

---

## 📋 현재 상황 요약

### 컬렉션 경로
- **메뉴 컬렉션**: `stores/{storeId}/menus/{menuId}`
- **현재 Store ID**: `hyunpoong-main` (`.env.local`의 `VITE_STORE_ID`)

### 문제점
- 관리자가 `/admin/menus`에서 "메뉴 등록 → 저장"을 눌러도 Firestore에 문서가 생성되지 않음
- **가능성 1순위**: Firestore Security Rules에서 `stores/{storeId}/menus` 쓰기 권한이 막혀있음

### 확인 방법
브라우저 콘솔(F12)에서 다음 에러가 보이면 Rules 문제입니다:
```
[createMenu] Firestore permission error: {
  code: "permission-denied",
  message: "...",
  storeId: "hyunpoong-main",
  collectionPath: "stores/hyunpoong-main/menus"
}
```

---

## 🔧 Firestore Rules 설정 방법

### 1. Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com) 접속
2. 프로젝트 `hyun-poong` 선택
3. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
4. 상단 탭에서 **"규칙"** 탭 클릭

### 2. Rules 편집기 열기
- "규칙" 탭에서 편집기 화면이 보입니다
- 현재 규칙이 표시됩니다

---

## 📝 Rules 예시

### ✅ 개발/테스트용 Rules (모든 접근 허용)

**⚠️ 주의**: 이 규칙은 **개발/테스트 환경에서만** 사용하세요. 프로덕션에서는 절대 사용하지 마세요.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 메뉴 컬렉션: 모든 읽기/쓰기 허용 (개발용)
    match /stores/{storeId}/menus/{menuId} {
      allow read, write: if true;
    }
    
    // 기타 컬렉션도 개발용으로 허용 (선택사항)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**사용 시기**:
- 로컬 개발 환경
- 초기 테스트 단계
- 메뉴 등록 기능 검증 중

---

### 🔒 운영용 Rules (인증된 관리자만 허용)

#### 옵션 1: 이메일 기반 인증

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 메뉴 컬렉션: 인증된 관리자만 쓰기 가능
    match /stores/{storeId}/menus/{menuId} {
      // 읽기는 모든 사용자 허용 (고객 앱에서도 메뉴 조회 필요)
      allow read: if true;
      
      // 쓰기는 관리자 이메일만 허용
      allow write: if request.auth != null
                   && request.auth.token.email == "admin@hyunpoongkalguksu.com";
    }
    
    // 기타 컬렉션 규칙...
  }
}
```

#### 옵션 2: 여러 관리자 이메일 허용

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 관리자 이메일 목록
    function isAdmin() {
      return request.auth != null
             && request.auth.token.email in [
               "admin@hyunpoongkalguksu.com",
               "owner@hyunpoongkalguksu.com",
               "manager@hyunpoongkalguksu.com"
             ];
    }
    
    match /stores/{storeId}/menus/{menuId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

#### 옵션 3: 커스텀 클레임 기반 (권장 - 향후 확장 가능)

Firebase Auth에서 사용자에게 `role: "admin"` 또는 `role: "owner"` 커스텀 클레임을 부여한 경우:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 관리자 역할 체크 함수
    function isAdmin() {
      return request.auth != null
             && request.auth.token.role in ["admin", "owner"];
    }
    
    match /stores/{storeId}/menus/{menuId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

**커스텀 클레임 설정 방법**:
1. Firebase Console → Authentication → Users
2. 사용자 선택 → "커스텀 클레임" 탭
3. `role` 필드에 `admin` 또는 `owner` 입력

---

## 🚀 Rules 적용 절차

### Step 1: Rules 편집
1. Firebase Console → Firestore Database → "규칙" 탭
2. 위 예시 중 하나를 복사하여 편집기에 붙여넣기
3. 필요 시 이메일 주소 수정

### Step 2: Rules 검증
1. 편집기 하단의 **"검증"** 버튼 클릭
2. 문법 오류가 없으면 "규칙이 유효합니다" 메시지 표시

### Step 3: Rules 게시
1. **"게시"** 버튼 클릭
2. 확인 대화상자에서 "게시" 확인
3. **적용까지 약 1분 소요** (Rules가 전 세계 Firebase 서버에 배포됨)

### Step 4: 메뉴 등록 테스트
1. `/admin/menus` 페이지 접속
2. "메뉴 등록" 버튼 클릭
3. 메뉴 정보 입력 후 "저장" 클릭
4. 성공 시:
   - 토스트 메시지: "메뉴가 등록되었습니다"
   - Firestore Console에서 `stores/hyunpoong-main/menus` 컬렉션에 새 문서 생성 확인

---

## 🔍 문제 해결 가이드

### 문제 1: 여전히 permission-denied 에러 발생

**원인**:
- Rules가 아직 적용되지 않음 (1분 대기 필요)
- 이메일 주소가 Rules와 일치하지 않음
- 로그인하지 않은 상태

**해결**:
1. Rules 게시 후 **최소 1분 대기**
2. 브라우저에서 **강력 새로고침** (Ctrl+Shift+R)
3. 로그아웃 후 다시 로그인
4. Firebase Console에서 현재 로그인한 사용자 이메일 확인
5. Rules의 이메일 주소와 일치하는지 확인

### 문제 2: Rules 문법 오류

**원인**:
- 중괄호 불일치
- 따옴표 누락
- 함수 정의 오류

**해결**:
1. 편집기의 "검증" 버튼으로 문법 확인
2. 오류 메시지 확인 후 수정
3. 예시 코드를 그대로 복사하여 사용

### 문제 3: 메뉴는 생성되지만 읽기가 안 됨

**원인**:
- Rules에서 `allow read`가 없거나 조건이 너무 엄격함

**해결**:
```javascript
match /stores/{storeId}/menus/{menuId} {
  allow read: if true;  // 모든 사용자 읽기 허용
  allow write: if isAdmin();  // 관리자만 쓰기
}
```

---

## 📊 Rules 적용 확인 방법

### 방법 1: Firebase Console에서 확인
1. Firestore Database → "데이터" 탭
2. `stores` → `hyunpoong-main` → `menus` 경로로 이동
3. 메뉴 등록 후 새 문서가 생성되는지 확인

### 방법 2: 브라우저 콘솔에서 확인
메뉴 등록 성공 시 다음 로그가 출력됩니다:
```
[createMenu] storeId: hyunpoong-main
[createMenu] menuData: {...}
[createMenu] menuDocData: {...}
[createMenu] collection path: stores/hyunpoong-main/menus
[createMenu] Document created with ID: XXXXXX
```

에러 발생 시:
```
[createMenu] Firestore permission error: {
  code: "permission-denied",
  ...
}
```

---

## ⚠️ 중요 사항

### 1. 프로덕션 환경 주의
- **개발용 Rules (`allow read, write: if true`)는 절대 프로덕션에서 사용하지 마세요**
- 프로덕션에서는 반드시 인증 기반 Rules를 사용하세요

### 2. Rules 파일 vs Console Rules
- 이 프로젝트 리포지토리의 `firestore.rules` 파일은 **로컬 개발용**입니다
- **실서버(Firebase Hosting)에는 Firebase Console의 Rules가 적용됩니다**
- 따라서 Rules 변경은 **반드시 Firebase Console에서 수동으로** 해야 합니다

### 3. Rules 변경 시 영향 범위
- Rules 변경은 **전 세계 Firebase 서버에 배포**됩니다
- 적용까지 **약 1분** 소요됩니다
- 변경 후 즉시 테스트하지 말고 1분 정도 대기하세요

---

## 📚 참고 자료

- [Firestore Security Rules 공식 문서](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Rules 조건문 가이드](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [커스텀 클레임 설정 방법](https://firebase.google.com/docs/auth/admin/custom-claims)

---

## ✅ 체크리스트

메뉴 등록 기능이 정상 작동하는지 확인:

- [ ] Firebase Console에서 Rules 탭 접속
- [ ] 개발용 또는 운영용 Rules 복사하여 붙여넣기
- [ ] Rules 검증 통과
- [ ] Rules 게시 완료
- [ ] 1분 대기
- [ ] `/admin/menus`에서 메뉴 등록 시도
- [ ] 브라우저 콘솔에서 `[createMenu] Document created with ID: ...` 로그 확인
- [ ] Firestore Console에서 `stores/hyunpoong-main/menus`에 새 문서 생성 확인
- [ ] 고객 앱에서 메뉴 목록에 새 메뉴 표시 확인

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-11-23


# 🔥 Firebase Storage CORS 설정 적용 가이드

**프로젝트**: 현풍닭칼국수 PWA  
**작성일**: 2025-01-20  
**목적**: Google Cloud Console에서 Firebase Storage CORS 설정 직접 적용

---

## 📋 준비사항

### 필요한 정보
- ✅ Google 계정 (Firebase 프로젝트 소유자 또는 Storage 관리자 권한)
- ✅ Firebase 프로젝트 ID: `hyun-poong`
- ✅ CORS 설정 JSON 파일: `src/cors.json`

### CORS 설정 내용

```json
[
  {
    "origin": [
      "https://hyun-poong.web.app",
      "https://hyun-poong.firebaseapp.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 🚀 단계별 가이드

### Step 1: Google Cloud Console 접속

1. **브라우저에서 접속**
   - URL: https://console.cloud.google.com/storage/browser
   - 또는: https://console.cloud.google.com → "Storage" 메뉴 클릭

2. **Google 계정으로 로그인**
   - Firebase 프로젝트에 접근 권한이 있는 계정으로 로그인

---

### Step 2: 프로젝트 선택

1. **상단 프로젝트 선택 드롭다운 클릭**
   - 현재 프로젝트 이름 옆의 드롭다운 화살표 클릭

2. **프로젝트 선택**
   - 프로젝트 목록에서 **`hyun-poong`** 선택
   - 또는 검색창에 "hyun-poong" 입력하여 선택

---

### Step 3: Storage 버킷 선택

1. **버킷 목록 확인**
   - 화면에 버킷 목록이 표시됩니다
   - 버킷 이름: **`hyun-poong.firebasestorage.app`** ← **이 버킷을 클릭하세요!**
   - 참고: 최신 Firebase는 `*.firebasestorage.app` 형식을 사용합니다
   - `hyun-poong.appspot.com`은 구버전 이름일 수 있습니다

2. **버킷 클릭**
   - **`hyun-poong.firebasestorage.app`** 버킷 이름을 클릭하여 버킷 상세 페이지로 이동

---

### Step 4: 권한 탭으로 이동

1. **상단 탭 메뉴 확인**
   - 버킷 상세 페이지 상단에 다음 탭들이 있습니다:
     - **파일** (Files)
     - **권한** (Permissions) ← **이 탭 클릭**
     - **사용량** (Usage)
     - **Extensions**

2. **"권한" 탭 클릭**
   - "권한" 또는 "Permissions" 탭을 클릭합니다

---

### Step 5: CORS 구성 섹션 찾기

1. **권한 페이지 스크롤**
   - 권한 페이지를 아래로 스크롤합니다

2. **"CORS 구성" 섹션 찾기**
   - "CORS 구성" 또는 "CORS Configuration" 섹션을 찾습니다
   - 이 섹션은 페이지 중간 또는 하단에 위치합니다

3. **"편집" 버튼 클릭**
   - CORS 구성 섹션 오른쪽에 있는 **"편집"** 또는 **"Edit"** 버튼을 클릭합니다

---

### Step 6: CORS 설정 입력

1. **JSON 편집기 열림**
   - "편집" 버튼을 클릭하면 JSON 편집기가 열립니다
   - 기존 설정이 있다면 표시되고, 없다면 빈 배열 `[]`이 표시됩니다

2. **기존 내용 삭제 (있는 경우)**
   - 기존 CORS 설정이 있다면 모두 선택(Ctrl+A) 후 삭제

3. **새 CORS 설정 붙여넣기**
   - 아래 JSON을 복사하여 붙여넣기:

```json
[
  {
    "origin": [
      "https://hyun-poong.web.app",
      "https://hyun-poong.firebaseapp.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

4. **JSON 형식 확인**
   - JSON이 올바른 형식인지 확인 (쉼표, 대괄호, 중괄호 등)
   - 오류가 있으면 빨간색으로 표시됩니다

---

### Step 7: 저장

1. **"저장" 버튼 클릭**
   - 편집기 하단 또는 오른쪽에 있는 **"저장"** 또는 **"Save"** 버튼을 클릭합니다

2. **저장 확인**
   - "CORS 구성이 업데이트되었습니다" 또는 "CORS configuration updated" 메시지가 표시됩니다
   - 저장이 완료되면 편집 모드가 종료되고 읽기 모드로 돌아갑니다

---

### Step 8: 설정 확인

1. **CORS 설정 확인**
   - 저장 후 CORS 구성 섹션에 입력한 설정이 표시되는지 확인합니다

2. **설정 내용 확인**
   - Origin 목록에 다음 도메인들이 포함되어 있는지 확인:
     - ✅ `https://hyun-poong.web.app`
     - ✅ `https://hyun-poong.firebaseapp.com`
     - ✅ `http://localhost:5173`
     - ✅ `http://localhost:5174`

---

## ✅ 적용 확인 방법

### 방법 1: 브라우저에서 테스트

1. **관리자 페이지 접속**
   - `https://hyun-poong.web.app/admin/menus` 접속

2. **메뉴 이미지 업로드 시도**
   - 메뉴 등록 또는 수정 페이지에서 이미지 업로드

3. **개발자 도구 확인**
   - F12 키로 개발자 도구 열기
   - Network 탭에서 이미지 업로드 요청 확인
   - CORS 에러가 없어야 합니다

### 방법 2: gsutil 명령어로 확인

```bash
# CORS 설정 확인
gsutil cors get gs://hyun-poong.firebasestorage.app
```

출력 예시:
```json
[
  {
    "origin": [
      "https://hyun-poong.web.app",
      "https://hyun-poong.firebaseapp.com",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 🚨 문제 해결

### 문제 1: "권한" 탭이 보이지 않아요

**해결 방법**:
- Storage 관리자 권한이 필요합니다
- 프로젝트 소유자에게 권한 요청
- 또는 프로젝트 소유자 계정으로 로그인

### 문제 2: "편집" 버튼이 비활성화되어 있어요

**해결 방법**:
- 프로젝트 소유자 또는 Storage 관리자 권한 확인
- 브라우저를 새로고침 (F5)
- 다른 브라우저에서 시도

### 문제 3: JSON 형식 오류가 발생해요

**해결 방법**:
- JSON 형식 확인 (쉼표, 따옴표 등)
- JSON 유효성 검사 도구 사용: https://jsonlint.com/
- 아래 올바른 형식 사용:

```json
[
  {
    "origin": ["https://hyun-poong.web.app", "https://hyun-poong.firebaseapp.com", "http://localhost:5173", "http://localhost:5174"],
    "method": ["GET","HEAD","POST","PUT","DELETE","OPTIONS"],
    "responseHeader": ["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

### 문제 4: 저장 후에도 CORS 에러가 발생해요

**해결 방법**:
1. **브라우저 캐시 삭제**
   - Ctrl+Shift+Delete → 캐시 삭제
   - 또는 시크릿 모드에서 테스트

2. **CORS 설정 적용 대기**
   - CORS 설정 적용 후 최대 5분 정도 소요될 수 있습니다
   - 잠시 후 다시 시도

3. **설정 재확인**
   - Google Cloud Console에서 CORS 설정이 올바르게 저장되었는지 확인

---

## 📝 빠른 참조

### CORS 설정 JSON (복사용)

```json
[{"origin":["https://hyun-poong.web.app","https://hyun-poong.firebaseapp.com","http://localhost:5173","http://localhost:5174"],"method":["GET","HEAD","POST","PUT","DELETE","OPTIONS"],"responseHeader":["Authorization","Content-Type","x-goog-meta-*","x-goog-resumable"],"maxAgeSeconds":3600}]
```

### 직접 링크

- **Google Cloud Console Storage**: https://console.cloud.google.com/storage/browser
- **Firebase Console Storage**: https://console.firebase.google.com/project/hyun-poong/storage

---

## 🎯 요약

1. ✅ Google Cloud Console 접속
2. ✅ 프로젝트 `hyun-poong` 선택
3. ✅ 버킷 `hyun-poong.appspot.com` 클릭
4. ✅ "권한" 탭 클릭
5. ✅ "CORS 구성" 섹션에서 "편집" 클릭
6. ✅ CORS 설정 JSON 붙여넣기
7. ✅ "저장" 클릭
8. ✅ 이미지 업로드 테스트

---

**가이드 작성 완료** ✅


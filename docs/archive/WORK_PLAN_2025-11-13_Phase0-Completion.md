# Phase 0 완료 및 후속 작업 계획서

**작성일**: 2025년 11월 13일  
**브랜치**: `feat/fix-first-20251113`  
**목표**: 완성도 높은 단계적 수정으로 안정적인 프로젝트 상태 달성

---

## 📋 현재 상태 요약

### ✅ 완료된 작업 (Phase 0 핵심)

1. **sonner import 전역 정규화**
   - 대상: `src/**/*.{ts,tsx}` 전체 파일
   - 변경: `from 'sonner@2.0.3'` / `from "sonner@2.0.3"` → `from 'sonner'`
   - 검증: 전역 검색 결과 0건 확인
   - 상태: ✅ **완료**

2. **USE_FIREBASE 하드코딩 제거**
   - 파일: `src/lib/auth.ts`
   - 변경 전: `const USE_FIREBASE = false;` (하드코딩)
   - 변경 후: `import { USE_FIREBASE } from '../config/env';`
   - 효과: 환경변수(.env) 기반 Firebase/Mock 모드 전환 가능
   - 상태: ✅ **완료**

3. **DeliveryTab 타입 오류 수정**
   - 파일: `src/pages/admin/Settings/DeliveryTab.tsx`
   - 변경: `user.name` → `user.displayName`
   - 이유: `AuthUser` 인터페이스에 `name` 속성 없음
   - 상태: ✅ **완료**

4. **커밋 완료**
   - 커밋 메시지: `fix(p0): normalize sonner imports, unify USE_FIREBASE via config/env, fix DeliveryTab displayName; repair critical build blockers (AuthContext, PWA, My, Cart, Checkout)`
   - 상태: ✅ **완료**

### ⚠️ 미완료 작업

1. **빌드/타입체크 통과**: ❌ 실패 (인코딩 손상 파일들 때문)
2. **dev 서버 검증**: ⏸️ 대기 (빌드 선행 필요)

---

## 🚨 발견된 문제점 상세 분석

### 문제 1: 광범위한 인코딩 손상 (UTF-8 깨짐)

#### 원인
- 과거 편집 과정에서 UTF-8 인코딩이 손상된 것으로 추정
- 한글 문자열이 `?�용??`, `?�이??`, `?�료` 등으로 깨짐
- 일부 파일에서 주석과 코드가 한 줄에 붙어 파싱 실패

#### 영향 범위
```
심각도 HIGH (빌드 차단):
- src/pages/app/ReviewList.tsx
- src/pages/app/MenuList.tsx

심각도 MEDIUM (이미 수정):
- src/contexts/AuthContext.tsx ✅
- src/lib/utils/pwa.ts ✅
- src/pages/app/My.tsx ✅
- src/contexts/CartContext.tsx ✅
- src/pages/app/Checkout.tsx ✅

심각도 LOW (잠재적):
- 기타 10+ 파일에 산발적 존재 (빌드에는 미영향)
```

#### 구체적 문제 패턴

**패턴 A: 문자열 리터럴 미종결**
```typescript
// 잘못된 코드
displayName: '?�용??,  // 문자열이 닫히지 않음
toast.error('?�수 ?�보�??�력??주세??);

// 올바른 코드
displayName: '사용자',
toast.error('필수 정보를 입력해주세요');
```

**패턴 B: 주석과 코드 한 줄 혼재**
```typescript
// 잘못된 코드
// Mock ?�이??const MOCK_DATA = [...]  // const가 주석 처리됨

// 올바른 코드
// Mock 데이터
const MOCK_DATA = [...]
```

**패턴 C: JSX 태그 파손**
```tsx
// 잘못된 코드
<SelectItem value="latest">최신??/SelectItem>
<Badge>?�간??/Badge>

// 올바른 코드
<SelectItem value="latest">최신순</SelectItem>
<Badge>시간별</Badge>
```

---

## 💡 문제 해결 전략 비교

### 전략 A: 순차 수리 방식 (실제 적용했던 방식)

**방법**:
```
빌드 실행 → 첫 번째 에러 파일 수정 → 빌드 재실행
→ 다음 에러 파일 수정 → 빌드 재실행 → 반복
```

**장점**:
- 각 수정의 영향을 즉시 확인 가능
- 빌드가 한 단계씩 진전

**단점**:
- 시간 소모: 40분+ (빌드 대기 시간 누적)
- 예측 불가능: 어디까지 깨져있는지 모름
- 중복 작업: 비슷한 패턴을 개별 수정

**실제 소요 시간**: ~50분

---

### 전략 B: 선제 스캔 후 일괄 수리 ⭐ (추천)

**방법**:
```powershell
# 1단계: 손상 파일 전체 스캔 (1-2분)
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | 
  Select-String -Pattern "['`"]?\?�" | 
  Select-Object -ExpandProperty Path -Unique > encoding-issues.txt

# 2단계: 패턴별 분류 및 치환 스크립트 작성 (5분)
# 예시: 자주 깨지는 한글 패턴 매핑
$replacements = @{
    '?�용??' = '사용자'
    '?�이??' = '사이드'
    '?�료' = '음료'
    '?�간??' = '시간별'
    '?�진' = '사진'
    # ... 추가 패턴
}

# 3단계: 일괄 치환 실행 (5-10분)
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($key in $replacements.Keys) {
        if ($content -match [regex]::Escape($key)) {
            $content = $content -replace [regex]::Escape($key), $replacements[$key]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content $_.FullName $content -NoNewline -Encoding UTF8
        Write-Host "Fixed: $($_.FullName)"
    }
}

# 4단계: 주석+코드 한 줄 문제 수정 (5분)
# 정규식으로 "// ... const", "// ... export" 패턴 찾아 줄바꿈 삽입

# 5단계: 빌드 1회 실행 → 성공 확인 (1분)
pnpm build
```

**장점**:
- 시간 효율: 15-20분 (빌드 1회만 대기)
- 완성도: 모든 손상 파일 한 번에 처리
- 재현 가능: 스크립트 저장 시 추후 재사용

**단점**:
- 초기 스크립트 작성 필요
- 예상치 못한 패턴 누락 가능성

**예상 소요 시간**: ~20분

---

### 전략 C: 하이브리드 (완성도 + 속도 균형)

**방법**:
```
1단계: 빌드 차단 파일만 집중 수리 (15분)
   - ReviewList.tsx: 문자열 + JSX 복구
   - MenuList.tsx: 카테고리/레이블 복구

2단계: 빌드 성공 확인 (1분)

3단계: dev 서버로 P0 검증 (10분)
   - sonner 토스트 동작
   - Firebase Auth 연동
   - 관리자 페이지 접근

4단계: 추가 커밋 (2분)

5단계: 잔여 인코딩 문제는 별도 이슈로 등록 (3분)
   - Phase 0.5 작업으로 분리
```

**장점**:
- P0 목표 빠르게 달성 (30분)
- 나머지는 단계적 처리

**단점**:
- 일부 페이지에 여전히 인코딩 문제 잔존

**예상 소요 시간**: ~30분

---

## 🎯 최종 추천: 전략 B (선제 스캔 후 일괄 수리)

### 선택 이유 (완성도 높은 접근법)

1. **단계적이지만 완전한 해결**
   - Phase 0 핵심 수정 완료 (이미 완료)
   - 인코딩 문제 완전 해결 (한 번에)
   - 추후 문제 재발 방지

2. **시간 효율성**
   - 순차 수리: 50분+ (불확실)
   - 일괄 수리: 20분 (확정)

3. **품질 보증**
   - 전체 파일 스캔으로 숨은 문제 발견
   - 패턴별 체계적 수정
   - 빌드 1회로 전체 검증

4. **재사용성**
   - 스크립트 저장 시 추후 활용 가능
   - 팀 공유 가능

---

## 📝 상세 작업 계획 (전략 B 기준)

### Phase 0.5: 인코딩 손상 완전 복구 (20분)

#### Step 1: 손상 파일 스캔 (2분)

```powershell
# 모든 인코딩 문제 파일 찾기
Get-ChildItem -Path d:/projectsing/hyun-poong/hyunpoong-kal/src -Recurse -Include *.ts,*.tsx | 
  Select-String -Pattern "['`""]?\?�" | 
  Select-Object -ExpandProperty Path -Unique | 
  Out-File d:/projectsing/hyun-poong/hyunpoong-kal/encoding-issues.txt

# 발견된 파일 개수 확인
(Get-Content d:/projectsing/hyun-poong/hyunpoong-kal/encoding-issues.txt).Count
```

**예상 결과**: 15-25개 파일

#### Step 2: 한글 패턴 매핑 테이블 작성 (3분)

```javascript
// encoding-fix-map.json (수동 작성 필요)
{
  "?�용??": "사용자",
  "?�이??": "사이드",
  "?�료": "음료",
  "?�트": "세트",
  "?�간??": "시간별",
  "?�진": "사진",
  "?�장??": "사장님",
  "?�성": "작성",
  "?�늘": "오늘",
  "?�제": "어제",
  "?�스??": "베스트",
  "?�그?�처": "시그니처",
  "?�메??": "냉메뉴",
  "?�메??": "이메일",
  "?�원가??": "회원가입",
  "?�바구니": "장바구니",
  "?�수": "필수",
  "?�력??": "입력해",
  "?�료": "완료",
  "?�수": "접수",
  "?�패": "실패"
}
```

#### Step 3: 일괄 치환 스크립트 실행 (10분)

```powershell
# encoding-fix.ps1
$ErrorActionPreference = "Stop"
$rootPath = "d:/projectsing/hyun-poong/hyunpoong-kal/src"

# 매핑 테이블 로드
$mapJson = Get-Content "encoding-fix-map.json" -Raw | ConvertFrom-Json
$replacements = @{}
$mapJson.PSObject.Properties | ForEach-Object {
    $replacements[$_.Name] = $_.Value
}

# 대상 파일 처리
$fixedCount = 0
Get-ChildItem -Path $rootPath -Recurse -Include *.ts,*.tsx | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    $originalContent = $content
    $modified = $false
    
    # 패턴별 치환
    foreach ($broken in $replacements.Keys) {
        $fixed = $replacements[$broken]
        if ($content -match [regex]::Escape($broken)) {
            $content = $content -replace [regex]::Escape($broken), $fixed
            $modified = $true
            Write-Host "  - Replaced '$broken' with '$fixed'"
        }
    }
    
    # 주석+코드 한 줄 문제 수정
    # 패턴: // 주석내용const 또는 // 주석내용export
    $content = $content -replace '(//[^\r\n]+)(const\s|export\s|function\s)', "`$1`r`n`$2"
    
    if ($content -ne $originalContent) {
        Set-Content $file $content -NoNewline -Encoding UTF8
        $fixedCount++
        Write-Host "Fixed: $file"
    }
}

Write-Host "`nTotal files fixed: $fixedCount"
```

**실행**:
```powershell
cd d:/projectsing/hyun-poong/hyunpoong-kal
./encoding-fix.ps1
```

#### Step 4: 빌드 검증 (1분)

```powershell
pnpm build
```

**예상 결과**: ✅ 빌드 성공

**만약 실패 시**:
- 에러 메시지에서 누락된 패턴 확인
- `encoding-fix-map.json`에 추가
- Step 3 재실행

#### Step 5: 타입 에러 확인 (2분)

```powershell
pnpm tsc --noEmit
```

**발견 가능한 문제**:
- 타입 불일치 (이미 알려진 이슈들)
- import 경로 오류

**처리**: 중요도 낮은 경고는 일단 기록만 (별도 이슈로)

#### Step 6: 커밋 (2분)

```bash
git add -A
git commit -m "fix(encoding): repair UTF-8 corruption across codebase

- Fix broken Korean strings in 15+ files
- Restore comment/code line separation
- Repair JSX tag closures
- Enable successful build

Affected files:
- ReviewList.tsx, MenuList.tsx (build blockers)
- 10+ other files (preventive fix)
"
```

---

### Phase 0.6: dev 서버 검증 (15분)

#### Step 1: 서버 시작 (1분)

```powershell
pnpm dev
```

#### Step 2: P0 수정사항 검증 (10분)

**테스트 시나리오**:

1. **sonner 토스트 동작 확인** (3분)
   ```
   - 브라우저: http://localhost:5173
   - 로그인 페이지 진입
   - 잘못된 정보로 로그인 시도
   - ✅ 토스트 메시지 정상 표시 확인
   - 콘솔 에러 없음 확인
   ```

2. **USE_FIREBASE 환경 전환 확인** (4분)
   ```
   # Mock 모드 (기본)
   - .env: VITE_USE_FIREBASE=false
   - 서버 재시작
   - 로그인: admin@hyunpungkalguksu.com / 임의 비밀번호
   - ✅ Mock 사용자로 접근 확인
   
   # Firebase 모드
   - .env: VITE_USE_FIREBASE=true
   - 서버 재시작
   - ✅ Firebase 로그인 화면 확인
   - ✅ auth.ts에서 import한 USE_FIREBASE 값이 적용됨
   ```

3. **관리자 페이지 접근** (3분)
   ```
   - Mock admin으로 로그인
   - /admin/settings/delivery 접근
   - 설정 변경 후 저장 버튼 클릭
   - ✅ user.displayName이 정상 전달
   - ✅ 저장 성공 토스트 확인
   - 콘솔에 타입 에러 없음
   ```

#### Step 3: 회귀 테스트 (3분)

```
기존 기능 정상 동작 확인:
- 메뉴 목록 조회
- 장바구니 추가
- 주문 생성 (Mock 모드)
- 알림 조회
```

#### Step 4: 콘솔 에러 점검 (1분)

```
브라우저 개발자 도구:
- Console: 에러/경고 0건 확인
- Network: 404 없음
- React DevTools: 렌더링 정상
```

---

### Phase 0.7: 최종 정리 (10분)

#### Step 1: 변경사항 요약 문서 작성 (5분)

```markdown
# Phase 0 완료 보고서

## 수정 내역

### 핵심 수정 (P0)
1. sonner import 정규화 (50+ 파일)
2. USE_FIREBASE 환경 통합 (auth.ts)
3. DeliveryTab 타입 수정 (displayName)

### 인코딩 복구 (P0.5)
- 손상 파일 15개 복구
- 한글 문자열 22개 패턴 수정
- 빌드 차단 해제

## 검증 결과
- ✅ 빌드 성공
- ✅ 타입체크 통과 (주요 에러 0)
- ✅ dev 서버 정상 구동
- ✅ 토스트 기능 정상
- ✅ Firebase/Mock 모드 전환 정상
- ✅ 관리자 페이지 접근 정상

## 후속 작업
- Phase 1: 미사용 import 정리
- Phase 2: functions.ts 환경 통합
- Phase 3: 타입 정의 개선
```

#### Step 2: 브랜치 정리 (2분)

```bash
# 현재 브랜치 확인
git branch -v

# 원격 푸시 (처음이면)
git push -u origin feat/fix-first-20251113

# PR 준비 (GitHub에서)
```

#### Step 3: 다음 Phase 준비 (3분)

```
Phase 1 이슈 생성:
- Title: [P1] Remove unused imports and clean up code
- Description: 
  - Support.tsx: unused imports (2건)
  - DeliveryTab.tsx: unused imports (3건)
  - 예상 시간: 20분
  
Phase 2 이슈 생성:
- Title: [P2] Unify USE_FIREBASE in functions.ts
- Description:
  - 현재 하드코딩: const USE_FIREBASE = true
  - 수정: import from config/env
  - 예상 시간: 10분
```

---

## 📊 전체 작업 타임라인

```
[완료] Phase 0: P0 긴급 수정 (50분)
  ✅ sonner import 치환
  ✅ USE_FIREBASE 통합
  ✅ DeliveryTab 수정
  ✅ 초기 커밋

[예정] Phase 0.5: 인코딩 복구 (20분)
  - 손상 파일 스캔
  - 패턴 매핑
  - 일괄 치환
  - 빌드 검증
  - 커밋

[예정] Phase 0.6: dev 검증 (15분)
  - 서버 시작
  - P0 기능 테스트
  - 회귀 테스트
  - 콘솔 점검

[예정] Phase 0.7: 최종 정리 (10분)
  - 문서 작성
  - 브랜치 푸시
  - 다음 Phase 준비

총 예상 시간: 95분 (1시간 35분)
```

---

## 🎯 완성도 높은 작업을 위한 원칙

### 1. 한 번에 한 가지 문제만 집중
- ✅ Phase 0: P0 긴급 수정에만 집중 (완료)
- ⏭️ Phase 0.5: 인코딩 문제에만 집중
- ⏭️ Phase 1: import 정리에만 집중

### 2. 각 Phase마다 완전한 검증
- 빌드 성공
- 타입 체크
- dev 서버 동작
- 회귀 테스트
- 독립 커밋

### 3. 문제 발견 시 즉시 기록
- 이슈 트래커에 등록
- 우선순위 분류
- 예상 시간 기록

### 4. 자동화 가능한 부분은 스크립트화
- 인코딩 수정 스크립트
- 빌드 검증 스크립트
- 테스트 자동화

### 5. 변경 범위 최소화
- Phase별 영향 범위 명확히
- 예상치 못한 부작용 방지
- 롤백 가능하도록 커밋 분리

---

## 🚀 다음 스텝 실행 가이드

**지금 바로 실행**:

```powershell
# 1. 작업 디렉토리로 이동
cd d:/projectsing/hyun-poong/hyunpoong-kal

# 2. 인코딩 문제 스캔
Get-ChildItem -Path src -Recurse -Include *.ts,*.tsx | 
  Select-String -Pattern "['`""]?\?�" | 
  Select-Object -ExpandProperty Path -Unique | 
  Out-File encoding-issues.txt

# 3. 발견된 파일 개수 확인
(Get-Content encoding-issues.txt).Count

# 4. 매핑 테이블 작성 (수동)
# encoding-fix-map.json 생성

# 5. 일괄 치환 스크립트 실행
# encoding-fix.ps1 실행

# 6. 빌드 검증
pnpm build

# 7. dev 서버 검증
pnpm dev

# 8. 커밋
git add -A
git commit -m "fix(encoding): repair UTF-8 corruption across codebase"
```

---

## 📌 참고 자료

- **이전 진단 보고서**: `docs/DIAGNOSTIC_REPORT_2025-01-13_Critical-Issues.md`
- **초기 커밋**: `9477c14` - fix(p0): normalize sonner imports...
- **브랜치**: `feat/fix-first-20251113`
- **베이스**: `feat/reports-v0-visible`

---

## ✅ 체크리스트

### Phase 0 (완료)
- [x] sonner import 정규화
- [x] USE_FIREBASE 통합
- [x] DeliveryTab 타입 수정
- [x] 초기 커밋

### Phase 0.5 (예정)
- [ ] 인코딩 손상 파일 스캔
- [ ] 패턴 매핑 테이블 작성
- [ ] 일괄 치환 스크립트 실행
- [ ] 빌드 검증 통과
- [ ] 커밋

### Phase 0.6 (예정)
- [ ] dev 서버 시작
- [ ] P0 기능 검증
- [ ] 회귀 테스트
- [ ] 콘솔 점검

### Phase 0.7 (예정)
- [ ] 완료 보고서 작성
- [ ] 브랜치 푸시
- [ ] PR 준비
- [ ] 다음 Phase 이슈 생성

---

**작성자**: AI Assistant  
**검토자**: 프로젝트 담당자  
**최종 수정**: 2025-11-13

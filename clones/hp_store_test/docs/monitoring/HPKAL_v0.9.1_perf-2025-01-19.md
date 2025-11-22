# HPKAL v0.9.1 모바일 성능 로그 (2025-01-19)

> 이 문서는 v0.9.1에서 진행된 모바일 성능 최적화(작업 1~3)를 기준으로  
> **Before(최적화 전)** / **After(코드 스플리팅 + UI 최적화 후)** 측정값을 함께 기록하기 위한 문서입니다.

## 0. 스냅샷 정의

- **Snapshot A (Before):** 작업 1~3 적용 **전** 상태
  - 기준 브랜치: `release/hpkal-v0.9.0` 또는 `feat/hpkal-mobile-perf-20250119-baseline`
  - 상태: 최적화 전 베이스라인

- **Snapshot B (After):** 작업 1~3 적용 **후** 상태
  - 기준 브랜치: `feat/hpkal-mobile-perf-20250119-step3-ui-opt`
  - 상태: 코드 스플리팅 + 이미지/렌더링 최적화 완료

---

## 1. 환경 정보

### 1-1. Snapshot A (Before)

- 앱 버전: v0.9.1 (최적화 전)
- 브랜치: (측정 시점 브랜치)
- 빌드 커맨드: `npm run build`
- 테스트 기기: (예: Galaxy S23 / iPhone 14 Pro 등, 실제 측정 시 기입)
- 네트워크: (예: Wi-Fi / LTE)

### 1-2. Snapshot B (After)

- 앱 버전: v0.9.1 (코드 스플리팅 + UI 최적화 적용 후)
- 브랜치: `feat/hpkal-mobile-perf-20250119-step3-ui-opt`
- 빌드 커맨드: `npm run build`
- 테스트 기기: (예: Galaxy S23 / iPhone 14 Pro 등, 실제 측정 시 기입)
- 네트워크: (예: Wi-Fi / LTE)

---

## 2. Lighthouse 측정 지표 (모바일)

| Snapshot | 페이지              | FCP   | LCP   | TTI   | TBT   | CLS   | Performance Score | 비고 |
|----------|---------------------|-------|-------|-------|-------|-------|-------------------|------|
| A        | /                   |       |       |       |       |       |                   |      |
| A        | /menu               |       |       |       |       |       |                   |      |
| A        | /order-history      |       |       |       |       |       |                   |      |
| B        | /                   |       |       |       |       |       |                   |      |
| B        | /menu               |       |       |       |       |       |                   |      |
| B        | /order-history      |       |       |       |       |       |                   |      |

> 실제 측정 후 위 표를 채운다.

### 2-1. Snapshot A (Before) – 주요 이슈

#### 홈 페이지 (/)
- (측정 후 업데이트)

#### 메뉴 리스트 페이지 (/menu)
- (측정 후 업데이트)

#### 주문내역 페이지 (/order-history)
- (측정 후 업데이트)

### 2-2. Snapshot B (After) – 주요 이슈

#### 홈 페이지 (/)
- (측정 후 업데이트)

#### 메뉴 리스트 페이지 (/menu)
- (측정 후 업데이트)

#### 주문내역 페이지 (/order-history)
- (측정 후 업데이트)

---

## 3. 번들 크기 / 빌드 아웃풋

### 3-1. 요약 비교

| Snapshot | dist 전체 크기 | 메인 번들 크기 | JS 파일 합계 | CSS 파일 합계 | 비고 |
|----------|----------------|----------------|--------------|---------------|------|
| A        |                |                |              |               |      |
| B        | 1.79 MB        | 679.80 KB      | 1.69 MB      | 90.58 KB      | 코드 스플리팅 + UI 최적화 후 실제 값 |

### 3-2. Snapshot 별 상세 기록

#### Snapshot A (Before)

```text
(여기에 npm run analyze:dist 결과를 그대로 붙여넣기)
```

#### Snapshot B (After)

```text
📦 dist 전체 크기: 1.79 MB
📊 JS 파일 총합: 1.69 MB (122개 파일)
📊 CSS 파일 총합: 90.58 KB (1개 파일)

주요 청크:
- index-4syR-BqK.js: 679.80 KB (메인 번들)
- BarChart-DM1s9Gms.js: 337.99 KB (차트 라이브러리)
- Home-CPoi0xg8.js: 8.25 KB
- MenuList-CJj0Dw4Q.js: 4.05 KB
- MenuDetail-DfjsQnro.js: 6.75 KB
- Cart-CfXLdtaF.js: 11.49 KB

(전체 analyze:dist 출력 결과를 여기에 붙여넣기)
```

---

## 4. 체감 속도 메모

### 4-1. Snapshot A (Before)

#### 홈 페이지 (/)
- 첫 진입 체감 시간: (예: 체감 3~4초)
- 관찰 메모:
  - (예: "홈 첫 로딩 시 상단 배너/추천 메뉴 이미지가 늦게 뜨면서 스크롤이 끊김")

#### 메뉴 리스트 페이지 (/menu)
- 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (예: "메뉴 리스트 스크롤 시 프레임 드랍 느낌 있음")

#### 주문내역 페이지 (/order-history)
- 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (측정 후 기입)

### 4-2. Snapshot B (After)

#### 홈 페이지 (/)
- 첫 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (측정 후 기입)

#### 메뉴 리스트 페이지 (/menu)
- 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (측정 후 기입)

#### 주문내역 페이지 (/order-history)
- 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (측정 후 기입)

---

## 5. 측정 방법 가이드

### Lighthouse 측정 방법

1. Chrome DevTools 열기 (F12)
2. Lighthouse 탭 선택
3. 설정:
   - Device: Mobile
   - Categories: Performance만 선택 (또는 전체)
4. "Analyze page load" 클릭
5. 결과에서 Performance 섹션의 각 지표 기록

### 번들 크기 확인 방법

```bash
# 빌드 실행
npm run build

# 번들 크기 분석
npm run analyze:dist
```

출력 결과를 위의 "3. 번들 크기/빌드 아웃풋" 섹션에 복사하여 기록

---

**작성일:** 2025-01-19  
**작성자:** AI Assistant  
**상태:** Before/After 비교 구조 준비 완료 - 실제 측정값 입력 대기

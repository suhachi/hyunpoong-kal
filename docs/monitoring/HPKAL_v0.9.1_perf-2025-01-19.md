# HPKAL v0.9.1 모바일 성능 로그 (2025-01-19)

## 1. 환경 정보

- 앱 버전: v0.9.1 (모바일 성능 패치 사전/후 비교용)
- 브랜치: feat/hpkal-mobile-perf-20250119-baseline
- 빌드 커맨드: `npm run build`
- 테스트 기기: (예: Galaxy S23 / iPhone 14 Pro 등, 실제 측정 시 내가 기입)
- 네트워크: (예: Wi-Fi / LTE)

## 2. 측정 지표 (Lighthouse – 모바일 모드)

> 아래 값들은 "기본 상태(최적화 전)" 기준으로 채운다.

### 홈 페이지 (/)

- First Contentful Paint (FCP): 측정 전
- Largest Contentful Paint (LCP): 측정 전
- Time to Interactive (TTI): 측정 전
- Total Blocking Time (TBT): 측정 전
- Cumulative Layout Shift (CLS): 측정 전
- **Lighthouse Performance Score:** 측정 전

**상위 5개 문제 항목:**
1. (측정 후 업데이트)
2. (측정 후 업데이트)
3. (측정 후 업데이트)
4. (측정 후 업데이트)
5. (측정 후 업데이트)

### 메뉴 리스트 페이지 (/menu)

- First Contentful Paint (FCP): 측정 전
- Largest Contentful Paint (LCP): 측정 전
- Time to Interactive (TTI): 측정 전
- Total Blocking Time (TBT): 측정 전
- Cumulative Layout Shift (CLS): 측정 전
- **Lighthouse Performance Score:** 측정 전

**상위 5개 문제 항목:**
1. (측정 후 업데이트)
2. (측정 후 업데이트)
3. (측정 후 업데이트)
4. (측정 후 업데이트)
5. (측정 후 업데이트)

### 주문내역 페이지 (/order-history)

- First Contentful Paint (FCP): 측정 전
- Largest Contentful Paint (LCP): 측정 전
- Time to Interactive (TTI): 측정 전
- Total Blocking Time (TBT): 측정 전
- Cumulative Layout Shift (CLS): 측정 전
- **Lighthouse Performance Score:** 측정 전

**상위 5개 문제 항목:**
1. (측정 후 업데이트)
2. (측정 후 업데이트)
3. (측정 후 업데이트)
4. (측정 후 업데이트)
5. (측정 후 업데이트)

---

## 3. 번들 크기/빌드 아웃풋

- 빌드 커맨드: `npm run build`
- 분석 커맨드: `npm run analyze:dist`
- dist 디렉터리 총 크기: (빌드 후 기입)

### 주요 JS 번들 파일

```
dist/                     (빌드 전)
├─ assets/
│  ├─ index-xxxxx.js      (빌드 전)
│  ├─ vendor-xxxxx.js     (빌드 전)
│  └─ ...
└─ index.html             (빌드 전)
```

> 빌드 후 `npm run analyze:dist` 실행 결과를 여기에 복사하여 기록

---

## 4. 체감 속도 메모 (수동 기록용)

### 홈(/)

- 첫 진입 체감 시간: (예: 체감 3~4초)
- 관찰 메모:
  - (예: "홈 첫 로딩 시 상단 배너/추천 메뉴 이미지가 늦게 뜨면서 스크롤이 끊김")

### 메뉴 리스트(/menu)

- 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (예: "메뉴 리스트 스크롤 시 프레임 드랍 느낌 있음")

### 주문내역(/order-history)

- 진입 체감 시간: (측정 후 기입)
- 관찰 메모:
  - (측정 후 기입)

---

## 5. 다음 단계 계획 (v0.9.1 성능 패치)

### 작업 2: Admin/차트 라우트 코드 스플리팅 (초기 번들 다이어트)
- [ ] App.tsx에서 `/admin/**` 라우트 lazy-load 적용
- [ ] 차트 관련 코드 (recharts 등) lazy-load 적용
- [ ] 고객앱 진입 시 관리/차트 코드 분리

### 작업 3: 고객앱 이미지 + 렌더링 최적화 1차
- [ ] Home/MenuList/MenuDetail/Cart 이미지 `loading="lazy"` 적용
- [ ] 메뉴/추천 카드 React.memo 적용
- [ ] 최소한의 useCallback 적용

### 작업 4: 2차 측정 (동일 방식으로 Lighthouse/번들 크기 비교)
- [ ] 작업 2, 3 완료 후 동일 방식으로 재측정
- [ ] 개선 전/후 비교 분석

---

## 6. 측정 방법 가이드

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
**상태:** 베이스라인 측정 준비 완료


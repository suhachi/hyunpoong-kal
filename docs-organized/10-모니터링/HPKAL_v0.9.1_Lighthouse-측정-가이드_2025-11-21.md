# Lighthouse 측정 가이드 (모바일 기준)

**작성일**: 2025-11-21  
**버전**: v0.9.1  
**측정 환경**: 모바일 (Chrome DevTools)  
**배포 URL**: https://hyun-poong.web.app

---

## 📋 측정 방법

### 1. Chrome DevTools 열기

1. Chrome 브라우저에서 측정할 페이지 열기
2. `F12` 또는 `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)로 DevTools 열기
3. **Lighthouse** 탭 선택

### 2. Lighthouse 설정

- **Device**: `Mobile` 선택
- **Categories**: `Performance` (또는 `All` 선택 가능)
- **Clear storage**: 체크 (캐시 클리어 후 측정)

### 3. 측정 시작

- **"Analyze page load"** 버튼 클릭
- 측정 완료까지 약 30초~1분 소요

---

## 📊 측정 대상 페이지

### 측정할 URL

1. ✅ **홈 페이지**
   - URL: `https://hyun-poong.web.app/`
   - 경로: `/`
   - 상태: 로그인 불필요

2. ✅ **메뉴 리스트**
   - URL: `https://hyun-poong.web.app/menu`
   - 경로: `/menu`
   - 상태: 로그인 불필요

3. ✅ **주문 내역**
   - URL: `https://hyun-poong.web.app/order-history`
   - 경로: `/order-history`
   - 상태: 로그인 불필요

4. ✅ **관리자 대시보드**
   - URL: `https://hyun-poong.web.app/admin/dashboard`
   - 경로: `/admin/dashboard`
   - 상태: **관리자 로그인 필요**
   - 로그인 정보:
     - 이메일: `admin@hyunpoongkalguksu.com`
     - 비밀번호: (Mock 모드에서는 체크 안 함, 아무 값이나 입력)

---

## 📝 측정 결과 기록

각 페이지마다 아래 값을 메모해 주세요:

### Performance 점수

| 페이지 | Performance 점수 | 측정 일시 | 비고 |
|--------|-----------------|----------|------|
| `/` (홈) | | | |
| `/menu` (메뉴) | | | |
| `/order-history` (주문내역) | | | |
| `/admin/dashboard` (관리자) | | | |

---

### 주요 메트릭 (Core Web Vitals)

각 페이지마다 다음 값을 기록해 주세요:

#### 1. `/` (홈 페이지)

| 메트릭 | 값 | 단위 |
|--------|-----|------|
| **Performance 점수** | | |
| **First Contentful Paint (FCP)** | | 초 |
| **Largest Contentful Paint (LCP)** | | 초 |
| **Total Blocking Time (TBT)** | | ms |
| **Cumulative Layout Shift (CLS)** | | |
| **Speed Index** | | 초 |
| **Time to Interactive (TTI)** | | 초 |

---

#### 2. `/menu` (메뉴 리스트)

| 메트릭 | 값 | 단위 |
|--------|-----|------|
| **Performance 점수** | | |
| **First Contentful Paint (FCP)** | | 초 |
| **Largest Contentful Paint (LCP)** | | 초 |
| **Total Blocking Time (TBT)** | | ms |
| **Cumulative Layout Shift (CLS)** | | |
| **Speed Index** | | 초 |
| **Time to Interactive (TTI)** | | 초 |

---

#### 3. `/order-history` (주문 내역)

| 메트릭 | 값 | 단위 |
|--------|-----|------|
| **Performance 점수** | | |
| **First Contentful Paint (FCP)** | | 초 |
| **Largest Contentful Paint (LCP)** | | 초 |
| **Total Blocking Time (TBT)** | | ms |
| **Cumulative Layout Shift (CLS)** | | |
| **Speed Index** | | 초 |
| **Time to Interactive (TTI)** | | 초 |

---

#### 4. `/admin/dashboard` (관리자 대시보드)

| 메트릭 | 값 | 단위 |
|--------|-----|------|
| **Performance 점수** | | |
| **First Contentful Paint (FCP)** | | 초 |
| **Largest Contentful Paint (LCP)** | | 초 |
| **Total Blocking Time (TBT)** | | ms |
| **Cumulative Layout Shift (CLS)** | | |
| **Speed Index** | | 초 |
| **Time to Interactive (TTI)** | | 초 |

---

## 📋 추가 측정 항목 (선택)

### All Categories 선택 시

#### Accessibility

| 페이지 | Accessibility 점수 | 비고 |
|--------|-------------------|------|
| `/` | | |
| `/menu` | | |
| `/order-history` | | |
| `/admin/dashboard` | | |

---

#### Best Practices

| 페이지 | Best Practices 점수 | 비고 |
|--------|-------------------|------|
| `/` | | |
| `/menu` | | |
| `/order-history` | | |
| `/admin/dashboard` | | |

---

#### SEO

| 페이지 | SEO 점수 | 비고 |
|--------|---------|------|
| `/` | | |
| `/menu` | | |
| `/order-history` | | |
| `/admin/dashboard` | | |

---

## 📸 Lighthouse 리포트 저장

### 리포트 내보내기

1. Lighthouse 측정 완료 후
2. **"Export report"** 버튼 클릭
3. JSON 또는 HTML 형식으로 저장
4. 파일명 예시: `lighthouse-report-hyun-poong-home-2025-11-21.json`

---

## ⚠️ 주의사항

### 측정 전 확인사항

- [ ] **캐시 클리어**: Lighthouse 설정에서 "Clear storage" 체크
- [ ] **네트워크 속도**: "Throttling" 설정 확인 (기본: "Mobile 3G" 또는 "Mobile 4G")
- [ ] **CPU 감속**: "CPU slowdown" 설정 확인 (기본: 4x)
- [ ] **관리자 로그인**: `/admin/dashboard` 측정 전 로그인 완료
- [ ] **브라우저 확장 프로그램**: 가능하면 비활성화 (측정 결과에 영향)

---

### 측정 시 주의사항

- 각 페이지마다 **별도로 측정**해야 합니다
- 측정 중 **페이지를 조작하지 마세요**
- 측정 완료까지 **기다려 주세요** (약 30초~1분)
- 같은 페이지를 **여러 번 측정**하면 결과가 달라질 수 있습니다 (평균 3회 측정 권장)

---

## 📊 측정 결과 분석 가이드

### Performance 점수 기준

- **90-100**: ✅ 우수 (Good)
- **50-89**: ⚠️ 개선 필요 (Needs Improvement)
- **0-49**: ❌ 나쁨 (Poor)

### Core Web Vitals 기준

#### First Contentful Paint (FCP)
- **0-1.8초**: ✅ 우수
- **1.8-3.0초**: ⚠️ 개선 필요
- **3.0초 이상**: ❌ 나쁨

#### Largest Contentful Paint (LCP)
- **0-2.5초**: ✅ 우수
- **2.5-4.0초**: ⚠️ 개선 필요
- **4.0초 이상**: ❌ 나쁨

#### Total Blocking Time (TBT)
- **0-200ms**: ✅ 우수
- **200-600ms**: ⚠️ 개선 필요
- **600ms 이상**: ❌ 나쁨

#### Cumulative Layout Shift (CLS)
- **0-0.1**: ✅ 우수
- **0.1-0.25**: ⚠️ 개선 필요
- **0.25 이상**: ❌ 나쁨

---

## 📝 측정 결과 템플릿

### 결과 기록 예시

```markdown
## 측정 결과

**측정 일시**: 2025-11-21 15:30  
**측정 환경**: Chrome DevTools (Mobile)

### `/` (홈 페이지)

- **Performance 점수**: 85
- **FCP**: 1.2초
- **LCP**: 2.1초
- **TBT**: 150ms
- **CLS**: 0.05
- **Speed Index**: 2.3초
- **TTI**: 3.5초

### `/menu` (메뉴 리스트)

- **Performance 점수**: 78
- ...
```

---

## 🔄 측정 완료 후

측정 결과를 다음 파일에 업데이트해 주세요:

- `docs/monitoring/HPKAL_v0.9.1_perf-2025-01-19.md`
- `docs/monitoring/HPKAL_v0.9.1_모바일성능-2차측정-비교_2025-01-19.md` (2차 측정 시)

---

**작성일**: 2025-11-21  
**작성자**: AI Assistant  
**상태**: ⏳ **측정 대기 중**


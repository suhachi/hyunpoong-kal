# 현풍닭칼국수 PWA - QR 코드 다운로드 및 설치 가이드

**버전:** v0.9.1  
**작성일:** 2025-11-21  
**대상 URL:** https://hyun-poong.web.app

---

## 📋 개요

이 문서는 점주/운영자가 QR 코드를 생성하고, 손님/본인이 PWA(Progressive Web App)를 설치할 수 있도록 안내하는 가이드입니다.

### 목적
- 점주가 QR 코드를 출력/배포하여 손님들이 쉽게 앱에 접속할 수 있도록 지원
- PWA 설치를 통해 앱처럼 사용할 수 있도록 안내
- 향후 멀티 스토어 확장 시 이 문서를 템플릿으로 재사용 가능

### 대상 사용자
- 점주/운영자: QR 코드 생성 및 출력
- 손님/사용자: QR 스캔 후 PWA 설치

---

## 📱 QR 코드 생성 가이드

### 방법 1: 온라인 QR 코드 생성기 사용 (추천)

1. **QR 코드 생성 사이트 접속**
   - 추천 사이트:
     - [QR Code Generator](https://www.qr-code-generator.com/)
     - [QRCode Monkey](https://www.qrcode-monkey.com/)
     - [QRCode Generator](https://www.the-qrcode-generator.com/)

2. **URL 입력**
   ```
   https://hyun-poong.web.app
   ```

3. **QR 코드 생성**
   - "URL" 또는 "Website" 옵션 선택
   - 위 URL 입력
   - "Generate QR Code" 또는 "생성" 버튼 클릭

4. **QR 코드 다운로드**
   - 고해상도 이미지로 다운로드 (최소 300x300px 권장)
   - PNG 또는 SVG 형식 추천

### 방법 2: 로컬 툴 사용 (고급)

#### Windows
```powershell
# qrencode 설치 (Chocolatey 사용)
choco install qrencode

# QR 코드 생성
qrencode -o qr-code.png -s 10 "https://hyun-poong.web.app"
```

#### macOS
```bash
# qrencode 설치 (Homebrew 사용)
brew install qrencode

# QR 코드 생성
qrencode -o qr-code.png -s 10 "https://hyun-poong.web.app"
```

#### Linux
```bash
# qrencode 설치
sudo apt-get install qrencode

# QR 코드 생성
qrencode -o qr-code.png -s 10 "https://hyun-poong.web.app"
```

### QR 코드 출력 권장사항

#### 해상도
- **최소:** 300x300px (인쇄용)
- **권장:** 500x500px 이상 (고해상도 인쇄)
- **최대:** 1000x1000px (대형 포스터용)

#### 출력 용도별 크기
- **테이블 스티커:** 5cm x 5cm 이상
- **전단지/포스터:** 10cm x 10cm 이상
- **현수막/배너:** 20cm x 20cm 이상

#### 인쇄 시 주의사항
- QR 코드 주변에 여백(최소 4개 모듈 크기) 확보
- 흰색 배경 사용 (색상 배경은 인식률 저하)
- 반사 없는 매트 재질 사용 권장
- 손상/오염 방지를 위한 코팅 처리 권장

---

## 🤖 안드로이드(Android) PWA 설치 가이드

### Chrome 브라우저 기준

#### 1단계: QR 코드 스캔
1. 안드로이드 기기의 카메라 앱 또는 QR 스캐너 앱 실행
2. QR 코드를 스캔
3. 자동으로 Chrome 브라우저에서 `https://hyun-poong.web.app` 열림

#### 2단계: 홈 화면에 추가
1. Chrome 브라우저 상단 메뉴(⋮) 클릭
2. "홈 화면에 추가" 또는 "Add to Home screen" 선택
3. 앱 이름 확인 (기본값: "현풍닭칼국수")
4. "추가" 또는 "Add" 버튼 클릭

#### 3단계: 설치 확인
- 홈 화면에 "현풍닭칼국수" 아이콘 생성됨
- 아이콘을 탭하면 전체 화면으로 앱 실행
- 일반 앱과 동일하게 사용 가능

### 다른 브라우저 (Samsung Internet, Firefox 등)
- 브라우저별로 메뉴 위치가 다를 수 있으나, "홈 화면에 추가" 기능은 동일
- 일부 브라우저는 자동으로 설치 팝업을 표시할 수 있음

---

## 🍎 iOS(iPhone/iPad) PWA 설치 가이드

### Safari 브라우저 기준 (필수)

#### 1단계: QR 코드 스캔
1. iPhone/iPad의 카메라 앱 실행
2. QR 코드를 스캔
3. 화면 상단에 알림 표시 → "Safari에서 열기" 탭

#### 2단계: Safari에서 열기
- QR 코드 스캔 후 자동으로 Safari에서 열림
- 또는 알림을 탭하여 Safari에서 열기

#### 3단계: 홈 화면에 추가
1. Safari 하단의 **공유 버튼(□↑)** 클릭
2. 스크롤하여 **"홈 화면에 추가"** 선택
3. 앱 이름 확인 (기본값: "현풍닭칼국수")
4. **"추가"** 버튼 클릭

#### 4단계: 설치 확인
- 홈 화면에 "현풍닭칼국수" 아이콘 생성됨
- 아이콘을 탭하면 Safari 없이 독립적으로 앱 실행
- 전체 화면으로 표시됨

### 주의사항
- **Safari 필수:** iOS에서는 Safari 브라우저에서만 PWA 설치 가능
- Chrome/Firefox 등 다른 브라우저에서는 설치 불가
- iOS 11.3 이상 버전 필요

---

## ✅ 점주용 체크리스트

### QR 코드 준비
- [ ] QR 코드 생성 완료
- [ ] 고해상도 이미지 다운로드
- [ ] 출력물 제작 (스티커/포스터/전단지 등)
- [ ] QR 코드 인식 테스트 (본인 폰으로 스캔)

### 설치 테스트
- [ ] 안드로이드 기기에서 설치 테스트
- [ ] iOS 기기에서 설치 테스트
- [ ] 설치 후 앱 실행 정상 여부 확인
- [ ] 홈 화면 아이콘 표시 확인

### 배포 준비
- [ ] 매장 내 눈에 잘 띄는 위치에 QR 코드 배치
- [ ] 테이블, 카운터, 현관 등 접근하기 쉬운 곳
- [ ] 직원 교육: 손님 문의 시 설치 방법 안내

### 직원 교육 포인트
- QR 코드 위치 안내
- "홈 화면에 추가" 기능 설명
- 안드로이드/아이폰 설치 방법 차이 설명
- 설치 후 앱처럼 사용 가능하다는 점 강조

---

## 🔄 향후 멀티 스토어 확장 시나리오

### 현재 구조
- **단일 도메인:** `https://hyun-poong.web.app`
- **QR 코드 URL:** 동일

### 향후 확장 시
멀티 스토어 지원 시 다음 중 하나의 방식으로 확장 가능:

#### 옵션 1: 서브도메인 방식
```
https://store1.hyun-poong.web.app
https://store2.hyun-poong.web.app
```

#### 옵션 2: 경로 기반 방식
```
https://hyun-poong.web.app/store/store1
https://hyun-poong.web.app/store/store2
```

### 문서 재사용 방법
1. 이 문서를 복사
2. "대상 URL" 섹션의 URL만 스토어별로 변경
3. QR 코드 생성 시 해당 스토어 URL 사용
4. 나머지 내용은 동일하게 사용

### 예시: 스토어별 문서
```
docs/HPKAL_v0.9.1_QR-설치-가이드_스토어1.md
docs/HPKAL_v0.9.1_QR-설치-가이드_스토어2.md
```

각 문서에서:
- 대상 URL만 변경
- QR 코드 생성 시 해당 스토어 URL 사용
- 나머지 설치 가이드는 동일

---

## 📞 문제 해결

### QR 코드가 인식되지 않을 때
- **해상도 확인:** 너무 작거나 흐릿한 경우 인식 불가
- **조명 확인:** 어두운 곳에서는 카메라가 인식하기 어려움
- **거리 조절:** 너무 가깝거나 멀면 인식 불가 (권장: 20-50cm)
- **손상 확인:** QR 코드가 찢어지거나 오염되지 않았는지 확인

### PWA 설치가 안 될 때

#### 안드로이드
- Chrome 브라우저 사용 확인
- "홈 화면에 추가" 메뉴가 보이지 않으면:
  - Chrome 최신 버전 업데이트
  - 브라우저 캐시 삭제 후 재시도
  - 다른 브라우저에서 시도

#### iOS
- Safari 브라우저 사용 확인 (필수)
- iOS 11.3 이상 버전 확인
- "홈 화면에 추가" 옵션이 보이지 않으면:
  - Safari에서 페이지를 완전히 로드한 후 재시도
  - 공유 버튼에서 스크롤하여 찾기

### 설치 후 앱이 실행되지 않을 때
- 인터넷 연결 확인
- 브라우저 캐시 삭제 후 재설치
- 홈 화면 아이콘 삭제 후 재설치

---

## 📚 추가 리소스

### 관련 문서
- `docs/MOCK-모드-한계-및-테스트-가이드.md` - Mock 모드 사용 가이드
- `docs/작업완료보고서_v0.9.1-최종통합_2025-11-21.md` - v0.9.1 릴리즈 노트

### 기술 정보
- **PWA 기술:** Service Worker, Web App Manifest
- **지원 브라우저:**
  - Android: Chrome, Samsung Internet, Firefox
  - iOS: Safari (11.3+)
  - Desktop: Chrome, Edge, Safari

### 문의
- 기술 지원: 개발팀 문의
- 운영 문의: 점주/관리자 문의

---

**작성자:** AI Assistant  
**최종 업데이트:** 2025-11-21  
**버전:** v0.9.1


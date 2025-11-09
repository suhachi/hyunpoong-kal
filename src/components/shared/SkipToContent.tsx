/**
 * Skip to Content 링크
 * 스크린 리더 및 키보드 사용자를 위한 컴포넌트
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#D61C1C] focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      본문으로 바로가기
    </a>
  );
}

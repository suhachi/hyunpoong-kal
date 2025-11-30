import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { BottomNav } from "./BottomNav";
import { Credits } from "../shared/Credits";

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F3]">
      {/* Skip Link - 키보드 접근성 개선 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white text-black px-4 py-2 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D61C1C] focus:ring-offset-2"
      >
        메인 콘텐츠로 건너뛰기
      </a>

      {/* 헤더 */}
      <AppHeader />

      {/* 메인 콘텐츠 */}
      <main id="main-content" className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* 개발사 정보 푸터 */}
      <Credits variant="footer" />

      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

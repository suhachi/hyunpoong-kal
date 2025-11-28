import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  UtensilsCrossed,
  Settings,
  Ticket,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Truck,
  MessageSquare,
  Gift,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Credits } from '../../../components/shared/Credits';
import { useAuth } from '../../../contexts/AuthContext';
import { USE_FIREBASE } from '../../../config/env';
import { mockLogout } from '../../../lib/auth';

export function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    mockLogout();
    navigate('/');
  }

  // Mock 모드: loading/user 조건으로 차단하지 않음
  if (USE_FIREBASE) {
    // Firebase 모드: 기존 로직 그대로
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-[#F9F6F3]">
          <div className="text-center text-[#8B7355]">로딩 중...</div>
        </div>
      );
    }

    if (!user) {
      // 이 경우는 ProtectedRoute 설정이 잘못됐을 때만 발생해야 함
      // 안전장치 정도로만 남겨두기
      navigate('/dev', { replace: true });
      return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F6F3]" data-testid="admin-layout-root">
      {/* Top Bar (Mobile + Desktop) */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-[#E5DDD5]">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-[#F9F6F3] rounded-lg transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-[#333]" />
              ) : (
                <Menu className="w-6 h-6 text-[#333]" />
              )}
            </button>
            <h1 className="text-[#D61C1C]">현풍닭칼국수 관리자</h1>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#F9F6F3] rounded-lg">
              <User className="w-4 h-4 text-[#8B7355]" />
              <span className="text-[#333]">{user?.displayName}</span>
              <span className="text-[#8B7355]">({user?.role})</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-[#8B7355] hover:text-[#D61C1C]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:block fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-[#E5DDD5] overflow-y-auto">
        <SidebarNav />
      </aside>

      {/* Sidebar (Mobile Overlay) */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-[#E5DDD5] overflow-y-auto z-40">
            <SidebarNav onItemClick={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 lg:p-6 pb-24">
          <Outlet />
        </div>

        {/* Credits */}
        <div className="lg:ml-0 border-t border-[#E5DDD5] bg-white">
          <Credits />
        </div>
      </main>
    </div>
  );
}

interface SidebarNavProps {
  onItemClick?: () => void;
}

function SidebarNav({ onItemClick }: SidebarNavProps) {
  // Admin Sidebar 메뉴 목록 (현재 기준)
  // 1) 대시보드              /admin
  // 2) 주문 관리             /admin/orders
  // 3) 배달 관제             /admin/delivery
  // 4) 고객 지원             /admin/support
  // 5) 리뷰 관리             /admin/reviews
  // 6) 메뉴 관리             /admin/menus
  // 7) 쿠폰/프로모션         /admin/promotions
  // 8) 포인트 관리           /admin/points
  // 9) 관제 대시보드(분석)    /admin/analytics
  // 10) 통합 리포트          /admin/integrated-analytics
  // 11) 설정                 /admin/settings
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: '대시보드', end: true },
    { to: '/admin/orders', icon: ShoppingBag, label: '주문 관리' },
    { to: '/admin/delivery', icon: Truck, label: '배달 관제' },
    { to: '/admin/support', icon: MessageSquare, label: '고객 지원' },
    { to: '/admin/reviews', icon: Star, label: '리뷰 관리' },
    { to: '/admin/menus', icon: UtensilsCrossed, label: '메뉴 관리' },
    { to: '/admin/notices', icon: FileText, label: '게시판 관리' },
    { to: '/admin/promotions', icon: Ticket, label: '쿠폰/프로모션' },
    { to: '/admin/points', icon: Gift, label: '포인트 관리' },
    { to: '/admin/analytics', icon: BarChart3, label: '관제 대시보드' },
    { to: '/admin/integrated-analytics', icon: TrendingUp, label: '통합 리포트' },
    { to: '/admin/settings', icon: Settings, label: '설정' },
  ];

  return (
    <nav className="p-4 space-y-2">
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#D61C1C] text-white'
                : 'text-[#333] hover:bg-[#F9F6F3]'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}

      {/* 고객 앱으로 이동 */}
      <div className="pt-4 mt-4 border-t border-[#E5DDD5]">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8B7355] hover:bg-[#F9F6F3] transition-colors"
        >
          <span className="text-xl">🍜</span>
          <span>고객 앱 보기</span>
        </NavLink>
      </div>
    </nav>
  );
}

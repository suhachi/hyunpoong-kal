/**
 * 현풍닭칼국수 PWA - 완전한 라우팅 버전
 * 
 * 주의: 이 파일은 로컬 개발 환경 전용입니다.
 * 
 * 사용법:
 * 1. App.tsx를 App.demo.tsx로 백업
 * 2. 이 파일을 App.tsx로 복사
 * 3. npm run dev 실행
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { ensureFcmToken, FCM_TOKEN_KEY } from './lib/fcm';

// Layout (레이아웃은 즉시 로드)
import { AppLayout } from './components/app/AppLayout';
const AdminLayout = lazy(() => import('./pages/admin/_layout/AdminLayout').then(m => ({ default: m.AdminLayout })));

// 고객 앱 페이지 (lazy load)
const Home = lazy(() => import('./pages/app/Home').then(m => ({ default: m.Home })));
const MenuList = lazy(() => import('./pages/app/MenuList').then(m => ({ default: m.MenuList })));
const MenuDetail = lazy(() => import('./pages/app/MenuDetail').then(m => ({ default: m.MenuDetail })));
const Cart = lazy(() => import('./pages/app/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./pages/app/Checkout').then(m => ({ default: m.Checkout })));
const My = lazy(() => import('./pages/app/My').then(m => ({ default: m.My })));
const Login = lazy(() => import('./pages/app/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/app/Signup').then(m => ({ default: m.Signup })));
const OrderTracking = lazy(() => import('./pages/app/OrderTracking').then(m => ({ default: m.OrderTracking })));
const OrderHistory = lazy(() => import('./pages/app/OrderHistory').then(m => ({ default: m.OrderHistory })));
const ReviewWrite = lazy(() => import('./pages/app/ReviewWrite').then(m => ({ default: m.ReviewWrite })));
const ReviewList = lazy(() => import('./pages/app/ReviewList').then(m => ({ default: m.ReviewList })));
const Points = lazy(() => import('./pages/app/Points').then(m => ({ default: m.Points })));
const Coupons = lazy(() => import('./pages/app/Coupons').then(m => ({ default: m.Coupons })));
const Notifications = lazy(() => import('./pages/app/Notifications').then(m => ({ default: m.Notifications })));
const NotificationSettings = lazy(() => import('./pages/app/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const Support = lazy(() => import('./pages/app/Support').then(m => ({ default: m.Support })));
const InstallGuide = lazy(() => import('./pages/app/InstallGuide').then(m => ({ default: m.InstallGuide })));

// 관리자 페이지 (lazy load - Admin 영역 전체 분리)
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const AdminOrders = lazy(() => import('./pages/admin/Orders').then(m => ({ default: m.AdminOrders })));
const AdminMenus = lazy(() => import('./pages/admin/Menus').then(m => ({ default: m.AdminMenus })));
const AdminReviews = lazy(() => import('./pages/admin/Reviews').then(m => ({ default: m.AdminReviews })));
const AdminAnalytics = lazy(() => import('./pages/admin/Analytics').then(m => ({ default: m.AdminAnalytics })));
const IntegratedAnalytics = lazy(() => import('./pages/admin/IntegratedAnalytics').then(m => ({ default: m.IntegratedAnalytics })));
const AdminSettingsCenter = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.AdminSettingsCenter })));
const AdminSupport = lazy(() => import('./pages/admin/Support').then(m => ({ default: m.AdminSupport })));
const AdminDelivery = lazy(() => import('./pages/admin/Delivery').then(m => ({ default: m.AdminDelivery })));
const AdminPromotions = lazy(() => import('./pages/admin/Promotions').then(m => ({ default: m.AdminPromotions })));
const AdminPoints = lazy(() => import('./pages/admin/Points').then(m => ({ default: m.AdminPoints })));
const AdminNotices = lazy(() => import('./pages/admin/Notices').then(m => ({ default: m.AdminNotices })));

// 개발 도구
const DevTools = lazy(() => import('./pages/DevTools').then(m => ({ default: m.DevTools })));

// 로딩 폴백 컴포넌트
const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-sm text-muted-foreground">로딩 중...</div>
  </div>
);

export default function App() {
  // T2-9: 앱 진입 시 1회 FCM 토큰 보장 시도 (Mock 우선)
  useEffect(() => {
    try {
      const existing = localStorage.getItem(FCM_TOKEN_KEY);
      if (!existing) {
        ensureFcmToken().catch((err) => console.error('[FCM] ensureFcmToken error', err));
      }
    } catch (e) {
      console.warn('[FCM] 초기 토큰 확인 실패:', e);
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            {/* ========================================
                고객 앱 라우트 (AppLayout 사용)
                ======================================== */}
            <Route path="/" element={<AppLayout />}>
              {/* 홈 */}
              <Route index element={<Home />} />
              
              {/* 메뉴 */}
              <Route path="menu" element={<MenuList />} />
              {/* T2-12: Route param은 MenuDetail의 useParams<{ menuId }>() 와 일치해야 함 */}
              <Route path="menu/:menuId" element={<MenuDetail />} />
              
              {/* 장바구니 & 주문 */}
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              {/* 주문 추적: 테스트 및 문서에서 /order/:orderId 사용 */}
              <Route path="order/:orderId" element={<OrderTracking />} />
              <Route path="order-history" element={<OrderHistory />} />
              
              {/* 리뷰 */}
              <Route path="review/:orderId" element={<ReviewWrite />} />
              <Route path="reviews" element={<ReviewList />} />
              
              {/* 포인트 & 쿠폰 */}
              <Route path="points" element={<Points />} />
              <Route path="coupons" element={<Coupons />} />
              
              {/* 알림 */}
              <Route path="notifications" element={<Notifications />} />
              <Route path="notifications/settings" element={<NotificationSettings />} />
              
              {/* 고객지원 */}
              <Route path="support" element={<Support />} />
              
              {/* 마이페이지 */}
              <Route path="my" element={<My />} />
            </Route>

            {/* ========================================
                인증 페이지 (레이아웃 없음)
                ======================================== */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ========================================
                설치 안내 페이지 (레이아웃 없음)
                ======================================== */}
            <Route path="/install" element={<InstallGuide />} />

            {/* ========================================
                관리자 라우트 (AdminLayout + ProtectedRoute)
                ======================================== */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["owner", "admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* 대시보드 */}
              <Route index element={<Dashboard />} />
              
              {/* 주문 관리 */}
              <Route path="orders" element={<AdminOrders />} />
              
              {/* 메뉴 관리 */}
              <Route path="menus" element={<AdminMenus />} />
              
              {/* 게시판 관리 */}
              <Route path="notices" element={<AdminNotices />} />
              
              {/* 리뷰 관리 */}
              <Route path="reviews" element={<AdminReviews />} />
              
              {/* 분석 */}
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="integrated-analytics" element={<IntegratedAnalytics />} />
              
              {/* 배달 관제 */}
              <Route path="delivery" element={<AdminDelivery />} />
              
              {/* 프로모션 */}
              <Route path="promotions" element={<AdminPromotions />} />
              
              {/* 포인트 관리 */}
              <Route path="points" element={<AdminPoints />} />
              
              {/* 고객지원 */}
              <Route path="support" element={<AdminSupport />} />
              
              {/* 설정 */}
              <Route path="settings" element={<AdminSettingsCenter />} />
            </Route>

            {/* ========================================
                개발 도구 (개발 환경에서만)
                ======================================== */}
            <Route path="/dev" element={<DevTools />} />

            {/* ========================================
                404 - 홈으로 리다이렉트
                ======================================== */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* 전역 토스트 알림 */}
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

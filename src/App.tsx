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
import { useEffect } from 'react';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Layout
import { AppLayout } from './components/app/AppLayout';
import { AdminLayout } from './pages/admin/_layout/AdminLayout';

// 고객 앱 페이지
import { Home } from './pages/app/Home';
import { MenuList } from './pages/app/MenuList';
import { MenuDetail } from './pages/app/MenuDetail';
import { Cart } from './pages/app/Cart';
import { Checkout } from './pages/app/Checkout';
import { My } from './pages/app/My';
import { Login } from './pages/app/Login';
import { Signup } from './pages/app/Signup';
import { OrderTracking } from './pages/app/OrderTracking';
import { OrderHistory } from './pages/app/OrderHistory';
import { ReviewWrite } from './pages/app/ReviewWrite';
import { ReviewList } from './pages/app/ReviewList';
import { Points } from './pages/app/Points';
import { Coupons } from './pages/app/Coupons';
import { Notifications } from './pages/app/Notifications';
import { NotificationSettings } from './pages/app/NotificationSettings';
import { Support } from './pages/app/Support';

// 관리자 페이지
import { Dashboard } from './pages/admin/Dashboard';
import { AdminOrders } from './pages/admin/Orders';
import { AdminMenus } from './pages/admin/Menus';
import { AdminReviews } from './pages/admin/Reviews';
import { AdminAnalytics } from './pages/admin/Analytics';
import { IntegratedAnalytics } from './pages/admin/IntegratedAnalytics';
import { AdminSettingsCenter } from './pages/admin/Settings';
import { AdminSupport } from './pages/admin/Support';
import { AdminDelivery } from './pages/admin/Delivery';
import { AdminPromotions } from './pages/admin/Promotions';
import { AdminPoints } from './pages/admin/Points';

// 개발 도구
import { DevTools } from './pages/DevTools';
import { ProtectedRoute } from './components/shared/ProtectedRoute';
import { ensureFcmToken, FCM_TOKEN_KEY } from './lib/fcm';

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
          <Routes>
            {/* ========================================
                고객 앱 라우트 (AppLayout 사용)
                ======================================== */}
            <Route path="/" element={<AppLayout />}>
              {/* 홈 */}
              <Route index element={<Home />} />
              
              {/* 메뉴 */}
              <Route path="menu" element={<MenuList />} />
              <Route path="menu/:id" element={<MenuDetail />} />
              
              {/* 장바구니 & 주문 */}
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="orders/:orderId" element={<OrderTracking />} />
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

          {/* 전역 토스트 알림 */}
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * 보호된 라우트 컴포넌트
 * 인증이 필요한 페이지에 접근 제한
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { LoadingSkeleton } from './LoadingSkeleton';
import { USE_FIREBASE } from '../../config/env';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[]; // 허용할 역할 (없으면 로그인만 확인)
  requireAuth?: boolean; // 인증 필요 여부 (기본: true)
}

export function ProtectedRoute({ 
  children, 
  roles,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading, initializing } = useAuth();
  const location = useLocation();
  const [mockDelayPassed, setMockDelayPassed] = useState(false);
  const isMock = !USE_FIREBASE;

  // STEP-8-2: Mock 모드일 때 50~100ms 지연 후 role 체크
  useEffect(() => {
    if (isMock && !loading) {
      // Mock 모드에서는 최소 1~3프레임 기다린 뒤 role 체크
      const timer = setTimeout(() => {
        setMockDelayPassed(true);
      }, 100); // 100ms 지연
      return () => clearTimeout(timer);
    } else if (!isMock) {
      // Firebase 모드에서는 즉시 통과
      setMockDelayPassed(true);
    }
  }, [isMock, loading]);

  console.group('🔒 ProtectedRoute Debug');
  console.log('📍 pathname:', location.pathname);
  console.log('⏳ loading:', loading);
  console.log('⏳ initializing:', initializing);
  console.log('🎭 isMock:', isMock);
  console.log('⏰ mockDelayPassed:', mockDelayPassed);
  console.log('👤 user:', user);
  console.log('🎫 roles required:', roles);
  console.log('🔐 requireAuth:', requireAuth);
  if (user) {
    console.log('👤 user.role:', user.role);
    console.log('✅ has required role:', roles ? roles.includes(user.role) : 'N/A');
  }
  console.groupEnd();

  // 로딩 중 또는 초기화 중
  if (loading || initializing) {
    console.log('🔒 ProtectedRoute: ⏳ Loading or Initializing...');
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  // Mock 모드일 때 지연 시간이 지나지 않았으면 로딩 표시
  if (isMock && !mockDelayPassed) {
    console.log('🔒 ProtectedRoute: ⏳ Waiting for mock delay...');
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  // 인증이 필요한데 로그인하지 않은 경우
  if (requireAuth && !user) {
    console.log('🔒 ProtectedRoute: ❌ No user, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 특정 역할이 필요한데 권한이 없는 경우
  if (roles && user && !roles.includes(user.role)) {
    console.log('🔒 ProtectedRoute: ⚠️ Insufficient role, redirecting to /');
    return <Navigate to="/" replace />;
  }

  console.log('🔒 ProtectedRoute: ✅ Access granted');

  return <>{children}</>;
}

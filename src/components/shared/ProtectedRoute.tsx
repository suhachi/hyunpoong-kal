/**
 * 보호된 라우트 컴포넌트
 * 인증이 필요한 페이지에 접근 제한
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { LoadingSkeleton } from './LoadingSkeleton';

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
  const { user, loading } = useAuth();
  const location = useLocation();

  console.group('🔒 ProtectedRoute Debug');
  console.log('📍 pathname:', location.pathname);
  console.log('⏳ loading:', loading);
  console.log('👤 user:', user);
  console.log('🎫 roles required:', roles);
  console.log('🔐 requireAuth:', requireAuth);
  if (user) {
    console.log('👤 user.role:', user.role);
    console.log('✅ has required role:', roles ? roles.includes(user.role) : 'N/A');
  }
  console.groupEnd();

  // 로딩 중
  if (loading) {
    console.log('🔒 ProtectedRoute: ⏳ Loading...');
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

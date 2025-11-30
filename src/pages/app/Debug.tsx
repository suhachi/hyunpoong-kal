/**
 * 디버그 페이지 - 앱 상태 확인
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useAuth } from "../../contexts/AuthContext";
import { USE_FIREBASE, APP_CONFIG, ENV } from "../../config/env";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

export function Debug() {
  const { user, loading } = useAuth();

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl mb-6">🔧 디버그 정보</h1>

      {/* 환경 정보 */}
      <Card className="p-6 mb-4">
        <h2 className="text-xl mb-4">환경 설정</h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="font-semibold">환경:</dt>
            <dd className="font-mono">{ENV}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold">Firebase 사용:</dt>
            <dd className="font-mono">{USE_FIREBASE ? "true ✅" : "false ❌ (Mock 모드)"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold">앱 버전:</dt>
            <dd className="font-mono">{APP_CONFIG.version}</dd>
          </div>
        </dl>
      </Card>

      {/* 인증 상태 */}
      <Card className="p-6 mb-4">
        <h2 className="text-xl mb-4">인증 상태</h2>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="font-semibold">로딩 중:</dt>
            <dd className="font-mono">{loading ? "true 🔄" : "false ✅"}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold">사용자:</dt>
            <dd className="font-mono">{user ? "✅ 로그인됨" : "❌ 비로그인"}</dd>
          </div>
          {user && (
            <>
              <div className="flex justify-between">
                <dt className="font-semibold">UID:</dt>
                <dd className="font-mono">{user.uid}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold">이메일:</dt>
                <dd className="font-mono">{user.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold">이름:</dt>
                <dd className="font-mono">{user.displayName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-semibold">역할:</dt>
                <dd className="font-mono">{user.role}</dd>
              </div>
            </>
          )}
        </dl>
      </Card>

      {/* localStorage */}
      <Card className="p-6 mb-4">
        <h2 className="text-xl mb-4">LocalStorage</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {JSON.stringify(
            {
              mockUser: localStorage.getItem("mockUser"),
              mockRole: localStorage.getItem("mockRole"),
            },
            null,
            2,
          )}
        </pre>
      </Card>

      {/* 빠른 액션 */}
      <Card className="p-6">
        <h2 className="text-xl mb-4">빠른 액션</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            variant="destructive"
          >
            LocalStorage 초기화
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
          >
            홈으로 이동
          </Button>
          <Button
            onClick={() => {
              window.location.href = "/login";
            }}
            variant="outline"
          >
            로그인 페이지
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("mockRole", "owner");
              window.location.href = "/admin/dashboard";
            }}
            variant="outline"
          >
            관리자로 전환
          </Button>
        </div>
      </Card>

      {/* 개발사 정보 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          © 2024 {APP_CONFIG.company} (사업자번호: {APP_CONFIG.bizNo})
        </p>
        <p>대표: {APP_CONFIG.ceo}</p>
      </div>
    </div>
  );
}

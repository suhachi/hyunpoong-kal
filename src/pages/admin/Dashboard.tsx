// Route: /admin
/**
 * 수동 테스트:
 * 1. 관리자 대시보드 페이지 열기
 * 2. 고객 앱에서 주문 생성 (배달/포장/만나서결제 아무거나)
 * 3. 1~3초 내:
 *    - 알림음 반복 재생
 *    - 토스트 알림 등장
 * 4. 토스트의 '확인/접수' 버튼 클릭 → 알림 중지 + 주문 페이지 이동
 */
import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Star, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/admin/common/StatCard";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { getDashboardStats } from "@/lib/admin/stats.api";
import { AdminOrderAlert } from "@/components/admin/AdminOrderAlert";

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    averageRating: 0,
    installRate: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  // 브라우저 알림 권한 요청 (최초 1회)
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  async function loadStats() {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 실시간 주문 알림 (headless) */}
      <AdminOrderAlert />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl text-[#333] mb-2">대시보드</h1>
        <p className="text-[#8B7355]">현풍닭칼국수 운영 현황을 한눈에 확인하세요</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="오늘 매출"
          value={formatPrice(stats.todaySales)}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          subtitle="전일 대비"
          loading={loading}
        />

        <StatCard
          title="오늘 주문"
          value={`${stats.todayOrders}건`}
          icon={ShoppingBag}
          trend={{ value: 8.3, isPositive: true }}
          subtitle="전일 대비"
          loading={loading}
        />

        <StatCard
          title="평균 평점"
          value={stats.averageRating.toFixed(1)}
          icon={Star}
          subtitle="전체 리뷰 기준"
          loading={loading}
        />

        <StatCard
          title="PWA 설치율"
          value={`${stats.installRate}%`}
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
          subtitle="이번 주 기준"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 실시간 주문 현황 */}
        <Card className="p-6">
          <h2 className="text-[#333] mb-4">실시간 주문 현황</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">로딩 중...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="mb-3">
                  <span className="text-3xl">🔔</span>
                </div>
                <p className="text-[#333] font-semibold mb-2">실시간 알림 활성화됨</p>
                <p className="text-[#8B7355] text-sm">
                  새 주문이 들어오면 자동으로 알림이 표시됩니다
                </p>
                <p className="text-[#8B7355] text-sm mt-1">
                  (배달/포장/만나서결제 모든 주문)
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* 최근 리뷰 */}
        <Card className="p-6">
          <h2 className="text-[#333] mb-4">최근 리뷰</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">로딩 중...</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[#8B7355]">최근 리뷰가 없습니다</p>
                <p className="text-[#8B7355] mt-1">고객이 리뷰를 남기면 여기에 표시됩니다</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 시간대별 주문 현황 */}
      <Card className="p-6">
        <h2 className="text-[#333] mb-4">시간대별 주문 현황</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#E5DDD5] rounded-lg">
          <p className="text-[#8B7355]">차트가 여기에 표시됩니다 (Phase 2-9에서 구현 예정)</p>
        </div>
      </Card>

      {/* 도움말 */}
      <Card className="p-6 bg-[#F37021]/5 border-[#F37021]/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="text-[#333] mb-2">관리자 대시보드 안내</h3>
            <ul className="space-y-1 text-[#8B7355]">
              <li>• 좌측 메뉴에서 주문, 리뷰, 메뉴, 설정을 관리할 수 있습니다</li>
              <li>• 실시간 통계는 Firebase 연동 후 자동으로 업데이트됩니다</li>
              <li>• 모바일에서는 상단 메뉴 버튼을 눌러 네비게이션을 열 수 있습니다</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

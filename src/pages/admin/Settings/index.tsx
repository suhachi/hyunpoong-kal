/**
 * 관리자 설정 센터 메인
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Settings, CreditCard, Truck, Map, Bell, Shield } from 'lucide-react';
import { getCurrentUser } from '../../../lib/auth';
import { PaymentTab } from './PaymentTab';
import { DeliveryTab } from './DeliveryTab';
import { MapsTab } from './MapsTab';
import { FCMTab } from './FCMTab';
import { OperationsTab } from './OperationsTab';

export function AdminSettingsCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'payment';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // 사용자 정보 가져오기 (동기)
  const user = getCurrentUser();

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 탭 변경 시 URL 업데이트
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // 접근 권한 확인
  if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Shield className="w-16 h-16 text-[#2E1C10]/20 mx-auto" />
          <div>
            <h2 className="text-xl font-medium text-[#2E1C10] mb-2">
              접근 권한이 필요합니다
            </h2>
            <p className="text-[#2E1C10]/60">
              설정 센터는 관리자 또는 소유자만 접근할 수 있습니다.
            </p>
            <p className="text-sm text-[#2E1C10]/40 mt-2">
              현재 역할: {user?.role || '없음'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-6 h-6 text-[#D61C1C]" />
            <h1 className="text-2xl text-[#2E1C10]">설정 센터</h1>
          </div>
          <p className="text-[#2E1C10]/60">
            API 키 및 시스템 설정을 안전하게 관리하세요
          </p>
        </div>

        {/* Role 배지 */}
        {user && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#D61C1C]/10 rounded-lg">
            <Shield className="w-4 h-4 text-[#D61C1C]" />
            <span className="text-sm font-medium text-[#D61C1C]">
              {user.role === 'owner' ? '소유자' : '관리자'}
            </span>
          </div>
        )}
      </div>

      {/* 보안 안내 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-medium text-blue-900">
              보안 원칙
            </h3>
            <p className="text-xs text-blue-800">
              서버 비밀키는 <code className="px-1 py-0.5 bg-blue-100 rounded">functions:config</code>에만 저장됩니다.
              클라이언트(.env.local)에는 공개 가능한 키만 저장하세요.
            </p>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">결제</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">배달대행</span>
          </TabsTrigger>
          <TabsTrigger value="maps" className="gap-2">
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">지도/지오</span>
          </TabsTrigger>
          <TabsTrigger value="fcm" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">알림/FCM</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">운영/보안</span>
          </TabsTrigger>
        </TabsList>

        {/* 결제 탭 */}
        <TabsContent value="payment">
          <PaymentTab />
        </TabsContent>

        {/* 배달대행 탭 */}
        <TabsContent value="delivery">
          <DeliveryTab />
        </TabsContent>

        {/* 지도/지오코딩 탭 */}
        <TabsContent value="maps">
          <MapsTab />
        </TabsContent>

        {/* FCM 알림 탭 */}
        <TabsContent value="fcm">
          <FCMTab />
        </TabsContent>

        {/* 운영/보안 탭 */}
        <TabsContent value="operations">
          <OperationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

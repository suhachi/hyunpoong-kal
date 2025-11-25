# Admin Settings - Full Source Code

**Generated**: 2025-11-25-1033  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of admin settings page and 5 tabs.

---
## src\pages\admin\Settings\index.tsx

```tsx
/**
 * 관리자 설정 센터 메인
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Settings, CreditCard, Truck, Map, Bell, Shield, Store } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { PaymentTab } from './PaymentTab';
import { DeliveryTab } from './DeliveryTab';
import { MapsTab } from './MapsTab';
import { FCMTab } from './FCMTab';
import { OperationsTab } from './OperationsTab';
import { StoreInfoTab } from './StoreInfoTab';

export function AdminSettingsCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'storeInfo';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // 사용자 정보 가져오기 (AuthContext 사용)
  const { user } = useAuth();

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
    <div data-testid="admin-settings-page-root" className="space-y-6">
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
        <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="storeInfo" className="gap-2" data-testid="admin-settings-tab-trigger-storeinfo">
            <Store className="w-4 h-4" />
            <span className="hidden sm:inline">가게 정보</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2" data-testid="admin-settings-tab-trigger-payment">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">결제</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2" data-testid="admin-settings-tab-trigger-delivery">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">배달대행</span>
          </TabsTrigger>
          <TabsTrigger value="maps" className="gap-2" data-testid="admin-settings-tab-trigger-maps">
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">지도/지오</span>
          </TabsTrigger>
          <TabsTrigger value="fcm" className="gap-2" data-testid="admin-settings-tab-trigger-fcm">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">알림/FCM</span>
          </TabsTrigger>
          <TabsTrigger value="operations" className="gap-2" data-testid="admin-settings-tab-trigger-operations">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">운영/보안</span>
          </TabsTrigger>
        </TabsList>

        {/* 가게 정보 탭 */}
        <TabsContent value="storeInfo">
          <StoreInfoTab />
        </TabsContent>

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

```

---

## src\pages\admin\Settings\PaymentTab.tsx

```tsx
/**
 * 결제 설정 탭 (NICEPAY)
 * KS컴퍼니 (사업자번호: 553-17-00098)
 * 
 * 주의: 현재 실제 결제 연동은 Phase 3 이후로 보류
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Terminal,
  FileText,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { checkFunctionsHealth } from '../../../lib/admin/settingsCenter.api';
import type { FunctionsHealthCheck } from '../../../types/adminSettings';

export function PaymentTab() {
  const [healthCheck, setHealthCheck] = useState<FunctionsHealthCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  // 헬스체크
  const loadHealthCheck = async () => {
    setChecking(true);
    try {
      const result = await checkFunctionsHealth();
      setHealthCheck(result);
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('상태 확인에 실패했습니다');
    } finally {
      setChecking(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthCheck();
  }, []);

  // CLI 명령어 복사
  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('명령어가 복사되었습니다');
  };

  return (
    <div data-testid="admin-settings-payment-tab" className="space-y-6">
      {/* 결제 연동 상태 안내 */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          <div className="font-medium mb-1">현재 결제 연동 상태</div>
          <div className="text-sm text-[#2E1C10]/70">
            • 현재 이 프로젝트는 <strong>테스트 결제 및 가상 결제</strong>만 지원합니다.<br />
            • 실제 PG(결제대행) 연동은 <strong>Phase 3 이후</strong>로 보류되었습니다.<br />
            • 향후 PG사 선정 시 별도 T코드로 연동 작업이 진행됩니다.
          </div>
        </AlertDescription>
      </Alert>

      {/* 나이스페이 설정 (테스트 전용) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#D61C1C]" />
            <CardTitle>결제 설정 (NICEPAY 테스트)</CardTitle>
          </div>
          <CardDescription>
            개발 및 테스트 환경용 NICEPAY 설정입니다. 실제 결제는 되지 않습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              <div className="font-medium mb-1">⚠️ 주의사항</div>
              <div className="text-[#2E1C10]/60">
                • 현재 설정은 Mock 모드 테스트용입니다.<br />
                • 실제 결제 승인/취소는 동작하지 않습니다.<br />
                • Phase 2 이후 Firebase Functions와 연동하여 테스트 결제가 가능해집니다.
              </div>
            </AlertDescription>
          </Alert>

          <NicePaySettings
            healthCheck={healthCheck}
            loading={loading}
            checking={checking}
            onRecheck={loadHealthCheck}
            onCopyCommand={copyCommand}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// 나이스페이 설정 컴포넌트
function NicePaySettings({ 
  healthCheck, 
  loading, 
  checking, 
  onRecheck, 
  onCopyCommand 
}: {
  healthCheck: FunctionsHealthCheck | null;
  loading: boolean;
  checking: boolean;
  onRecheck: () => void;
  onCopyCommand: (cmd: string) => void;
}) {
  const isConfigured = healthCheck?.nicepay?.configured || false;

  const nicepayCommand = `firebase functions:config:set \\
  nicepay.mode="production" \\
  nicepay.endpoint="https://api.nicepay.co.kr/v1" \\
  nicepay.mid="YOUR_MERCHANT_ID" \\
  nicepay.key="YOUR_MERCHANT_KEY" \\
  nicepay.return_url="https://hp-kal.web.app/pay/return" \\
  nicepay.cancel_url="https://hp-kal.web.app/pay/cancel"`;

  const getCheckCommand = `firebase functions:config:get nicepay`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측: 상태 패널 */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">NICEPAY 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Functions Config 연결 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2E1C10]/80">Functions Config</span>
              {loading ? (
                <Badge variant="outline" className="gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                  확인 중...
                </Badge>
              ) : isConfigured ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  연결됨
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  미설정
                </Badge>
              )}
            </div>

            <Separator />

            {/* 필수 키 체크 */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#2E1C10]/60">필수 설정</span>
              
              {healthCheck?.nicepay?.fields && Object.entries(healthCheck.nicepay.fields).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-[#2E1C10]/70">{key}</span>
                  {value ? (
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-600" />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            {/* 재확인 버튼 */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={onRecheck}
              disabled={checking}
            >
              {checking ? '확인 중...' : '상태 재확인'}
            </Button>
          </CardContent>
        </Card>

        {/* 안내 */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            NICEPAY 설정은 Firebase Functions에만 저장됩니다.
            프론트엔드에는 노출되지 않습니다.
          </AlertDescription>
        </Alert>
      </div>

      {/* 우측: 설정/가이드 */}
      <div className="lg:col-span-2 space-y-6">
        {/* 1. CLI 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#D61C1C]" />
              <CardTitle>CLI 설정 (서버)</CardTitle>
            </div>
            <CardDescription>
              Firebase Functions Config에 NICEPAY 비밀키를 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 명령어 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2E1C10]">
                  1. 설정 명령어
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyCommand(nicepayCommand)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-4 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
                <code className="text-xs text-[#2E1C10]/80 whitespace-pre">
                  {nicepayCommand}
                </code>
              </pre>
            </div>

            <Separator />

            {/* 확인 명령어 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2E1C10]">
                  2. 설정 확인
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCopyCommand(getCheckCommand)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-4 bg-[#2E1C10]/5 rounded-lg">
                <code className="text-xs text-[#2E1C10]/80">
                  {getCheckCommand}
                </code>
              </pre>
            </div>

            <Separator />

            {/* 배포 필요 안내 */}
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                설정 후 Functions를 재배포해야 적용됩니다:
                <code className="block mt-2 px-2 py-1 bg-white rounded">
                  firebase deploy --only functions
                </code>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 2. NICEPAY 가이드 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F37021]" />
              <CardTitle>NICEPAY 가이드</CardTitle>
            </div>
            <CardDescription>
              NICEPAY 개발자 센터에서 필요한 정보를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* MID/KEY 발급 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                1. MID/KEY 발급
              </h4>
              <p className="text-xs text-[#2E1C10]/60">
                NICEPAY 개발자 센터에서 가맹점 ID(MID)와 Key를 발급받으세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://npg.nicepay.co.kr', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                NICEPAY 개발자 센터
              </Button>
            </div>

            <Separator />

            {/* Return/Cancel URL */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                2. Return/Cancel URL 등록
              </h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                NICEPAY 관리자 페이지에서 아래 URL을 등록하세요:
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-[#2E1C10]/60">Return URL:</span>
                  <code className="flex-1 text-[#2E1C10]">
                    https://hp-kal.web.app/pay/return
                  </code>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-[#2E1C10]/60">Cancel URL:</span>
                  <code className="flex-1 text-[#2E1C10]">
                    https://hp-kal.web.app/pay/cancel
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// TossPaymentsSettings 컴포넌트 제거됨 (T2-6: Toss 결제 연동 완전 제거)

```

---

## src\pages\admin\Settings\DeliveryTab.tsx

```tsx
/**
 * 배달 대행사 설정 탭
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Save,
  Truck,
  Terminal,
} from 'lucide-react';
import { toast } from 'sonner';
import { getAdminSettings, saveAdminSettings } from '../../../lib/admin/settingsCenter.api';
import { formatPrice } from '../../../lib/utils';
import { getCurrentUser } from '../../../lib/auth';
import type { DeliverySettings } from '../../../types/adminSettings';
import { DEFAULT_DELIVERY_SETTINGS } from '../../../types/adminSettings';

export function DeliveryTab() {
  const [settings, setSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS);
  const [originalSettings, setOriginalSettings] = useState<DeliverySettings>(DEFAULT_DELIVERY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = getCurrentUser();

  // 설정 로드
  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getAdminSettings();
      setSettings(data.delivery);
      setOriginalSettings(data.delivery);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('설정을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // 저장
  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await saveAdminSettings(
        { delivery: settings },
        user.uid,
        user.displayName
      );
      setOriginalSettings(settings);
      toast.success('설정을 저장했습니다');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('설정 저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  // CLI 명령어
  const webhookCommand = `firebase functions:config:set \\
  delivery.secret="YOUR_WEBHOOK_SECRET_32_CHARS" \\
  delivery.provider_a_key="YOUR_PROVIDER_A_API_KEY" \\
  delivery.allowed_ips="1.2.3.4,5.6.7.8"`;

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('명령어가 복사되었습니다');
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-64 bg-gray-100 rounded-lg" />
    </div>;
  }

  return (
    <div data-testid="admin-settings-delivery-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측: 상태 패널 */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">배달 대행사 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Provider 선택 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2E1C10]/80">현재 Provider</span>
              <Badge variant={settings.provider === 'mock' ? 'outline' : 'default'}>
                {settings.provider === 'mock' && 'Mock (개발)'}
                {settings.provider === 'providerA' && 'Provider A'}
                {settings.provider === 'custom' && 'Custom'}
              </Badge>
            </div>

            <Separator />

            {/* 최대 거리 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2E1C10]/80">최대 배달 거리</span>
              <span className="font-medium text-[#2E1C10]">
                {settings.maxDistanceKm}km
              </span>
            </div>

            {/* 요금 구간 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2E1C10]/80">요금 구간</span>
              <span className="font-medium text-[#2E1C10]">
                {settings.feeTable.length}개
              </span>
            </div>

            {/* 야간 추가비 */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#2E1C10]/80">야간 추가비</span>
              <span className="font-medium text-[#2E1C10]">
                +{formatPrice(settings.nightSurcharge)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            Provider별 API 키는 Functions Config에만 저장됩니다.
          </AlertDescription>
        </Alert>
      </div>

      {/* 우측: 설정 */}
      <div className="lg:col-span-2 space-y-6">
        {/* Provider 선택 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#D61C1C]" />
              <CardTitle>배달 대행사 Provider</CardTitle>
            </div>
            <CardDescription>
              사용할 배달 대행사를 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select
                value={settings.provider}
                onValueChange={(value: any) => setSettings({ ...settings, provider: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mock">Mock (개발/테스트용)</SelectItem>
                  <SelectItem value="providerA">Provider A</SelectItem>
                  <SelectItem value="custom">Custom Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.provider === 'providerA' && (
              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-xs">
                  Provider A API 키는 Functions Config에서 설정하세요.
                  <code className="block mt-2 px-2 py-1 bg-white rounded text-[10px]">
                    delivery.provider_a_key
                  </code>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* 배달비 설정 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">배달비 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 최대 거리 */}
            <div className="space-y-2">
              <Label>최대 배달 거리 (km)</Label>
              <Input
                type="number"
                value={settings?.maxDistanceKm ?? 5}
                onChange={(e) => setSettings({
                  ...settings,
                  maxDistanceKm: parseFloat(e.target.value) || 0
                })}
                min={0}
                step={0.1}
              />
            </div>

            <Separator />

            {/* 요금 구간표 */}
            <div className="space-y-2">
              <Label>거리별 요금</Label>
              <div className="space-y-2">
                {(settings?.feeTable || []).map((zone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={zone.toKm}
                      onChange={(e) => {
                        const newTable = [...settings.feeTable];
                        newTable[index].toKm = parseFloat(e.target.value) || 0;
                        setSettings({ ...settings, feeTable: newTable });
                      }}
                      placeholder="거리 (km)"
                      className="flex-1"
                    />
                    <span className="text-sm text-[#2E1C10]/60">km까지</span>
                    <Input
                      type="number"
                      value={zone.fee}
                      onChange={(e) => {
                        const newTable = [...settings.feeTable];
                        newTable[index].fee = parseInt(e.target.value) || 0;
                        setSettings({ ...settings, feeTable: newTable });
                      }}
                      placeholder="배달비"
                      className="flex-1"
                    />
                    <span className="text-sm text-[#2E1C10]/60">원</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* 야간 추가비 */}
            <div className="space-y-2">
              <Label>야간 추가비 ({settings.nightStartHour}:00 ~ {settings.nightEndHour}:00)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#2E1C10]/60">+</span>
                <Input
                  type="number"
                  value={settings?.nightSurcharge ?? 0}
                  onChange={(e) => setSettings({
                    ...settings,
                    nightSurcharge: parseInt(e.target.value) || 0
                  })}
                  min={0}
                  step={1000}
                />
                <span className="text-sm text-[#2E1C10]/60">원</span>
              </div>
            </div>

            {/* 저장 버튼 */}
            {hasChanges && (
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? '저장 중...' : '저장'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Webhook 설정 (CLI) */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#F37021]" />
              <CardTitle className="text-base">Webhook 비밀키 설정 (서버)</CardTitle>
            </div>
            <CardDescription>
              배달 대행사 Webhook 검증을 위한 비밀키
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[#2E1C10]">CLI 명령어</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCommand(webhookCommand)}
              >
                <Copy className="w-4 h-4 mr-2" />
                복사
              </Button>
            </div>
            <pre className="p-4 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
              <code className="text-xs text-[#2E1C10]/80 whitespace-pre">
                {webhookCommand}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

```

---

## src\pages\admin\Settings\MapsTab.tsx

```tsx
/**
 * 지도/지오코딩 설정 탭
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';
import { CheckCircle2, XCircle, AlertCircle, Copy, Download, Map as MapIcon } from 'lucide-react';
import { toast } from 'sonner';
import { getEnv } from '../../../config/env';

export function MapsTab() {
  // 환경 변수 확인 (Figma Make 호환)
  const kakaoKey = getEnv('VITE_KAKAO_MAP_KEY');
  const googleKey = getEnv('VITE_GOOGLE_MAPS_API_KEY');

  // .env 템플릿 생성
  const generateEnvTemplate = () => {
    const template = `# 지도/지오코딩 API 키
# Kakao Maps (https://developers.kakao.com)
VITE_KAKAO_MAP_KEY=${kakaoKey || 'YOUR_KAKAO_REST_API_KEY'}

# Google Maps (https://console.cloud.google.com)
VITE_GOOGLE_MAPS_API_KEY=${googleKey || 'YOUR_GOOGLE_MAPS_API_KEY'}
`;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.maps.template';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('.env 템플릿을 다운로드했습니다');
  };

  return (
    <div data-testid="admin-settings-maps-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측: 상태 패널 */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">지도 API 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Kakao Maps */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2E1C10]/80">Kakao Maps</span>
              {kakaoKey ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  설정됨
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  미설정
                </Badge>
              )}
            </div>

            {/* Google Maps */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2E1C10]/80">Google Maps</span>
              {googleKey ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  설정됨
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="w-3 h-3" />
                  선택사항
                </Badge>
              )}
            </div>

            <Separator />

            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                최소 1개 이상의 지도 API가 필요합니다.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* 우측: 설정 가이드 */}
      <div className="lg:col-span-2 space-y-6">
        {/* 상단 안내 */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>🔐 보안 및 복제 편의를 위해</strong> 지도 API 키는 화면에서 직접 입력하지 않고<br />
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 파일과 복사 스크립트로만 관리합니다.<br />
            아래 안내에 따라 Kakao/Google 콘솔에서 키를 발급한 뒤, 환경변수에 추가해 주세요.
          </AlertDescription>
        </Alert>

        {/* Kakao Maps */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-[#FEE500]" />
              <CardTitle>Kakao Maps API (.env로 설정)</CardTitle>
            </div>
            <CardDescription>
              Kakao 지도 및 지오코딩 서비스
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">1. API 키 발급</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                Kakao Developers 콘솔에서 <strong>JavaScript 키</strong>를 발급받으세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://developers.kakao.com/console/app', '_blank')}
              >
                Kakao Developers 콘솔
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">2. 플랫폼 등록</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                앱 설정에서 Web 플랫폼에 도메인을 추가하세요:
              </p>
              <div className="space-y-1 text-xs">
                <code className="block p-2 bg-gray-50 rounded">
                  http://localhost:5173
                </code>
                <code className="block p-2 bg-gray-50 rounded">
                  https://{'{배포 도메인}'}
                </code>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">3. 프로젝트 루트의 <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 파일에 아래와 같이 추가</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                이 화면에서는 API 키를 직접 저장하지 않습니다. 아래 환경변수에만 키를 넣어야 합니다.
              </p>
              <code className="block p-3 bg-gray-50 rounded text-xs font-mono">
                VITE_KAKAO_MAP_KEY=발급받은_JAVASCRIPT_KEY
              </code>
              <p className="text-xs text-[#2E1C10]/60 mt-2">
                저장 후 <code className="bg-gray-100 px-1 py-0.5 rounded">npm run build && firebase deploy</code> 로 다시 배포하세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Google Maps */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapIcon className="w-5 h-5 text-[#4285F4]" />
              <CardTitle>Google Maps API (선택)</CardTitle>
            </div>
            <CardDescription>
              Google 지도 및 지오코딩 서비스
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">1. API 키 발급</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                Google Cloud Console에서 <strong>브라우저 키(Browser Key)</strong>를 발급받으세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.cloud.google.com/google/maps-apis', '_blank')}
              >
                Google Cloud Console
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">2. API 활성화</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                다음 API를 활성화하세요:
              </p>
              <ul className="text-xs text-[#2E1C10]/70 space-y-1 list-disc list-inside">
                <li>Maps JavaScript API</li>
                <li>Geocoding API</li>
                <li>Places API (선택)</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">3. 프로젝트 루트의 <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 파일에 아래와 같이 추가</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                이 화면에서는 API 키를 직접 저장하지 않습니다. 아래 환경변수에만 키를 넣어야 합니다.
              </p>
              <code className="block p-3 bg-gray-50 rounded text-xs font-mono">
                VITE_GOOGLE_MAPS_API_KEY=발급받은_BROWSER_KEY
              </code>
              <p className="text-xs text-[#2E1C10]/60 mt-2">
                저장 후 <code className="bg-gray-100 px-1 py-0.5 rounded">npm run build && firebase deploy</code> 로 다시 배포하세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* .env 템플릿 다운로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">.env 템플릿</CardTitle>
            <CardDescription>
              지도 API 키 설정을 위한 템플릿 파일
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={generateEnvTemplate}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              .env 템플릿 다운로드
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

```

---

## src\pages\admin\Settings\FCMTab.tsx

```tsx
/**
 * FCM 알림 설정 탭
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';
import { CheckCircle2, XCircle, AlertCircle, Bell, Terminal, Play, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { runFCMDiagnostics } from '../../../lib/admin/settingsCenter.api';
import type { DiagnosticResult } from '../../../types/adminSettings';
import { USE_FIREBASE } from '../../../config/env';

export function FCMTab() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [running, setRunning] = useState(false);

  // 진단 실행
  const runDiagnostics = async () => {
    // Mock 모드 전용: 경고 대신 정보 상태만 설정
    if (!USE_FIREBASE) {
      setRunning(true);
      try {
        // Mock 모드용 정보 결과 생성
        const mockResult: DiagnosticResult = {
          overall: 'info',
          checks: [
            {
              name: 'Mock 모드',
              status: 'info',
              message: '현재 Mock 모드(USE_FIREBASE=false)에서는 FCM 푸시를 사용하지 않습니다.',
            },
            {
              name: '실서비스 전환',
              status: 'info',
              message: '실서비스 전환 후 Firebase 연결 및 FCM 설정을 진행해 주세요.',
            },
          ],
        };
        setDiagnostics(mockResult);
        // Mock 모드에서는 toast를 띄우지 않음
      } catch (error) {
        console.error('Mock diagnostics failed:', error);
      } finally {
        setRunning(false);
      }
      return;
    }

    // 실서비스 모드: 기존 진단 로직 실행
    setRunning(true);
    try {
      const result = await runFCMDiagnostics();
      setDiagnostics(result);
      
      if (result.overall === 'pass') {
        toast.success('모든 FCM 설정이 정상입니다');
      } else if (result.overall === 'warning') {
        toast.warning('일부 설정을 확인해주세요');
      } else {
        toast.error('FCM 설정에 문제가 있습니다');
      }
    } catch (error) {
      console.error('Diagnostics failed:', error);
      toast.error('진단 실행에 실패했습니다');
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    // Mock 모드에서는 자동 진단 실행하지 않음 (사용자가 버튼을 눌러야만 실행)
    if (!USE_FIREBASE) {
      // Mock 모드용 정보 결과만 설정
      const mockResult: DiagnosticResult = {
        overall: 'info',
        checks: [
          {
            name: 'Mock 모드',
            status: 'info',
            message: '현재 Mock 모드(USE_FIREBASE=false)에서는 FCM 푸시를 사용하지 않습니다.',
          },
        ],
      };
      setDiagnostics(mockResult);
      return;
    }
    
    // 실서비스 모드에서만 자동 진단 실행
    runDiagnostics();
  }, []);

  // Functions Config 명령어
  const fcmCommand = `firebase functions:config:set \\
  fcm.server_key="YOUR_FCM_SERVER_KEY"`;

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('명령어가 복사되었습니다');
  };

  return (
    <div data-testid="admin-settings-fcm-tab" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측: 상태 패널 */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">FCM 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* 전체 상태 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#2E1C10]/80">전체 상태</span>
              {!diagnostics ? (
                <Badge variant="outline">확인 중...</Badge>
              ) : diagnostics.overall === 'info' ? (
                <Badge className="bg-blue-500 gap-1">
                  <AlertCircle className="w-3 h-3" />
                  정보
                </Badge>
              ) : diagnostics.overall === 'pass' ? (
                <Badge className="bg-green-500 gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  정상
                </Badge>
              ) : diagnostics.overall === 'warning' ? (
                <Badge className="bg-yellow-500 gap-1">
                  <AlertCircle className="w-3 h-3" />
                  경고
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="w-3 h-3" />
                  오류
                </Badge>
              )}
            </div>

            <Separator />

            {/* 진단 결과 */}
            {diagnostics && (
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#2E1C10]/60">진단 결과</span>
                {diagnostics.checks.map((check, index) => (
                  <div key={index} className="flex items-start gap-2 text-xs">
                    {check.status === 'info' ? (
                      <AlertCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                    ) : check.status === 'pass' ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : check.status === 'warning' ? (
                      <AlertCircle className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-[#2E1C10]/70">{check.name}</div>
                      <div className="text-[#2E1C10]/50">{check.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={runDiagnostics}
              disabled={running}
            >
              <Play className="w-4 h-4 mr-2" />
              {running ? '진단 중...' : '진단 재실행'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 우측: 설정 가이드 */}
      <div className="lg:col-span-2 space-y-6">
        {/* Mock 모드 안내 배너 */}
        {!USE_FIREBASE && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              <strong>⚙️ 현재 이 프로젝트는 Mock 모드(USE_FIREBASE=false)입니다.</strong><br />
              테스트 환경에서는 FCM 푸시를 사용하지 않으며, 아래 경고/진단 결과는 무시해도 됩니다.<br />
              실서비스 전환 시 Firebase 연결 후 FCM 설정(서버 키, VAPID 키, Service Worker)을 완료해 주세요.
            </AlertDescription>
          </Alert>
        )}

        {/* 1. Firebase Cloud Messaging */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#FFCA28]" />
              <CardTitle>Firebase Cloud Messaging</CardTitle>
            </div>
            <CardDescription>
              푸시 알림을 위한 FCM 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">1. Firebase Console 설정</h4>
              <ol className="text-xs text-[#2E1C10]/70 space-y-1 list-decimal list-inside">
                <li>Firebase Console → 프로젝트 설정 → 클라우드 메시징</li>
                <li>Firebase Cloud Messaging API (V1) 사용 설정</li>
                <li>서버 키 복사</li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://console.firebase.google.com', '_blank')}
              >
                Firebase Console 열기
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">2. VAPID 키 설정 (.env.local)</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                Firebase Console → 프로젝트 설정 → 클라우드 메시징 → 웹 푸시 인증서
              </p>
              <code className="block p-2 bg-gray-50 rounded text-xs">
                VITE_FCM_VAPID_KEY=YOUR_VAPID_KEY
              </code>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">3. 서버 키 설정 (Functions)</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#2E1C10]/60">CLI 명령어</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCommand(fcmCommand)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-3 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
                <code className="text-xs text-[#2E1C10]/80 whitespace-pre">
                  {fcmCommand}
                </code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* 2. Service Worker */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Worker</CardTitle>
            <CardDescription>
              푸시 알림 수신을 위한 Service Worker 설정
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                firebase-messaging-sw.js
              </h4>
              <p className="text-xs text-[#2E1C10]/60">
                프로젝트 루트(/public)에 다음 파일을 생성하세요:
              </p>
              <pre className="p-3 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
                <code className="text-xs text-[#2E1C10]/80">{`importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "hp-kal",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();`}</code>
              </pre>
            </div>

            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                Service Worker 파일은 반드시 /public 폴더에 위치해야 합니다.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* 3. 체크리스트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">FCM 설정 체크리스트</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                'Firebase Cloud Messaging API (V1) 활성화',
                'VAPID 키 발급 및 .env.local 설정',
                'FCM 서버 키 Functions Config 설정',
                'Service Worker 파일 생성 (/public/firebase-messaging-sw.js)',
                'Service Worker 등록 확인',
                '브라우저 알림 권한 요청 구현',
                'FCM 토큰 저장 및 관리',
                '푸시 알림 수신 테스트',
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    className="mt-1"
                    disabled
                  />
                  <span className="text-[#2E1C10]/70">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

```

---

## src\pages\admin\Settings\OperationsTab.tsx

```tsx
/**
 * 운영/보안 설정 탭
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';
import { Shield, Terminal, Copy, FileText, Rocket, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '../../../components/ui/switch';
import { useEffect, useState } from 'react';
import { getAdminSettings, saveAdminSettings } from '../../../lib/admin/settingsCenter.api';
import type { AdminSettings } from '../../../types/adminSettings';
import { getCurrentUser } from '../../../lib/auth';

export function OperationsTab() {
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await getAdminSettings();
        setSettings(s);
      } catch (e) {
        toast.error('설정을 불러오지 못했습니다');
      }
    })();
  }, []);

  const handleTogglePoints = async (enabled: boolean) => {
    if (!settings) return;
    const user = getCurrentUser();
    try {
      setSaving(true);
      const updated = await saveAdminSettings(
        { points: { ...settings.points, enabled } },
        user?.uid || 'system',
        user?.displayName || user?.email || 'system'
      );
      setSettings(updated);
      toast.success(`포인트 기능이 ${enabled ? '활성화' : '비활성화'}되었습니다`);
    } catch (e) {
      toast.error('저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  // 배포 스크립트
  const deployScripts = [
    {
      name: '1. Firestore 인덱스 및 Rules',
      command: 'firebase deploy --only firestore:indexes,firestore:rules,storage',
      description: '데이터베이스 인덱스 및 보안 규칙 배포',
    },
    {
      name: '2. Cloud Functions',
      command: 'firebase deploy --only functions',
      description: '서버리스 함수 배포',
    },
    {
      name: '3. Hosting (빌드 포함)',
      command: 'npm run build && firebase deploy --only hosting',
      description: '프론트엔드 빌드 및 배포',
    },
  ];

  // 전체 배포 스크립트
  const fullDeployScript = deployScripts.map(s => s.command).join('\n');

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success('명령어가 복사되었습니다');
  };

  return (
    <div data-testid="admin-settings-operations-tab" className="space-y-6">
      {/* 포인트 기능 토글 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D61C1C]" />
            <CardTitle>포인트 기능</CardTitle>
          </div>
          <CardDescription>
            포인트 리워드 시스템 사용 여부를 제어합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#2E1C10]">포인트 시스템 활성화</p>
            <p className="text-xs text-[#2E1C10]/60">체크 해제 시 포인트 관리 페이지에서 안내가 표시됩니다</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#2E1C10]/60">
              {settings?.points?.enabled ? 'ON' : 'OFF'}
            </span>
            {settings ? (
              <Switch
                className="border border-[#2E1C10]/20"
                checked={!!settings.points.enabled}
                onCheckedChange={handleTogglePoints}
                disabled={saving}
              />
            ) : (
              <div className="h-[1.15rem] w-8 rounded-full bg-gray-200 animate-pulse" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* 배포 스크립트 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#D61C1C]" />
            <CardTitle>배포 스크립트</CardTitle>
          </div>
          <CardDescription>
            Firebase 프로젝트를 단계별로 배포합니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {deployScripts.map((script, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-[#2E1C10]">{script.name}</h4>
                  <p className="text-xs text-[#2E1C10]/60">{script.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyCommand(script.command)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-3 bg-[#2E1C10]/5 rounded-lg">
                <code className="text-xs text-[#2E1C10]/80">
                  {script.command}
                </code>
              </pre>
              {index < deployScripts.length - 1 && <Separator />}
            </div>
          ))}

          <Separator className="my-4" />

          {/* 전체 배포 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#2E1C10]">전체 배포 (순차 실행)</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCommand(fullDeployScript)}
              >
                <Copy className="w-4 h-4 mr-2" />
                전체 복사
              </Button>
            </div>
            <pre className="p-3 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
              <code className="text-xs text-[#2E1C10]/80 whitespace-pre">
                {fullDeployScript}
              </code>
            </pre>
          </div>

          <Alert>
            <Shield className="w-4 h-4" />
            <AlertDescription className="text-xs">
              배포 전 반드시 .env.local과 functions:config가 올바르게 설정되어 있는지 확인하세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* CORS 설정 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#F37021]" />
            <CardTitle>CORS 설정</CardTitle>
          </div>
          <CardDescription>
            Firebase Storage CORS 정책 설정
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#2E1C10]">cors.json 파일</h4>
            <pre className="p-3 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
              <code className="text-xs text-[#2E1C10]/80">{`[
  {
    "origin": ["https://hp-kal.web.app", "https://hp-kal.firebaseapp.com"],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]`}</code>
            </pre>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[#2E1C10]">CORS 적용 명령어</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCommand('gsutil cors set cors.json gs://hp-kal.appspot.com')}
              >
                <Copy className="w-4 h-4 mr-2" />
                복사
              </Button>
            </div>
            <pre className="p-3 bg-[#2E1C10]/5 rounded-lg">
              <code className="text-xs text-[#2E1C10]/80">
                gsutil cors set cors.json gs://hp-kal.appspot.com
              </code>
            </pre>
          </div>

          <Alert>
            <FileText className="w-4 h-4" />
            <AlertDescription className="text-xs">
              자세한 CORS 설정 방법은{' '}
              <a
                href="/docs/06-firebase/03-CORS-설정-가이드.md"
                className="text-[#D61C1C] underline"
                target="_blank"
              >
                CORS 설정 가이드
              </a>
              를 참고하세요.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Firestore Rules & Indexes */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#C7A45A]" />
            <CardTitle>Firestore Rules & Indexes</CardTitle>
          </div>
          <CardDescription>
            데이터베이스 보안 규칙 및 인덱스 관리
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Rules */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">보안 규칙</h4>
              <p className="text-xs text-[#2E1C10]/60">
                firestore.rules 파일에서 보안 규칙을 관리합니다.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyCommand('firebase deploy --only firestore:rules')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Rules 배포 명령어 복사
              </Button>
            </div>

            {/* Indexes */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">인덱스</h4>
              <p className="text-xs text-[#2E1C10]/60">
                firestore.indexes.json 파일에서 인덱스를 관리합니다.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => copyCommand('firebase deploy --only firestore:indexes')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Indexes 배포 명령어 복사
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#2E1C10]">테스트</h4>
            <p className="text-xs text-[#2E1C10]/60">
              에뮬레이터에서 보안 규칙을 테스트하세요:
            </p>
            <pre className="p-3 bg-[#2E1C10]/5 rounded-lg">
              <code className="text-xs text-[#2E1C10]/80">
                firebase emulators:start --only firestore
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* 참고 문서 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">참고 문서</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() => window.open('/docs/03-development/02-배포가이드_v1.0.md', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            배포 가이드
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() => window.open('/docs/03-development/환경변수-설정가이드.md', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            환경변수 가이드
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() => window.open('/docs/06-firebase/README.md', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Firebase 설정 가이드
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start"
            onClick={() => window.open('/docs/04-operations/04-배포-전-최종-체크리스트.md', '_blank')}
          >
            <FileText className="w-4 h-4 mr-2" />
            배포 전 체크리스트
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

```

---

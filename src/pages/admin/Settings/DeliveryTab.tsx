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

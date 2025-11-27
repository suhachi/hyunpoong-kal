# Components - Full Source Code

**Generated**: 2025-11-27-1140  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of reusable components.

---
## src\components\admin\AddressSearch.tsx

```tsx
 
```

---

## src\components\admin\BusinessHoursForm.tsx

```tsx
/**
 * 영업시간 설정 폼
 */

import { BusinessHours, DAY_LABELS } from '../../types/settings';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

interface BusinessHoursFormProps {
  value: BusinessHours[];
  onChange: (hours: BusinessHours[]) => void;
}

export function BusinessHoursForm({ value, onChange }: BusinessHoursFormProps) {
  const handleToggle = (day: string) => {
    const updated = value.map(h =>
      h.day === day ? { ...h, isOpen: !h.isOpen } : h
    );
    onChange(updated);
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', time: string) => {
    const updated = value.map(h =>
      h.day === day ? { ...h, [field]: time } : h
    );
    onChange(updated);
  };

  const handleApplyToAll = (day: string) => {
    const source = value.find(h => h.day === day);
    if (!source) return;

    const updated = value.map(h => ({
      ...h,
      openTime: source.openTime,
      closeTime: source.closeTime,
    }));
    onChange(updated);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-[#333]">요일별 영업시간</h3>
        </div>

        <div className="space-y-3">
          {value.map((hours, index) => (
            <div
              key={hours.day}
              className="flex items-center gap-3 p-3 rounded-lg border bg-white"
            >
              {/* 요일 + 토글 */}
              <div className="w-24 flex items-center gap-2">
                <Switch
                  checked={hours.isOpen}
                  onCheckedChange={() => handleToggle(hours.day)}
                />
                <Label className="text-sm text-[#333]">
                  {DAY_LABELS[hours.day]}
                </Label>
              </div>

              {/* 시간 입력 */}
              {hours.isOpen ? (
                <>
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={hours.openTime}
                      onChange={(e) => handleTimeChange(hours.day, 'openTime', e.target.value)}
                      className="w-32"
                    />
                    <span className="text-gray-400">~</span>
                    <Input
                      type="time"
                      value={hours.closeTime}
                      onChange={(e) => handleTimeChange(hours.day, 'closeTime', e.target.value)}
                      className="w-32"
                    />
                  </div>

                  {/* 전체 적용 버튼 */}
                  <button
                    type="button"
                    onClick={() => handleApplyToAll(hours.day)}
                    className="text-xs text-[#F37021] hover:underline whitespace-nowrap"
                  >
                    전체 적용
                  </button>
                </>
              ) : (
                <div className="flex-1 text-sm text-gray-400">휴무</div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
          <p className="text-xs text-blue-800">
            💡 <strong>전체 적용</strong> 버튼을 누르면 해당 요일의 시간을 모든 요일에 일괄 적용합니다.
          </p>
        </div>
      </div>
    </Card>
  );
}

```

---

## src\components\admin\CreditsCard.tsx

```tsx
/**
 * 개발사 크레딧 카드
 * KS컴퍼니 고정 정보 표시
 */

import { Card } from '../ui/card';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

export function CreditsCard() {
  return (
    <Card className="p-6 bg-gradient-to-br from-[#2E1C10]/5 to-[#F9F6F3]">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D61C1C] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg text-[#333]">개발 · 운영</h3>
            <p className="text-sm text-[#8B7355]">Service Provider</p>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-4 h-4 text-[#8B7355] mt-1" />
            <div className="flex-1">
              <p className="text-sm text-[#333]">
                <strong>KS컴퍼니</strong> (KS Company)
              </p>
              <p className="text-xs text-[#8B7355] mt-1">
                사업자등록번호: 553-17-00098
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#8B7355] mt-1" />
            <div className="flex-1">
              <p className="text-sm text-[#333]">대표이사</p>
              <p className="text-xs text-[#8B7355] mt-1">
                석경선 (대표) · 배종수 (공동대표)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#8B7355] mt-1" />
            <div className="flex-1">
              <p className="text-sm text-[#333]">연락처</p>
              <p className="text-xs text-[#8B7355] mt-1">
                이메일: kskim7@khu.ac.kr
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="w-4 h-4 text-[#8B7355] mt-1" />
            <div className="flex-1">
              <p className="text-sm text-[#333]">서비스</p>
              <p className="text-xs text-[#8B7355] mt-1">
                현풍닭칼국수 브랜드 PWA 배달앱
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#F9F6F3] rounded p-3 border border-[#C7A45A]/20 mt-4">
          <p className="text-xs text-[#8B7355] leading-relaxed">
            본 앱은 현풍닭칼국수 브랜드 아이덴티티를 기반으로 개발된 
            Progressive Web App (PWA) 배달 주문 시스템입니다. 
            브랜드 디자인 시스템, Firebase 백엔드, NICEPAY 결제 연동이 
            포함된 완전한 솔루션을 제공합니다.
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <p className="text-xs text-[#8B7355]">
            © 2025 KS Company. All rights reserved.
          </p>
          <div className="flex gap-2">
            <span className="text-xs px-2 py-1 bg-[#D61C1C]/10 text-[#D61C1C] rounded">
              v2.6
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

```

---

## src\components\admin\DeliveryProviderForm.tsx

```tsx
/**
 * 배달대행사 API 설정 폼
 * 관리자가 배달대행사 API 정보를 입력하고 연동 테스트
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertTriangle,
  Eye,
  EyeOff,
  TestTube
} from 'lucide-react';
import { DeliveryProviderSettings } from '../../types/settings';
import { toast } from 'sonner';

interface DeliveryProviderFormProps {
  value: DeliveryProviderSettings;
  onChange: (value: DeliveryProviderSettings) => void;
}

export function DeliveryProviderForm({ value, onChange }: DeliveryProviderFormProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const handleTestConnection = async () => {
    if (!value.enabled) {
      toast.error('배달 추적을 먼저 활성화해주세요');
      return;
    }

    if (value.provider === 'mock') {
      toast.info('Mock Provider는 테스트가 필요하지 않습니다');
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // API 연결 테스트
      const config = value.provider === 'providerA' ? value.providerA : value.custom;
      
      if (!config?.apiUrl || !config?.apiKey) {
        throw new Error('API URL과 API Key를 입력해주세요');
      }

      // 실제 API 테스트 호출
      const response = await fetch(`${config.apiUrl}/health`, {
        method: 'GET',
        headers: {
          'X-API-Key': config.apiKey,
          ...(value.provider === 'providerA' && value.providerA?.merchantId 
            ? { 'X-Merchant-Id': value.providerA.merchantId }
            : {}
          ),
          ...(value.provider === 'custom' && value.custom?.headers 
            ? value.custom.headers 
            : {}
          ),
        },
      });

      if (response.ok) {
        setTestResult('success');
        toast.success('API 연결 테스트 성공!');
      } else {
        throw new Error(`API 응답 오류: ${response.status}`);
      }
    } catch (error: any) {
      console.error('API 테스트 실패:', error);
      setTestResult('error');
      toast.error(`API 연결 실패: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6 text-[#D61C1C]" />
            <div>
              <CardTitle>배달대행사 연동</CardTitle>
              <CardDescription>
                배달대행사 API를 연동하여 실시간 배달 추적을 사용하세요
              </CardDescription>
            </div>
          </div>
          {testResult && (
            <Badge 
              variant={testResult === 'success' ? 'default' : 'destructive'}
              className="gap-1"
            >
              {testResult === 'success' ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  연결됨
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3" />
                  연결 실패
                </>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 배달 추적 활성화 */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label className="text-base">배달 추적 사용</Label>
            <p className="text-sm text-muted-foreground mt-1">
              실시간 배달 위치 추적 및 관제 기능
            </p>
          </div>
          <Switch
            checked={value.enabled}
            onCheckedChange={(enabled) => onChange({ ...value, enabled })}
          />
        </div>

        {value.enabled && (
          <>
            {/* Provider 선택 */}
            <div className="space-y-2">
              <Label>배달대행사 선택</Label>
              <Select
                value={value.provider}
                onValueChange={(provider) => 
                  onChange({ ...value, provider: provider as DeliveryProviderSettings['provider'] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="배달대행사를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mock">
                    Mock (테스트용)
                  </SelectItem>
                  <SelectItem value="providerA">
                    Provider A (예: 부릉, 바로고 등)
                  </SelectItem>
                  <SelectItem value="custom">
                    Custom (직접 입력)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {value.provider === 'mock' && '테스트 환경에서만 사용하세요. 실제 배달 추적은 되지 않습니다.'}
                {value.provider === 'providerA' && '배달대행사에서 제공받은 API 정보를 입력하세요.'}
                {value.provider === 'custom' && '사용 중인 배달대행사 API 정보를 직접 입력하세요.'}
              </p>
            </div>

            {/* Mock Provider 안내 */}
            {value.provider === 'mock' && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Mock Provider는 개발/테스트용입니다. 실제 배달 추적 데이터는 생성되지 않습니다.
                  프로덕션 환경에서는 실제 배달대행사를 선택해주세요.
                </AlertDescription>
              </Alert>
            )}

            {/* Provider A 설정 */}
            {value.provider === 'providerA' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium text-sm text-[#2E1C10]">Provider A API 정보</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="providerA-apiUrl">API URL *</Label>
                  <Input
                    id="providerA-apiUrl"
                    type="url"
                    placeholder="https://api.provider-a.example.com"
                    value={value.providerA?.apiUrl || ''}
                    onChange={(e) => onChange({
                      ...value,
                      providerA: {
                        ...value.providerA,
                        apiUrl: e.target.value,
                        apiKey: value.providerA?.apiKey || '',
                        merchantId: value.providerA?.merchantId || '',
                      }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    배달대행사에서 제공한 API 엔드포인트 주소
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerA-apiKey">API Key *</Label>
                  <div className="relative">
                    <Input
                      id="providerA-apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="YOUR_API_KEY_HERE"
                      value={value.providerA?.apiKey || ''}
                      onChange={(e) => onChange({
                        ...value,
                        providerA: {
                          ...value.providerA,
                          apiUrl: value.providerA?.apiUrl || '',
                          apiKey: e.target.value,
                          merchantId: value.providerA?.merchantId || '',
                        }
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    배달대행사에서 제공한 인증 키
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerA-merchantId">가맹점 ID *</Label>
                  <Input
                    id="providerA-merchantId"
                    placeholder="YOUR_MERCHANT_ID"
                    value={value.providerA?.merchantId || ''}
                    onChange={(e) => onChange({
                      ...value,
                      providerA: {
                        ...value.providerA,
                        apiUrl: value.providerA?.apiUrl || '',
                        apiKey: value.providerA?.apiKey || '',
                        merchantId: e.target.value,
                      }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    배달대행사에서 발급받은 가맹점 고유 ID
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerA-webhook">Webhook Secret (선택)</Label>
                  <div className="relative">
                    <Input
                      id="providerA-webhook"
                      type={showWebhookSecret ? 'text' : 'password'}
                      placeholder="webhook_secret_key"
                      value={value.providerA?.webhookSecret || ''}
                      onChange={(e) => onChange({
                        ...value,
                        providerA: {
                          ...value.providerA,
                          apiUrl: value.providerA?.apiUrl || '',
                          apiKey: value.providerA?.apiKey || '',
                          merchantId: value.providerA?.merchantId || '',
                          webhookSecret: e.target.value,
                        }
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    >
                      {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    실시간 배달 상태 업데이트를 위한 Webhook 인증 키
                  </p>
                </div>
              </div>
            )}

            {/* Custom Provider 설정 */}
            {value.provider === 'custom' && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium text-sm text-[#2E1C10]">Custom API 정보</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="custom-name">배달대행사 이름 *</Label>
                  <Input
                    id="custom-name"
                    placeholder="예: 우리배달"
                    value={value.custom?.name || ''}
                    onChange={(e) => onChange({
                      ...value,
                      custom: {
                        ...value.custom,
                        name: e.target.value,
                        apiUrl: value.custom?.apiUrl || '',
                        apiKey: value.custom?.apiKey || '',
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-apiUrl">API URL *</Label>
                  <Input
                    id="custom-apiUrl"
                    type="url"
                    placeholder="https://api.yourdelivery.com"
                    value={value.custom?.apiUrl || ''}
                    onChange={(e) => onChange({
                      ...value,
                      custom: {
                        ...value.custom,
                        name: value.custom?.name || '',
                        apiUrl: e.target.value,
                        apiKey: value.custom?.apiKey || '',
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-apiKey">API Key *</Label>
                  <div className="relative">
                    <Input
                      id="custom-apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="YOUR_API_KEY_HERE"
                      value={value.custom?.apiKey || ''}
                      onChange={(e) => onChange({
                        ...value,
                        custom: {
                          ...value.custom,
                          name: value.custom?.name || '',
                          apiUrl: value.custom?.apiUrl || '',
                          apiKey: e.target.value,
                        }
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-webhook">Webhook Secret (선택)</Label>
                  <div className="relative">
                    <Input
                      id="custom-webhook"
                      type={showWebhookSecret ? 'text' : 'password'}
                      placeholder="webhook_secret_key"
                      value={value.custom?.webhookSecret || ''}
                      onChange={(e) => onChange({
                        ...value,
                        custom: {
                          ...value.custom,
                          name: value.custom?.name || '',
                          apiUrl: value.custom?.apiUrl || '',
                          apiKey: value.custom?.apiKey || '',
                          webhookSecret: e.target.value,
                        }
                      })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                    >
                      {showWebhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* API 연결 테스트 */}
            {value.provider !== 'mock' && (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex-1"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      테스트 중...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      API 연결 테스트
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* 안내 메시지 */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>중요:</strong> 설정을 변경한 후 반드시 <strong>저장</strong> 버튼을 눌러주세요.
                API 정보는 안전하게 Firebase Firestore에 저장됩니다.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}

```

---

## src\components\admin\FeesForm.tsx

```tsx
/**
 * 배달비/최소주문 설정 폼
 */

import { DeliveryFee } from '../../types/settings';
import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface FeesFormProps {
  deliveryFees: DeliveryFee[];
  deliveryRadius: number;
  minDeliveryOrder: number;
  minPickupOrder: number;
  onDeliveryFeesChange: (fees: DeliveryFee[]) => void;
  onDeliveryRadiusChange: (radius: number) => void;
  onMinDeliveryOrderChange: (amount: number) => void;
  onMinPickupOrderChange: (amount: number) => void;
}

export function FeesForm({
  deliveryFees,
  deliveryRadius,
  minDeliveryOrder,
  minPickupOrder,
  onDeliveryFeesChange,
  onDeliveryRadiusChange,
  onMinDeliveryOrderChange,
  onMinPickupOrderChange,
}: FeesFormProps) {
  const handleAddFee = () => {
    const lastFee = deliveryFees[deliveryFees.length - 1];
    const newFee: DeliveryFee = {
      minDistance: lastFee ? lastFee.maxDistance : 0,
      maxDistance: lastFee ? lastFee.maxDistance + 2 : 2,
      fee: lastFee ? lastFee.fee + 1000 : 3000,
    };
    onDeliveryFeesChange([...deliveryFees, newFee]);
  };

  const handleRemoveFee = (index: number) => {
    if (deliveryFees.length <= 1) return;
    onDeliveryFeesChange(deliveryFees.filter((_, i) => i !== index));
  };

  const handleFeeChange = (index: number, field: keyof DeliveryFee, value: number) => {
    const updated = deliveryFees.map((fee, i) =>
      i === index ? { ...fee, [field]: value } : fee
    );
    onDeliveryFeesChange(updated);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* 배달비 설정 */}
        <div>
          <h3 className="text-lg text-[#333] mb-4">거리별 배달비</h3>
          <div className="space-y-3">
            {deliveryFees.map((fee, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-white">
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    type="number"
                    value={fee.minDistance}
                    onChange={(e) => handleFeeChange(index, 'minDistance', Number(e.target.value))}
                    min="0"
                    step="0.5"
                    className="w-20"
                  />
                  <span className="text-gray-400">~</span>
                  <Input
                    type="number"
                    value={fee.maxDistance}
                    onChange={(e) => handleFeeChange(index, 'maxDistance', Number(e.target.value))}
                    min="0"
                    step="0.5"
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">km</span>
                  <span className="text-gray-400 mx-2">→</span>
                  <Input
                    type="number"
                    value={fee.fee}
                    onChange={(e) => handleFeeChange(index, 'fee', Number(e.target.value))}
                    min="0"
                    step="500"
                    className="w-28"
                  />
                  <span className="text-sm text-gray-600">원</span>
                </div>
                {deliveryFees.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFee(index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddFee}
            className="mt-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            구간 추가
          </Button>
        </div>

        {/* 최대 배달 반경 */}
        <div>
          <Label htmlFor="deliveryRadius" className="text-sm text-[#333]">
            최대 배달 반경 (km)
          </Label>
          <Input
            id="deliveryRadius"
            type="number"
            value={deliveryRadius}
            onChange={(e) => onDeliveryRadiusChange(Number(e.target.value))}
            min="1"
            step="0.5"
            className="mt-2 w-32"
          />
          <p className="text-xs text-gray-500 mt-1">
            {deliveryRadius}km 이상은 배달 불가로 표시됩니다
          </p>
        </div>

        {/* 최소 배달 주문 금액 */}
        <div>
          <Label htmlFor="minDeliveryOrder" className="text-sm text-[#333]">
            최소 배달 주문 금액 (원)
          </Label>
          <Input
            id="minDeliveryOrder"
            type="number"
            value={minDeliveryOrder}
            onChange={(e) => onMinDeliveryOrderChange(Number(e.target.value))}
            min="0"
            step="1000"
            className="mt-2 w-40"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formatPrice(minDeliveryOrder)} 미만 주문 시 배달 불가
          </p>
        </div>

        {/* 최소 포장 주문 금액 */}
        <div>
          <Label htmlFor="minPickupOrder" className="text-sm text-[#333]">
            최소 포장 주문 금액 (원)
          </Label>
          <Input
            id="minPickupOrder"
            type="number"
            value={minPickupOrder}
            onChange={(e) => onMinPickupOrderChange(Number(e.target.value))}
            min="0"
            step="1000"
            className="mt-2 w-40"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formatPrice(minPickupOrder)} 미만 주문 시 포장 불가
          </p>
        </div>
      </div>
    </Card>
  );
}

```

---

## src\components\admin\MenuCreateDialog.tsx

```tsx
/**
 * 메뉴 등록 다이얼로그
 * Phase 2-6: 신규 메뉴 생성 폼
 * 옵션 그룹을 동적으로 선택하고 사용
 */

import { useState, useEffect } from 'react';
import { Menu, MenuCategory, MenuBadge, CATEGORY_LABELS, BADGE_LABELS, MenuOptionGroup } from '../../types/menu';
import { OptionGroup } from '../../types/menu';
import { getOptionGroups } from '../../lib/admin/optionGroups.api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, X, Upload, Image as ImageIcon, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../lib/utils';
import { uploadMenuImage, validateImageFile } from '../../lib/storage';
import { USE_FIREBASE } from '../../config/env';

interface MenuCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (menuData: Partial<Menu>) => Promise<void>;
}

export function MenuCreateDialog({
  open,
  onOpenChange,
  onSave,
}: MenuCreateDialogProps) {
  // 기본 정보
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('noodle');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<MenuBadge[]>([]);
  const [allergens, setAllergens] = useState('');
  const [origin, setOrigin] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // 이미지
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 옵션 그룹 관리
  const [availableOptionGroups, setAvailableOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedOptionGroupIds, setSelectedOptionGroupIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  // 옵션 그룹 로드
  useEffect(() => {
    if (open) {
      loadOptionGroups();
    }
  }, [open]);

  const loadOptionGroups = async () => {
    try {
      const groups = await getOptionGroups();
      setAvailableOptionGroups(groups);
    } catch (error) {
      console.error('Failed to load option groups:', error);
    }
  };

  // 배지 토글
  const handleToggleBadge = (badge: MenuBadge) => {
    setSelectedBadges(prev =>
      prev.includes(badge)
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  // 이미지 파일 선택 핸들러
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 검증
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || '이미지 파일 검증에 실패했습니다.');
        e.target.value = ''; // 파일 선택 초기화
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || '이미지 파일 검증에 실패했습니다.');
    }

    if (USE_FIREBASE) {
      // Firebase Storage에 업로드
      try {
        const result = await uploadMenuImage(file);
        console.log('[MenuCreateDialog] Image uploaded to Firebase Storage:', result.path);
        return result.url;
      } catch (error: any) {
        console.error('[MenuCreateDialog] Firebase Storage upload failed:', error);
        throw new Error(error.message || '이미지 업로드에 실패했습니다.');
      }
    } else {
      // Mock 모드: 임시 blob URL 반환
      return URL.createObjectURL(file);
    }
  };

  // 옵션 그룹 선택/해제
  const handleToggleOptionGroup = (groupId: string) => {
    setSelectedOptionGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // 폼 초기화
  const resetForm = () => {
    setName('');
    setCategory('noodle');
    setPrice('');
    setDescription('');
    setSelectedBadges([]);
    setAllergens('');
    setOrigin('');
    setIsAvailable(true);
    setImagePreview('');
    setImageFile(null);
    setSelectedOptionGroupIds([]);
  };

  // 저장 핸들러
  const handleSave = async () => {
    console.log('[MenuCreateDialog] handleSave called');
    // 검증
    if (!name.trim()) {
      console.log('[MenuCreateDialog] Validation failed: name is empty');
      toast.error('메뉴 이름을 입력하세요');
      return;
    }
    if (!price || parseFloat(price) < 0) {
      console.log('[MenuCreateDialog] Validation failed: invalid price');
      toast.error('올바른 가격을 입력하세요');
      return;
    }
    if (!imageFile) {
      console.log('[MenuCreateDialog] Validation failed: no image file');
      toast.error('이미지 파일을 선택하세요');
      return;
    }
    console.log('[MenuCreateDialog] Validation passed, starting save process');
    setLoading(true);
    try {
      const selectedGroups = availableOptionGroups.filter(group =>
        selectedOptionGroupIds.includes(group.id)
      );
      console.log('[MenuCreateDialog] Selected option groups:', selectedGroups.length);
      // 이미지 파일 업로드
      console.log('[MenuCreateDialog] Uploading image file...');
      console.log('[MenuCreateDialog] USE_FIREBASE:', USE_FIREBASE);
      let finalImageUrl: string;
      if (USE_FIREBASE) {
        try {
          // Firebase 모드: 임시 ID로 업로드 (메뉴 생성 후 실제 ID로 업데이트 필요)
          const tempMenuId = `temp-${Date.now()}`;
          console.log('[MenuCreateDialog] Calling uploadMenuImage with tempMenuId:', tempMenuId);
          const result = await uploadMenuImage(imageFile!, tempMenuId);
          finalImageUrl = result.url;
          console.log('[MenuCreateDialog] Image uploaded to Firebase Storage:', result.path);
          console.log('[MenuCreateDialog] Firebase Storage URL:', finalImageUrl);
        } catch (error: any) {
          console.error('[MenuCreateDialog] Firebase Storage upload failed:', error);
          toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          setLoading(false);
          return;
        }
      } else {
        // Mock 모드: blob URL 사용
        console.log('[MenuCreateDialog] Mock mode: using blob URL');
        finalImageUrl = await uploadImage(imageFile!);
      }
      console.log('[MenuCreateDialog] Image uploaded, URL:', finalImageUrl);
      // allergens를 string[]로 변환 (쉼표로 구분된 문자열을 배열로 변환)
      const allergensArray = allergens.trim()
        ? allergens.split(',').map(a => a.trim()).filter(a => a.length > 0)
        : [];
      const menuData: Partial<Menu> = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        description: description.trim(),
        badges: selectedBadges,
        allergens: allergensArray,
        origin: origin.trim() || '국내산',
        isAvailable,
        image: finalImageUrl,
        optionGroups: selectedGroups,
      };
      console.log('[MenuCreateDialog] menuData prepared:', menuData);
      console.log('[MenuCreateDialog] Calling onSave...');
      await onSave(menuData);
      console.log('[MenuCreateDialog] onSave completed successfully');
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error('[MenuCreateDialog] Error in handleSave:', error);
      toast.error(error.message || '메뉴 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // --- JSX 반환 시작 ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle>메뉴 등록</DialogTitle>
          <DialogDescription>
            새로운 메뉴를 등록합니다. 필수 항목(*)을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-6">
            {/* 이미지 파일 업로드 */}
            <div>
              <Label htmlFor="imageFile">이미지 파일 *</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                권장: 1600px, WebP 형식, 3MB 이하
              </p>
              {/* 이미지 미리보기 */}
              {imagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={() => {
                      setImagePreview('');
                      setImageFile(null);
                      toast.error('이미지를 불러올 수 없습니다');
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                    }}
                  >
                    제거
                  </Button>
                </div>
              )}
            </div>
            {/* 메뉴 이름 */}
            <div>
              <Label htmlFor="name">메뉴 이름 *</Label>
              <Input
                id="name"
                type="text"
                placeholder="예: 닭칼국수"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            {/* 카테고리 */}
            <div>
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* 가격 */}
            <div>
              <Label htmlFor="price">가격 (원) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="9000"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
              />
            </div>
            {/* 설명 */}
            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="메뉴 설명을 입력하세요"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {/* 배지 */}
            <div>
              <Label>배지</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(BADGE_LABELS).map(([key, label]) => {
                  const isSelected = selectedBadges.includes(key as MenuBadge);
                  const badgeKey = key as MenuBadge;
                  // 배지별 색상 정의
                  const badgeColors: Record<MenuBadge, { selected: string; unselected: string }> = {
                    best: { selected: 'bg-red-500 text-white border-red-500', unselected: 'bg-red-50 text-red-600 border-red-200' },
                    signature: { selected: 'bg-purple-500 text-white border-purple-500', unselected: 'bg-purple-50 text-purple-600 border-purple-200' },
                    spicy: { selected: 'bg-orange-500 text-white border-orange-500', unselected: 'bg-orange-50 text-orange-600 border-orange-200' },
                    cold: { selected: 'bg-blue-500 text-white border-blue-500', unselected: 'bg-blue-50 text-blue-600 border-blue-200' },
                    seasonal: { selected: 'bg-green-500 text-white border-green-500', unselected: 'bg-green-50 text-green-600 border-green-200' },
                  };
                  const colors = badgeColors[badgeKey];
                  return (
                    <Badge
                      key={key}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer border-2 transition-colors ${
                        isSelected ? colors.selected : colors.unselected
                      }`}
                      onClick={() => handleToggleBadge(badgeKey)}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
            {/* 옵션 그룹 등 기타 필드 추가 필요시 여기에 */}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false); }} disabled={loading}>취소</Button>
              <Button type="submit" disabled={loading}>등록</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

```

---

## src\components\admin\MenuCSVImport.tsx

```tsx
/**
 * 메뉴 CSV 일괄 등록
 * Phase 2-6: CSV 파일로 메뉴 대량 등록
 */

import { useState } from 'react';
import { Menu } from '../../types/menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../lib/utils';

interface CSVRow {
  name: string;
  category: string;
  price: string;
  description: string;
  badges: string;
  options: string;
  imageUrl: string;
  allergens: string;
  origin: string;
}

interface ParsedMenu {
  data: Partial<Menu>;
  errors: string[];
  row: number;
}

interface MenuCSVImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (menus: Partial<Menu>[]) => Promise<void>;
}

export function MenuCSVImport({
  open,
  onOpenChange,
  onImport,
}: MenuCSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedMenus, setParsedMenus] = useState<ParsedMenu[]>([]);
  const [loading, setLoading] = useState(false);

  // CSV 파싱
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('CSV 파일만 업로드 가능합니다');
      return;
    }

    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        toast.error('CSV 파일에 데이터가 없습니다');
        return;
      }

      // 헤더 확인
      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['name', 'category', 'price'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        toast.error(`필수 컬럼이 누락되었습니다: ${missingHeaders.join(', ')}`);
        return;
      }

      // 데이터 파싱
      const parsed: ParsedMenu[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        const errors: string[] = [];
        const menuData: Partial<Menu> = {};

        // 이름 검증
        if (!row.name || row.name.length > 50) {
          errors.push('이름은 필수이며 50자 이내여야 합니다');
        } else {
          menuData.name = row.name;
        }

        // 카테고리 검증
        const validCategories = ['noodle', 'set', 'side', 'drink', 'alcohol'];
        if (!validCategories.includes(row.category)) {
          errors.push('유효하지 않은 카테고리입니다');
        } else {
          menuData.category = row.category as any;
        }

        // 가격 검증
        const price = parseInt(row.price);
        if (isNaN(price) || price < 0) {
          errors.push('가격은 0 이상의 정수여야 합니다');
        } else {
          menuData.price = price;
        }

        // 설명
        if (row.description) {
          menuData.description = row.description;
        }

        // 배지
        if (row.badges) {
          const badges = row.badges.split('|').map(b => b.trim());
          menuData.badges = badges as any;
        }

        // 옵션 (JSON)
        if (row.options) {
          try {
            menuData.options = JSON.parse(row.options);
          } catch {
            errors.push('옵션 JSON 형식이 잘못되었습니다');
          }
        }

        // 이미지
        if (row.imageUrl) {
          menuData.image = row.imageUrl;
        } else {
          errors.push('이미지 URL은 필수입니다');
        }

        // 알레르기
        if (row.allergens) {
          menuData.allergens = row.allergens.split('|').map(a => a.trim());
        }

        // 원산지
        if (row.origin) {
          menuData.origin = row.origin;
        }

        menuData.isAvailable = true;
        menuData.order = 999;

        parsed.push({
          data: menuData,
          errors,
          row: i + 1,
        });
      }

      setParsedMenus(parsed);
      toast.success(`${parsed.length}개 메뉴를 확인했습니다`);
    } catch (error) {
      console.error('CSV parsing error:', error);
      toast.error('CSV 파일을 읽는데 실패했습니다');
    }
  };

  // 일괄 등록
  const handleImport = async () => {
    const validMenus = parsedMenus.filter(m => m.errors.length === 0);

    if (validMenus.length === 0) {
      toast.error('등록 가능한 메뉴가 없습니다');
      return;
    }

    setLoading(true);

    try {
      await onImport(validMenus.map(m => m.data));
      
      toast.success(`${validMenus.length}개 메뉴가 등록되었습니다`);
      onOpenChange(false);
      
      // 초기화
      setFile(null);
      setParsedMenus([]);
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || '일괄 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const validCount = parsedMenus.filter(m => m.errors.length === 0).length;
  const errorCount = parsedMenus.filter(m => m.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto !bg-gray-50 rounded-xl p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle>CSV 일괄 등록</DialogTitle>
          <DialogDescription>
            CSV 파일로 여러 메뉴를 한 번에 등록합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* CSV 형식 안내 */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-sm">
              <p className="mb-3 font-semibold text-blue-900">CSV 파일 형식:</p>
              <code className="text-sm bg-gray-100 p-3 block rounded font-mono break-all">
                name,category,price,description,badges,options,imageUrl,allergens,origin
              </code>
              <div className="mt-3 text-sm space-y-1">
                <p>• <strong>필수:</strong> name, category, price, imageUrl</p>
                <p>• <strong>badges:</strong> 파이프(|)로 구분 (예: best|signature)</p>
                <p>• <strong>options:</strong> JSON 형식</p>
                <p>• <strong>allergens/origin:</strong> 파이프(|)로 구분</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* 파일 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CSV 파일 선택
            </label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="h-12 text-base"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                선택된 파일: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* 미리보기 */}
          {parsedMenus.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-base px-3 py-1">
                  정상 {validCount}개
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-base px-3 py-1">
                    오류 {errorCount}개
                  </Badge>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3 border-2 rounded-lg p-4 bg-gray-50">
                {parsedMenus.map((menu, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      menu.errors.length > 0 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-[#333] mb-1">
                          {menu.errors.length > 0 ? (
                            <AlertCircle className="w-5 h-5 inline mr-2 text-red-600 align-middle" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 inline mr-2 text-green-600 align-middle" />
                          )}
                          <span className="font-semibold">
                            {menu.data.name || '(이름 없음)'}
                          </span>
                          <span className="ml-2 text-[#D61C1C] font-medium">
                            {menu.data.price ? formatPrice(menu.data.price) : '0원'}
                          </span>
                        </p>
                        {menu.data.category && (
                          <p className="text-sm text-gray-600 mb-2">
                            카테고리: {menu.data.category}
                          </p>
                        )}
                        {menu.errors.length > 0 && (
                          <ul className="mt-2 text-sm text-red-700 space-y-1">
                            {menu.errors.map((error, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                        행 {menu.row}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
            disabled={loading}
          >
            취소
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || validCount === 0}
            className="min-w-[150px]"
          >
            {loading ? '등록 중...' : `${validCount}개 메뉴 등록`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

```

---

## src\components\admin\MenuEditDialog.tsx

```tsx
/**
 * 메뉴 편집 다이얼로그 (가격/설명 수정)
 */

import { useState, useEffect, useRef } from 'react';
import { Menu, MenuCategory, CATEGORY_LABELS } from '../../types/menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { Checkbox } from '../ui/checkbox';
import { Clock } from 'lucide-react';
import { uploadMenuImage, validateImageFile, deleteImageFromStorage } from '../../lib/storage';
import { USE_FIREBASE } from '../../config/env';

interface MenuEditDialogProps {
  menu: Menu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { name?: string; category?: MenuCategory; price?: number; description?: string; image?: string }, reason: string) => void;
  loading?: boolean;
}

export function MenuEditDialog({
  menu,
  open,
  onOpenChange,
  onSave,
  loading,
}: MenuEditDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('noodle');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 시간제 판매 설정
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [timeLimitStart, setTimeLimitStart] = useState('11:00');
  const [timeLimitEnd, setTimeLimitEnd] = useState('14:00');

  // 다이얼로그 열릴 때 또는 menu가 변경될 때 초기값 설정
  useEffect(() => {
    if (open && menu) {
      setName(menu.name);
      setCategory(menu.category);
      setPrice(menu.price.toString());
      setDescription(menu.description || '');
      setReason('');
      setImageUrl(menu.image || '');
      setImageFile(null);
      // 시간제 판매 설정 초기화
      if (menu.availableHours) {
        setTimeLimitEnabled(true);
        setTimeLimitStart(menu.availableHours.start);
        setTimeLimitEnd(menu.availableHours.end);
      } else {
        setTimeLimitEnabled(false);
        setTimeLimitStart('11:00');
        setTimeLimitEnd('14:00');
      }
      // 파일 입력 필드 리셋
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (!open) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setName('');
      setCategory('noodle');
      setPrice('');
      setDescription('');
      setReason('');
      setImageUrl('');
      setImageFile(null);
      setTimeLimitEnabled(false);
      setTimeLimitStart('11:00');
      setTimeLimitEnd('14:00');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, menu?.menuId]);

  // 다이얼로그 열릴 때 초기값 설정
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이전 blob URL 정리
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || '이미지 파일 검증에 실패했습니다.');
    }

    if (USE_FIREBASE && menu?.menuId) {
      // Firebase Storage에 업로드 (기존 이미지 삭제는 나중에 처리)
      try {
        const result = await uploadMenuImage(file, menu.menuId);
        console.log('[MenuEditDialog] Image uploaded to Firebase Storage:', result.path);
        return result.url;
      } catch (error: any) {
        console.error('[MenuEditDialog] Firebase Storage upload failed:', error);
        throw new Error(error.message || '이미지 업로드에 실패했습니다.');
      }
    } else {
      // Mock 모드 또는 menuId가 없는 경우: Base64로 변환
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = () => {
          reject(new Error('이미지 읽기에 실패했습니다'));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menu) {
      return;
    }

    const updates: { name?: string; category?: MenuCategory; price?: number; description?: string; image?: string; availableHours?: { start: string; end: string } | null } = {};

    // 메뉴명 변경
    if (name.trim() !== menu.name) {
      updates.name = name.trim();
    }

    // 카테고리 변경
    if (category !== menu.category) {
      updates.category = category;
    }

    const newPrice = parseInt(price);
    if (!isNaN(newPrice) && newPrice !== menu.price) {
      updates.price = newPrice;
    }

    if (description.trim() !== menu.description) {
      updates.description = description.trim();
    }

    // 이미지 변경 감지 및 저장
    const currentImageUrl = menu.image || '';
    const imageUrlChanged = imageUrl && imageUrl !== currentImageUrl;
    
    if (imageFile) {
      // 파일이 선택된 경우 업로드 후 URL 저장
      try {
        const uploadedUrl = await uploadImage(imageFile);
        updates.image = uploadedUrl;
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('이미지 업로드에 실패했습니다');
        return; // 업로드 실패 시 저장 중단
      }
    } else if (imageUrlChanged && !imageUrl.startsWith('blob:')) {
      // 파일은 없지만 URL이 변경되었고, blob URL이 아닌 경우 (실제 URL)
      updates.image = imageUrl;
    }

    // 시간제 판매 설정 변경 감지
    const currentHours = menu.availableHours;
    const newHours = timeLimitEnabled ? { start: timeLimitStart, end: timeLimitEnd } : null;
    const hoursChanged = 
      (currentHours?.start !== newHours?.start) ||
      (currentHours?.end !== newHours?.end) ||
      (currentHours && !newHours) ||
      (!currentHours && newHours);
    
    if (hoursChanged) {
      updates.availableHours = newHours;
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    onSave(updates, reason.trim());
  };

  if (!menu) return null;

  const hasChanges =
    name.trim() !== menu.name ||
    category !== menu.category ||
    (parseInt(price) !== menu.price && !isNaN(parseInt(price))) ||
    description.trim() !== menu.description ||
    imageFile !== null ||
    (imageUrl && imageUrl !== (menu.image || ""));

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md !bg-gray-50 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>메뉴 수정</DialogTitle>
            <DialogDescription>
              메뉴명, 가격, 설명, 사진을 수정합니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 메뉴명 */}
            <div className="space-y-2">
              <Label htmlFor="name">메뉴명</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="메뉴 이름을 입력하세요"
                maxLength={50}
              />
              {name.trim() !== menu.name && (
                <p className="text-xs text-[#F37021]">
                  {menu.name} → {name.trim() || '(이름 없음)'}
                </p>
              )}
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as MenuCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {category !== menu.category && (
                <p className="text-xs text-[#F37021]">
                  {CATEGORY_LABELS[menu.category]} → {CATEGORY_LABELS[category]}
                </p>
              )}
            </div>

            {/* 사진 변경 */}
            <div className="space-y-2">
              <Label htmlFor="image">사진</Label>
              <div className="flex items-center gap-4">
                {imageUrl ? (
                  <img src={imageUrl} alt="미리보기" className="w-20 h-20 rounded object-cover border" onError={e => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-gray-400">사진 없음</div>
                )}
                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block"
                />
              </div>
            </div>

            {/* 가격 */}
            <div className="space-y-2">
              <Label htmlFor="price">가격 (원)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
                step="500"
                placeholder="9000"
              />
              {parseInt(price) !== menu.price && !isNaN(parseInt(price)) && (
                <p className="text-xs text-[#F37021]">
                  {formatPrice(menu.price)} → {formatPrice(parseInt(price))}
                </p>
              )}
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                maxLength={200}
                placeholder="메뉴 설명을 입력하세요"
              />
              <p className="text-xs text-gray-500 text-right">
                {description.length}/200자
              </p>
            </div>

            {/* 시간제 판매 설정 */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <Label className="text-base font-medium">시간제 판매 설정</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timeLimitEnabled"
                  checked={timeLimitEnabled}
                  onCheckedChange={(checked) => setTimeLimitEnabled(checked as boolean)}
                />
                <Label htmlFor="timeLimitEnabled" className="cursor-pointer">
                  시간제 판매 사용
                </Label>
              </div>
              {timeLimitEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label htmlFor="timeLimitStart">시작 시간</Label>
                    <Input
                      id="timeLimitStart"
                      type="time"
                      value={timeLimitStart}
                      onChange={e => setTimeLimitStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeLimitEnd">종료 시간</Label>
                    <Input
                      id="timeLimitEnd"
                      type="time"
                      value={timeLimitEnd}
                      onChange={e => setTimeLimitEnd(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {timeLimitEnabled && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
                  💡 <strong>{timeLimitStart} ~ {timeLimitEnd}</strong> 시간대에만 주문이 가능합니다.
                </div>
              )}
            </div>

            {/* 변경 사유 */}
            {hasChanges && (
              <div className="space-y-2">
                <Label htmlFor="reason">변경 사유</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="예: 원가 상승으로 인한 가격 조정 (선택사항)"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges || loading}
            >
              {loading ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

```

---

## src\components\admin\MenuTable.tsx

```tsx
/**
 * 관리자 메뉴 테이블
 * 썸네일/이름/카테고리/가격/배지/상태/액션
 */

import { Menu, CATEGORY_LABELS, BADGE_LABELS } from '../../types/menu';
import { getMenuStatus } from '../../lib/admin/menus.api';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MoreVertical, Edit2, Clock, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { formatPrice } from '../../lib/utils';

interface MenuTableProps {
  menus: Menu[];
  onToggleAvailability: (menuId: string) => void;
  onEdit?: (menu: Menu) => void;
  onSetTimeLimit?: (menu: Menu) => void;
  onDelete?: (menuId: string) => void;
  loading?: boolean;
}

export function MenuTable({
  menus,
  onToggleAvailability,
  onEdit,
  onSetTimeLimit,
  onDelete,
  loading,
}: MenuTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500">검색 결과가 없습니다</p>
      </div>
    );
  }

  return (
    <>
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-600 w-20">이미지</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">메뉴명</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">카테고리</th>
              <th className="px-4 py-3 text-right text-xs text-gray-600">가격</th>
              <th className="px-4 py-3 text-left text-xs text-gray-600">배지</th>
              <th className="px-4 py-3 text-center text-xs text-gray-600">상태</th>
              <th className="px-4 py-3 text-center text-xs text-gray-600 w-24">판매</th>
              <th className="px-4 py-3 text-center text-xs text-gray-600 w-12">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {menus.map(menu => {
              const status = getMenuStatus(menu);
              return (
                <tr key={menu.menuId} className="hover:bg-gray-50">
                  {/* 썸네일 */}
                  <td className="px-4 py-3">
                    <ImageWithFallback
                      src={menu.image}
                      alt={menu.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>

                  {/* 메뉴명 */}
                  <td className="px-4 py-3">
                    <div className="text-sm text-[#333]">{menu.name}</div>
                    {menu.availableHours && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {menu.availableHours.start} - {menu.availableHours.end}
                      </div>
                    )}
                  </td>

                  {/* 카테고리 */}
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {CATEGORY_LABELS[menu.category]}
                    </Badge>
                  </td>

                  {/* 가격 */}
                  <td className="px-4 py-3 text-right text-sm">
                    {formatPrice(menu.price)}
                  </td>

                  {/* 배지 */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {menu.badges.map(badge => (
                        <Badge
                          key={badge}
                          variant={
                            badge === 'best' ? 'default' :
                            badge === 'signature' ? 'secondary' :
                            'outline'
                          }
                          className={
                            badge === 'best' ? 'bg-[#D61C1C]' :
                            badge === 'signature' ? 'bg-[#C7A45A]' :
                            badge === 'spicy' ? 'bg-[#F37021] text-white' :
                            badge === 'cold' ? 'bg-blue-500 text-white' :
                            ''
                          }
                        >
                          {BADGE_LABELS[badge]}
                        </Badge>
                      ))}
                    </div>
                  </td>

                  {/* 상태 */}
                  <td className="px-4 py-3 text-center">
                    <Badge
                      variant="outline"
                      className={
                        status === 'available' ? 'border-green-500 text-green-700' :
                        status === 'soldout' ? 'border-gray-400 text-gray-600' :
                        status === 'time-limited' ? 'border-yellow-500 text-yellow-700' :
                        ''
                      }
                    >
                      {status === 'available' ? '판매중' :
                       status === 'soldout' ? '품절' :
                       status === 'time-limited' ? '시간외' :
                       '숨김'}
                    </Badge>
                  </td>

                  {/* 판매 스위치 */}
                  <td className="px-4 py-3 text-center">
                    <Switch
                      checked={menu.isAvailable}
                      onCheckedChange={() => onToggleAvailability(menu.menuId)}
                    />
                  </td>

                  {/* 액션 */}
                  <td className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(menu)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            가격/설명 수정
                          </DropdownMenuItem>
                        )}
                        {onSetTimeLimit && (
                          <DropdownMenuItem onClick={() => onSetTimeLimit(menu)}>
                            <Clock className="w-4 h-4 mr-2" />
                            시간제 설정
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(menu.menuId)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 */}
      <div className="md:hidden space-y-3">
        {menus.map(menu => {
          const status = getMenuStatus(menu);
          return (
            <div key={menu.menuId} className="bg-white border rounded-lg p-4 space-y-3">
              {/* 헤더: 썸네일 + 정보 */}
              <div className="flex gap-3">
                <ImageWithFallback
                  src={menu.image}
                  alt={menu.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#333] mb-1">{menu.name}</div>
                  <div className="text-xs text-gray-500 mb-2">
                    {CATEGORY_LABELS[menu.category]} • {formatPrice(menu.price)}
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {menu.badges.map(badge => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className={
                          badge === 'best' ? 'bg-[#D61C1C] text-white border-[#D61C1C]' :
                          badge === 'signature' ? 'bg-[#C7A45A] text-white border-[#C7A45A]' :
                          badge === 'spicy' ? 'bg-[#F37021] text-white border-[#F37021]' :
                          badge === 'cold' ? 'bg-blue-500 text-white border-blue-500' :
                          ''
                        }
                      >
                        {BADGE_LABELS[badge]}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* 상태 & 액션 */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={
                      status === 'available' ? 'border-green-500 text-green-700' :
                      status === 'soldout' ? 'border-gray-400 text-gray-600' :
                      status === 'time-limited' ? 'border-yellow-500 text-yellow-700' :
                      ''
                    }
                  >
                    {status === 'available' ? '판매중' :
                     status === 'soldout' ? '품절' :
                     status === 'time-limited' ? '시간외' :
                     '숨김'}
                  </Badge>
                  {menu.availableHours && (
                    <span className="text-xs text-gray-500">
                      {menu.availableHours.start}-{menu.availableHours.end}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={menu.isAvailable}
                    onCheckedChange={() => onToggleAvailability(menu.menuId)}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(menu)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          가격/설명 수정
                        </DropdownMenuItem>
                      )}
                      {onSetTimeLimit && (
                        <DropdownMenuItem onClick={() => onSetTimeLimit(menu)}>
                          <Clock className="w-4 h-4 mr-2" />
                          시간제 설정
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(menu.menuId)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

```

---

## src\components\admin\OptionGroupsManagement.tsx

```tsx
/**
 * 옵션 그룹 관리 컴포넌트
 * 관리자가 옵션 그룹과 옵션 항목을 생성/수정/삭제
 */

import { useState, useEffect } from 'react';
import { OptionGroup, OptionItem } from '../../types/menu';
import {
  getOptionGroups,
  createOptionGroup,
  updateOptionGroup,
  deleteOptionGroup,
  addOptionItem,
  updateOptionItem,
  deleteOptionItem,
} from '../../lib/admin/optionGroups.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { formatPrice } from '../../lib/utils';

export function OptionGroupsManagement() {
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // 옵션 그룹 다이얼로그
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null);
  const [groupForm, setGroupForm] = useState({
    name: '',
    required: true,
    multiSelect: false,
    maxSelect: 1,
  });

  // 옵션 항목 다이얼로그
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ groupId: string; item: OptionItem } | null>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    quantity: 1,
    price: 0,
  });
  const [currentGroupId, setCurrentGroupId] = useState<string>('');

  // 데이터 로드
  useEffect(() => {
    loadOptionGroups();
  }, []);

  const loadOptionGroups = async () => {
    try {
      setLoading(true);
      const groups = await getOptionGroups();
      setOptionGroups(groups);
    } catch (error) {
      toast.error('옵션 그룹을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 옵션 그룹 펼치기/접기
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // 옵션 그룹 생성/수정 다이얼로그 열기
  const openGroupDialog = (group?: OptionGroup) => {
    if (group) {
      setEditingGroup(group);
      setGroupForm({
        name: group.name,
        required: group.required,
        multiSelect: group.multiSelect,
        maxSelect: group.maxSelect || 1,
      });
    } else {
      setEditingGroup(null);
      setGroupForm({
        name: '',
        required: true,
        multiSelect: false,
        maxSelect: 1,
      });
    }
    setGroupDialogOpen(true);
  };

  // 옵션 그룹 저장
  const handleSaveGroup = async () => {
    try {
      if (!groupForm.name.trim()) {
        toast.error('옵션 그룹 이름을 입력하세요');
        return;
      }

      if (editingGroup) {
        // 수정
        await updateOptionGroup(editingGroup.id, groupForm);
        toast.success('옵션 그룹이 수정되었습니다');
      } else {
        // 생성
        await createOptionGroup({
          ...groupForm,
          items: [],
          order: optionGroups.length + 1,
        });
        toast.success('옵션 그룹이 생성되었습니다');
      }

      setGroupDialogOpen(false);
      loadOptionGroups();
    } catch (error) {
      toast.error('저장에 실패했습니다');
    }
  };

  // 옵션 그룹 삭제
  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('이 옵션 그룹을 삭제하시겠습니까?')) return;

    try {
      await deleteOptionGroup(groupId);
      toast.success('옵션 그룹이 삭제되었습니다');
      loadOptionGroups();
    } catch (error) {
      toast.error('삭제에 실패했습니다');
    }
  };

  // 옵션 항목 추가/수정 다이얼로그 열기
  const openItemDialog = (groupId: string, item?: OptionItem) => {
    setCurrentGroupId(groupId);
    if (item) {
      setEditingItem({ groupId, item });
      setItemForm({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        quantity: 1,
        price: 0,
      });
    }
    setItemDialogOpen(true);
  };

  // 옵션 항목 저장
  const handleSaveItem = async () => {
    try {
      if (!itemForm.name.trim()) {
        toast.error('옵션 이름을 입력하세요');
        return;
      }

      if (itemForm.quantity < 1) {
        toast.error('수량은 1 이상이어야 합니다');
        return;
      }

      if (editingItem) {
        // 수정
        await updateOptionItem(editingItem.groupId, editingItem.item.id, itemForm);
        toast.success('옵션이 수정되었습니다');
      } else {
        // 추가
        await addOptionItem(currentGroupId, itemForm);
        toast.success('옵션이 추가되었습니다');
      }

      setItemDialogOpen(false);
      loadOptionGroups();
    } catch (error) {
      toast.error('저장에 실패했습니다');
    }
  };

  // 옵션 항목 삭제
  const handleDeleteItem = async (groupId: string, itemId: string) => {
    if (!confirm('이 옵션을 삭제하시겠습니까?')) return;

    try {
      await deleteOptionItem(groupId, itemId);
      toast.success('옵션이 삭제되었습니다');
      loadOptionGroups();
    } catch (error) {
      toast.error('삭제에 실패했습니다');
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg">옵션 그룹 관리</h3>
          <p className="text-sm text-gray-500">메뉴에 사용할 옵션 그룹을 관리합니다</p>
        </div>
        <Button onClick={() => openGroupDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          옵션 그룹 추가
        </Button>
      </div>

      {optionGroups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-gray-500">
            등록된 옵션 그룹이 없습니다
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {optionGroups.map((group) => (
            <Card key={group.id}>
              <Collapsible open={expandedGroups.has(group.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CollapsibleTrigger onClick={() => toggleGroup(group.id)}>
                        {expandedGroups.has(group.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </CollapsibleTrigger>
                      <div>
                        <CardTitle className="text-base">{group.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {group.required && (
                            <Badge variant="secondary" className="text-xs">
                              필수
                            </Badge>
                          )}
                          {group.multiSelect && (
                            <Badge variant="outline" className="text-xs">
                              다중선택 (최대 {group.maxSelect || '무제한'})
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {group.items.length}개 항목
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openItemDialog(group.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        옵션 추가
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openGroupDialog(group)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGroup(group.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CollapsibleContent>
                  <CardContent>
                    {group.items.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">
                        옵션 항목이 없습니다
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>옵션명</TableHead>
                            <TableHead>수량</TableHead>
                            <TableHead>추가 가격</TableHead>
                            <TableHead className="text-right">작업</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.items.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                {item.price > 0
                                  ? `+${formatPrice(item.price)}`
                                  : '무료'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openItemDialog(group.id, item)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteItem(group.id, item.id)}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {/* 옵션 그룹 생성/수정 다이얼로그 */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="!bg-gray-50">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? '옵션 그룹 수정' : '옵션 그룹 추가'}
            </DialogTitle>
            <DialogDescription>
              옵션 그룹 정보를 입력하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName">옵션 그룹 이름 *</Label>
              <Input
                id="groupName"
                placeholder="예: 면양, 맵기, 토핑, 사이즈"
                value={groupForm.name}
                onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={groupForm.required}
                onCheckedChange={(checked) =>
                  setGroupForm({ ...groupForm, required: !!checked })
                }
              />
              <Label htmlFor="required" className="cursor-pointer">
                필수 선택
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="multiSelect"
                checked={groupForm.multiSelect}
                onCheckedChange={(checked) =>
                  setGroupForm({ ...groupForm, multiSelect: !!checked })
                }
              />
              <Label htmlFor="multiSelect" className="cursor-pointer">
                다중 선택 가능
              </Label>
            </div>

            {groupForm.multiSelect && (
              <div>
                <Label htmlFor="maxSelect">최대 선택 개수</Label>
                <Input
                  id="maxSelect"
                  type="number"
                  min="1"
                  value={groupForm.maxSelect}
                  onChange={(e) =>
                    setGroupForm({ ...groupForm, maxSelect: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveGroup}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 옵션 항목 추가/수정 다이얼로그 */}
      <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
        <DialogContent className="!bg-gray-50">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? '옵션 수정' : '옵션 추가'}
            </DialogTitle>
            <DialogDescription>
              옵션명, 수량, 가격을 입력하세요
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="itemName">옵션명 *</Label>
              <Input
                id="itemName"
                placeholder="예: 보통, 곱빼기, 순한맛, 수육"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="quantity">수량 *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={itemForm.quantity}
                onChange={(e) =>
                  setItemForm({ ...itemForm, quantity: parseInt(e.target.value) || 1 })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                이 옵션을 선택하면 제공되는 수량입니다
              </p>
            </div>

            <div>
              <Label htmlFor="price">추가 가격 (원)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={itemForm.price}
                onChange={(e) =>
                  setItemForm({ ...itemForm, price: parseInt(e.target.value) || 0 })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                0원이면 추가 비용이 없습니다
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={handleSaveItem}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

```

---

## src\components\admin\OrderActionBar.tsx

```tsx
import { useRef, useState } from 'react';
import { Bell, Printer, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { generateReceipt } from '../../lib/functions';
import type { Order } from '../../types/order';

interface OrderActionBarProps {
  order: Order;
}

export function OrderActionBar({ order }: OrderActionBarProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleBellRing = () => {
    // 자리표시자: 실제로는 주방 벨 시스템 연동
    toast.success('알림이 전송되었습니다', {
      description: '주방에 새로운 주문 알림을 보냈습니다.',
    });
  };

  const handlePrint = () => {
    try {
      // 브라우저 프린트 API 사용
      window.print();
      
      toast.success('인쇄 창이 열렸습니다', {
        description: `주문번호: ${order.orderId.slice(0, 8).toUpperCase()}`,
      });
    } catch (error) {
      console.error('Failed to print:', error);
      toast.error('인쇄 실패', {
        description: '프린터 설정을 확인해주세요.',
      });
    }
  };

  const handleDownloadReceipt = async () => {
    setDownloading(true);
    try {
      const receiptUrl = await generateReceipt(order.orderId);
      
      // 새 탭에서 열기
      window.open(receiptUrl, '_blank');
      toast.success('영수증이 다운로드되었습니다');
    } catch (error) {
      console.error('Failed to download receipt:', error);
      toast.error('영수증 다운로드에 실패했습니다');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleBellRing}
        className="gap-2"
      >
        <Bell className="w-4 h-4" />
        알림
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="gap-2"
      >
        <Printer className="w-4 h-4" />
        주문서
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadReceipt}
        disabled={downloading}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        영수증
      </Button>
    </div>
  );
}

```

---

## src\components\admin\OrderDetailDrawer.tsx

```tsx
import { useEffect, useState } from 'react';
import type { Order, OrderLog } from '../../types/order';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { MapPin, Phone, Mail, FileText, CreditCard, Clock } from 'lucide-react';
import { fetchOrderLogs } from '../../lib/admin/orders.api';
import { OrderActionBar } from './OrderActionBar';
import { formatPrice, formatDateTime, formatTime } from '../../lib/utils';
import { getOrderStatusLabelForAdmin } from '../../lib/orders.utils';

interface OrderDetailDrawerProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailDrawer({ order, open, onClose }: OrderDetailDrawerProps) {
  const [logs, setLogs] = useState<OrderLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (order && open) {
      setLogsLoading(true);
      fetchOrderLogs(order.orderId)
        .then(setLogs)
        .finally(() => setLogsLoading(false));
    }
  }, [order, open]);

  if (!order) return null;


  // 상태 라벨은 getOrderStatusLabelForAdmin 사용

  // 결제수단 라벨
  const paymentMethodLabels: Record<string, string> = {
    app_card: '앱 결제',
    meet_card: '만나서 카드',
    meet_cash: '만나서 현금',
    // 기존 호환성 (레거시 데이터)
    card: '카드',
    transfer: '계좌이체',
    easy_pay: '간편결제',
    on_site: '만나서결제',
    on_site_card: '만나서 카드',
    on_site_cash: '만나서 현금',
  };

  // 타임라인 항목
  const timelineItems = Object.entries(order.timeline)
    .filter(([_, timestamp]) => timestamp)
    .map(([status, timestamp]) => ({
      status,
      label: statusLabels[status] || status,
      timestamp: timestamp!,
    }))
    .sort((a, b) => {
      const toMs = (t: any) => {
        if (!t) return 0;
        if (typeof t === 'string') {
          const ms = Date.parse(t);
          return isNaN(ms) ? 0 : ms;
        }
        if (typeof t === 'object') {
          if ('seconds' in t && typeof (t as any).seconds === 'number') return (t as any).seconds * 1000;
          if ('toDate' in t && typeof (t as any).toDate === 'function') return (t as any).toDate().getTime();
        }
        return 0;
      };
      return toMs(a.timestamp) - toMs(b.timestamp);
    });

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg !bg-gray-50">
        <SheetHeader>
          <SheetTitle>주문 상세</SheetTitle>
          <SheetDescription>{order.orderId}</SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* 액션 바 */}
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  order.status === 'completed'
                    ? 'default'
                    : order.status === 'cancelled'
                    ? 'destructive'
                    : 'secondary'
                }
                className={
                  order.status === 'pending'
                    ? 'bg-gray-100 text-gray-700'
                    : order.status === 'accepted'
                    ? 'bg-blue-100 text-blue-700'
                    : order.status === 'cooking'
                    ? 'bg-amber-100 text-amber-700'
                    : order.status === 'delivering'
                    ? 'bg-purple-100 text-purple-700'
                    : order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : ''
                }
              >
                {getOrderStatusLabelForAdmin(order.status)}
              </Badge>
              <OrderActionBar order={order} />
            </div>

            <Separator />

            {/* 주문 항목 */}
            <div>
              <h3 className="text-sm text-[#333] mb-3">주문 항목</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={item.menuImage}
                      alt={item.menuName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#333] mb-1">{item.menuName}</div>
                      <div className="text-xs text-[#8B7355] space-y-0.5">
                        {item.options.noodle && <div>면: {item.options.noodle}</div>}
                        {item.options.spicy && <div>맵기: {item.options.spicy}</div>}
                        {item.options.toppings && item.options.toppings.length > 0 && (
                          <div>토핑: {item.options.toppings.join(', ')}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#333]">{item.quantity}개</div>
                      <div className="text-sm text-[#8B7355]">
                        {formatPrice(item.subtotal)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#8B7355]">
                  <span>소계</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-[#D61C1C]">
                    <span>할인 {order.couponId && `(${order.couponId})`}</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                {order.deliveryFee > 0 && (
                  <div className="flex justify-between text-[#8B7355]">
                    <span>배달비</span>
                    <span>{formatPrice(order.deliveryFee)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-[#333]">
                  <span>최종 금액</span>
                  <span>{formatPrice(order.finalAmount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* 배달 정보 */}
            <div>
              <h3 className="text-sm text-[#333] mb-3">배달 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {order.deliveryType === 'delivery' ? '배달' : '포장'}
                  </Badge>
                </div>

                {order.deliveryAddress && (
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-[#333]">{order.deliveryAddress.address}</div>
                      {order.deliveryAddress.detail && (
                        <div className="text-[#8B7355]">{order.deliveryAddress.detail}</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Phone className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                  <div className="text-[#333]">{order.phone}</div>
                </div>

                {order.email && (
                  <div className="flex gap-2">
                    <Mail className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                    <div className="text-[#333]">{order.email}</div>
                  </div>
                )}

                {order.requests && (
                  <div className="flex gap-2">
                    <FileText className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                    <div className="text-[#333]">{order.requests}</div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 결제 정보 */}
            <div>
              <h3 className="text-sm text-[#333] mb-3">결제 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <CreditCard className="w-4 h-4 text-[#8B7355]" />
                    <span className="text-[#333]">
                      {paymentMethodLabels[order.payment.method]}
                    </span>
                  </div>
                  <Badge
                    variant={
                      order.payment.status === 'approved' ? 'default' : 'secondary'
                    }
                    className={
                      order.payment.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : order.payment.status === 'refunded'
                        ? 'bg-red-100 text-red-700'
                        : ''
                    }
                  >
                    {order.payment.status === 'approved'
                      ? '승인'
                      : order.payment.status === 'pending'
                      ? '대기'
                      : order.payment.status === 'refunded'
                      ? '환불'
                      : order.payment.status}
                  </Badge>
                </div>

                {order.payment.tid && (
                  <div className="text-xs text-[#8B7355]">거래ID: {order.payment.tid}</div>
                )}

                {order.payment.cardName && (
                  <div className="text-xs text-[#8B7355]">
                    {order.payment.cardName} {order.payment.cardNum}
                  </div>
                )}

                {order.payment.paidAt && (
                  <div className="text-xs text-[#8B7355]">
                    결제일시: {formatDateTime(order.payment.paidAt)}
                  </div>
                )}

                {order.payment.cancelReason && (
                  <div className="p-3 bg-red-50 rounded-lg text-xs text-red-700">
                    취소 사유: {order.payment.cancelReason}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* 타임라인 */}
            <div>
              <h3 className="text-sm text-[#333] mb-3">타임라인</h3>
              <div className="space-y-3">
                {timelineItems.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="relative">
                      <div className="w-2 h-2 rounded-full bg-[#D61C1C] mt-1.5" />
                      {index < timelineItems.length - 1 && (
                        <div className="absolute left-1 top-4 w-px h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#333]">{item.label}</span>
                        <Clock className="w-3 h-3 text-[#8B7355]" />
                        <span className="text-xs text-[#8B7355]">
                          {formatTime(item.timestamp)}
                        </span>
                      </div>
                      <div className="text-xs text-[#8B7355] mt-0.5">
                        {formatDateTime(item.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* 로그 */}
            <div>
              <h3 className="text-sm text-[#333] mb-3">변경 이력</h3>
              {logsLoading ? (
                <div className="text-xs text-[#8B7355]">로딩 중...</div>
              ) : logs.length === 0 ? (
                <div className="text-xs text-[#8B7355]">변경 이력이 없습니다</div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.logId}
                      className="p-3 bg-gray-50 rounded-lg text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[#333]">
                          {log.action === 'status_changed'
                            ? '상태 변경'
                            : log.action === 'canceled'
                            ? '주문 취소'
                            : log.action === 'created'
                            ? '주문 생성'
                            : log.action}
                        </span>
                        <span className="text-[#8B7355]">
                          {formatDateTime(log.at)}
                        </span>
                      </div>
                      {log.from && log.to && (
                        <div className="text-[#8B7355]">
                          {getOrderStatusLabelForAdmin(log.from as any)} → {getOrderStatusLabelForAdmin(log.to as any)}
                        </div>
                      )}
                      {log.byName && (
                        <div className="text-[#8B7355]">담당자: {log.byName}</div>
                      )}
                      {log.reason && (
                        <div className="text-[#D61C1C]">사유: {log.reason}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

```

---

## src\components\admin\OrderTable.tsx

```tsx
import { useState } from 'react';
import type { Order, OrderStatus } from '../../types/order';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { OrderStatusBadge } from '../shared/OrderStatusBadge';
import { formatPrice, formatRelativeTime } from '../../lib/utils';

interface OrderTableProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onUpdateStatus: (order: Order, newStatus: OrderStatus) => void;
  isLoading?: boolean;
}

// 결제수단 라벨
const paymentMethodLabels: Record<string, string> = {
  app_card: '앱 결제',
  meet_card: '만나서 카드',
  meet_cash: '만나서 현금',
  // 기존 호환성 (레거시 데이터)
  card: '카드',
  transfer: '계좌이체',
  easy_pay: '간편결제',
  on_site: '만나서결제',
  on_site_card: '만나서 카드',
  on_site_cash: '만나서 현금',
};

export function OrderTable({ orders, onViewDetail, onUpdateStatus, isLoading }: OrderTableProps) {
  // 날짜 포맷팅 (상대 시간 기반: '방금 전', 'n분 전' 등)
  const formatDate = (timestamp: any) => {
    return formatRelativeTime(timestamp);
  };



  // 메뉴 요약
  const getMenuSummary = (order: Order) => {
    const first = order.items[0];
    const rest = order.items.length - 1;
    return rest > 0 ? `${first.menuName} 외 ${rest}개` : first.menuName;
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>시간</TableHead>
              <TableHead>메뉴</TableHead>
              <TableHead>금액</TableHead>
              <TableHead>결제</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <TableRow key={i}>
                <TableCell colSpan={7}>
                  <div className="h-12 bg-gray-100 animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-3xl">📦</span>
        </div>
        <p className="text-[#8B7355]">주문이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* 데스크톱 테이블 */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>시간</TableHead>
              <TableHead>메뉴</TableHead>
              <TableHead>금액</TableHead>
              <TableHead>결제</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.orderId}
                className="hover:bg-gray-50"
                data-testid="admin.orders.item"
              >
                <TableCell>
                  <div className="space-y-1" data-testid="admin.orders.item.summary">
                    <div className="text-sm text-[#333]">{order.orderId}</div>
                    <div className="text-xs text-[#8B7355]">{order.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-[#333]">{formatDate(order.createdAt)}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm text-[#333]">{getMenuSummary(order)}</div>
                    {order.deliveryType === 'delivery' && (
                      <Badge variant="outline" className="text-xs">
                        배달
                      </Badge>
                    )}
                    {order.deliveryType === 'pickup' && (
                      <Badge variant="outline" className="text-xs">
                        포장
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-[#333]">{formatPrice(order.finalAmount)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-[#8B7355]">
                    {paymentMethodLabels[order.payment.method] || order.payment.method}
                  </div>
                </TableCell>
                <TableCell data-testid="admin.orders.item.status">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetail(order)}
                      className="h-8 w-8 p-0"
                      data-testid="admin.orders.item.detail-button"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetail(order)}>
                          상세 보기
                        </DropdownMenuItem>
                        {order.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'accepted')}
                            >
                              접수하기
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'cancelled')}
                              className="text-red-600"
                            >
                              주문 취소
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === 'accepted' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'cooking')}
                            >
                              조리중
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'cancelled')}
                              className="text-red-600"
                            >
                              주문 취소
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === 'cooking' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'delivering')}
                            >
                              배달
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'cancelled')}
                              className="text-red-600"
                            >
                              주문 취소
                            </DropdownMenuItem>
                          </>
                        )}
                        {order.status === 'delivering' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'completed')}
                            >
                              완료
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onUpdateStatus(order, 'cancelled')}
                              className="text-red-600"
                            >
                              주문 취소
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 모바일 카드 */}
      <div className="md:hidden divide-y">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="p-4 space-y-3"
            data-testid="admin.orders.item"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1" data-testid="admin.orders.item.summary">
                <div className="text-sm text-[#333]">{order.orderId}</div>
                <div className="text-xs text-[#8B7355]">{formatDate(order.createdAt)}</div>
              </div>
              <div data-testid="admin.orders.item.status">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-[#333]">{getMenuSummary(order)}</div>
              <div className="flex items-center gap-2 text-xs text-[#8B7355]">
                <span>{order.phone}</span>
                <span>·</span>
                <span>{formatPrice(order.finalAmount)}</span>
                <span>·</span>
                <span>{paymentMethodLabels[order.payment.method]}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(order)}
                className="flex-1"
                data-testid="admin.orders.item.detail-button"
              >
                상세보기
              </Button>
              {order.status !== 'completed' && order.status !== 'canceled' && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {order.status === 'pending' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order, 'accepted')}>
                        접수 확인
                      </DropdownMenuItem>
                    )}
                    {order.status === 'accepted' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order, 'cooking')}>
                        조리중
                      </DropdownMenuItem>
                    )}
                    {order.status === 'cooking' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order, 'delivering')}>
                        배달
                      </DropdownMenuItem>
                    )}
                    {order.status === 'delivering' && (
                      <DropdownMenuItem onClick={() => onUpdateStatus(order, 'completed')}>
                        완료
                      </DropdownMenuItem>
                    )}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <DropdownMenuItem
                        onClick={() => onUpdateStatus(order, 'cancelled')}
                        className="text-red-600"
                      >
                        주문 취소
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

```

---

## src\components\admin\PrintableOrder.tsx

```tsx
import { forwardRef } from 'react';
import type { Order } from '../../types/order';
import { formatPrice, formatDateTime } from '../../lib/utils';

interface PrintableOrderProps {
  order: Order;
}

/**
 * 인쇄용 주문서 컴포넌트
 * - 브라우저 print() API용 레이아웃
 * - 영수증 프린터 호환 포맷
 */
export const PrintableOrder = forwardRef<HTMLDivElement, PrintableOrderProps>(
  ({ order }, ref) => {
    const createdAt = order.createdAt
      ? formatDateTime(new Date((order.createdAt as any).toDate?.() || order.createdAt))
      : '';

    return (
      <div ref={ref} className="print:block hidden">
        <style>
          {`
            @media print {
              @page {
                size: 80mm auto;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .print-content {
                width: 80mm;
                font-family: 'Courier New', monospace;
                font-size: 10pt;
                padding: 5mm;
              }
              .print-content h1 {
                font-size: 14pt;
                margin: 0 0 5mm 0;
                text-align: center;
              }
              .print-content h2 {
                font-size: 12pt;
                margin: 3mm 0 2mm 0;
                border-bottom: 1px dashed #000;
                padding-bottom: 1mm;
              }
              .print-content table {
                width: 100%;
                border-collapse: collapse;
              }
              .print-content td {
                padding: 1mm 0;
              }
              .print-divider {
                border-top: 1px dashed #000;
                margin: 3mm 0;
              }
            }
          `}
        </style>

        <div className="print-content">
          {/* 헤더 */}
          <h1>현풍닭칼국수</h1>
          <div style={{ textAlign: 'center', fontSize: '9pt', marginBottom: '5mm' }}>
            주문서
          </div>

          {/* 주문 정보 */}
          <table>
            <tbody>
              <tr>
                <td style={{ width: '30%' }}>주문번호:</td>
                <td>{order.orderId.slice(0, 8).toUpperCase()}</td>
              </tr>
              <tr>
                <td>주문시각:</td>
                <td>{createdAt}</td>
              </tr>
              <tr>
                <td>주문유형:</td>
                <td>{order.deliveryType === 'delivery' ? '배달' : '포장'}</td>
              </tr>
              <tr>
                <td>연락처:</td>
                <td>{order.phone}</td>
              </tr>
            </tbody>
          </table>

          {/* 배달 주소 */}
          {order.deliveryType === 'delivery' && order.deliveryAddress && (
            <>
              <div className="print-divider" />
              <h2>배달 주소</h2>
              <div style={{ fontSize: '9pt', lineHeight: '1.4' }}>
                {order.deliveryAddress.address}
                {order.deliveryAddress.detail && (
                  <>
                    <br />
                    {order.deliveryAddress.detail}
                  </>
                )}
              </div>
            </>
          )}

          {/* 주문 항목 */}
          <div className="print-divider" />
          <h2>주문 내역</h2>
          <table>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td colSpan={2}>
                    <div>
                      <strong>{item.menuName}</strong> x {item.quantity}
                    </div>
                    {(item.options.noodle || item.options.spicy || item.options.toppings) && (
                      <div style={{ fontSize: '8pt', color: '#666', marginLeft: '2mm' }}>
                        {[
                          item.options.noodle && `면양: ${item.options.noodle}`,
                          item.options.spicy && `맵기: ${item.options.spicy}`,
                          item.options.toppings &&
                            item.options.toppings.length > 0 &&
                            `토핑: ${item.options.toppings.join(', ')}`,
                        ]
                          .filter(Boolean)
                          .join(' / ')}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {formatPrice(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 금액 합계 */}
          <div className="print-divider" />
          <table>
            <tbody>
              <tr>
                <td>소계</td>
                <td style={{ textAlign: 'right' }}>{formatPrice(order.subtotal)}</td>
              </tr>
              {order.discount > 0 && (
                <tr>
                  <td>할인</td>
                  <td style={{ textAlign: 'right' }}>-{formatPrice(order.discount)}</td>
                </tr>
              )}
              {order.deliveryType === 'delivery' && (
                <tr>
                  <td>배달비</td>
                  <td style={{ textAlign: 'right' }}>+{formatPrice(order.deliveryFee)}</td>
                </tr>
              )}
              <tr style={{ fontWeight: 'bold', fontSize: '11pt' }}>
                <td>총 결제액</td>
                <td style={{ textAlign: 'right' }}>{formatPrice(order.finalAmount)}</td>
              </tr>
            </tbody>
          </table>

          {/* 결제 정보 */}
          <div className="print-divider" />
          <table>
            <tbody>
              <tr>
                <td>결제수단</td>
                <td style={{ textAlign: 'right' }}>
                  {order.payment.method === 'card'
                    ? '카드'
                    : order.payment.method === 'easy_pay'
                    ? '간편결제'
                    : order.payment.method === 'transfer'
                    ? '계좌이체'
                    : '만나서결제'}
                </td>
              </tr>
              <tr>
                <td>결제상태</td>
                <td style={{ textAlign: 'right' }}>
                  {order.payment.status === 'approved' ? '승인완료' : '대기중'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 요청사항 */}
          {order.requests && (
            <>
              <div className="print-divider" />
              <h2>요청사항</h2>
              <div style={{ fontSize: '9pt', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                {order.requests}
              </div>
            </>
          )}

          {/* 하단 정보 */}
          <div className="print-divider" />
          <div style={{ fontSize: '8pt', textAlign: 'center', color: '#666' }}>
            감사합니다
            <br />
            시스템 개발: KS컴퍼니
          </div>
        </div>
      </div>
    );
  }
);

PrintableOrder.displayName = 'PrintableOrder';

```

---

## src\components\admin\ReplyModal.tsx

```tsx
import { useState, useEffect } from 'react';
import { Modal } from './common/Modal';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import type { Review } from '../../types/review';

export interface ReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onSubmit: (reviewId: string, text: string) => Promise<void>;
  onDelete?: (reviewId: string) => Promise<void>;
}

export function ReplyModal({
  open,
  onOpenChange,
  review,
  onSubmit,
  onDelete,
}: ReplyModalProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const maxLength = 200;
  const isEditing = !!review?.reply;

  useEffect(() => {
    if (review?.reply) {
      setText(review.reply.text);
    } else {
      setText('');
    }
  }, [review]);

  async function handleSubmit() {
    if (!review) return;

    if (text.trim().length < 10) {
      toast.error('답글은 최소 10자 이상 입력해주세요.');
      return;
    }

    if (text.length > maxLength) {
      toast.error(`답글은 최대 ${maxLength}자까지 입력 가능합니다.`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(review.id!, text.trim());
      toast.success(isEditing ? '답글이 수정되었습니다.' : '답글이 등록되었습니다.');
      onOpenChange(false);
    } catch (error) {
      console.error('답글 저장 실패:', error);
      toast.error('답글 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!review?.id || !onDelete) return;

    if (!confirm('답글을 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      await onDelete(review.id);
      toast.success('답글이 삭제되었습니다.');
      onOpenChange(false);
    } catch (error) {
      console.error('답글 삭제 실패:', error);
      toast.error('답글 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  if (!review) return null;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? '답글 수정' : '답글 작성'}
      description={`${review.userName}님의 리뷰에 답글을 남겨보세요.`}
      size="md"
    >
      <div className="space-y-4">
        {/* 원본 리뷰 */}
        <div className="bg-[#F9F6F3] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#333]">{review.userName}</span>
            <span className="text-[#8B7355]">·</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <span key={i} className="text-[#F37021]">⭐</span>
              ))}
            </div>
          </div>
          <p className="text-[#333] line-clamp-3">{review.text}</p>
        </div>

        {/* 답글 입력 */}
        <div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="고객님께 전할 답글을 입력하세요..."
            rows={5}
            maxLength={maxLength}
            className="resize-none"
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[#8B7355]">
              {text.length}/{maxLength}자
            </span>
            <span className="text-[#8B7355]">
              최소 10자 이상
            </span>
          </div>
        </div>

        {/* 도움말 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-900">
            💡 <strong>답글 작성 팁:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-blue-800">
            <li>• 감사 인사로 시작하세요</li>
            <li>• 구체적인 개선 사항이나 설명을 덧붙이세요</li>
            <li>• 친근하고 진심 어린 톤을 사용하세요</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            취소
          </Button>

          {isEditing && onDelete && (
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              삭제
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            disabled={loading || text.trim().length < 10}
            className="flex-1 bg-[#D61C1C] hover:bg-[#B91818]"
          >
            {loading ? '저장 중...' : isEditing ? '수정' : '등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

```

---

## src\components\admin\ReportDialog.tsx

```tsx
import { useState } from 'react';
import { Modal } from './common/Modal';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import type { ReviewReportReason } from '../../types/review';
import { REPORT_REASON_LABELS } from '../../types/review';

export interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewId: string | null;
  onSubmit: (reviewId: string, reason: ReviewReportReason, description?: string) => Promise<void>;
}

export function ReportDialog({
  open,
  onOpenChange,
  reviewId,
  onSubmit,
}: ReportDialogProps) {
  const [reason, setReason] = useState<ReviewReportReason>('spam');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!reviewId) return;

    setLoading(true);
    try {
      await onSubmit(reviewId, reason, description.trim() || undefined);
      toast.success('리뷰 신고가 접수되었습니다.');
      onOpenChange(false);
      
      // 초기화
      setReason('spam');
      setDescription('');
    } catch (error: any) {
      console.error('리뷰 신고 실패:', error);
      toast.error(error.message || '리뷰 신고에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="리뷰 신고"
      description="부적절한 리뷰를 신고해주세요."
      size="md"
    >
      <div className="space-y-4">
        {/* 신고 사유 선택 */}
        <div>
          <Label className="mb-3 block text-[#333]">신고 사유</Label>
          <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReviewReportReason)}>
            {(Object.keys(REPORT_REASON_LABELS) as ReviewReportReason[]).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={`reason-${key}`} />
                <Label htmlFor={`reason-${key}`} className="cursor-pointer">
                  {REPORT_REASON_LABELS[key]}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* 상세 설명 (선택사항) */}
        <div>
          <Label htmlFor="description" className="mb-2 block text-[#333]">
            상세 설명 (선택사항)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="신고 사유에 대한 자세한 설명을 입력하세요..."
            rows={3}
            maxLength={500}
            className="resize-none"
            disabled={loading}
          />
          <div className="flex justify-end mt-1">
            <span className="text-[#8B7355]">
              {description.length}/500자
            </span>
          </div>
        </div>

        {/* 안내 */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-900">
            ⚠️ <strong>신고 안내:</strong>
          </p>
          <ul className="mt-2 space-y-1 text-amber-800">
            <li>• 신고는 관리자가 검토 후 조치합니다</li>
            <li>• 허위 신고 시 제재를 받을 수 있습니다</li>
            <li>• 중복 신고는 불가능합니다</li>
          </ul>
        </div>

        {/* 버튼 */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1"
          >
            취소
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? '신고 중...' : '신고하기'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

```

---

## src\components\admin\ReviewCard.tsx

```tsx
import { useState } from 'react';
import { Star, Image as ImageIcon, MessageSquare, Flag, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { Review } from '../../types/review';

export interface ReviewCardProps {
  review: Review;
  onReply?: (reviewId: string) => void;
  onReport?: (reviewId: string) => void;
  onToggleHidden?: (reviewId: string, hidden: boolean) => void;
}

export function ReviewCard({ review, onReply, onReport, onToggleHidden }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxPreviewLength = 100;
  const needsExpansion = review.text.length > maxPreviewLength;

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#333]">{review.userName || '익명'}</span>
            {review.hasPhoto && (
              <Badge variant="outline" className="text-[#F37021] border-[#F37021]">
                <ImageIcon className="w-3 h-3 mr-1" />
                사진리뷰
              </Badge>
            )}
            {(review.reportedCount || 0) > 0 && (
              <Badge variant="destructive">
                <Flag className="w-3 h-3 mr-1" />
                신고 {review.reportedCount}건
              </Badge>
            )}
            {review.isHidden && (
              <Badge variant="secondary">
                <EyeOff className="w-3 h-3 mr-1" />
                숨김
              </Badge>
            )}
          </div>

          {/* 별점 */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < review.rating
                    ? 'fill-[#F37021] text-[#F37021]'
                    : 'text-[#E5DDD5]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 날짜 */}
        <time className="text-[#8B7355]">
          {formatDate(review.createdAt)}
        </time>
      </div>

      {/* 리뷰 내용 */}
      <div className="mb-4">
        <p className="text-[#333] whitespace-pre-wrap break-words">
          {needsExpansion && !isExpanded
            ? review.text.slice(0, maxPreviewLength) + '...'
            : review.text}
        </p>
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#D61C1C] hover:underline mt-1"
          >
            {isExpanded ? '접기' : '더보기'}
          </button>
        )}
      </div>

      {/* 사진 */}
      {review.photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {review.photos.map((photo, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-[#F9F6F3]"
            >
              <img
                src={photo}
                alt={`리뷰 사진 ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                onClick={() => window.open(photo, '_blank')}
              />
            </div>
          ))}
        </div>
      )}

      {/* 답글 */}
      {review.reply && (
        <div className="bg-[#F9F6F3] rounded-lg p-4 mb-4 border-l-4 border-[#D61C1C]">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-[#D61C1C]" />
            <span className="text-[#D61C1C]">{review.reply.by}</span>
            <span className="text-[#8B7355]">·</span>
            <time className="text-[#8B7355]">
              {formatDate(review.reply.at)}
            </time>
          </div>
          <p className="text-[#333] whitespace-pre-wrap">{review.reply.text}</p>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-2 flex-wrap">
        {onReply && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReply(review.id!)}
            className="text-[#D61C1C] border-[#D61C1C] hover:bg-[#D61C1C] hover:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {review.reply ? '답글 수정' : '답글 달기'}
          </Button>
        )}

        {onToggleHidden && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleHidden(review.id!, !review.isHidden)}
          >
            {review.isHidden ? (
              <>
                <Eye className="w-4 h-4 mr-2" />
                표시
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                숨기기
              </>
            )}
          </Button>
        )}

        {onReport && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReport(review.id!)}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <Flag className="w-4 h-4 mr-2" />
            신고
          </Button>
        )}
      </div>

      {/* 주문 정보 */}
      <div className="mt-4 pt-4 border-t border-[#E5DDD5]">
        <p className="text-[#8B7355]">
          주문번호: {review.orderId}
          {review.rewardIssued && (
            <span className="ml-2 text-[#F37021]">🎁 쿠폰 발급됨</span>
          )}
        </p>
      </div>
    </Card>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

```

---

## src\components\admin\StoreLocationPicker.tsx

```tsx
/**
 * 가게 위치 선택 컴포넌트 (관리자용)
 * 지도에서 클릭하여 가게 위치를 선택할 수 있습니다.
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useRef, useState } from 'react';
import { loadKakaoMaps } from '../../lib/kakaoMaps';
import { MapPin } from 'lucide-react';

type StoreLocationPickerProps = {
  lat?: number | null;
  lng?: number | null;
  addressText?: string;
  onChange: (value: { lat: number; lng: number }) => void;
};

export function StoreLocationPicker({
  lat,
  lng,
  addressText,
  onChange,
}: StoreLocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadKakaoMaps()
      .then((kakao) => {
        if (!isMounted || !containerRef.current) return;

        // 기본 좌표: 서울 시청 (37.5665, 126.9780)
        const defaultLat = 37.5665;
        const defaultLng = 126.9780;

        const center = new kakao.maps.LatLng(
          lat ?? defaultLat,
          lng ?? defaultLng
        );

        // 지도 생성
        const map = new kakao.maps.Map(containerRef.current, {
          center,
          level: 3,
        });

        mapRef.current = map;

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: center,
          map,
        });

        markerRef.current = marker;

        // 지도 클릭 이벤트
        kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
          const clickedLatLng = mouseEvent.latLng;
          marker.setPosition(clickedLatLng);
          
          onChange({
            lat: clickedLatLng.getLat(),
            lng: clickedLatLng.getLng(),
          });
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('[StoreLocationPicker] Failed to load map', err);
        setError('지도를 불러오지 못했습니다.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []); // 초기 로드만

  // lat/lng 변경 시 마커 위치 업데이트
  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !window.kakao) return;
    if (lat == null || lng == null) return;

    const position = new window.kakao.maps.LatLng(lat, lng);
    markerRef.current.setPosition(position);
    mapRef.current.setCenter(position);
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      {addressText && (
        <p className="text-xs text-[#8B7355] mb-2">
          <MapPin className="w-3 h-3 inline mr-1" />
          주소: {addressText}
        </p>
      )}
      
      {loading && !error && (
        <div className="flex items-center justify-center py-8 border rounded-md bg-gray-50">
          <p className="text-sm text-[#8B7355]">지도를 불러오는 중입니다...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8 border rounded-md bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-xs text-[#8B7355] mb-2">
            지도를 클릭해서 가게 위치를 선택하세요.
          </p>
          <div
            ref={containerRef}
            className="w-full rounded-md border border-[#E5DDD5] overflow-hidden"
            style={{ minHeight: 280 }}
          />
        </>
      )}
    </div>
  );
}


```

---

## src\components\admin\TimeSettingDialog.tsx

```tsx
/**
 * 시간제 판매 설정 다이얼로그
 */

import { useState } from 'react';
import { Menu } from '../../types/menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

interface TimeSettingDialogProps {
  menu: Menu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (hours: { start: string; end: string } | null) => void;
  loading?: boolean;
}

export function TimeSettingDialog({
  menu,
  open,
  onOpenChange,
  onSave,
  loading,
}: TimeSettingDialogProps) {
  const [enabled, setEnabled] = useState(false);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('14:00');

  // 다이얼로그 열릴 때 초기값 설정
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && menu) {
      if (menu.availableHours) {
        setEnabled(true);
        setStartTime(menu.availableHours.start);
        setEndTime(menu.availableHours.end);
      } else {
        setEnabled(false);
        setStartTime('11:00');
        setEndTime('14:00');
      }
    }
    onOpenChange(newOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!menu) return;

    if (enabled) {
      onSave({ start: startTime, end: endTime });
    } else {
      onSave(null);
    }
  };

  if (!menu) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md !bg-gray-50 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>시간제 판매 설정</DialogTitle>
            <DialogDescription>
              {menu.name}의 판매 시간을 제한합니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 활성화 체크박스 */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="enabled"
                checked={enabled}
                onCheckedChange={(checked) => setEnabled(checked as boolean)}
              />
              <Label htmlFor="enabled" className="cursor-pointer">
                시간제 판매 사용
              </Label>
            </div>

            {enabled && (
              <>
                {/* 시작 시간 */}
                <div className="space-y-2">
                  <Label htmlFor="start">시작 시간</Label>
                  <Input
                    id="start"
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    required
                  />
                </div>

                {/* 종료 시간 */}
                <div className="space-y-2">
                  <Label htmlFor="end">종료 시간</Label>
                  <Input
                    id="end"
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    required
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-xs text-blue-800">
                    💡 <strong>{startTime} ~ {endTime}</strong> 시간대에만 주문이 가능합니다.
                    <br />
                    시간 외에는 "시간외" 상태로 표시됩니다.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

```

---

## src\components\admin\common\DataTable.tsx

```tsx
import { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Skeleton } from '../../ui/skeleton';

export interface Column<T> {
  key: string;
  label: string;
  width?: string;
  render?: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T extends { id?: string }>({
  columns,
  data,
  loading,
  emptyMessage = '데이터가 없습니다.',
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-[#E5DDD5] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} style={{ width: col.width }}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#E5DDD5] p-12 text-center">
        <p className="text-[#8B7355]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#E5DDD5] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} style={{ width: col.width }}>
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item.id || index}
              onClick={() => onRowClick?.(item)}
              className={onRowClick ? 'cursor-pointer hover:bg-[#F9F6F3]' : ''}
            >
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render
                    ? col.render(item)
                    : String((item as any)[col.key] || '-')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

```

---

## src\components\admin\common\Modal.tsx

```tsx
import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Button } from '../../ui/button';

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={sizeClasses[size] + ' !bg-gray-50'}>
        <DialogHeader>
          <DialogTitle className="text-[#333]">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-[#8B7355]">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onCancel,
  variant = 'default',
  loading,
}: ConfirmModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
            className={
              variant === 'destructive'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#D61C1C] hover:bg-[#B91818]'
            }
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}

```

---

## src\components\admin\common\StatCard.tsx

```tsx
import { LucideIcon } from 'lucide-react';
import { Card } from '../../ui/card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number; // 퍼센트
    isPositive: boolean;
  };
  subtitle?: string;
  loading?: boolean;
  variant?: 'default' | 'success' | 'info' | 'warning';
}

export function StatCard({ title, value, icon: Icon, trend, subtitle, loading, variant = 'default' }: StatCardProps) {
  const variantColors = {
    default: 'bg-white text-[#D61C1C]',
    success: 'bg-white text-green-600',
    info: 'bg-white text-blue-600',
    warning: 'bg-white text-amber-600',
  };

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="w-24 h-4 bg-[#E5DDD5] rounded" />
          <div className="w-10 h-10 bg-[#E5DDD5] rounded-lg" />
        </div>
        <div className="w-32 h-8 bg-[#E5DDD5] rounded mb-2" />
        {subtitle && <div className="w-20 h-3 bg-[#E5DDD5] rounded" />}
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-[#8B7355] mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-[#333]">{value}</span>
            {trend && (
              <span
                className={`text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-[#8B7355] mt-1">{subtitle}</p>}
        </div>

        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${variantColors[variant]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  );
}

```

---

## src\components\app\AppHeader.tsx

```tsx
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { FEATURE_FLAGS } from '../../config/env';

interface AppHeaderProps {
  showBack?: boolean;
  title?: string;
}

export function AppHeader({ showBack = false, title }: AppHeaderProps) {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  
  return (
    <header 
      className="sticky top-0 z-50 bg-white border-b border-[#2E1C10]/10"
      role="banner"
      aria-label="사이트 헤더"
    >
      <nav className="flex items-center justify-between h-14 px-4" role="navigation" aria-label="주요 네비게이션">
        {/* 왼쪽: 뒤로가기 또는 로고 */}
        <div className="flex items-center">
          {showBack ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-lg hover:bg-[#2E1C10]/5"
              aria-label="뒤로가기"
            >
              <ArrowLeft className="w-6 h-6 text-[#2E1C10]" />
            </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
              <ChickenLogo />
              <span className="text-[#2E1C10]">
                현풍닭칼국수
              </span>
            </Link>
          )}
          {title && (
            <h1 className="ml-2 text-[#2E1C10]">
              {title}
            </h1>
          )}
        </div>
        
        {/* 오른쪽: 고객지원, 알림, 장바구니 */}
        <div className="flex items-center gap-1">
          {FEATURE_FLAGS.support && (
            <Link
              to="/support"
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#2E1C10]/5"
              aria-label="고객 지원"
            >
              <MessageCircle className="w-6 h-6 text-[#2E1C10]" />
            </Link>
          )}
          
          <Link
            to="/notifications"
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#2E1C10]/5"
            aria-label="알림"
          >
            <Bell className="w-6 h-6 text-[#2E1C10]" />
          </Link>
          
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#2E1C10]/5"
            aria-label={`장바구니 (${totalItems}개 상품)`}
          >
            <ShoppingCart className="w-6 h-6 text-[#2E1C10]" aria-hidden="true" />
            {/* 장바구니 아이템 수 뱃지 */}
            {totalItems > 0 && (
              <span 
                className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-[#D61C1C] rounded-full"
                aria-label={`${totalItems}개 상품`}
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}

// 간단한 닭 로고 (SVG)
function ChickenLogo() {
  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="현풍닭칼국수 로고"
    >
      <circle cx="16" cy="16" r="14" fill="#D61C1C" fillOpacity="0.12" />
      <path
        d="M16 8C13 8 11 10 11 13C11 15 12 16.5 13.5 17.5L13 22H19L18.5 17.5C20 16.5 21 15 21 13C21 10 19 8 16 8Z"
        stroke="#D61C1C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
      />
      <circle cx="14.5" cy="12.5" r="1" fill="#D61C1C" />
      <path
        d="M16 14C15.5 14 15 14.5 15 15"
        stroke="#D61C1C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

```

---

## src\components\app\AppLayout.tsx

```tsx
import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { Credits } from '../shared/Credits';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F6F3]">
      {/* Skip Link - 키보드 접근성 개선 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-white text-black px-4 py-2 rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-[#D61C1C] focus:ring-offset-2"
      >
        메인 콘텐츠로 건너뛰기
      </a>
      
      {/* 헤더 */}
      <AppHeader />
      
      {/* 메인 콘텐츠 */}
      <main id="main-content" className="flex-1 pb-20">
        <Outlet />
      </main>
      
      {/* 개발사 정보 푸터 */}
      <Credits variant="footer" />
      
      {/* 하단 네비게이션 */}
      <BottomNav />
    </div>
  );
}

```

---

## src\components\app\BottomNav.tsx

```tsx
import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, Star, User } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { to: '/', icon: Home, label: '홈' },
    { to: '/menu', icon: UtensilsCrossed, label: '메뉴' },
    { to: '/reviews', icon: Star, label: '리뷰' },
    { to: '/my', icon: User, label: '마이' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#2E1C10]/10">
      <div className="grid grid-cols-4 h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? 'text-[#D61C1C]'
                  : 'text-[#2E1C10]/60 hover:text-[#2E1C10]'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

```

---

## src\components\app\CheckoutSummary.tsx

```tsx
/**
 * 결제 요약 컴포넌트
 * Phase A: 쿠폰 적용 - 금액 변화 하이라이트
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { Separator } from '../ui/separator';
import { Sparkles } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export interface CheckoutSummaryProps {
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  pointsUsed: number;
  total: number;
  highlightChanges?: boolean;
}

export const CheckoutSummary = memo(function CheckoutSummary({
  subtotal,
  deliveryFee,
  couponDiscount,
  pointsUsed,
  total,
  highlightChanges = true,
}: CheckoutSummaryProps) {
  const prevTotal = usePrevious(total);
  const prevCoupon = usePrevious(couponDiscount);
  const prevPoints = usePrevious(pointsUsed);

  const totalChanged = prevTotal !== undefined && prevTotal !== total;
  const couponChanged = prevCoupon !== undefined && prevCoupon !== couponDiscount;
  const pointsChanged = prevPoints !== undefined && prevPoints !== pointsUsed;

  const savingsAmount = useMemo(() => 
    couponDiscount + pointsUsed, 
    [couponDiscount, pointsUsed]
  );

  return (
    <div className="space-y-3">
      {/* 기본 항목 */}
      <SummaryLine label="상품 금액" amount={subtotal} />

      {deliveryFee > 0 && (
        <SummaryLine label="배달비" amount={deliveryFee} />
      )}

      {/* 할인 항목 */}
      {couponDiscount > 0 && (
        <motion.div
          initial={highlightChanges && couponChanged ? { scale: 0.95, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SummaryLine
            label="쿠폰 할인"
            amount={-couponDiscount}
            className="text-[#D61C1C]"
            highlight={highlightChanges && couponChanged}
          />
        </motion.div>
      )}

      {pointsUsed > 0 && (
        <motion.div
          initial={highlightChanges && pointsChanged ? { scale: 0.95, opacity: 0 } : {}}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <SummaryLine
            label="포인트 사용"
            amount={-pointsUsed}
            className="text-[#F37021]"
            highlight={highlightChanges && pointsChanged}
          />
        </motion.div>
      )}

      <Separator />

      {/* 총 절약 금액 (할인이 있을 때만) */}
      {savingsAmount > 0 && (
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-[#D61C1C]/5 to-[#F37021]/5 rounded-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F37021]" />
            <span className="text-sm text-[#2E1C10]/80">총 절약</span>
          </div>
          <span className="text-sm font-medium text-[#D61C1C]">
            -{formatPrice(savingsAmount)}
          </span>
        </div>
      )}

      {/* 총 결제금액 */}
      <motion.div
        initial={highlightChanges && totalChanged ? { scale: 1.05 } : {}}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SummaryLine
          label="총 결제금액"
          amount={total}
          className="font-bold text-lg"
          highlight={highlightChanges && totalChanged}
        />
      </motion.div>
    </div>
  );
});

/**
 * 요약 행 컴포넌트
 */
interface SummaryLineProps {
  label: string;
  amount: number;
  className?: string;
  highlight?: boolean;
}

const SummaryLine = memo(function SummaryLine({ 
  label, 
  amount, 
  className = '', 
  highlight = false 
}: SummaryLineProps) {
  return (
    <div
      className={`
        flex justify-between text-sm transition-colors
        ${highlight ? 'bg-yellow-100 -mx-2 px-2 py-1 rounded' : ''}
        ${className}
      `}
    >
      <span className="text-[#2E1C10]/60">{label}</span>
      <span className={className || 'text-[#2E1C10]'}>
        {formatPrice(amount)}
      </span>
    </div>
  );
});

/**
 * 이전 값 추적 Hook
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


```

---

## src\components\app\CouponCard.tsx

```tsx
/**
 * 쿠폰 카드 컴포넌트
 */

import { Coupon, getCouponStatus, COUPON_TYPE_LABELS } from '../../types/coupon';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Ticket } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

interface CouponCardProps {
  coupon: Coupon;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (coupon: Coupon) => void;
}

export function CouponCard({ coupon, selectable, selected, onSelect }: CouponCardProps) {
  const status = getCouponStatus(coupon);
  const expiryDate = new Date(coupon.expiresAt);
  const daysLeft = Math.ceil((coupon.expiresAt - Date.now()) / (1000 * 60 * 60 * 24));

  const isAvailable = status === 'available';
  const isExpiringSoon = isAvailable && daysLeft <= 7;

  return (
    <Card
      className={`p-4 ${
        selectable
          ? isAvailable
            ? 'cursor-pointer hover:border-[#D61C1C] transition-colors'
            : 'opacity-50 cursor-not-allowed'
          : ''
      } ${selected ? 'border-[#D61C1C] border-2' : ''}`}
      onClick={() => {
        if (selectable && isAvailable && onSelect) {
          onSelect(coupon);
        }
      }}
    >
      <div className="flex gap-4">
        {/* 금액 */}
        <div className="flex-shrink-0 w-24 flex flex-col items-center justify-center bg-gradient-to-br from-[#D61C1C] to-[#F37021] rounded-lg text-white p-3">
          <Ticket className="w-6 h-6 mb-1" />
          <div className="text-xl">{formatPrice(coupon.amount).replace('원', '')}</div>
          <div className="text-xs opacity-90">원</div>
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-sm text-[#333]">{coupon.title}</h3>
            <Badge
              variant="outline"
              className={
                status === 'available'
                  ? isExpiringSoon
                    ? 'border-yellow-500 text-yellow-700'
                    : 'border-green-500 text-green-700'
                  : status === 'used'
                  ? 'border-gray-400 text-gray-600'
                  : 'border-red-500 text-red-700'
              }
            >
              {status === 'available'
                ? isExpiringSoon
                  ? `${daysLeft}일 남음`
                  : '사용가능'
                : status === 'used'
                ? '사용완료'
                : '만료됨'}
            </Badge>
          </div>

          <p className="text-xs text-[#8B7355] mb-2">{coupon.description}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatPrice(coupon.minSpend)} 이상 주문 시</span>
            <span>
              {expiryDate.getFullYear()}.{String(expiryDate.getMonth() + 1).padStart(2, '0')}.
              {String(expiryDate.getDate()).padStart(2, '0')}까지
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

```

---

## src\components\app\DeliveryFeeBreakdown.tsx

```tsx
/**
 * 배달비 상세 표시 컴포넌트
 * Phase D: 배달비 거리기반 UI - 구간표 시각화
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { MapPin, Moon, Info } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';

export interface FeeZone {
  range: string;
  fee: number;
  current: boolean;
}

export interface DeliveryFeeBreakdownProps {
  distance: number;
  zones: FeeZone[];
  nightSurcharge?: number;
  total: number;
  address?: string;
  isNightTime?: boolean;
}

export function DeliveryFeeBreakdown({
  distance,
  zones,
  nightSurcharge = 0,
  total,
  address,
  isNightTime = false,
}: DeliveryFeeBreakdownProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* 배달 주소 */}
      {address && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#2E1C10]/60 mb-1">배달 주소</p>
            <p className="text-sm text-[#2E1C10]">{address}</p>
          </div>
        </div>
      )}

      {/* 배달 거리 */}
      <div className="flex items-center justify-between p-3 bg-white border border-[#C7A45A]/20 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C7A45A]" />
          <span className="text-sm text-[#2E1C10]/80">배달 거리</span>
        </div>
        <span className="font-medium text-[#2E1C10]">
          {distance.toFixed(1)}km
        </span>
      </div>

      {/* 거리별 요금 구간표 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-sm font-medium text-[#2E1C10]">거리별 요금</h4>
          <Info className="w-3 h-3 text-[#2E1C10]/40" />
        </div>
        
        {zones.map((zone, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-all',
              zone.current
                ? 'bg-[#D61C1C]/10 border-2 border-[#D61C1C] shadow-sm'
                : 'bg-gray-50 border border-gray-200'
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-sm',
                  zone.current
                    ? 'font-medium text-[#D61C1C]'
                    : 'text-[#2E1C10]/60'
                )}
              >
                {zone.range}
              </span>
              {zone.current && (
                <Badge className="bg-[#D61C1C] text-white text-[10px] px-1.5 py-0">
                  현재
                </Badge>
              )}
            </div>
            <span
              className={cn(
                'font-medium',
                zone.current ? 'text-[#D61C1C] text-base' : 'text-[#2E1C10]/60'
              )}
            >
              {formatPrice(zone.fee)}
            </span>
          </div>
        ))}
      </div>

      {/* 야간 배달 추가 요금 */}
      {nightSurcharge > 0 && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-900">야간 배달 추가</span>
              {isNightTime && (
                <Badge className="bg-indigo-600 text-white text-[10px] px-1.5 py-0">
                  적용 중
                </Badge>
              )}
            </div>
            <span className="font-medium text-indigo-600">
              +{formatPrice(nightSurcharge)}
            </span>
          </div>
          <p className="text-xs text-indigo-600/70 mt-1">
            오후 9시 ~ 오전 6시
          </p>
        </div>
      )}

      <Separator />

      {/* 총 배달비 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D61C1C]/5 to-[#F37021]/5 rounded-xl">
        <span className="font-medium text-[#2E1C10]">총 배달비</span>
        <span className="text-xl font-bold text-[#D61C1C]">
          {formatPrice(total)}
        </span>
      </div>

      {/* 안내 문구 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            배달 거리는 직선 거리가 아닌 실제 도로 거리로 계산됩니다.
            날씨나 교통 상황에 따라 배달 시간이 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 거리 기반 요금 계산 유틸리티
 */
export function calculateDeliveryFee(
  distance: number,
  baseFees: { min: number; max: number; fee: number }[],
  nightSurcharge: number = 0,
  isNightTime: boolean = false
): { baseFee: number; nightFee: number; total: number } {
  // 거리에 맞는 구간 찾기
  const zone = baseFees.find(
    (z) => distance >= z.min && distance <= z.max
  );

  const baseFee = zone?.fee || 0;
  const nightFee = isNightTime ? nightSurcharge : 0;
  const total = baseFee + nightFee;

  return { baseFee, nightFee, total };
}

/**
 * 야간 시간대 체크 (21:00 ~ 06:00)
 */
export function isNightTimeNow(): boolean {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 6;
}

```

---

## src\components\app\InlineError.tsx

```tsx
/**
 * 인라인 에러 컴포넌트
 * Phase A: 쿠폰 적용 - 검증 오류 표시
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export type InlineErrorVariant = 'error' | 'warning' | 'info';

export interface InlineErrorProps {
  message: string;
  variant?: InlineErrorVariant;
  actionLabel?: string;
  onAction?: () => void;
}

export function InlineError({
  message,
  variant = 'error',
  actionLabel,
  onAction,
}: InlineErrorProps) {
  const config = getVariantConfig(variant);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-2 p-3 rounded-lg border
        ${config.bgColor} ${config.borderColor}
      `}
    >
      {/* 아이콘 */}
      <config.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />

      {/* 메시지 */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${config.textColor}`}>
          {message}
        </p>

        {/* 액션 버튼 (선택적) */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className={`
              mt-2 text-sm font-medium underline
              ${config.actionColor}
              hover:opacity-80 transition-opacity
            `}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Variant별 설정
 */
function getVariantConfig(variant: InlineErrorVariant) {
  switch (variant) {
    case 'error':
      return {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-500',
        textColor: 'text-red-900',
        actionColor: 'text-red-700',
      };
    case 'warning':
      return {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-500',
        textColor: 'text-yellow-900',
        actionColor: 'text-yellow-700',
      };
    case 'info':
      return {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-900',
        actionColor: 'text-blue-700',
      };
  }
}

```

---

## src\components\app\PaymentProgress.tsx

```tsx
/**
 * 결제 진행 상태 컴포넌트
 * Phase H: 결제 NICEPAY - 단계별 UI 시각화
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useState } from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

export type PaymentStatus = 
  | 'preparing'    // 결제 준비 중
  | 'redirecting'  // PG사 리다이렉트
  | 'processing'   // 결제 처리 중
  | 'success'      // 결제 성공
  | 'failed'       // 결제 실패
  | 'timeout'      // 시간 초과
  | 'cancelled';   // 사용자 취소

export interface PaymentProgressProps {
  status: PaymentStatus;
  message?: string;
  timeoutSeconds?: number;
  onRetry?: () => void;
  onCancel?: () => void;
  onContact?: () => void;
}

export function PaymentProgress({
  status,
  message,
  timeoutSeconds = 180, // 3분
  onRetry,
  onCancel,
  onContact,
}: PaymentProgressProps) {
  const [remainingTime, setRemainingTime] = useState(timeoutSeconds);
  const [progress, setProgress] = useState(0);

  // 타이머 (redirecting, processing 상태에서만)
  useEffect(() => {
    if (status !== 'redirecting' && status !== 'processing') {
      return;
    }

    setRemainingTime(timeoutSeconds);
    setProgress(0);

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });

      setProgress((prev) => {
        const newProgress = ((timeoutSeconds - remainingTime) / timeoutSeconds) * 100;
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, timeoutSeconds]);

  const config = getStatusConfig(status);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 space-y-6">
      {/* 아이콘 */}
      <div
        className={cn(
          'flex items-center justify-center w-20 h-20 rounded-full',
          config.iconBg
        )}
      >
        <config.icon className={cn('w-10 h-10', config.iconColor)} />
      </div>

      {/* 상태 메시지 */}
      <div className="text-center space-y-2">
        <h2 className={cn('text-xl font-medium', config.titleColor)}>
          {config.title}
        </h2>
        {message && (
          <p className="text-[#2E1C10]/60">{message}</p>
        )}
      </div>

      {/* 프로그레스 바 (진행 중 상태) */}
      {(status === 'redirecting' || status === 'processing') && (
        <div className="w-full max-w-sm space-y-3">
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-center gap-2 text-sm text-[#2E1C10]/60">
            <Clock className="w-4 h-4" />
            <span>
              남은 시간: {minutes}분 {seconds}초
            </span>
          </div>

          {remainingTime < 30 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-900 text-center">
                잠시만 기다려 주세요. 곧 완료됩니다.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {status === 'failed' && onRetry && (
          <Button
            onClick={onRetry}
            className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
          >
            다시 시도하기
          </Button>
        )}

        {status === 'timeout' && onRetry && (
          <Button
            onClick={onRetry}
            className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
          >
            처음부터 다시 시도
          </Button>
        )}

        {(status === 'failed' || status === 'timeout') && onContact && (
          <Button
            onClick={onContact}
            variant="outline"
            className="w-full"
          >
            고객센터 문의
          </Button>
        )}

        {(status === 'redirecting' || status === 'processing') && onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full"
          >
            결제 취소
          </Button>
        )}
      </div>

      {/* 망취소 안내 (실패 시) */}
      {status === 'failed' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h4 className="text-sm font-medium text-red-900 mb-2">
            결제가 실패했습니다
          </h4>
          <p className="text-xs text-red-800">
            카드사 승인이 거부되었거나 네트워크 오류가 발생했습니다.
            결제가 진행되었다면 자동으로 <strong>망취소</strong> 처리됩니다.
          </p>
          <p className="text-xs text-red-800 mt-2">
            • 승인 취소는 즉시 진행되나, 카드사 반영은 1~3일 소요될 수 있습니다.<br />
            • 결제가 완료되지 않았으니 안심하세요.
          </p>
        </div>
      )}

      {/* 시간 초과 안내 */}
      {status === 'timeout' && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
          <h4 className="text-sm font-medium text-yellow-900 mb-2">
            결제 시간이 초과되었습니다
          </h4>
          <p className="text-xs text-yellow-800">
            결제 처리 중 예상보다 시간이 오래 걸렸습니다.
            네트워크 상태를 확인한 후 다시 시도해 주세요.
          </p>
        </div>
      )}

      {/* 성공 시 자동 이동 안내 */}
      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
          <p className="text-xs text-green-800 text-center">
            잠시 후 주문 상세 페이지로 이동합니다...
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 상태별 설정
 */
function getStatusConfig(status: PaymentStatus) {
  switch (status) {
    case 'preparing':
      return {
        icon: Loader2,
        iconColor: 'text-[#C7A45A] animate-spin',
        iconBg: 'bg-[#C7A45A]/10',
        title: '결제 준비 중',
        titleColor: 'text-[#2E1C10]',
      };

    case 'redirecting':
      return {
        icon: Clock,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        title: 'PG사로 이동 중',
        titleColor: 'text-[#2E1C10]',
      };

    case 'processing':
      return {
        icon: Loader2,
        iconColor: 'text-[#D61C1C] animate-spin',
        iconBg: 'bg-[#D61C1C]/10',
        title: '결제 처리 중',
        titleColor: 'text-[#2E1C10]',
      };

    case 'success':
      return {
        icon: CheckCircle2,
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
        title: '결제 완료!',
        titleColor: 'text-green-900',
      };

    case 'failed':
      return {
        icon: XCircle,
        iconColor: 'text-red-600',
        iconBg: 'bg-red-100',
        title: '결제 실패',
        titleColor: 'text-red-900',
      };

    case 'timeout':
      return {
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        iconBg: 'bg-yellow-100',
        title: '시간 초과',
        titleColor: 'text-yellow-900',
      };

    case 'cancelled':
      return {
        icon: XCircle,
        iconColor: 'text-gray-600',
        iconBg: 'bg-gray-100',
        title: '결제 취소됨',
        titleColor: 'text-[#2E1C10]',
      };

    default:
      return {
        icon: Loader2,
        iconColor: 'text-[#2E1C10]/40',
        iconBg: 'bg-gray-100',
        title: '처리 중',
        titleColor: 'text-[#2E1C10]',
      };
  }
}

```

---

## src\components\app\UpsellCard.tsx

```tsx
/**
 * 업셀 카드 컴포넌트
 * Phase E: 최소 주문금액 미달 시 추천 메뉴 제안
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatPrice } from '../../lib/utils';
import type { Menu } from '../../types/menu';

export interface UpsellCardProps {
  menu: Menu;
  onAddToCart: (menu: Menu) => void;
  highlight?: boolean;
}

export const UpsellCard = memo(function UpsellCard({ 
  menu, 
  onAddToCart, 
  highlight = false 
}: UpsellCardProps) {

  return (
    <div
      className={`
        flex gap-3 p-3 bg-white rounded-lg border transition-all
        ${highlight 
          ? 'border-[#D61C1C] shadow-md ring-2 ring-[#D61C1C]/20' 
          : 'border-[#C7A45A]/20 hover:border-[#C7A45A]/40'
        }
      `}
    >
      {/* 메뉴 이미지 */}
      <div className="relative flex-shrink-0">
        <img
          src={menu.imageUrl || '/placeholder-menu.jpg'}
          alt={menu.name}
          className="w-16 h-16 rounded object-cover"
        />
        
        {menu.isPopular && (
          <Badge
            className="absolute -top-1 -right-1 bg-[#D61C1C] text-white text-[10px] px-1 py-0"
          >
            인기
          </Badge>
        )}
      </div>

      {/* 메뉴 정보 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#2E1C10] truncate">
          {menu.name}
        </h4>
        
        {menu.description && (
          <p className="text-xs text-[#2E1C10]/60 line-clamp-1 mt-0.5">
            {menu.description}
          </p>
        )}
        
        <p className="text-sm font-medium text-[#D61C1C] mt-1">
          {formatPrice(menu.price)}
        </p>
      </div>

      {/* 추가 버튼 */}
      <Button
        size="sm"
        onClick={() => onAddToCart(menu)}
        disabled={menu.soldOut}
        className="self-center flex-shrink-0 gap-1"
      >
        <Plus className="w-4 h-4" />
        담기
      </Button>
    </div>
  );
});

```

---

## src\components\app\UpsellSection.tsx

```tsx
/**
 * 업셀 섹션 컴포넌트
 * Phase E: 최소 주문금액 미달 시 추천 메뉴 제안 섹션
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo, useEffect, useState, useMemo } from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { UpsellCard } from './UpsellCard';
import { formatPrice } from '../../lib/utils';
import type { Menu } from '../../types/menu';

export interface UpsellSectionProps {
  missingAmount: number;
  allMenus: Menu[];
  onAddToCart: (menu: Menu) => void;
  maxRecommendations?: number;
}

export const UpsellSection = memo(function UpsellSection({
  missingAmount,
  allMenus,
  onAddToCart,
  maxRecommendations = 3,
}: UpsellSectionProps) {
  // useMemo를 사용하여 추천 메뉴 계산 최적화
  const recommendedMenus = useMemo(() => {
    return getRecommendedMenus(allMenus, missingAmount, maxRecommendations);
  }, [allMenus, missingAmount, maxRecommendations]);

  if (recommendedMenus.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-[#FFF9F0] to-[#FFF4E6] rounded-xl border border-[#F37021]/20">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-[#F37021] rounded-full">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-[#2E1C10]">
            이 메뉴는 어떠세요?
          </h3>
          <p className="text-xs text-[#2E1C10]/60">
            {formatPrice(missingAmount)} 더 담으면 주문할 수 있어요
          </p>
        </div>
      </div>

      {/* 추천 메뉴 리스트 */}
      <div className="space-y-2">
        {recommendedMenus.map((menu, index) => (
          <UpsellCard
            key={menu.id}
            menu={menu}
            onAddToCart={onAddToCart}
            highlight={index === 0}
          />
        ))}
      </div>

      {/* 안내 문구 */}
      <div className="mt-3 flex items-start gap-2 p-2 bg-white/50 rounded text-xs text-[#2E1C10]/60">
        <TrendingUp className="w-4 h-4 flex-shrink-0 text-[#F37021] mt-0.5" />
        <p>
          인기 메뉴와 최근 본 메뉴를 기준으로 추천해드려요
        </p>
      </div>
    </div>
  );
});

/**
 * 추천 메뉴 선정 로직
 */
function getRecommendedMenus(
  allMenus: Menu[],
  missingAmount: number,
  maxCount: number
): Menu[] {
  // 1. 조건 필터링
  const eligible = allMenus.filter((menu) => {
    return (
      !menu.soldOut &&                    // 품절 아님
      menu.available !== false &&         // 판매 가능
      menu.price <= missingAmount * 1.5   // 부족 금액의 1.5배 이하
    );
  });

  // 2. 우선순위 점수 계산
  const scored = eligible.map((menu) => {
    let score = 0;

    // 인기 메뉴 우대 (+100)
    if (menu.isPopular) score += 100;

    // 가격이 부족 금액에 가까울수록 높은 점수
    const priceFit = 1 - Math.abs(menu.price - missingAmount) / missingAmount;
    score += priceFit * 50;

    // 평점 반영 (+0~20)
    if (menu.rating) {
      score += (menu.rating / 5) * 20;
    }

    // 리뷰 수 반영 (+0~10)
    if (menu.reviewCount) {
      score += Math.min(menu.reviewCount / 10, 10);
    }

    return { menu, score };
  });

  // 3. 점수 내림차순 정렬 후 상위 N개 반환
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map((item) => item.menu);
}

```

---

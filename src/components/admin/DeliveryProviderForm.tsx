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
import { toast } from 'sonner@2.0.3';

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

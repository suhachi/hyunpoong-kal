/**
 * 결제 설정 탭 (NICEPAY / 토스페이먼츠)
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Separator } from '../../../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
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
import { toast } from 'sonner@2.0.3';
import { checkFunctionsHealth } from '../../../lib/admin/settingsCenter.api';
import type { FunctionsHealthCheck } from '../../../types/adminSettings';

type PaymentProvider = 'nicepay' | 'toss';

export function PaymentTab() {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('nicepay');
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

  const isNicePayConfigured = healthCheck?.nicepay.configured || false;
  const allNicePayFieldsSet = healthCheck?.nicepay.fields
    ? Object.values(healthCheck.nicepay.fields).every(v => v)
    : false;

  return (
    <div className="space-y-6">
      {/* 결제사 선택 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#D61C1C]" />
            <CardTitle>결제사 선택</CardTitle>
          </div>
          <CardDescription>
            사용할 결제 서비스 제공사를 선택하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedProvider} 
            onValueChange={(value) => setSelectedProvider(value as PaymentProvider)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* 나이스페이 */}
            <div
              className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                selectedProvider === 'nicepay'
                  ? 'border-[#D61C1C] bg-[#D61C1C]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProvider('nicepay')}
            >
              <RadioGroupItem value="nicepay" id="nicepay" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="nicepay" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#2E1C10]">나이스페이</span>
                    <Badge variant="outline" className="text-xs">전통적</Badge>
                  </div>
                  <p className="text-xs text-[#2E1C10]/60 mb-2">
                    1998년 설립, 안정적인 결제 서비스
                  </p>
                  <div className="space-y-1 text-xs text-[#2E1C10]/50">
                    <div>✓ 높은 시장 점유율</div>
                    <div>✓ 다양한 결제 수단</div>
                    <div>✓ 금융권 신뢰도 높음</div>
                  </div>
                </Label>
              </div>
              {isNicePayConfigured && selectedProvider === 'nicepay' && (
                <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-green-600" />
              )}
            </div>

            {/* 토스페이먼츠 */}
            <div
              className={`relative flex items-start space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                selectedProvider === 'toss'
                  ? 'border-[#D61C1C] bg-[#D61C1C]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedProvider('toss')}
            >
              <RadioGroupItem value="toss" id="toss" className="mt-1" />
              <div className="flex-1">
                <Label htmlFor="toss" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[#2E1C10]">토스페이먼츠</span>
                    <Badge className="bg-blue-600 text-xs">최신</Badge>
                  </div>
                  <p className="text-xs text-[#2E1C10]/60 mb-2">
                    2021년 설립, 현대적인 결제 API
                  </p>
                  <div className="space-y-1 text-xs text-[#2E1C10]/50">
                    <div>✓ 경쟁력 있는 수수료</div>
                    <div>✓ 빠른 정산 (D+1)</div>
                    <div>✓ 개발자 친화적 API</div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* 수수료 비교 */}
          <Alert className="mt-4">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="text-xs">
              <div className="font-medium mb-1">예상 수수료 (2024년 기준)</div>
              <div className="grid grid-cols-2 gap-2 text-[#2E1C10]/60">
                <div>• 나이스페이: 신용카드 3.3~3.5%</div>
                <div>• 토스페이먼츠: 신용카드 3.2%</div>
              </div>
              <div className="mt-2 text-[#2E1C10]/50">
                * 실제 수수료는 계약 협상에 따라 달라질 수 있습니다.
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* 나이스페이 설정 */}
      {selectedProvider === 'nicepay' && (
        <NicePaySettings
          healthCheck={healthCheck}
          loading={loading}
          checking={checking}
          onRecheck={loadHealthCheck}
          onCopyCommand={copyCommand}
        />
      )}

      {/* 토스페이먼츠 설정 */}
      {selectedProvider === 'toss' && (
        <TossPaymentsSettings
          onCopyCommand={copyCommand}
        />
      )}
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
  const isConfigured = healthCheck?.nicepay.configured || false;
  const allFieldsSet = healthCheck?.nicepay.fields
    ? Object.values(healthCheck.nicepay.fields).every(v => v)
    : false;

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
              
              {healthCheck && Object.entries(healthCheck.nicepay.fields).map(([key, value]) => (
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

// 토스페이먼츠 설정 컴포넌트
function TossPaymentsSettings({ 
  onCopyCommand 
}: {
  onCopyCommand: (cmd: string) => void;
}) {
  const tossCommand = `firebase functions:config:set \\
  toss.mode="production" \\
  toss.client_key="live_ck_YOUR_CLIENT_KEY" \\
  toss.secret_key="live_sk_YOUR_SECRET_KEY"`;

  const getCheckCommand = `firebase functions:config:get toss`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 좌측: 상태 패널 */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">토스페이먼츠 상태</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription className="text-xs">
                토스페이먼츠 설정은 Firebase Functions Config에 저장됩니다.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* 우측: 설정/가이드 */}
      <div className="lg:col-span-2 space-y-6">
        {/* 1. CLI 설정 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-600" />
              <CardTitle>CLI 설정 (서버)</CardTitle>
            </div>
            <CardDescription>
              Firebase Functions Config에 토스페이먼츠 키를 설정합니다
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
                  onClick={() => onCopyCommand(tossCommand)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-4 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
                <code className="text-xs text-[#2E1C10]/80 whitespace-pre">
                  {tossCommand}
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

        {/* 2. 토스페이먼츠 가이드 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <CardTitle>토스페이먼츠 가이드</CardTitle>
            </div>
            <CardDescription>
              토스페이먼츠 개발자 센터에서 필요한 정보를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API 키 발급 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                1. API 키 발급
              </h4>
              <p className="text-xs text-[#2E1C10]/60">
                토스페이먼츠 개발자 센터에서 Client Key와 Secret Key를 발급받으세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://developers.tosspayments.com/', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                토스페이먼츠 개발자 센터
              </Button>
            </div>

            <Separator />

            {/* 테스트 키 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                2. 테스트 모드
              </h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                개발 시에는 테스트 키를 사용하세요:
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-[#2E1C10]/60">Client Key:</span>
                  <code className="flex-1 text-blue-800">
                    test_ck_...
                  </code>
                </div>
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                  <span className="text-[#2E1C10]/60">Secret Key:</span>
                  <code className="flex-1 text-blue-800">
                    test_sk_...
                  </code>
                </div>
              </div>
            </div>

            <Separator />

            {/* 테스트 카드 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                3. 테스트 카드 정보
              </h4>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                <div className="font-medium text-yellow-900 mb-2">테스트용 카드번호</div>
                <div className="space-y-1 text-yellow-800">
                  <div>• 카드번호: 5570********1234</div>
                  <div>• 유효기간: 12/28</div>
                  <div>• CVC: 123</div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://docs.tosspayments.com/reference/test-card', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                테스트 카드 정보 보기
              </Button>
            </div>

            <Separator />

            {/* 장점 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                4. 토스페이먼츠 장점
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="font-medium text-green-900">수수료</div>
                  <div className="text-green-700">3.2% (고정)</div>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="font-medium text-green-900">정산</div>
                  <div className="text-green-700">D+1 (빠름)</div>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="font-medium text-green-900">API</div>
                  <div className="text-green-700">RESTful</div>
                </div>
                <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                  <div className="font-medium text-green-900">문서</div>
                  <div className="text-green-700">매우 우수</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. 문서 링크 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">참고 문서</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open('/PAYMENT-PROVIDER-선택-시스템-가이드.md', '_blank')}
            >
              <FileText className="w-4 h-4 mr-2" />
              결제사 선택 시스템 가이드
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => window.open('/결제사-선택-시스템-요약.md', '_blank')}
            >
              <FileText className="w-4 h-4 mr-2" />
              결제사 선택 빠른 요약
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

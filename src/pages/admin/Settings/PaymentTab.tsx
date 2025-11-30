/**
 * 결제 설정 탭 (NICEPAY)
 * KS컴퍼니 (사업자번호: 553-17-00098)
 *
 * 주의: 현재 실제 결제 연동은 Phase 3 이후로 보류
 */

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Separator } from "../../../components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
  Terminal,
  FileText,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { checkFunctionsHealth } from "../../../lib/admin/settingsCenter.api";
import type { FunctionsHealthCheck } from "../../../types/adminSettings";

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
      console.error("Health check failed:", error);
      toast.error("상태 확인에 실패했습니다");
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
    toast.success("명령어가 복사되었습니다");
  };

  return (
    <div data-testid="admin-settings-payment-tab" className="space-y-6">
      {/* 결제 연동 상태 안내 */}
      <Alert>
        <AlertCircle className="w-4 h-4" />
        <AlertDescription>
          <div className="font-medium mb-1">현재 결제 연동 상태</div>
          <div className="text-sm text-[#2E1C10]/70">
            • 현재 이 프로젝트는 <strong>테스트 결제 및 가상 결제</strong>만 지원합니다.
            <br />• 실제 PG(결제대행) 연동은 <strong>Phase 3 이후</strong>로 보류되었습니다.
            <br />• 향후 PG사 선정 시 별도 T코드로 연동 작업이 진행됩니다.
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
                • 현재 설정은 Mock 모드 테스트용입니다.
                <br />
                • 실제 결제 승인/취소는 동작하지 않습니다.
                <br />• Phase 2 이후 Firebase Functions와 연동하여 테스트 결제가 가능해집니다.
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
  onCopyCommand,
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

              {healthCheck?.nicepay?.fields &&
                Object.entries(healthCheck.nicepay.fields).map(([key, value]) => (
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
              {checking ? "확인 중..." : "상태 재확인"}
            </Button>
          </CardContent>
        </Card>

        {/* 안내 */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription className="text-xs">
            NICEPAY 설정은 Firebase Functions에만 저장됩니다. 프론트엔드에는 노출되지 않습니다.
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
                <span className="text-sm font-medium text-[#2E1C10]">1. 설정 명령어</span>
                <Button variant="outline" size="sm" onClick={() => onCopyCommand(nicepayCommand)}>
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-4 bg-[#2E1C10]/5 rounded-lg overflow-x-auto">
                <code className="text-xs text-[#2E1C10]/80 whitespace-pre">{nicepayCommand}</code>
              </pre>
            </div>

            <Separator />

            {/* 확인 명령어 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#2E1C10]">2. 설정 확인</span>
                <Button variant="outline" size="sm" onClick={() => onCopyCommand(getCheckCommand)}>
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
              </div>
              <pre className="p-4 bg-[#2E1C10]/5 rounded-lg">
                <code className="text-xs text-[#2E1C10]/80">{getCheckCommand}</code>
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
            <CardDescription>NICEPAY 개발자 센터에서 필요한 정보를 확인하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* MID/KEY 발급 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">1. MID/KEY 발급</h4>
              <p className="text-xs text-[#2E1C10]/60">
                NICEPAY 개발자 센터에서 가맹점 ID(MID)와 Key를 발급받으세요.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("https://npg.nicepay.co.kr", "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                NICEPAY 개발자 센터
              </Button>
            </div>

            <Separator />

            {/* Return/Cancel URL */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">2. Return/Cancel URL 등록</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                NICEPAY 관리자 페이지에서 아래 URL을 등록하세요:
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-[#2E1C10]/60">Return URL:</span>
                  <code className="flex-1 text-[#2E1C10]">https://hp-kal.web.app/pay/return</code>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-[#2E1C10]/60">Cancel URL:</span>
                  <code className="flex-1 text-[#2E1C10]">https://hp-kal.web.app/pay/cancel</code>
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

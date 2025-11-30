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
      
      // 전체 상태에 따라 다른 메시지 표시
      if (result.overall === 'pass') {
        toast.success('모든 FCM 설정이 정상입니다');
      } else if (result.overall === 'info') {
        // 미설정 상태는 정보 메시지로 표시
        toast.info('FCM 설정이 필요합니다. 아래 가이드를 참고하여 설정해주세요');
      } else if (result.overall === 'warning') {
        toast.warning('일부 설정을 확인해주세요');
      } else {
        // 실제 오류만 에러 메시지 표시
        const hasActualError = result.checks.some(
          check => check.status === 'fail' && check.name !== 'VAPID 키'
        );
        if (hasActualError) {
          toast.error('FCM 설정에 문제가 있습니다');
        } else {
          // VAPID 키만 미설정인 경우는 정보 메시지
          toast.info('FCM 설정이 필요합니다. 아래 가이드를 참고하여 설정해주세요');
        }
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

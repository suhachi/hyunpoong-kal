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
    if (!settings || !settings.points) return;
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
      console.error('Failed to toggle points:', e);
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
            {settings && settings.points ? (
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

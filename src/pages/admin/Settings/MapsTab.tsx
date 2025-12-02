/**
 * 지도/지오코딩 설정 탭
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

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
import { CheckCircle2, XCircle, AlertCircle, Download, Map as MapIcon } from "lucide-react";
import { toast } from "sonner";
import { getEnv } from "../../../config/env";

export function MapsTab() {
  // 환경 변수 확인 (Figma Make 호환)
  const kakaoKey = getEnv("VITE_KAKAO_MAP_KEY");
  const googleKey = getEnv("VITE_GOOGLE_MAPS_API_KEY");

  // .env 템플릿 생성
  const generateEnvTemplate = () => {
    const template = `# 지도/지오코딩 API 키
# Kakao Maps (https://developers.kakao.com)
VITE_KAKAO_MAP_KEY=${kakaoKey || "YOUR_KAKAO_REST_API_KEY"}

# Google Maps (https://console.cloud.google.com)
VITE_GOOGLE_MAPS_API_KEY=${googleKey || "YOUR_GOOGLE_MAPS_API_KEY"}
`;

    const blob = new Blob([template], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env.maps.template";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(".env 템플릿을 다운로드했습니다");
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
            <strong>🔐 보안 및 복제 편의를 위해</strong> 지도 API 키는 화면에서 직접 입력하지 않고
            <br />
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 파일과 복사
            스크립트로만 관리합니다.
            <br />
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
            <CardDescription>Kakao 지도 및 지오코딩 서비스</CardDescription>
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
                onClick={() => window.open("https://developers.kakao.com/console/app", "_blank")}
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
                  {typeof window !== "undefined"
                    ? window.location.origin
                    : "https://hyun-poong.web.app"}
                </code>
                <code className="block p-2 bg-gray-50 rounded">https://{"{배포 도메인}"}</code>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                3. 프로젝트 루트의{" "}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 파일에
                아래와 같이 추가
              </h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                이 화면에서는 API 키를 직접 저장하지 않습니다. 아래 환경변수에만 키를 넣어야 합니다.
              </p>
              <code className="block p-3 bg-gray-50 rounded text-xs font-mono">
                VITE_KAKAO_MAP_KEY=발급받은_JAVASCRIPT_KEY
              </code>
              <p className="text-xs text-[#2E1C10]/60 mt-2">
                저장 후{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  npm run build && firebase deploy
                </code>{" "}
                로 다시 배포하세요.
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
            <CardDescription>Google 지도 및 지오코딩 서비스</CardDescription>
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
                onClick={() =>
                  window.open("https://console.cloud.google.com/google/maps-apis", "_blank")
                }
              >
                Google Cloud Console
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">2. API 활성화</h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">다음 API를 활성화하세요:</p>
              <ul className="text-xs text-[#2E1C10]/70 space-y-1 list-disc list-inside">
                <li>Maps JavaScript API</li>
                <li>Geocoding API</li>
                <li>Places API (선택)</li>
              </ul>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[#2E1C10]">
                3. 프로젝트 루트의{" "}
                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">.env.local</code> 파일에
                아래와 같이 추가
              </h4>
              <p className="text-xs text-[#2E1C10]/60 mb-2">
                이 화면에서는 API 키를 직접 저장하지 않습니다. 아래 환경변수에만 키를 넣어야 합니다.
              </p>
              <code className="block p-3 bg-gray-50 rounded text-xs font-mono">
                VITE_GOOGLE_MAPS_API_KEY=발급받은_BROWSER_KEY
              </code>
              <p className="text-xs text-[#2E1C10]/60 mt-2">
                저장 후{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  npm run build && firebase deploy
                </code>{" "}
                로 다시 배포하세요.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* .env 템플릿 다운로드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">.env 템플릿</CardTitle>
            <CardDescription>지도 API 키 설정을 위한 템플릿 파일</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generateEnvTemplate} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              .env 템플릿 다운로드
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

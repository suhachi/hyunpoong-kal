import React, { useMemo } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";

export const InstallGuide: React.FC = () => {
  const navigate = useNavigate();

  // 현재 호스팅된 origin 기반 URL (프리뷰/프로덕션 모두 대응)
  const appUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://hyun-poong.web.app";
    return window.location.origin;
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-[#F9F6F3] to-[#C7A45A]/10">
      <Card className="w-full max-w-md p-6 flex flex-col items-center gap-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#8B4513]">현풍닭칼국수 모바일 앱 설치</h1>
          <p className="text-sm text-muted-foreground">
            아래 QR 코드를 휴대폰으로 스캔하면 앱 웹페이지가 열립니다.
            <br />
            브라우저에서 페이지가 열린 후, 아래 안내에 따라 홈 화면에 추가해 주세요.
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <QRCodeCanvas value={appUrl} size={200} includeMargin />
        </div>

        <div className="w-full text-sm space-y-3">
          <div>
            <h2 className="font-semibold mb-1 text-[#8B4513]">1. QR 코드 스캔</h2>
            <p className="text-muted-foreground">
              휴대폰 카메라 또는 QR 스캐너 앱으로 위 QR 코드를 스캔하면
              <span className="font-mono break-all text-xs block mt-1">{appUrl}</span>로 접속합니다.
            </p>
          </div>
          <div>
            <h2 className="font-semibold mb-1 text-[#8B4513]">2. 홈 화면에 추가</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Android/Chrome: 메뉴(⋮) → "홈 화면에 추가" 선택</li>
              <li>iPhone/Safari: 공유 버튼 → "홈 화면에 추가" 선택</li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-1 text-[#8B4513]">3. 앱처럼 사용</h2>
            <p className="text-muted-foreground">
              홈 화면 아이콘을 통해 바로 접속하면, 일반 앱처럼 실행할 수 있습니다.
            </p>
          </div>
        </div>

        <Button className="w-full mt-2" onClick={handleGoHome}>
          홈으로 돌아가기
        </Button>
      </Card>
    </div>
  );
};

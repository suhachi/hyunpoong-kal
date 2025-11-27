/**
 * 404 Not Found 페이지
 * 존재하지 않는 경로 접근 시 표시
 */

import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-[#D61C1C]">404</h1>
          <h2 className="text-2xl text-[#2E1C10]">페이지를 찾을 수 없습니다</h2>
          <p className="text-[#2E1C10]/60">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-[#D61C1C] hover:bg-[#D61C1C]/90"
          >
            <Home className="w-4 h-4 mr-2" />
            홈으로 이동
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-[#2E1C10]/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전 페이지
          </Button>
        </div>
      </div>
    </div>
  );
}


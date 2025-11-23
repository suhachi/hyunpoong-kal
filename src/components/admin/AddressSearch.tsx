/**
 * 주소 검색 컴포넌트 (카카오맵 Geocoding API 사용)
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { KAKAO_MAP_APP_KEY } from '../../config/env';

type AddressSearchProps = {
  value: string;
  onChange: (address: string) => void;
  onLocationFound: (lat: number, lng: number, fullAddress: string) => void;
  placeholder?: string;
  className?: string;
};

export function AddressSearch({
  value,
  onChange,
  onLocationFound,
  placeholder = '주소를 입력하세요',
  className = '',
}: AddressSearchProps) {
  const [searching, setSearching] = useState(false);
  const [searchSuccess, setSearchSuccess] = useState(false);

  const handleSearch = async () => {
    if (!value.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }

    if (!KAKAO_MAP_APP_KEY) {
      toast.error('카카오맵 API 키가 설정되지 않았습니다');
      return;
    }

    setSearching(true);
    setSearchSuccess(false);

    try {
      // 카카오맵 Geocoding API 호출
      // REST API 키 사용 (JavaScript 키와 다를 수 있음)
      const restApiKey = KAKAO_MAP_APP_KEY; // 동일한 키 사용 (필요시 별도 환경 변수로 분리 가능)
      
      // 헤더를 명시적으로 Headers 객체로 생성하여 인코딩 문제 방지
      const headers = new Headers();
      headers.append('Authorization', `KakaoAK ${restApiKey}`);
      
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(value)}`,
        {
          method: 'GET',
          headers: headers,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.documents || data.documents.length === 0) {
        toast.error('주소를 찾을 수 없습니다');
        setSearching(false);
        return;
      }

      // 첫 번째 결과 사용
      const result = data.documents[0];
      const lat = parseFloat(result.y);
      const lng = parseFloat(result.x);
      const fullAddress = result.address_name || value;

      // 좌표와 주소 전달
      onLocationFound(lat, lng, fullAddress);
      
      // 주소 업데이트
      onChange(fullAddress);

      // 성공 알림
      setSearchSuccess(true);
      toast.success('주소를 찾았습니다');

      // 3초 후 성공 표시 제거
      setTimeout(() => {
        setSearchSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('[AddressSearch] Failed to search address:', error);
      toast.error('주소 검색에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setSearchSuccess(false);
            }}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="bg-gray-50 pr-10"
          />
          {searchSuccess && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
          )}
        </div>
        <Button
          onClick={handleSearch}
          disabled={searching || !value.trim()}
          className="bg-[#D61C1C] hover:bg-[#B81515]"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>
      {searchSuccess && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          주소를 찾았습니다
        </p>
      )}
    </div>
  );
}

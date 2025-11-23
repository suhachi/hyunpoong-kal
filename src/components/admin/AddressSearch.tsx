/**
 * 주소 검색 컴포넌트 (카카오맵 주소 검색 API 사용)
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, Loader2 } from 'lucide-react';
import { loadGoogleMaps } from '../../lib/googleMaps';
import { loadKakaoMaps } from '../../lib/kakaoMaps';
import { toast } from 'sonner';

type AddressSearchProps = {
  value: string;
  onChange: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
};

export function AddressSearch({
  value,
  onChange,
  placeholder = '주소를 검색하세요 (예: 대구광역시 달성군 현풍면)',
}: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [searching, setSearching] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);
  const [mapProvider, setMapProvider] = useState<'google' | 'kakao' | null>(null);

  // value 변경 시 searchQuery 동기화
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // 지도 API 로드 확인 (구글맵 우선)
  useEffect(() => {
    loadGoogleMaps()
      .then(() => {
        setMapsReady(true);
        setMapProvider('google');
      })
      .catch(() => {
        // 구글맵 실패 시 카카오맵 시도
        return loadKakaoMaps();
      })
      .then((kakao) => {
        if (kakao) {
          setMapsReady(true);
          setMapProvider('kakao');
        }
      })
      .catch(() => {
        // 키가 없어도 주소 입력은 가능하도록
        setMapsReady(false);
      });
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }

    if (!kakaoReady) {
      // 카카오맵 키가 없으면 주소만 저장
      onChange(searchQuery.trim());
      return;
    }

    setSearching(true);
    try {
      const geocoder = new window.kakao.maps.services.Geocoder();
      
      geocoder.addressSearch(searchQuery.trim(), (result: any[], status: any) => {
        setSearching(false);
        
        if (status === window.kakao.maps.services.Status.OK) {
          if (result.length > 0) {
            const firstResult = result[0];
            const lat = parseFloat(firstResult.y);
            const lng = parseFloat(firstResult.x);
            const address = firstResult.address_name;
            
            onChange(address, lat, lng);
            toast.success('주소를 찾았습니다');
          } else {
            toast.error('주소를 찾을 수 없습니다');
            onChange(searchQuery.trim()); // 주소만 저장
          }
        } else {
          toast.error('주소 검색에 실패했습니다');
          onChange(searchQuery.trim()); // 주소만 저장
        }
      });
    } catch (error) {
      console.error('[AddressSearch] Search failed:', error);
      setSearching(false);
      toast.error('주소 검색 중 오류가 발생했습니다');
      onChange(searchQuery.trim()); // 주소만 저장
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="bg-gray-50 flex-1"
          disabled={searching}
        />
        <Button
          type="button"
          onClick={handleSearch}
          disabled={searching || !searchQuery.trim()}
          className="bg-[#D61C1C] hover:bg-[#B81515]"
        >
          {searching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>
      {!mapsReady && (
        <p className="text-xs text-[#8B7355]">
          주소 검색 기능을 사용하려면 구글맵 또는 카카오맵 키가 필요합니다. 주소를 직접 입력할 수 있습니다.
        </p>
      )}
    </div>
  );
}


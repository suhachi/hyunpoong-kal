/**
 * 가게 위치 선택 컴포넌트 (관리자용)
 * 지도에서 클릭하여 가게 위치를 선택할 수 있습니다.
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useRef, useState } from 'react';
import { loadKakaoMaps } from '../../lib/kakaoMaps';
import { MapPin } from 'lucide-react';

type StoreLocationPickerProps = {
  lat?: number | null;
  lng?: number | null;
  addressText?: string;
  onChange: (value: { lat: number; lng: number }) => void;
};

export function StoreLocationPicker({
  lat,
  lng,
  addressText,
  onChange,
}: StoreLocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 지도 초기 로드 및 lat/lng 변경 시 업데이트
  useEffect(() => {
    let isMounted = true;
    let clickListener: any = null;

    // lat/lng가 없으면 지도 로드하지 않음
    if (lat == null || lng == null) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    loadKakaoMaps()
      .then((kakao) => {
        if (!isMounted || !containerRef.current) return;

        const center = new kakao.maps.LatLng(lat, lng);

        // 지도가 이미 생성되어 있으면 중심만 이동
        if (mapRef.current) {
          mapRef.current.setCenter(center);
          if (markerRef.current) {
            markerRef.current.setPosition(center);
          }
          setLoading(false);
          return;
        }

        // 지도 생성
        const map = new kakao.maps.Map(containerRef.current, {
          center,
          level: 3,
        });

        mapRef.current = map;

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: center,
          map,
        });

        markerRef.current = marker;

        // 지도 클릭 이벤트
        clickListener = kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
          const clickedLatLng = mouseEvent.latLng;
          marker.setPosition(clickedLatLng);
          
          onChange({
            lat: clickedLatLng.getLat(),
            lng: clickedLatLng.getLng(),
          });
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error('[StoreLocationPicker] Failed to load map', err);
        setError('지도를 불러오지 못했습니다.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (clickListener && window.kakao && window.kakao.maps) {
        window.kakao.maps.event.removeListener(clickListener);
      }
    };
  }, [lat, lng, onChange]); // lat/lng 변경 시 재로드


  return (
    <div className="space-y-2">
      {addressText && (
        <p className="text-xs text-[#8B7355] mb-2">
          <MapPin className="w-3 h-3 inline mr-1" />
          주소: {addressText}
        </p>
      )}
      
      {loading && !error && (
        <div 
          className="flex items-center justify-center border rounded-md bg-gray-50"
          style={{ 
            minHeight: '400px',
            height: '400px',
            width: '100%'
          }}
        >
          <p className="text-sm text-[#8B7355]">지도를 불러오는 중입니다...</p>
        </div>
      )}

      {error && (
        <div 
          className="flex items-center justify-center border rounded-md bg-red-50"
          style={{ 
            minHeight: '400px',
            height: '400px',
            width: '100%'
          }}
        >
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && lat != null && lng != null && (
        <>
          <p className="text-xs text-[#8B7355] mb-2">
            지도를 클릭해서 가게 위치를 선택하세요.
          </p>
          <div
            ref={containerRef}
            className="w-full rounded-md border border-[#E5DDD5] overflow-hidden"
            style={{ 
              minHeight: '400px',
              height: '400px',
              width: '100%'
            }}
          />
        </>
      )}

      {!loading && !error && (lat == null || lng == null) && (
        <div className="flex items-center justify-center py-8 border rounded-md bg-gray-50">
          <p className="text-sm text-[#8B7355]">
            주소를 검색하면 지도가 표시됩니다.
          </p>
        </div>
      )}
    </div>
  );
}


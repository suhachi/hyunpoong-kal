/**
 * 가게 위치 지도 표시 컴포넌트 (읽기 전용)
 * 고객 앱에서 가게 위치를 지도로 표시합니다.
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../lib/googleMaps';
import { loadKakaoMaps } from '../../lib/kakaoMaps';

type StoreLocationMapProps = {
  lat?: number | null;
  lng?: number | null;
  height?: number;
};

export function StoreLocationMap({ lat, lng, height = 220 }: StoreLocationMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lng) return;

    let isMounted = true;
    let map: any = null;
    setLoading(true);
    setError(null);

    // 구글맵 우선 시도
    loadGoogleMaps()
      .then((google) => {
        if (!isMounted || !containerRef.current) return;

        const center = new google.maps.LatLng(lat, lng);

        // 지도 생성
        map = new google.maps.Map(containerRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
        });

        mapRef.current = map;

        // 마커 생성
        const marker = new google.maps.Marker({
          position: center,
          map,
        });

        markerRef.current = marker;
        setLoading(false);
      })
      .catch(() => {
        // 구글맵 실패 시 카카오맵 시도
        console.log('[StoreLocationMap] Google Maps failed, trying Kakao Maps');
        return loadKakaoMaps();
      })
      .then((mapsLib) => {
        if (!isMounted || !containerRef.current || map) return; // 이미 구글맵이 로드되었으면 스킵

        if (!mapsLib) return;

        // 카카오맵 사용
        const kakao = mapsLib as any;
        const center = new kakao.maps.LatLng(lat, lng);

        map = new kakao.maps.Map(containerRef.current, {
          center,
          level: 3,
        });

        mapRef.current = map;

        const marker = new kakao.maps.Marker({
          position: center,
          map,
        });

        markerRef.current = marker;
        setLoading(false);
      })
      .catch((err) => {
        console.error('[StoreLocationMap] Failed to load map', err);
        setError('지도를 불러오지 못했습니다.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [lat, lng]);

  // 좌표가 없는 경우
  if (!lat || !lng) {
    return (
      <div className="flex items-center justify-center py-6 border border-[#E5DDD5] rounded-md bg-[#F9F6F3]/50">
        <p className="text-sm text-[#8B7355]">
          지도 정보가 아직 등록되지 않았습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {loading && (
        <div className="flex items-center justify-center py-6 border border-[#E5DDD5] rounded-md bg-gray-50">
          <p className="text-sm text-[#8B7355]">지도를 불러오는 중입니다...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-6 border border-red-200 rounded-md bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div
          ref={containerRef}
          className="w-full rounded-md border border-[#E5DDD5] overflow-hidden"
          style={{ minHeight: height }}
        />
      )}
    </div>
  );
}


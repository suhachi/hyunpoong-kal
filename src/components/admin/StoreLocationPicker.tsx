/**
 * 가게 위치 선택 컴포넌트 (관리자용)
 * 지도에서 클릭하여 가게 위치를 선택할 수 있습니다.
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useRef, useState } from 'react';
import { loadPrimaryMap, loadSecondaryMap } from '../../lib/maps';
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

  useEffect(() => {
    let isMounted = true;
    let map: any = null;
    let marker: any = null;

    // 기본 지도 우선 시도
    loadPrimaryMap()
      .then((mapsLib) => {
        if (!isMounted || !containerRef.current) return;

        const isGoogle = window.google && window.google.maps;
        const isKakao = window.kakao && window.kakao.maps;

        // 기본 좌표: 서울 시청 (37.5665, 126.9780)
        const defaultLat = 37.5665;
        const defaultLng = 126.9780;

        if (isGoogle) {
          // 구글맵 사용
          const google = mapsLib as any;
          const center = new google.maps.LatLng(
            lat ?? defaultLat,
            lng ?? defaultLng
          );

          map = new google.maps.Map(containerRef.current, {
            center,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
          });

          mapRef.current = map;

          marker = new google.maps.Marker({
            position: center,
            map,
            draggable: true,
          });

          markerRef.current = marker;

          map.addListener('click', (event: any) => {
            const clickedLatLng = event.latLng;
            marker.setPosition(clickedLatLng);
            
            onChange({
              lat: clickedLatLng.lat(),
              lng: clickedLatLng.lng(),
            });
          });

          marker.addListener('dragend', () => {
            const position = marker.getPosition();
            onChange({
              lat: position.lat(),
              lng: position.lng(),
            });
          });
        } else if (isKakao) {
          // 카카오맵 사용
          const kakao = mapsLib as any;
          const center = new kakao.maps.LatLng(
            lat ?? defaultLat,
            lng ?? defaultLng
          );

          map = new kakao.maps.Map(containerRef.current, {
            center,
            level: 3,
          });

          mapRef.current = map;

          marker = new kakao.maps.Marker({
            position: center,
            map,
          });

          markerRef.current = marker;

          kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
            const clickedLatLng = mouseEvent.latLng;
            marker.setPosition(clickedLatLng);
            
            onChange({
              lat: clickedLatLng.getLat(),
              lng: clickedLatLng.getLng(),
            });
          });
        }

        setLoading(false);
      })
      .catch(() => {
        // 기본 지도 실패 시 보조 지도 시도
        console.log('[StoreLocationPicker] Primary map failed, trying secondary map');
        return loadSecondaryMap();
      })
      .then((mapsLib) => {
        if (!isMounted || !containerRef.current || map) return; // 이미 지도가 로드되었으면 스킵

        if (!mapsLib) return;

        const isGoogle = window.google && window.google.maps;
        const isKakao = window.kakao && window.kakao.maps;

        const defaultLat = 37.5665;
        const defaultLng = 126.9780;

        if (isGoogle) {
          const google = mapsLib as any;
          const center = new google.maps.LatLng(
            lat ?? defaultLat,
            lng ?? defaultLng
          );

          map = new google.maps.Map(containerRef.current, {
            center,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
          });

          mapRef.current = map;

          marker = new google.maps.Marker({
            position: center,
            map,
            draggable: true,
          });

          markerRef.current = marker;

          map.addListener('click', (event: any) => {
            const clickedLatLng = event.latLng;
            marker.setPosition(clickedLatLng);
            
            onChange({
              lat: clickedLatLng.lat(),
              lng: clickedLatLng.lng(),
            });
          });

          marker.addListener('dragend', () => {
            const position = marker.getPosition();
            onChange({
              lat: position.lat(),
              lng: position.lng(),
            });
          });
        } else if (isKakao) {
          const kakao = mapsLib as any;
          const center = new kakao.maps.LatLng(
            lat ?? defaultLat,
            lng ?? defaultLng
          );

          map = new kakao.maps.Map(containerRef.current, {
            center,
            level: 3,
          });

          mapRef.current = map;

          marker = new kakao.maps.Marker({
            position: center,
            map,
          });

          markerRef.current = marker;

          kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
            const clickedLatLng = mouseEvent.latLng;
            marker.setPosition(clickedLatLng);
            
            onChange({
              lat: clickedLatLng.getLat(),
              lng: clickedLatLng.getLng(),
            });
          });
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('[StoreLocationPicker] Failed to load map', err);
        setError('지도를 불러오지 못했습니다.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []); // 초기 로드만

  // lat/lng 변경 시 마커 위치 업데이트
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (lat == null || lng == null) return;

    // 구글맵인지 카카오맵인지 확인
    if (window.google && window.google.maps) {
      const position = new window.google.maps.LatLng(lat, lng);
      markerRef.current.setPosition(position);
      mapRef.current.setCenter(position);
    } else if (window.kakao && window.kakao.maps) {
      const position = new window.kakao.maps.LatLng(lat, lng);
      markerRef.current.setPosition(position);
      mapRef.current.setCenter(position);
    }
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      {addressText && (
        <p className="text-xs text-[#8B7355] mb-2">
          <MapPin className="w-3 h-3 inline mr-1" />
          주소: {addressText}
        </p>
      )}
      
      {loading && !error && (
        <div className="flex items-center justify-center py-8 border rounded-md bg-gray-50">
          <p className="text-sm text-[#8B7355]">지도를 불러오는 중입니다...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-8 border rounded-md bg-red-50">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-xs text-[#8B7355] mb-2">
            지도를 클릭해서 가게 위치를 선택하세요.
          </p>
          <div
            ref={containerRef}
            className="w-full rounded-md border border-[#E5DDD5] overflow-hidden"
            style={{ minHeight: 280 }}
          />
        </>
      )}
    </div>
  );
}


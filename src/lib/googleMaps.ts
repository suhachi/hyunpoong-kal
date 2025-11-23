/**
 * Google Maps JavaScript API 로더
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { GOOGLE_MAP_API_KEY } from '../config/env';

declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

let googleMapsPromise: Promise<typeof window.google> | null = null;

/**
 * Google Maps JavaScript API를 로드합니다.
 * 이미 로드된 경우 기존 Promise를 반환합니다.
 */
export function loadGoogleMaps(): Promise<typeof window.google> {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    if (!GOOGLE_MAP_API_KEY) {
      console.warn('[loadGoogleMaps] Missing GOOGLE_MAP_API_KEY - 지도 기능을 사용할 수 없습니다');
      reject(new Error('Google Map API key is not configured'));
      return;
    }

    // 이미 로드된 경우
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }

    // 콜백 함수 설정
    window.initGoogleMaps = () => {
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps object not found on window'));
      }
    };

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;

    script.onerror = (err) => {
      console.error('[loadGoogleMaps] Failed to load script', err);
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

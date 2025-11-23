/**
 * Kakao Map JS SDK 로더
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { KAKAO_MAP_APP_KEY } from '../config/env';

declare global {
  interface Window {
    kakao?: any;
  }
}

let kakaoMapsPromise: Promise<typeof window.kakao> | null = null;

/**
 * Kakao Maps SDK를 로드합니다.
 * 이미 로드된 경우 기존 Promise를 반환합니다.
 */
export function loadKakaoMaps(): Promise<typeof window.kakao> {
  if (kakaoMapsPromise) {
    return kakaoMapsPromise;
  }

  kakaoMapsPromise = new Promise((resolve, reject) => {
    if (!KAKAO_MAP_APP_KEY) {
      console.error('[loadKakaoMaps] Missing KAKAO_MAP_APP_KEY');
      reject(new Error('Kakao Map app key is not configured'));
      return;
    }

    // 이미 로드된 경우
    if (window.kakao && window.kakao.maps) {
      resolve(window.kakao);
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    
    script.onload = () => {
      if (!window.kakao) {
        reject(new Error('Kakao object not found on window'));
        return;
      }
      
      // autoload=false이므로 수동으로 로드
      window.kakao.maps.load(() => {
        resolve(window.kakao!);
      });
    };

    script.onerror = (err) => {
      console.error('[loadKakaoMaps] Failed to load script', err);
      reject(new Error('Failed to load Kakao Maps script'));
    };

    document.head.appendChild(script);
  });

  return kakaoMapsPromise;
}


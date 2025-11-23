/**
 * 지도 API 통합 로더
 * 환경 변수에 따라 기본 지도 제공자를 결정합니다.
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { MAP_PROVIDER } from '../config/env';
import { loadGoogleMaps } from './googleMaps';
import { loadKakaoMaps } from './kakaoMaps';

/**
 * 기본 지도 API를 로드합니다.
 * VITE_MAP_PROVIDER 환경 변수에 따라 구글맵 또는 카카오맵을 우선 로드합니다.
 */
export async function loadPrimaryMap(): Promise<any> {
  if (MAP_PROVIDER === 'kakao') {
    return loadKakaoMaps();
  }
  return loadGoogleMaps();
}

/**
 * 보조 지도 API를 로드합니다 (fallback용).
 * 기본 지도가 실패할 경우 사용됩니다.
 */
export async function loadSecondaryMap(): Promise<any> {
  if (MAP_PROVIDER === 'kakao') {
    return loadGoogleMaps();
  }
  return loadKakaoMaps();
}


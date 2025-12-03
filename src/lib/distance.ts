/**
 * 거리 계산 유틸리티
 * Haversine 공식을 사용한 두 좌표 간 거리 계산
 */

/**
 * 도(degree)를 라디안(radian)으로 변환
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * 두 좌표 간 거리를 계산 (Haversine 공식)
 * @param lat1 시작점 위도
 * @param lng1 시작점 경도
 * @param lat2 도착점 위도
 * @param lng2 도착점 경도
 * @returns 두 지점 간 거리 (km)
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

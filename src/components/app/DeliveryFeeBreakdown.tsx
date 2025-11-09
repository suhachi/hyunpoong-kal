/**
 * 배달비 상세 표시 컴포넌트
 * Phase D: 배달비 거리기반 UI - 구간표 시각화
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { MapPin, Moon, Info } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';

export interface FeeZone {
  range: string;
  fee: number;
  current: boolean;
}

export interface DeliveryFeeBreakdownProps {
  distance: number;
  zones: FeeZone[];
  nightSurcharge?: number;
  total: number;
  address?: string;
  isNightTime?: boolean;
}

export function DeliveryFeeBreakdown({
  distance,
  zones,
  nightSurcharge = 0,
  total,
  address,
  isNightTime = false,
}: DeliveryFeeBreakdownProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };

  return (
    <div className="space-y-4">
      {/* 배달 주소 */}
      {address && (
        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-4 h-4 text-[#D61C1C] flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#2E1C10]/60 mb-1">배달 주소</p>
            <p className="text-sm text-[#2E1C10]">{address}</p>
          </div>
        </div>
      )}

      {/* 배달 거리 */}
      <div className="flex items-center justify-between p-3 bg-white border border-[#C7A45A]/20 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#C7A45A]" />
          <span className="text-sm text-[#2E1C10]/80">배달 거리</span>
        </div>
        <span className="font-medium text-[#2E1C10]">
          {distance.toFixed(1)}km
        </span>
      </div>

      {/* 거리별 요금 구간표 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="text-sm font-medium text-[#2E1C10]">거리별 요금</h4>
          <Info className="w-3 h-3 text-[#2E1C10]/40" />
        </div>
        
        {zones.map((zone, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-all',
              zone.current
                ? 'bg-[#D61C1C]/10 border-2 border-[#D61C1C] shadow-sm'
                : 'bg-gray-50 border border-gray-200'
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'text-sm',
                  zone.current
                    ? 'font-medium text-[#D61C1C]'
                    : 'text-[#2E1C10]/60'
                )}
              >
                {zone.range}
              </span>
              {zone.current && (
                <Badge className="bg-[#D61C1C] text-white text-[10px] px-1.5 py-0">
                  현재
                </Badge>
              )}
            </div>
            <span
              className={cn(
                'font-medium',
                zone.current ? 'text-[#D61C1C] text-base' : 'text-[#2E1C10]/60'
              )}
            >
              {formatPrice(zone.fee)}
            </span>
          </div>
        ))}
      </div>

      {/* 야간 배달 추가 요금 */}
      {nightSurcharge > 0 && (
        <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-indigo-900">야간 배달 추가</span>
              {isNightTime && (
                <Badge className="bg-indigo-600 text-white text-[10px] px-1.5 py-0">
                  적용 중
                </Badge>
              )}
            </div>
            <span className="font-medium text-indigo-600">
              +{formatPrice(nightSurcharge)}
            </span>
          </div>
          <p className="text-xs text-indigo-600/70 mt-1">
            오후 9시 ~ 오전 6시
          </p>
        </div>
      )}

      <Separator />

      {/* 총 배달비 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D61C1C]/5 to-[#F37021]/5 rounded-xl">
        <span className="font-medium text-[#2E1C10]">총 배달비</span>
        <span className="text-xl font-bold text-[#D61C1C]">
          {formatPrice(total)}
        </span>
      </div>

      {/* 안내 문구 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-900">
            배달 거리는 직선 거리가 아닌 실제 도로 거리로 계산됩니다.
            날씨나 교통 상황에 따라 배달 시간이 달라질 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 거리 기반 요금 계산 유틸리티
 */
export function calculateDeliveryFee(
  distance: number,
  baseFees: { min: number; max: number; fee: number }[],
  nightSurcharge: number = 0,
  isNightTime: boolean = false
): { baseFee: number; nightFee: number; total: number } {
  // 거리에 맞는 구간 찾기
  const zone = baseFees.find(
    (z) => distance >= z.min && distance <= z.max
  );

  const baseFee = zone?.fee || 0;
  const nightFee = isNightTime ? nightSurcharge : 0;
  const total = baseFee + nightFee;

  return { baseFee, nightFee, total };
}

/**
 * 야간 시간대 체크 (21:00 ~ 06:00)
 */
export function isNightTimeNow(): boolean {
  const hour = new Date().getHours();
  return hour >= 21 || hour < 6;
}

/**
 * 업셀 섹션 컴포넌트
 * Phase E: 최소 주문금액 미달 시 추천 메뉴 제안 섹션
 *
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo, useEffect, useState, useMemo } from "react";
import { TrendingUp, Sparkles } from "lucide-react";
import { UpsellCard } from "./UpsellCard";
import { formatPrice } from "@/lib/utils";
import type { Menu } from "@/types/menu";

export interface UpsellSectionProps {
  missingAmount: number;
  allMenus: Menu[];
  onAddToCart: (menu: Menu) => void;
  maxRecommendations?: number;
}

export const UpsellSection = memo(function UpsellSection({
  missingAmount,
  allMenus,
  onAddToCart,
  maxRecommendations = 3,
}: UpsellSectionProps) {
  // useMemo를 사용하여 추천 메뉴 계산 최적화
  const recommendedMenus = useMemo(() => {
    return getRecommendedMenus(allMenus, missingAmount, maxRecommendations);
  }, [allMenus, missingAmount, maxRecommendations]);

  if (recommendedMenus.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-[#FFF9F0] to-[#FFF4E6] rounded-xl border border-[#F37021]/20">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-8 h-8 bg-[#F37021] rounded-full">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-[#2E1C10]">이 메뉴는 어떠세요?</h3>
          <p className="text-xs text-[#2E1C10]/60">
            {formatPrice(missingAmount)} 더 담으면 주문할 수 있어요
          </p>
        </div>
      </div>

      {/* 추천 메뉴 리스트 */}
      <div className="space-y-2">
        {recommendedMenus.map((menu, index) => (
          <UpsellCard key={menu.id} menu={menu} onAddToCart={onAddToCart} highlight={index === 0} />
        ))}
      </div>

      {/* 안내 문구 */}
      <div className="mt-3 flex items-start gap-2 p-2 bg-white/50 rounded text-xs text-[#2E1C10]/60">
        <TrendingUp className="w-4 h-4 flex-shrink-0 text-[#F37021] mt-0.5" />
        <p>인기 메뉴와 최근 본 메뉴를 기준으로 추천해드려요</p>
      </div>
    </div>
  );
});

/**
 * 추천 메뉴 선정 로직
 */
function getRecommendedMenus(allMenus: Menu[], missingAmount: number, maxCount: number): Menu[] {
  // 1. 조건 필터링
  const eligible = allMenus.filter(menu => {
    return (
      !menu.soldOut && // 품절 아님
      menu.available !== false && // 판매 가능
      menu.price <= missingAmount * 1.5 // 부족 금액의 1.5배 이하
    );
  });

  // 2. 우선순위 점수 계산
  const scored = eligible.map(menu => {
    let score = 0;

    // 인기 메뉴 우대 (+100)
    if (menu.isPopular) score += 100;

    // 가격이 부족 금액에 가까울수록 높은 점수
    const priceFit = 1 - Math.abs(menu.price - missingAmount) / missingAmount;
    score += priceFit * 50;

    // 평점 반영 (+0~20)
    if (menu.rating) {
      score += (menu.rating / 5) * 20;
    }

    // 리뷰 수 반영 (+0~10)
    if (menu.reviewCount) {
      score += Math.min(menu.reviewCount / 10, 10);
    }

    return { menu, score };
  });

  // 3. 점수 내림차순 정렬 후 상위 N개 반환
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxCount)
    .map(item => item.menu);
}

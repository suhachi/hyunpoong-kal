/**
 * 업셀 카드 컴포넌트
 * Phase E: 최소 주문금액 미달 시 추천 메뉴 제안
 *
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { memo } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { formatPrice } from "../../lib/utils";
import type { Menu } from "../../types/menu";

export interface UpsellCardProps {
  menu: Menu;
  onAddToCart: (menu: Menu) => void;
  highlight?: boolean;
}

export const UpsellCard = memo(function UpsellCard({
  menu,
  onAddToCart,
  highlight = false,
}: UpsellCardProps) {
  return (
    <div
      className={`
        flex gap-3 p-3 bg-white rounded-lg border transition-all
        ${
          highlight
            ? "border-[#D61C1C] shadow-md ring-2 ring-[#D61C1C]/20"
            : "border-[#C7A45A]/20 hover:border-[#C7A45A]/40"
        }
      `}
    >
      {/* 메뉴 이미지 */}
      <div className="relative flex-shrink-0">
        <img
          src={menu.imageUrl || "/placeholder-menu.jpg"}
          alt={menu.name}
          className="w-16 h-16 rounded object-cover"
        />

        {menu.isPopular && (
          <Badge className="absolute -top-1 -right-1 bg-[#D61C1C] text-white text-[10px] px-1 py-0">
            인기
          </Badge>
        )}
      </div>

      {/* 메뉴 정보 */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-[#2E1C10] truncate">{menu.name}</h4>

        {menu.description && (
          <p className="text-xs text-[#2E1C10]/60 line-clamp-1 mt-0.5">{menu.description}</p>
        )}

        <p className="text-sm font-medium text-[#D61C1C] mt-1">{formatPrice(menu.price)}</p>
      </div>

      {/* 추가 버튼 */}
      <Button
        size="sm"
        onClick={() => onAddToCart(menu)}
        disabled={menu.soldOut}
        className="self-center flex-shrink-0 gap-1"
      >
        <Plus className="w-4 h-4" />
        담기
      </Button>
    </div>
  );
});

# App Pages - Full Source Code

**Generated**: 2025-11-22-2149  
**Project**: hyunpoong-kal  
**Company**: KS Company (BRN: 553-17-00098)

---

## Overview

Complete source code of 9 user-facing pages.

---
## src\pages\app\Home.tsx

```tsx
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, memo, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ChevronRight, CloudSun, Star, Gift, Ticket } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { FEATURE_FLAGS } from '../../config/env';
import { DEFAULT_MENU_IMAGE } from '../../config/ui';
import { formatPrice } from '../../lib/utils';
import { getMenus } from '../../lib/admin/menus.api';
import { getActiveNotices } from '../../lib/admin/notices.api';
import type { Menu } from '../../types/menu';
import type { Notice } from '../../types/notice';

export function Home() {
  const navigate = useNavigate();
  const [recommendedMenus, setRecommendedMenus] = useState<Menu[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 추천 메뉴 로드
        const menus = await getMenus({});
        const bestMenus = menus
          .filter(m => m.badges.includes('best'))
          .slice(0, 2);
        setRecommendedMenus(bestMenus.length >= 2 ? bestMenus : menus.slice(0, 2));

        // 공지사항 로드
        const activeNotices = await getActiveNotices(1);
        setNotices(activeNotices);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, []);

  // 추천 메뉴 클릭 핸들러
  const handleMenuClick = useCallback((menuId: string) => {
    navigate(`/menu/${menuId}`);
  }, [navigate]);

  return (
    <div className="space-y-6">
      {/* 히어로 섹션 */}
      <section className="relative h-[300px] bg-gradient-to-b from-[#D61C1C] to-[#F37021]/20 mt-6">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
          <h1 className="text-3xl mb-4 text-center drop-shadow-lg">현풍닭칼국수</h1>
          <p className="text-lg text-center drop-shadow-md opacity-90">
            정성껏 끓여낸 진한 국물과 쫄깃한 수타면
          </p>
          <Button 
            onClick={() => navigate('/menu')} 
            size="lg" 
            className="mt-6 bg-white text-[#D61C1C] hover:bg-gray-100"
          >
            메뉴 보러가기
          </Button>
        </div>
      </section>
      
      <div className="px-4 space-y-6">
        {/* 영업 상태 */}
        <div className="flex items-center gap-2 p-4 bg-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-center w-3 h-3">
            <span className="w-full h-full bg-green-500 rounded-full animate-pulse" />
          </div>
          <span className="text-sm text-[#2E1C10]">
            영업중
          </span>
          <span className="text-sm text-[#2E1C10]/60">
            10:00 - 22:00
          </span>
        </div>
        
        {/* 빠른 액션 */}
        <div className="grid grid-cols-2 gap-3">
          {FEATURE_FLAGS.points && (
            <Link 
              to="/points" 
              className="p-4 bg-gradient-to-br from-[#D61C1C] to-[#F37021] rounded-2xl shadow-sm text-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <Gift className="w-6 h-6" />
                <ChevronRight className="w-5 h-5" />
              </div>
              <p className="text-sm opacity-90 mb-1">내 포인트</p>
              <p className="text-xl">0P</p>
            </Link>
          )}
          
          <Link 
            to="/coupons" 
            className="p-4 bg-gradient-to-br from-[#F37021] to-[#C7A45A] rounded-2xl shadow-sm text-white hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <Ticket className="w-6 h-6" />
              <ChevronRight className="w-5 h-5" />
            </div>
            <p className="text-sm opacity-90 mb-1">내 쿠폰</p>
            <p className="text-xl">0개</p>
          </Link>
        </div>
        
        {/* 날씨 기반 추천 */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CloudSun className="w-5 h-5 text-[#F37021]" />
            <h2 className="text-[#2E1C10]">
              오늘의 추천 메뉴
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recommendedMenus.map((menu) => (
              <RecommendCard
                key={menu.menuId}
                menu={menu}
                onClick={() => handleMenuClick(menu.menuId)}
              />
            ))}
          </div>
        </section>
        
        {/* 리뷰 하이라이트 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-[#F37021] text-[#F37021]" />
              <h2 className="text-[#2E1C10]">고객 리뷰</h2>
            </div>
            <Link to="/reviews" className="text-sm text-[#D61C1C] flex items-center gap-1">
              전체보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* 초기 상태: 아직 리뷰가 없을 때 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-[#2E1C10] mb-1">
              아직 등록된 리뷰가 없습니다.
            </p>
            <p className="text-xs text-[#2E1C10]/60">
              첫 리뷰를 남겨주시면 더 많은 손님들이 참고할 수 있어요.
            </p>
          </div>
        </section>
        
        {/* 공지사항 */}
        {notices.length > 0 && (
          <section 
            className="p-4 bg-[#F37021]/10 rounded-2xl cursor-pointer hover:bg-[#F37021]/15 transition-colors"
            onClick={() => navigate('/notices')}
          >
            {notices.map(notice => {
              const typeColors = {
                notice: 'border-[#F37021] text-[#F37021]',
                event: 'border-blue-500 text-blue-600',
                promotion: 'border-purple-500 text-purple-600',
              };
              const typeLabels = {
                notice: '공지',
                event: '이벤트',
                promotion: '프로모션',
              };
              return (
                <div key={notice.id} className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={typeColors[notice.type]}>
                        {typeLabels[notice.type]}
                      </Badge>
                      <span className="text-xs text-[#2E1C10]/60">
                        {new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }).replace(/\./g, '.').replace(/\s/g, '')}
                      </span>
                    </div>
                    <h3 className="text-sm text-[#2E1C10] mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-sm text-[#2E1C10]/60">
                      {notice.content}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#2E1C10]/40 flex-shrink-0" />
                </div>
              );
            })}
          </section>
        )}
        
        {/* CTA 버튼 */}
        <Link to="/menu">
          <Button 
            size="lg"
            className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
          >
            메뉴 보기
          </Button>
        </Link>
      </div>
    </div>
  );
}

interface RecommendCardProps {
  menu: Menu;
  onClick: () => void;
}

const RecommendCardBase = ({ menu, onClick }: RecommendCardProps) => {
  const badgeLabels: Record<string, string> = {
    best: '베스트',
    signature: '시그니처',
    spicy: '매운맛',
    cold: '냉메뉴',
    seasonal: '계절메뉴',
  };

  const hasBestBadge = menu.badges.includes('best');

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-square bg-gradient-to-br from-[#F9F6F3] to-[#C7A45A]/20 overflow-hidden">
        <ImageWithFallback
          src={menu.image || DEFAULT_MENU_IMAGE}
          alt={menu.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          {hasBestBadge && (
            <Badge className="bg-[#D61C1C] text-white text-xs">
              베스트
            </Badge>
          )}
        </div>
        <h3 className="text-sm text-[#2E1C10] mb-1">
          {menu.name}
        </h3>
        <p className="text-[#D61C1C]">
          {formatPrice(menu.price)}
        </p>
      </div>
    </div>
  );
};

const RecommendCard = memo(RecommendCardBase);

```

---

## src\pages\app\MenuList.tsx

```tsx
import { useState, useMemo, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { DEFAULT_MENU_IMAGE } from '../../config/ui';
import { getMenus } from '../../lib/admin/menus.api';
import type { Menu, MenuCategory } from '../../types/menu';
import { formatPrice } from '../../lib/utils';

const categories: { value: MenuCategory; label: string }[] = [
  { value: 'noodle', label: '메인' },
  { value: 'set', label: '세트' },
  { value: 'side', label: '사이드' },
  { value: 'drink', label: '음료' },
  { value: 'alcohol', label: '주류' },
];

const badgeStyles = {
  best: 'bg-[#D61C1C] text-white',
  signature: 'bg-[#C7A45A] text-white',
  spicy: 'bg-[#F37021] text-white',
  cold: 'bg-blue-500 text-white',
  seasonal: 'bg-green-600 text-white',
};

const badgeLabels = {
  best: '베스트',
  signature: '시그니처',
  spicy: '매운맛',
  cold: '냉메뉴',
  seasonal: '계절메뉴',
};

export function MenuList() {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('noodle');
  const [searchQuery, setSearchQuery] = useState('');
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // localStorage에 저장된 메뉴 데이터를 가져옴 (변경사항 반영)
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);
        const loadedMenus = await getMenus({});
        setMenus(loadedMenus);
      } catch (error) {
        console.error('Failed to load menus:', error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };
    loadMenus();
  }, []);
  
  const filteredMenus = useMemo(() => {
    if (!Array.isArray(menus) || menus.length === 0) {
      return [];
    }
    return menus.filter((menu) => {
      const matchesCategory = menu.category === selectedCategory;
      const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menus, selectedCategory, searchQuery]);
  
  return (
    <div className="pb-6" data-testid="menu-list.page">
      {/* 검색 */}
      <div className="sticky top-14 z-40 bg-[#F9F6F3] pt-4 px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2E1C10]/40" />
          <Input
            type="search"
            placeholder="메뉴 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>
      
      {/* 카테고리 탭 */}
      <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as MenuCategory)}>
        <div className="sticky top-[104px] z-40 bg-[#F9F6F3] px-4 pb-3">
          <TabsList className="w-full justify-start overflow-x-auto bg-white">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                className="data-[state=active]:bg-[#D61C1C] data-[state=active]:text-white"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {/* 메뉴 리스트 */}
        {categories.map((cat) => (
          <TabsContent key={cat.value} value={cat.value} className="px-4 mt-0">
            {loading ? (
              <div className="text-center py-12 text-[#2E1C10]/60">
                로딩 중...
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-12 text-[#2E1C10]/60">
                검색 결과가 없습니다
              </div>
            ) : (
              <div className="grid gap-4" data-testid="menu-list.items">
                {filteredMenus.map((menu) => (
                  <MenuCard key={menu.menuId} menu={menu} />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface MenuCardProps {
  menu: Menu;
}

const MenuCardBase = ({ menu }: MenuCardProps) => {
  return (
    <Link to={`/menu/${menu.menuId}`} data-testid="menu-list.item.link">
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
          !menu.isAvailable ? 'opacity-60' : ''
        }`}
        data-testid="menu-list.item"
      >
        <div className="flex gap-4 p-4">
          {/* 메뉴 이미지 */}
          <div className="relative flex-shrink-0 w-24 h-24 bg-gradient-to-br from-[#F9F6F3] to-[#C7A45A]/20 rounded-xl overflow-hidden">
            <ImageWithFallback
              src={menu.image || DEFAULT_MENU_IMAGE}
              alt={menu.name}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            {!menu.isAvailable && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge className="bg-gray-600 text-white">품절</Badge>
              </div>
            )}
            {menu.availableHours && (
              <div className="absolute bottom-1 right-1">
                <Badge className="bg-yellow-500 text-white text-xs">시간제</Badge>
              </div>
            )}
          </div>
          
          {/* 메뉴 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-[#2E1C10] truncate" data-testid="menu-list.item.name">
                {menu.name}
              </h3>
            </div>
            
            {/* 뱃지 */}
            {menu.badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {menu.badges.map((badge) => (
                  <Badge
                    key={badge}
                    className={`text-xs ${badgeStyles[badge]}`}
                  >
                    {badgeLabels[badge]}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* 설명 */}
            <p className="text-sm text-[#2E1C10]/60 line-clamp-2 mb-2">
              {menu.description}
            </p>
            
            {/* 가격 */}
            <p className="text-[#D61C1C]" data-testid="menu-list.item.price">
              {formatPrice(menu.price)}
            </p>
            
            {/* 시간제 안내 */}
            {menu.availableHours && (
              <p className="text-xs text-yellow-600 mt-1">
                {menu.availableHours.start} - {menu.availableHours.end}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const MenuCard = memo(MenuCardBase);

```

---

## src\pages\app\Cart.tsx

```tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Truck, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { DEFAULT_MENU_IMAGE } from '../../config/ui';
import { useCart } from '../../contexts/CartContext';
import { UpsellSection } from '../../components/app/UpsellSection';
import { PriceBreakdown } from '../../components/shared/PriceBreakdown';
import { ORDER_LIMITS } from '../../constants';
import type { Menu } from '../../types/menu';
import { formatPrice } from '../../lib/utils';

// 실제 음식 이미지 매핑
const menuImages: Record<string, string> = {
  'menu-001': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-002': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-003': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-004': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-005': 'https://images.unsplash.com/photo-1608120073766-c80051eccbf6?w=200',
  'menu-006': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-007': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-008': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-013': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-014': 'https://images.unsplash.com/photo-1676686997059-fb817ebbb2b5?w=200',
  'menu-021': 'https://images.unsplash.com/photo-1645530656505-1b8a4057889b?w=200',
  'menu-022': 'https://images.unsplash.com/photo-1645530656505-1b8a4057889b?w=200',
  'menu-023': 'https://images.unsplash.com/photo-1645530656505-1b8a4057889b?w=200',
  'menu-024': 'https://images.unsplash.com/photo-1608120073766-c80051eccbf6?w=200',
  'menu-025': 'https://images.unsplash.com/photo-1616627077891-a4780e730b7e?w=200',
};

export function Cart() {
  const navigate = useNavigate();
  const {
    items,
    deliveryType,
    requests,
    couponDiscount,
    removeItem,
    updateQuantity,
    setDeliveryType,
    setRequests,
    getSubtotal,
    getDeliveryFee,
    getTotalAmount,
    addToCart,
    forceReload,
  } = useCart();

  const [allMenus, setAllMenus] = useState<Menu[]>([]);
  // T2-16: Cart 페이지 hydration 완전 제거
  // - CartContext의 items를 즉시 신뢰하고 렌더링
  // - localStorage 동기화는 CartContext에서 이미 처리됨
  // - isHydrating 플래그 제거로 불필요한 로딩 상태 회피
  const [isHydrating] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const totalAmount = getTotalAmount();

  const minOrderAmount = deliveryType === 'delivery' ? ORDER_LIMITS.MIN_AMOUNT_DELIVERY : ORDER_LIMITS.MIN_AMOUNT_PICKUP;
  const canProceed = subtotal >= minOrderAmount;
  const missingAmount = minOrderAmount - subtotal;

  // 메뉴 데이터 로드 (추천용)
  // T2-13: UpsellSection 메뉴 로딩은 선택적 기능이므로 당분간 비활성화
  // public/data/menus.json이 준비되면 주석 해제
  useEffect(() => {
    // loadMenus();
  }, []);

  async function loadMenus() {
    try {
      const response = await fetch('/data/menus.json');
      const data = await response.json();
      setAllMenus(data.map((item: any) => ({
        id: item.menuId,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.image,
        category: item.category,
        available: item.isAvailable !== false,
        soldOut: item.isAvailable === false,
        isPopular: item.badges?.includes('best'),
        rating: 4.5, // Mock data
        reviewCount: 100,
      })));
    } catch (error) {
      console.error('Failed to load menus:', error);
    }
  }

  function handleAddToCart(menu: Menu) {
    addToCart({
      menuId: menu.id,
      menuName: menu.name,
      price: menu.price,
      quantity: 1,
      options: [],
      subtotal: menu.price,
    });
  }

  // 로딩 상태 (현재는 사용하지 않지만 향후 필요 시 활성화 가능)
  if (isHydrating) {
    return (
      <div data-testid="cart.loading" className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-16 h-16 border-4 border-[#D61C1C]/30 border-t-[#D61C1C] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#2E1C10]/60">장바구니를 불러오는 중...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4" data-testid="cart.empty">
        <div className="w-24 h-24 mb-6 rounded-full bg-[#2E1C10]/5 flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-[#2E1C10]/40" />
        </div>
        <h2 className="text-xl text-[#2E1C10] mb-2">
          장바구니가 비어있어요
        </h2>
        <p className="text-[#2E1C10]/60 mb-6 text-center">
          맛있는 메뉴를 담아보세요
        </p>
        <Button
          onClick={() => navigate('/menu')}
          className="bg-[#D61C1C] hover:bg-[#D61C1C]/90"
        >
          메뉴 보러가기
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-32" data-testid="cart.page">
      <div className="px-4 py-6 space-y-6">
        {/* 장바구니 헤더 */}
        <div data-testid="cart.header">
          <h1 className="text-2xl text-[#2E1C10] mb-1">
            장바구니
          </h1>
          <p className="text-[#2E1C10]/60">
            {items.length}개 메뉴
          </p>
        </div>

        {/* 장바구니 아이템 */}
        <div className="space-y-4" data-testid="cart.items">
          {items.map((item, index) => (
            <CartItemCard
              key={`${item.menuId}-${index}`}
              item={item}
              onUpdateQuantity={(qty) => updateQuantity(item.menuId, qty)}
              onRemove={() => removeItem(item.menuId)}
            />
          ))}
        </div>

        <Separator />

        {/* 배달/포장 선택 */}
        <div data-testid="cart.method">
          <h2 className="text-[#2E1C10] mb-3">
            주문 방식
          </h2>
          <RadioGroup value={deliveryType} onValueChange={(v) => setDeliveryType(v as 'delivery' | 'pickup')}>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10">
              <RadioGroupItem value="delivery" id="delivery" data-testid="cart.method.radio-delivery" />
              <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer flex-1">
                <Truck className="w-5 h-5 text-[#D61C1C]" />
                <div>
                  <p className="text-[#2E1C10]">배달</p>
                  <p className="text-sm text-[#2E1C10]/60">
                    최소 주문 {formatPrice(ORDER_LIMITS.MIN_AMOUNT_DELIVERY)}
                  </p>
                </div>
              </Label>
              {deliveryType === 'delivery' && (
                <span className="text-sm text-[#D61C1C]">
                  +{formatPrice(deliveryFee)}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-[#2E1C10]/10">
              <RadioGroupItem value="pickup" id="pickup" data-testid="cart.method.radio-pickup" />
              <Label htmlFor="pickup" className="flex items-center gap-2 cursor-pointer flex-1">
                <ShoppingBag className="w-5 h-5 text-[#F37021]" />
                <div>
                  <p className="text-[#2E1C10]">포장</p>
                  <p className="text-sm text-[#2E1C10]/60">
                    최소 주문 {formatPrice(ORDER_LIMITS.MIN_AMOUNT_PICKUP)}
                  </p>
                </div>
              </Label>
              {deliveryType === 'pickup' && (
                <span className="text-sm text-[#C7A45A]">무료</span>
              )}
            </div>
          </RadioGroup>
        </div>

        {/* 요청사항 */}
        <div>
          <h2 className="text-[#2E1C10] mb-3">
            요청사항 (선택)
          </h2>
          <Textarea
            data-testid="cart.input.requests"
            placeholder="예) 면 부드럽게 해주세요"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            maxLength={150}
            className="resize-none"
          />
          <p className="text-xs text-[#2E1C10]/60 mt-1">
            {requests?.length || 0}/150자
          </p>
        </div>

        {/* 최소 주문 금액 경고 + 업셀 섹션 */}
        {!canProceed && (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {deliveryType === 'delivery' ? '배달' : '포장'}은{' '}
                {formatPrice(minOrderAmount)} 이상부터 가능해요.{' '}
                <span className="font-medium">
                  {formatPrice(missingAmount)} 더 담아주세요.
                </span>
              </AlertDescription>
            </Alert>

            {/* 업셀 추천 섹션 */}
            <UpsellSection
              missingAmount={missingAmount}
              allMenus={allMenus}
              onAddToCart={handleAddToCart}
              maxRecommendations={3}
            />
          </div>
        )}

        {/* 쿠폰 (나중에 구현) */}
        {/* <div>
          <Button variant="outline" className="w-full justify-between">
            <span>쿠폰 선택하기</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div> */}
      </div>

      {/* 하단 고정 결제 영역 */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[#2E1C10]/10 px-4 py-4 space-y-3" data-testid="cart.summary">
        {/* 금액 상세 - PriceBreakdown 컴포넌트 사용 */}
        <PriceBreakdown
          subtotal={subtotal}
          deliveryFee={deliveryType === 'delivery' ? deliveryFee : 0}
          couponDiscount={couponDiscount}
          total={totalAmount}
          showDeliveryFee={deliveryType === 'delivery'}
        />

        {/* 결제하기 버튼 */}
        <Button
          data-testid="cart.button.submit"
          size="lg"
          className="w-full bg-[#D61C1C] hover:bg-[#D61C1C]/90"
          disabled={!canProceed}
          onClick={() => navigate('/checkout')}
        >
          {canProceed ? `${formatPrice(totalAmount)} 결제하기` : '최소 주문 금액 미달'}
        </Button>
      </div>
    </div>
  );
}

interface CartItemCardProps {
  item: {
    menuId: string;
    menuName: string;
    menuImage: string;
    menuPrice: number;
    quantity: number;
    options: {
      noodle?: string;
      spicy?: string;
      toppings?: string[];
    };
    optionPrices: {
      noodle: number;
      toppings: number;
    };
    subtotal: number;
  };
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const optionsText = [
    item.options.noodle && `면양: ${item.options.noodle}`,
    item.options.spicy && `맵기: ${item.options.spicy}`,
    item.options.toppings && item.options.toppings.length > 0 && `토핑: ${item.options.toppings.join(', ')}`,
  ].filter(Boolean).join(' · ');

  const imageUrl = menuImages[item.menuId];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm" data-testid="cart.item">
      <div className="flex gap-4">
        {/* 메뉴 이미지 */}
        <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#F9F6F3] to-[#C7A45A]/20 rounded-xl overflow-hidden">
          <ImageWithFallback
            src={imageUrl || DEFAULT_MENU_IMAGE}
            alt={item.menuName}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* 메뉴 정보 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-[#2E1C10] truncate" data-testid="cart.item.name">
              {item.menuName}
            </h3>
            <button
              data-testid="cart.item.remove"
              onClick={onRemove}
              className="flex-shrink-0 p-1 hover:bg-[#2E1C10]/5 rounded"
              aria-label="삭제"
            >
              <Trash2 className="w-4 h-4 text-[#2E1C10]/60" />
            </button>
          </div>

          {/* 옵션 */}
          {optionsText && (
            <p className="text-sm text-[#2E1C10]/60 mb-2" data-testid="cart.item.options">
              {optionsText}
            </p>
          )}

          {/* 수량 및 가격 */}
          <div className="flex items-center justify-between">
            {/* 수량 조절 */}
            <div className="flex items-center border border-[#2E1C10]/20 rounded-lg overflow-hidden">
              <button
                data-testid="cart.item.quantity-decrease"
                onClick={() => onUpdateQuantity(Math.max(1, item.quantity - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#F9F6F3]"
                aria-label="수량 감소"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-10 text-center text-sm text-[#2E1C10]" data-testid="cart.item.quantity">
                {item.quantity}
              </span>
              <button
                data-testid="cart.item.quantity-increase"
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-[#F9F6F3]"
                aria-label="수량 증가"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* 가격 */}
            <span className="text-[#D61C1C]" data-testid="cart.item.price">
              {formatPrice(item.subtotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

## src\pages\app\OrderHistory.tsx

```tsx
/**
 * 주문내역 페이지
 * 고객의 모든 주문을 시간순으로 표시하고 상태별 필터링 제공
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Skeleton } from '../../components/ui/skeleton';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { 
  ShoppingBag, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Star,
  Package
} from 'lucide-react';
import { getOrdersByUser, filterOrdersByStatus, getReviewableOrders } from '../../lib/orders.api';
import type { Order, OrderStatus } from '../../types/order';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';

type FilterStatus = OrderStatus | 'all' | 'reviewable';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  pending: { label: '결제대기', variant: 'outline', color: 'text-gray-500' },
  accepted: { label: '접수완료', variant: 'default', color: 'text-green-600' },
  preparing: { label: '조리중', variant: 'secondary', color: 'text-orange-600' },
  completed: { label: '완료', variant: 'default', color: 'text-green-600' },
  canceled: { label: '취소', variant: 'destructive', color: 'text-gray-400' },
};

// OrderTracking 페이지와 동일한 상태 설정
const extendedStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  ...statusConfig,
  placed: { label: '주문접수', variant: 'default', color: 'text-green-600' },
  cooking: { label: '조리중', variant: 'secondary', color: 'text-orange-600' },
  out_for_delivery: { label: '배달중', variant: 'secondary', color: 'text-blue-600' },
  pickup_ready: { label: '포장완료', variant: 'default', color: 'text-green-600' },
  done: { label: '완료', variant: 'default', color: 'text-green-600' },
  payment_failed: { label: '결제실패', variant: 'destructive', color: 'text-red-500' },
};

export function OrderHistory() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');

  // 인증 체크
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userId = user.uid;

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  useEffect(() => {
    applyFilter();
  }, [filter, orders]);

  async function loadOrders() {
    if (!user) return;

    try {
      setLoading(true);
      const data = await getOrdersByUser(userId);
      setOrders(data);
    } catch (error) {
      console.error('주문 목록 로딩 실패:', error);
      toast.error('주문 내역을 불러오는데 실패했습니다. 다시 시도해주세요.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilter() {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else if (filter === 'reviewable') {
      setFilteredOrders(getReviewableOrders(orders));
    } else {
      setFilteredOrders(filterOrdersByStatus(orders, filter));
    }
  }

  function formatDate(timestamp: any): string {
    try {
      let date: Date;
      
      if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else {
        return '-';
      }

      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days === 0) {
        return '오늘 ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      } else if (days === 1) {
        return '어제 ' + date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      } else if (days < 7) {
        return `${days}일 전`;
      } else {
        return date.toLocaleDateString('ko-KR', { 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    } catch (error) {
      console.error('날짜 포맷 에러:', error);
      return '-';
    }
  }

  function hasReview(order: Order): boolean {
    // TODO: 실제로는 reviews 컬렉션 확인
    try {
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      return reviews.some((review: any) => review.orderId === order.orderId);
    } catch {
      return false;
    }
  }

  const reviewableCount = getReviewableOrders(orders).length;

  return (
    <div className="pb-24">
      {/* 헤더 */}
      <div className="sticky top-14 z-40 bg-[#F9F6F3] border-b border-[#E5DDD5] px-4 py-4">
        <h1 className="text-xl text-[#2E1C10] mb-4">주문내역</h1>
        
        {/* 필터 탭 */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterStatus)}>
          <TabsList className="w-full grid grid-cols-3 bg-white">
            <TabsTrigger value="all" className="text-sm">
              전체
              {!loading && orders.length > 0 && (
                <span className="ml-1 text-xs opacity-60">({orders.length})</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-sm">
              진행중
              {!loading && (
                <span className="ml-1 text-xs opacity-60">
                  ({orders.filter(o => 
                    o.status === 'accepted' || 
                    o.status === 'preparing' || 
                    o.status === 'cooking' || 
                    o.status === 'out_for_delivery' ||
                    o.status === 'placed'
                  ).length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviewable" className="text-sm relative">
              리뷰작성
              {reviewableCount > 0 && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-[#D61C1C] rounded-full">
                  {reviewableCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-4 space-y-3">
        {loading ? (
          // 로딩 스켈레톤
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-2xl border-[#E5DDD5]">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : filteredOrders.length === 0 ? (
          // 주문 없음
          <Card className="rounded-2xl border-[#E5DDD5] p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-[#2E1C10]/20 mx-auto mb-4" />
            <p className="text-[#2E1C10]/60 mb-4">
              {filter === 'all' 
                ? '주문 내역이 없습니다' 
                : filter === 'reviewable'
                ? '리뷰 작성 가능한 주문이 없습니다'
                : '해당 상태의 주문이 없습니다'}
            </p>
            <Button 
              onClick={() => navigate('/menu')}
              className="bg-[#D61C1C] hover:bg-[#D61C1C]/90"
            >
              메뉴 둘러보기
            </Button>
          </Card>
        ) : (
          // 주문 목록
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.orderId} 
              order={order}
              hasReview={hasReview(order)}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  hasReview: boolean;
  formatDate: (timestamp: any) => string;
}

function OrderCard({ order, hasReview, formatDate }: OrderCardProps) {
  const navigate = useNavigate();
  
  const statusInfo = extendedStatusConfig[order.status] || statusConfig.completed;
  const isCompleted = order.status === 'completed' || order.status === 'done';
  const isCanceled = order.status === 'canceled';
  const canReview = isCompleted && !hasReview;

  // 대표 이미지 (첫 번째 아이템) - 안전한 배열 접근
  const firstItem = order.items?.[0];
  const totalItems = order.items?.length || 0;

  // items가 비어있는 경우 처리
  if (!firstItem || totalItems === 0) {
    return (
      <Card className="rounded-2xl border-[#E5DDD5]">
        <CardContent className="p-4 text-center text-gray-500">
          주문 항목이 없습니다
        </CardContent>
      </Card>
    );
  }

  return (
    <Link to={`/order/${order.orderId}`}>
      <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.01] border-[#E5DDD5] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-[#2E1C10]/60">
                  {formatDate(order.createdAt)}
                </span>
                <Badge variant={statusInfo.variant} className="text-xs">
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-xs text-[#2E1C10]/40">
                주문번호: {order.orderId}
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#2E1C10]/40 flex-shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* 주문 아이템 */}
          <div className="flex gap-3">
            {/* 대표 이미지 */}
            {firstItem.menuImage && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#F9F6F3] flex-shrink-0">
                <ImageWithFallback
                  src={firstItem.menuImage}
                  alt={firstItem.menuName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* 주문 정보 */}
            <div className="flex-1 min-w-0">
              <p className="text-[#2E1C10] mb-1 truncate">
                {firstItem.menuName}
                {firstItem.quantity > 1 && (
                  <span className="text-[#2E1C10]/60"> × {firstItem.quantity}</span>
                )}
              </p>
              {totalItems > 1 && (
                <p className="text-sm text-[#2E1C10]/60">
                  외 {totalItems - 1}개
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {order.deliveryType === 'delivery' ? (
                  <Badge variant="outline" className="text-xs border-[#F37021]/30 text-[#F37021]">
                    <Package className="w-3 h-3 mr-1" />
                    배달
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs border-[#C7A45A]/30 text-[#C7A45A]">
                    <ShoppingBag className="w-3 h-3 mr-1" />
                    포장
                  </Badge>
                )}
              </div>
            </div>

            {/* 금액 */}
            <div className="text-right flex-shrink-0">
              <p className={`text-lg ${isCanceled ? 'text-[#2E1C10]/40 line-through' : 'text-[#D61C1C]'}`}>
                {formatPrice(order.finalAmount)}
              </p>
            </div>
          </div>

          {/* 하단 액션 */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/order/${order.orderId}`);
              }}
            >
              <Clock className="w-4 h-4 mr-1" />
              주문상세
            </Button>
            
            {canReview && (
              <Button
                size="sm"
                className="flex-1 bg-[#D61C1C] hover:bg-[#D61C1C]/90 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/review/${order.orderId}`);
                }}
              >
                <Star className="w-4 h-4 mr-1" />
                리뷰작성
              </Button>
            )}
            
            {isCompleted && hasReview && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-green-200 text-green-700"
                disabled
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                리뷰완료
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

```

---

## src\pages\app\Coupons.tsx

```tsx
/**
 * 고객 쿠폰함 페이지
 * Phase 2-8: 쿠폰 목록 및 상태별 필터
 */

import { useState, useEffect } from 'react';
import { Coupon, CouponStatus, getCouponStatus, COUPON_TYPE_LABELS } from '../../types/coupon';
import { getCoupons } from '../../lib/coupons.api';
import { getCurrentUser } from '../../lib/auth';
import { CouponCard } from '../../components/app/CouponCard';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Ticket, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../lib/utils';

export function Coupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [statusFilter, setStatusFilter] = useState<CouponStatus | 'all'>('available');
  const [loading, setLoading] = useState(true);
  
  // 쿠폰 코드 입력
  const [codeDialogOpen, setCodeDialogOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const user = getCurrentUser();

  useEffect(() => {
    loadCoupons();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredCoupons(coupons);
    } else {
      setFilteredCoupons(coupons.filter(c => getCouponStatus(c) === statusFilter));
    }
  }, [coupons, statusFilter]);

  const loadCoupons = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getCoupons(user.uid);
      setCoupons(data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCouponCode = async () => {
    if (!user) return;
    if (!couponCode.trim()) {
      toast.error('쿠폰 코드를 입력하세요');
      return;
    }

    setApplying(true);
    try {
      // Mock: 쿠폰 코드 검증 및 발급
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 임시 쿠폰 코드 검증 (실제로는 서버에서 처리)
      const validCodes: Record<string, { title: string; amount: number; minSpend: number }> = {
        'WELCOME2025': { title: '신년 맞이 특별 할인', amount: 10000, minSpend: 30000 },
        'FIRSTORDER': { title: '첫 주문 감사 쿠폰', amount: 5000, minSpend: 15000 },
        'REVIEW500': { title: '리뷰 이벤트 쿠폰', amount: 3000, minSpend: 10000 },
      };

      const codeUpper = couponCode.toUpperCase().trim();
      const couponData = validCodes[codeUpper];

      if (!couponData) {
        toast.error('유효하지 않은 쿠폰 코드입니다');
        return;
      }

      // 이미 등록된 코드인지 확인
      const alreadyHas = coupons.some(c => c.title === couponData.title);
      if (alreadyHas) {
        toast.error('이미 등록된 쿠폰입니다');
        return;
      }

      // 쿠폰 발급
      const newCoupon: Coupon = {
        id: `coupon-code-${Date.now()}`,
        uid: user.uid,
        type: 'code',
        amount: couponData.amount,
        minSpend: couponData.minSpend,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30일
        used: false,
        title: couponData.title,
        description: `${formatPrice(couponData.minSpend)} 이상 주문 시 사용 가능`,
      };

      setCoupons([newCoupon, ...coupons]);
      toast.success(`🎉 ${couponData.title} 쿠폰이 등록되었습니다!`);
      setCodeDialogOpen(false);
      setCouponCode('');
    } catch (error) {
      console.error('Failed to apply coupon code:', error);
      toast.error('쿠폰 등록에 실패했습니다');
    } finally {
      setApplying(false);
    }
  };

  const availableCount = coupons.filter(c => getCouponStatus(c) === 'available').length;
  const usedCount = coupons.filter(c => getCouponStatus(c) === 'used').length;
  const expiredCount = coupons.filter(c => getCouponStatus(c) === 'expired').length;

  return (
    <div className="min-h-screen bg-[#F9F6F3] pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl text-[#333] flex items-center gap-2">
            <Ticket className="w-6 h-6 text-[#D61C1C]" />
            내 쿠폰
          </h1>
          <p className="text-sm text-[#8B7355] mt-1">
            사용 가능한 쿠폰 {availableCount}장
          </p>
        </div>
      </div>

      {/* 탭 필터 */}
      <div className="bg-white border-b sticky top-[73px] z-10">
        <div className="container mx-auto px-4 py-3">
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="available">
                사용가능 ({availableCount})
              </TabsTrigger>
              <TabsTrigger value="used">
                사용완료 ({usedCount})
              </TabsTrigger>
              <TabsTrigger value="expired">
                만료됨 ({expiredCount})
              </TabsTrigger>
              <TabsTrigger value="all">
                전체 ({coupons.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 쿠폰 목록 */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">쿠폰이 없습니다</p>
            <p className="text-sm text-gray-400 mt-2">
              사진 리뷰를 작성하면 3,000원 쿠폰을 드려요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCoupons.map(coupon => (
              <CouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        )}
      </div>

      {/* 쿠폰 획득 안내 */}
      {availableCount === 0 && !loading && (
        <div className="container mx-auto px-4 pb-6">
          <div className="bg-gradient-to-br from-[#D61C1C]/10 to-[#F37021]/10 rounded-lg p-6 border border-[#D61C1C]/20">
            <h3 className="text-lg text-[#333] mb-3">쿠폰 받는 방법</h3>
            <ul className="space-y-2 text-sm text-[#8B7355]">
              <li className="flex items-start gap-2">
                <span className="text-[#D61C1C]">•</span>
                <span>주문 후 <strong>사진 리뷰</strong>를 남기면 3,000원 쿠폰</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F37021]">•</span>
                <span>신규 가입 시 5,000원 쿠폰</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C7A45A]">•</span>
                <span>특별 이벤트 쿠폰 (수시 발급)</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

```

---

## src\pages\app\My.tsx

```tsx
/**
 * 마이페이지
 * 고객 정보 및 주요 기능 접근 허브
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { User, ShoppingBag, Ticket, Gift, Bell, MessageSquare, LogOut, Settings } from "lucide-react";
import { toast } from 'sonner';
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";

export function My() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F6F3] flex items-center justify-center">
        <LoadingSkeleton />
      </div>
    );
  }

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 로그아웃 처리
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('로그아웃되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  const userName = user?.displayName || "사용자";
  const userEmail = user?.email || "";
  const recentOrdersCount = 12; // TODO: 실제 주문 수로 대체

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* 사용자 정보 카드 */}
      <Card className="rounded-2xl border-[#E5DDD5] bg-gradient-to-br from-white to-[#F9F6F3]">
        <CardHeader className="flex flex-row items-center gap-4">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={userName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#D61C1C] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-[#2E1C10] mb-1">{userName}님</CardTitle>
            <p className="text-sm text-[#8B7355]">{userEmail}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 items-center">
            <Badge variant="secondary" className="bg-[#D61C1C]/10 text-[#D61C1C] border-[#D61C1C]/20">
              {user?.role === 'owner' || user?.role === 'admin' ? '관리자' : '고객'}
            </Badge>
            <Badge variant="outline" className="border-[#C7A45A]/30 text-[#8B7355]">
              PWA 설치됨
            </Badge>
            <span className="text-sm text-[#8B7355] ml-auto">
              누적 주문 <span className="text-[#D61C1C] font-semibold">{recentOrdersCount}회</span>
            </span>
          </div>
          
          {/* 로그아웃 버튼 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
            {(user?.role === 'owner' || user?.role === 'admin') && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate('/admin')}
              >
                <Settings className="w-4 h-4 mr-2" />
                관리자
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 빠른 메뉴 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {/* 주문내역 */}
        <Link to="/order-history" className="block">
          <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.02] border-[#E5DDD5] h-full">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-[#D61C1C]/10 flex items-center justify-center mb-2">
                <ShoppingBag className="w-6 h-6 text-[#D61C1C]" />
              </div>
              <CardTitle className="text-[#2E1C10]">주문내역</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#8B7355]">
                최근 주문 확인
                <br />
                리뷰 작성하기
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 쿠폰함 */}
        <Link to="/coupons" className="block">
          <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.02] border-[#E5DDD5] h-full">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-[#F37021]/10 flex items-center justify-center mb-2">
                <Ticket className="w-6 h-6 text-[#F37021]" />
              </div>
              <CardTitle className="text-[#2E1C10]">쿠폰함</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#8B7355]">
                할인 쿠폰 확인
                <br />
                주문 시 적용
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 포인트 */}
        <Link to="/points" className="block">
          <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.02] border-[#E5DDD5] h-full">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-[#C7A45A]/10 flex items-center justify-center mb-2">
                <Gift className="w-6 h-6 text-[#C7A45A]" />
              </div>
              <CardTitle className="text-[#2E1C10]">포인트</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#8B7355]">
                적립·사용 내역
                <br />
                포인트 정책
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 알림 설정 */}
        <Link to="/notification-settings" className="block">
          <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.02] border-[#E5DDD5] h-full">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-[#2E1C10]">알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-[#8B7355]">
                푸시 알림 관리
                <br />
                마케팅 수신 동의
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* 1:1 문의 */}
        <Link to="/support" className="block col-span-2">
          <Card className="rounded-2xl hover:shadow-md transition-all hover:scale-[1.02] border-[#E5DDD5]">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-[#2E1C10]">1:1 문의</CardTitle>
                  <p className="text-sm text-[#8B7355] mt-1">
                    고객센터 채팅 · FAQ · 운영시간 안내
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* 추가 정보 */}
      <Card className="rounded-2xl border-[#E5DDD5] bg-[#F9F6F3]/50">
        <CardContent className="py-4">
          <div className="text-sm text-[#8B7355] space-y-1">
            <p>📱 <span className="font-medium text-[#2E1C10]">PWA 앱</span>으로 더 빠르게</p>
            <p>🎁 리뷰 작성 시 <span className="font-medium text-[#D61C1C]">포인트 적립</span></p>
            <p>🔔 주문 상태를 <span className="font-medium text-[#2E1C10]">실시간 알림</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

```

---

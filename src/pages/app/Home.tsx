import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ChevronRight, CloudSun, Star, Settings, Gift, Ticket } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { FEATURE_FLAGS } from '../../config/env';
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

  // 개발자 전용: 관리자 권한으로 전환
  const handleAdminAccess = (path: string) => {
    localStorage.setItem('mockRole', 'owner');
    navigate(path);
  };
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
                onClick={() => navigate(`/menu/${menu.menuId}`)}
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
          
          <div className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer" onClick={() => navigate('/review/1')}>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F37021] text-[#F37021]" />
                ))}
              </div>
              <span className="text-sm text-[#2E1C10]/60">김고객 님</span>
            </div>
            <p className="text-sm text-[#2E1C10] mb-3">
              칼국수 진짜 맛있어요! 국물이 진하고 면발도 쫄깃해요. 닭고기도 부드럽고 양도 푸짐합니다.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800"
                  alt="리뷰 사진"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square rounded-lg overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800"
                  alt="리뷰 사진"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
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
        
        {/* 개발자 전용: 관리자 페이지 바로가기 */}
        {/* TODO: 배포 전 삭제 필요 */}
        <div className="mt-4 p-4 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
          <p className="text-xs text-gray-500 mb-2 text-center">개발자 전용</p>
          <Button 
            variant="outline"
            size="sm"
            className="w-full border-gray-400 text-gray-700 hover:bg-gray-200 mb-2"
            onClick={() => navigate('/dev')}
          >
            <Settings className="w-4 h-4 mr-2" />
            🔧 디버그 페이지
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="w-full border-gray-400 text-gray-700 hover:bg-gray-200"
            onClick={() => handleAdminAccess('/admin')}
          >
            <Settings className="w-4 h-4 mr-2" />
            관리자 대시보드
          </Button>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button 
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => handleAdminAccess('/admin/orders')}
            >
              주문 관리
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => handleAdminAccess('/admin/reviews')}
            >
              리뷰 관리
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendCardProps {
  menu: Menu;
  onClick: () => void;
}

function RecommendCard({ menu, onClick }: RecommendCardProps) {
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
          src={menu.image}
          alt={menu.name}
          className="w-full h-full object-cover"
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
}

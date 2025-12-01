import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Star, Image as ImageIcon, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRecentReviews } from "@/lib/reviews.api";
import { toast } from "sonner";
import type { Review, ReviewSortOption, ReviewStats } from "@/types/review";

// Mock 데이터
const MOCK_REVIEWS: Review[] = [
  {
    id: "review-001",
    orderId: "order-001",
    userId: "user-001",
    userName: "김고객",
    rating: 5,
    content: "칼국수 진짜 맛있어요! 국물이 진하고 면발도 쫄깃해요. 닭고기도 부드럽고 양도 푸짐합니다. 다음에 또 주문할게요!",
    images: [
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800",
    ],
    menuNames: ["현풍닭칼국수"],
    createdAt: { seconds: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 2) / 1000), nanoseconds: 0 }, // 2일 전
    reply: {
      content: "감사합니다! 늘 맛있게 준비하겠습니다 😊",
      createdAt: { seconds: Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000), nanoseconds: 0 },
    },
  },
  {
    id: "review-002",
    orderId: "order-002",
    userId: "user-002",
    userName: "이손님",
    rating: 4,
    content: "맛있게 잘 먹었습니다. 배달도 빨랐어요!",
    images: [],
    menuNames: ["현풍닭칼국수"],
    createdAt: { seconds: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 5) / 1000), nanoseconds: 0 }, // 5일 전
  },
  {
    id: "review-003",
    orderId: "order-003",
    userId: "user-003",
    userName: "박미식",
    rating: 5,
    content: "현풍닭칼국수 정말 최고예요! 가격 대비 양도 많고 맛도 훌륭합니다. 사진으로는 다 담지 못할 정도로 푸짐해요. 강추!",
    images: [
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800",
      "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=800",
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800",
    ],
    menuNames: ["현풍닭칼국수"],
    createdAt: { seconds: Math.floor((Date.now() - 1000 * 60 * 60 * 24 * 7) / 1000), nanoseconds: 0 }, // 7일 전
  },
];

export function ReviewList() {
  const [searchParams] = useSearchParams();
  const storeId = searchParams.get("storeId") || "store-hyunpung";

  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [photoOnly, setPhotoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<ReviewSortOption>("latest");

  useEffect(() => {
    loadReviews();
  }, [storeId, photoOnly, sortBy]);

  async function loadReviews() {
    setLoading(true);
    try {
      // Firestore 데이터 로드
      const data = await getRecentReviews(50); // 최대 50개
      setReviews(data);

      // 통계 계산
      const total = data.length;
      const withPhotos = data.filter(r => r.images && r.images.length > 0).length;
      const totalRating = data.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = total > 0 ? totalRating / total : 0;

      const byRating: ReviewStats["byRating"] = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

      data.forEach(r => {
        const rating = Math.floor(r.rating) as 1 | 2 | 3 | 4 | 5;
        if (byRating[rating] !== undefined) {
          byRating[rating]++;
        }
      });

      setStats({
        total,
        averageRating,
        withPhotos,
        byRating,
      });
    } catch (error) {
      console.error("Failed to load reviews:", error);
      toast.error("리뷰를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp: any): string {
    if (!timestamp) return "";

    let date: Date;
    if (typeof timestamp === "number") {
      date = new Date(timestamp);
    } else if (timestamp.toDate) {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      return "";
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "오늘";
    if (days === 1) return "어제";
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    if (days < 365) return `${Math.floor(days / 30)}개월 전`;
    return date.toLocaleDateString();
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-[#333] mb-2">리뷰</h1>
        {stats && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-[#F37021] text-[#F37021]" />
              <span className="text-[#333]">{stats.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-[#8B7355]">
              리뷰 {stats.total}개 · 사진 {stats.withPhotos}개
            </span>
          </div>
        )}
      </div>

      {/* 별점 분포 */}
      {stats && (
        <Card className="p-4 mb-6">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count =
                stats.byRating[rating as keyof typeof stats.byRating];
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <Star className="w-4 h-4 fill-[#F37021] text-[#F37021]" />
                    <span className="text-[#333]">{rating}</span>
                  </div>
                  <div className="flex-1 h-2 bg-[#E5DDD5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F37021] transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-[#8B7355] w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* 필터 & 정렬 */}
      <div className="flex items-center gap-3 mb-6">
        <Tabs value={photoOnly ? "photo" : "all"} onValueChange={v => setPhotoOnly(v === "photo")}>
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="photo">사진리뷰</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={sortBy} onValueChange={v => setSortBy(v as ReviewSortOption)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="rating_high">별점 높은순</SelectItem>
            <SelectItem value="rating_low">별점 낮은순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 리뷰 목록 */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#D61C1C]" />
        </div>
      ) : reviews.length === 0 ? (
        <Card className="p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-[#C7A45A]" />
          <p className="text-[#333] mb-2">
            {photoOnly ? "사진 리뷰가 아직 없어요" : "리뷰가 아직 없어요"}
          </p>
          <p className="text-[#8B7355]">첫 번째 리뷰를 남겨주세요!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <Card key={review.id} className="p-4">
              {/* 리뷰 헤더 */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#333]">{review.userName}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "fill-[#F37021] text-[#F37021]" : "text-[#E5DDD5]"
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#8B7355]">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              {/* 리뷰 사진 */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {review.images.slice(0, 3).map((photo, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={photo}
                        alt={`리뷰 사진 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 리뷰 텍스트 */}
              <p className="text-[#333] mb-3 whitespace-pre-wrap">{review.content}</p>

              {/* 사장님 답글 */}
              {review.reply && (
                <div className="bg-[#F9F6F3] rounded-lg p-3 border-l-4 border-[#C7A45A]">
                  <p className="text-[#8B7355] mb-1">사장님</p>
                  <p className="text-[#333] whitespace-pre-wrap">{review.reply.content}</p>
                  <p className="text-[#8B7355] mt-2">{formatDate(review.reply.createdAt as any)}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

# Phase 2-3: 리뷰 시스템

## 🎯 목표

고객이 주문 후 리뷰를 작성하고, 다른 고객의 리뷰를 조회할 수 있는 완전한 리뷰 시스템을 구축합니다.

---

## 📋 PRD (Product Requirements Document)

### 1. 리뷰 데이터 모델

```typescript
// types/review.ts
export interface Review {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  
  // 메뉴 정보
  menuId: string;
  menuName: string;
  menuImage: string;
  
  // 평점 (1-5)
  rating: number;
  
  // 리뷰 내용
  content: string;
  
  // 이미지 (최대 5장)
  images: string[];
  
  // 태그 (선택)
  tags: string[];              // ['맛있어요', '양이 많아요', '배달이 빨라요']
  
  // 가게 답글
  reply?: {
    content: string;
    repliedAt: string;
    repliedBy: string;
  };
  
  // 신고
  isReported: boolean;
  reportReason?: string;
  
  // 통계
  helpfulCount: number;        // 도움됨 수
  
  // 타임스탬프
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewStats {
  totalCount: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  tagStats: Array<{
    tag: string;
    count: number;
  }>;
}
```

---

### 2. 리뷰 작성 페이지 (ReviewWrite.tsx)

#### 2.1 URL 구조
```
/reviews/write/:orderId
```

#### 2.2 UI 구조
```
┌─────────────────────────┐
│  ← 리뷰 작성             │
├─────────────────────────┤
│                         │
│  [주문 정보]             │
│  ┌──┬────────────────┐  │
│  │🍜│ 현풍닭칼국수    │  │
│  │  │ 2025.10.31     │  │
│  └──┴────────────────┘  │
│                         │
│  [별점 선택] *필수       │
│  ⭐⭐⭐⭐⭐              │
│  (탭하여 선택)           │
│                         │
│  [사진 업로드] 선택      │
│  ┌───┬───┬───┬───┬───┐ │
│  │ + │[📷]│   │   │   │ │
│  └───┴───┴───┴───┴───┘ │
│  (최대 5장)              │
│                         │
│  [리뷰 작성] *필수       │
│  ┌─────────────────────┐│
│  │ 음식은 어떠셨나요?   ││
│  │                     ││
│  │ (최소 10자 이상)    ││
│  └─────────────────────┘│
│  0 / 500자              │
│                         │
│  [태그 선택] 선택        │
│  ◯ 맛있어요             │
│  ◯ 양이 많아요          │
│  ◯ 배달이 빨라요        │
│  ◯ 친절해요             │
│  ◯ 재주문 의사 있어요   │
│  ◯ 포장이 깔끔해요      │
│                         │
│  ┌─────────────────────┐│
│  │  [등록하기]          ││
│  └─────────────────────┘│
│                         │
└─────────────────────────┘
```

#### 2.3 별점 선택 컴포넌트
```tsx
// components/app/StarRating.tsx
interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export function StarRating({ value, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={cn(
              sizeClasses[size],
              "transition-transform",
              !readonly && "hover:scale-110 active:scale-95"
            )}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            onClick={() => !readonly && onChange(star)}
          >
            <Star
              className={cn(
                "w-full h-full",
                isFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-none text-gray-300"
              )}
            />
          </button>
        );
      })}
      
      {!readonly && (
        <span className="ml-2 text-lg font-medium">
          {hoverValue || value || 0}/5
        </span>
      )}
    </div>
  );
}
```

#### 2.4 이미지 업로드
```tsx
// components/app/ImageUpload.tsx
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function ImageUpload({ images, onChange }: { 
  images: File[]; 
  onChange: (files: File[]) => void;
}) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // 파일 개수 체크
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`최대 ${MAX_IMAGES}장까지 업로드 가능합니다`);
      return;
    }
    
    // 파일 크기 체크
    const oversized = files.filter(f => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      toast.error('5MB 이하의 이미지만 업로드 가능합니다');
      return;
    }
    
    onChange([...images, ...files]);
  };
  
  const handleRemove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };
  
  return (
    <div className="grid grid-cols-5 gap-2">
      {/* 업로드 버튼 */}
      {images.length < MAX_IMAGES && (
        <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-hyunpung-red transition-colors">
          <Plus className="w-8 h-8 text-gray-400" />
          <span className="text-xs text-gray-500 mt-1">사진 추가</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}
      
      {/* 이미지 미리보기 */}
      {images.map((file, index) => (
        <div key={index} className="relative aspect-square">
          <img
            src={URL.createObjectURL(file)}
            alt={`리뷰 이미지 ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ))}
    </div>
  );
}
```

#### 2.5 태그 선택
```tsx
const REVIEW_TAGS = [
  { id: 'delicious', label: '맛있어요', icon: '😋' },
  { id: 'large-portion', label: '양이 많아요', icon: '🍽️' },
  { id: 'fast-delivery', label: '배달이 빨라요', icon: '🚀' },
  { id: 'kind', label: '친절해요', icon: '😊' },
  { id: 'reorder', label: '재주문 의사 있어요', icon: '👍' },
  { id: 'clean-packaging', label: '포장이 깔끔해요', icon: '📦' },
];

export function TagSelector({ selectedTags, onChange }: {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(t => t !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };
  
  return (
    <div className="flex flex-wrap gap-2">
      {REVIEW_TAGS.map(tag => (
        <button
          key={tag.id}
          type="button"
          onClick={() => toggleTag(tag.id)}
          className={cn(
            "px-4 py-2 rounded-full border transition-colors",
            selectedTags.includes(tag.id)
              ? "bg-hyunpung-red text-white border-hyunpung-red"
              : "bg-white text-gray-700 border-gray-300 hover:border-hyunpung-red"
          )}
        >
          <span className="mr-2">{tag.icon}</span>
          {tag.label}
        </button>
      ))}
    </div>
  );
}
```

#### 2.6 폼 제출
```tsx
// pages/app/ReviewWrite.tsx
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1, '별점을 선택해주세요').max(5),
  content: z.string().min(10, '최소 10자 이상 작성해주세요').max(500, '최대 500자까지 작성 가능합니다'),
  tags: z.array(z.string()).optional(),
});

export default function ReviewWrite() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: '',
      tags: [],
    },
  });
  
  const onSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      
      // 1. 이미지 업로드
      const imageUrls = await Promise.all(
        images.map(file => uploadReviewImage(orderId, file))
      );
      
      // 2. 리뷰 생성
      await createReview({
        orderId,
        userId: user.uid,
        userName: user.displayName || '익명',
        userAvatar: user.photoURL,
        rating: data.rating,
        content: data.content,
        images: imageUrls,
        tags: data.tags,
      });
      
      // 3. 성공 메시지
      toast.success('리뷰가 등록되었습니다!');
      
      // 4. 주문 상세 페이지로 이동
      navigate(`/orders/${orderId}`);
      
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('리뷰 등록에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <AppLayout>
      <AppHeader title="리뷰 작성" showBack />
      
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-4">
        {/* 주문 정보 */}
        <OrderSummary orderId={orderId} />
        
        {/* 별점 */}
        <FormField label="별점" required error={errors.rating?.message}>
          <StarRating
            value={watch('rating')}
            onChange={(rating) => setValue('rating', rating)}
          />
        </FormField>
        
        {/* 이미지 */}
        <FormField label="사진 업로드">
          <ImageUpload images={images} onChange={setImages} />
        </FormField>
        
        {/* 리뷰 내용 */}
        <FormField label="리뷰 작성" required error={errors.content?.message}>
          <Textarea
            {...register('content')}
            placeholder="음식은 어떠셨나요?"
            rows={5}
            maxLength={500}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {watch('content').length} / 500자
          </div>
        </FormField>
        
        {/* 태그 */}
        <FormField label="태그 선택">
          <TagSelector
            selectedTags={watch('tags')}
            onChange={(tags) => setValue('tags', tags)}
          />
        </FormField>
        
        {/* 제출 */}
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={submitting}
        >
          {submitting ? '등록 중...' : '등록하기'}
        </Button>
      </form>
    </AppLayout>
  );
}
```

---

### 3. 리뷰 목록 페이지 (ReviewList.tsx)

#### 3.1 URL 구조
```
/reviews
/reviews?menuId=xxx  (특정 메뉴의 리뷰)
```

#### 3.2 UI 구조
```
┌─────────────────────────┐
│  리뷰                    │
├─────────────────────────┤
│                         │
│  [통계 섹션]             │
│  ⭐ 4.8 / 5.0           │
│  234개의 리뷰            │
│                         │
│  ⭐⭐⭐⭐⭐ ████████ 180  │
│  ⭐⭐⭐⭐☆ ████░░░░  40  │
│  ⭐⭐⭐☆☆ ██░░░░░░  10  │
│  ⭐⭐☆☆☆ ░░░░░░░░   2  │
│  ⭐☆☆☆☆ ░░░░░░░░   2  │
│                         │
│  [인기 태그]             │
│  😋 맛있어요 156        │
│  🚀 배달 빨라요 98      │
│  🍽️ 양 많아요 87        │
│                         │
│  [정렬]                  │
│  ● 최신순 ◯ 별점높은순  │
│                         │
│  [필터]                  │
│  ◯ 전체                 │
│  ◯ 포토리뷰만           │
│  ◯ 별점 5점             │
│  ◯ 별점 4점             │
│                         │
├─────────────────────────┤
│  [리뷰 카드 1]           │
│  ┌─────────────────────┐│
│  │ 👤 홍길동   ⭐⭐⭐⭐⭐││
│  │ 2025.10.31          ││
│  │                     ││
│  │ [📷][📷][📷]        ││
│  │                     ││
│  │ 너무 맛있어요!       ││
│  │ 국물이 진하고...    ││
│  │                     ││
│  │ 😋 맛있어요          ││
│  │ 🚀 배달 빨라요      ││
│  │                     ││
│  │ 도움됨 12명          ││
│  │                     ││
│  │ ╭───────────────╮  ││
│  │ │ 🏪 사장님 답글  │  ││
│  │ │ 감사합니다!     │  ││
│  │ ╰───────────────╯  ││
│  └─────────────────────┘│
│                         │
│  [리뷰 카드 2]           │
│  ...                    │
│                         │
│  [더보기]                │
│                         │
└─────────────────────────┘
```

#### 3.3 통계 섹션
```tsx
// components/app/ReviewStats.tsx
export function ReviewStats({ stats }: { stats: ReviewStats }) {
  return (
    <Card className="p-6">
      {/* 평균 별점 */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-5xl font-bold text-hyunpung-red">
          {stats.averageRating.toFixed(1)}
        </div>
        <div>
          <StarRating value={stats.averageRating} readonly size="sm" />
          <p className="text-sm text-gray-600 mt-1">
            {stats.totalCount.toLocaleString()}개의 리뷰
          </p>
        </div>
      </div>
      
      {/* 별점 분포 */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating];
          const percentage = (count / stats.totalCount) * 100;
          
          return (
            <div key={rating} className="flex items-center gap-2">
              <div className="flex items-center gap-1 w-16">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{rating}</span>
              </div>
              
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* 인기 태그 */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">인기 태그</h3>
        <div className="flex flex-wrap gap-2">
          {stats.tagStats.slice(0, 5).map(({ tag, count }) => (
            <Badge key={tag} variant="secondary">
              {tag} {count}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
```

#### 3.4 리뷰 카드
```tsx
// components/app/ReviewCard.tsx
export function ReviewCard({ review }: { review: Review }) {
  const [showReply, setShowReply] = useState(false);
  const [helpful, setHelpful] = useState(false);
  
  return (
    <Card className="p-4">
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={review.userAvatar} />
            <AvatarFallback>{review.userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{review.userName}</p>
            <p className="text-xs text-gray-500">
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        
        <StarRating value={review.rating} readonly size="sm" />
      </div>
      
      {/* 이미지 */}
      {review.images.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {review.images.slice(0, 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg cursor-pointer"
              onClick={() => openImageViewer(review.images, index)}
            />
          ))}
          {review.images.length > 3 && (
            <div className="relative">
              <img
                src={review.images[3]}
                alt="더보기"
                className="w-full aspect-square object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium">
                  +{review.images.length - 3}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* 내용 */}
      <p className="text-gray-700 mb-3">{review.content}</p>
      
      {/* 태그 */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {review.tags.map(tag => (
            <Badge key={tag} variant="outline">
              {REVIEW_TAGS.find(t => t.id === tag)?.icon} {REVIEW_TAGS.find(t => t.id === tag)?.label}
            </Badge>
          ))}
        </div>
      )}
      
      {/* 도움됨 */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setHelpful(!helpful)}
          className={cn(
            "text-sm px-3 py-1 rounded-full border transition-colors",
            helpful
              ? "bg-hyunpung-red text-white border-hyunpung-red"
              : "bg-white text-gray-600 border-gray-300 hover:border-hyunpung-red"
          )}
        >
          👍 도움됨 {review.helpfulCount + (helpful ? 1 : 0)}
        </button>
      </div>
      
      {/* 사장님 답글 */}
      {review.reply && (
        <div className="bg-gray-50 rounded-lg p-3 mt-3">
          <div className="flex items-center gap-2 mb-2">
            <BowlIcon className="w-4 h-4 text-hyunpung-red" />
            <span className="text-sm font-medium">사장님 답글</span>
            <span className="text-xs text-gray-500">
              {formatDate(review.reply.repliedAt)}
            </span>
          </div>
          <p className="text-sm text-gray-700">{review.reply.content}</p>
        </div>
      )}
      
      {/* 신고 */}
      <div className="flex justify-end mt-3">
        <button className="text-xs text-gray-400 hover:text-gray-600">
          신고
        </button>
      </div>
    </Card>
  );
}
```

---

## 💬 프롬프트

```
현풍닭칼국수 PWA의 리뷰 시스템을 구축합니다.

## 작업 내용

### 1. 타입 정의 (`/types/review.ts`)
- Review 인터페이스 (완전한 구조)
- ReviewStats 인터페이스
- 상수: REVIEW_TAGS 배열

### 2. 리뷰 작성 페이지 (`/pages/app/ReviewWrite.tsx`)
- react-hook-form + zod 사용
- 별점 선택 (필수, 1-5)
- 이미지 업로드 (최대 5장, 5MB 제한)
- 리뷰 내용 (최소 10자, 최대 500자)
- 태그 선택 (다중 선택)
- Firebase Storage 업로드
- Firestore 리뷰 생성
- 성공 시 주문 상세 페이지 이동

### 3. StarRating 컴포넌트 (`/components/app/StarRating.tsx`)
- value, onChange, size, readonly props
- 호버 시 미리보기
- 클릭 시 선택
- 크기: sm(24px), md(40px), lg(64px)
- 채워진 별: fill-yellow-400
- 빈 별: fill-none text-gray-300

### 4. ImageUpload 컴포넌트 (`/components/app/ImageUpload.tsx`)
- 최대 5장 제한
- 파일 크기 체크 (5MB)
- 미리보기 + 삭제 버튼
- Grid 레이아웃 (5열)
- 업로드 버튼 (Plus 아이콘)

### 5. TagSelector 컴포넌트 (`/components/app/TagSelector.tsx`)
- 6개 태그 정의
- 다중 선택
- 선택된 태그: 현풍레드 배경
- 미선택 태그: 흰색 배경, 회색 테두리
- 호버 시 테두리 색상 변경

### 6. 리뷰 목록 페이지 (`/pages/app/ReviewList.tsx`)
- ReviewStats 표시
- 별점 분포 막대 그래프
- 인기 태그
- 정렬: 최신순 / 별점높은순 / 도움됨순
- 필터: 전체 / 포토리뷰 / 별점별
- 무한 스크롤
- 빈 상태 처리

### 7. ReviewStats 컴포넌트 (`/components/app/ReviewStats.tsx`)
- 평균 별점 (큰 숫자)
- 총 리뷰 수
- 별점 분포 (5점~1점)
- 각 별점 개수 및 비율
- 인기 태그 Top 5

### 8. ReviewCard 컴포넌트 (`/components/app/ReviewCard.tsx`)
- 사용자 정보 (아바타, 이름, 날짜)
- 별점
- 이미지 (Grid, 최대 3장 + 더보기)
- 리뷰 내용
- 태그 배지
- 도움됨 버튼 (토글)
- 사장님 답글 (있을 경우)
- 신고 버튼

### 9. API 함수 (`/lib/reviews.api.ts`)
```typescript
// 리뷰 생성
export async function createReview(data: {
  orderId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  content: string;
  images: string[];
  tags: string[];
}): Promise<Review>;

// 이미지 업로드
export async function uploadReviewImage(
  orderId: string,
  file: File
): Promise<string>;

// 리뷰 목록 조회
export async function fetchReviews(params: {
  menuId?: string;
  sortBy?: 'latest' | 'rating' | 'helpful';
  filter?: 'all' | 'photo' | 'rating5' | 'rating4';
  limit?: number;
  lastDoc?: any;
}): Promise<{ reviews: Review[]; lastDoc: any; hasMore: boolean }>;

// 리뷰 통계
export async function fetchReviewStats(
  menuId?: string
): Promise<ReviewStats>;

// 도움됨 토글
export async function toggleHelpful(
  reviewId: string,
  userId: string
): Promise<void>;
```

### 10. Mock 데이터 (`/data/reviews.json`)
최소 10개 리뷰:
- 다양한 별점 (5점 6개, 4점 2개, 3점 1개, 2점 1개)
- 일부 포토 리뷰
- 일부 사장님 답글 포함
- 다양한 태그

### 11. 구현 원칙
1. ✅ 이미지 최적화 (WebP, 압축)
2. ✅ 폼 유효성 검사 (zod)
3. ✅ 로딩 상태 (이미지 업로드 중)
4. ✅ 에러 처리 (toast)
5. ✅ 무한 스크롤
6. ✅ 이미지 뷰어 (클릭 시 확대)
7. ✅ 반응형 디자인

모든 파일을 100% 완성된 형태로 생성해주세요.
```

---

## ✅ 검증 체크리스트

- [ ] Review 타입이 정의되었는가?
- [ ] ReviewWrite 페이지에서 별점 선택이 가능한가?
- [ ] 이미지 업로드가 작동하는가? (최대 5장)
- [ ] 리뷰 내용 유효성 검사가 작동하는가?
- [ ] 태그 다중 선택이 가능한가?
- [ ] ReviewList 페이지에 통계가 표시되는가?
- [ ] 별점 분포 그래프가 정확한가?
- [ ] 정렬/필터가 작동하는가?
- [ ] ReviewCard가 모든 정보를 표시하는가?
- [ ] 사장님 답글이 구분되어 표시되는가?
- [ ] 도움됨 버튼이 토글되는가?
- [ ] 무한 스크롤이 작동하는가?

---

## 📌 다음 단계

**08-admin-dashboard.md** - 관리자 대시보드 및 주문 관리

---

**작성일**: 2025-10-31  
**개발사**: KS컴퍼니

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { toast } from 'sonner';
import { createReview } from '../../lib/reviews.api';
import type { Order } from '../../types/order';
import type { ReviewFormData } from '../../types/review';

interface ReviewFormProps {
    order: Order;
    userId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function ReviewForm({ order, userId, onSuccess, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ReviewFormData>();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (images.length + newFiles.length > 3) {
                toast.error('이미지는 최대 3개까지 업로드 가능합니다.');
                return;
            }
            setImages([...images, ...newFiles]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: ReviewFormData) => {
        if (!rating) {
            toast.error('별점을 선택해주세요.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createReview(order, userId, {
                ...data,
                rating,
                images
            });

            if (result.success) {
                toast.success('리뷰가 등록되었습니다.');
                onSuccess();
            } else {
                toast.error(result.error || '리뷰 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            toast.error('오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 별점 선택 */}
            <div className="flex flex-col items-center gap-2 py-4">
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`p-1 transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'
                                }`}
                        >
                            <Star className="w-8 h-8 fill-current" />
                        </button>
                    ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
                    {rating === 5 ? '정말 맛있어요!' :
                        rating === 4 ? '맛있어요' :
                            rating === 3 ? '보통이에요' :
                                rating === 2 ? '아쉬워요' : '별로예요'}
                </span>
            </div>

            {/* 리뷰 내용 */}
            <div className="space-y-2">
                <Textarea
                    placeholder="음식의 맛과 양, 포장 상태 등은 어떠셨나요?"
                    className="min-h-[120px] resize-none"
                    {...register('content', { required: '리뷰 내용을 입력해주세요.' })}
                />
                {errors.content && (
                    <span className="text-xs text-red-500">{errors.content.message}</span>
                )}
            </div>

            {/* 이미지 업로드 */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => document.getElementById('review-image-input')?.click()}
                    >
                        <ImageIcon className="w-4 h-4" />
                        사진 첨부하기
                    </Button>
                    <span className="text-xs text-gray-400">최대 3장</span>
                    <input
                        id="review-image-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                {images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                        {images.map((file, index) => (
                            <div key={index} className="relative flex-shrink-0 w-20 h-20 rounded-lg border overflow-hidden group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    className="flex-1 bg-[#D61C1C] hover:bg-[#B81515]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            등록 중
                        </>
                    ) : (
                        '리뷰 등록하기'
                    )}
                </Button>
            </div>
        </form>
    );
}

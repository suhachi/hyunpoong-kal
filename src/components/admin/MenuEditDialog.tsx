/**
 * 메뉴 편집 다이얼로그 (가격/설명 수정)
 */

import { useState, useEffect, useRef } from 'react';
import { Menu, MenuCategory, CATEGORY_LABELS } from '../../types/menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { formatPrice } from '../../lib/utils';
import { toast } from 'sonner';
import { Checkbox } from '../ui/checkbox';
import { Clock } from 'lucide-react';
import { uploadMenuImage, validateImageFile, deleteImageFromStorage } from '../../lib/storage';
import { USE_FIREBASE } from '../../config/env';
import { AdminMenuCustomOptionsEditor } from './AdminMenuCustomOptionsEditor';
import type { CustomOption } from '../../types/menu';

interface MenuEditDialogProps {
  menu: Menu | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: { name?: string; category?: MenuCategory; price?: number; description?: string; image?: string; customOptions?: CustomOption[] | undefined }, reason: string) => void;
  loading?: boolean;
}

export function MenuEditDialog({
  menu,
  open,
  onOpenChange,
  onSave,
  loading,
}: MenuEditDialogProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('noodle');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [reason, setReason] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 시간제 판매 설정
  const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
  const [timeLimitStart, setTimeLimitStart] = useState('11:00');
  const [timeLimitEnd, setTimeLimitEnd] = useState('14:00');

  // 커스텀 옵션 관리
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);

  // 다이얼로그 열릴 때 또는 menu가 변경될 때 초기값 설정
  useEffect(() => {
    if (open && menu) {
      setName(menu.name);
      setCategory(menu.category);
      setPrice(menu.price.toString());
      setDescription(menu.description || '');
      setReason('');
      setImageUrl(menu.image || '');
      setImageFile(null);
      // 커스텀 옵션 초기화
      setCustomOptions(menu.customOptions || []);
      // 시간제 판매 설정 초기화
      if (menu.availableHours) {
        setTimeLimitEnabled(true);
        setTimeLimitStart(menu.availableHours.start);
        setTimeLimitEnd(menu.availableHours.end);
      } else {
        setTimeLimitEnabled(false);
        setTimeLimitStart('11:00');
        setTimeLimitEnd('14:00');
      }
      // 파일 입력 필드 리셋
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (!open) {
      // 다이얼로그가 닫힐 때 상태 초기화
      setName('');
      setCategory('noodle');
      setPrice('');
      setDescription('');
      setReason('');
      setImageUrl('');
      setImageFile(null);
      setCustomOptions([]);
      setTimeLimitEnabled(false);
      setTimeLimitStart('11:00');
      setTimeLimitEnd('14:00');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [open, menu?.menuId]);

  // 다이얼로그 열릴 때 초기값 설정
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이전 blob URL 정리
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || '이미지 파일 검증에 실패했습니다.');
    }

    if (USE_FIREBASE && menu?.menuId) {
      // Firebase Storage에 업로드 (기존 이미지 삭제는 나중에 처리)
      try {
        const result = await uploadMenuImage(file, menu.menuId);
        console.log('[MenuEditDialog] Image uploaded to Firebase Storage:', result.path);
        return result.url;
      } catch (error: any) {
        console.error('[MenuEditDialog] Firebase Storage upload failed:', error);
        throw new Error(error.message || '이미지 업로드에 실패했습니다.');
      }
    } else {
      // Mock 모드 또는 menuId가 없는 경우: Base64로 변환
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String);
        };
        reader.onerror = () => {
          reject(new Error('이미지 읽기에 실패했습니다'));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!menu) {
      return;
    }

    const updates: { name?: string; category?: MenuCategory; price?: number; description?: string; image?: string; availableHours?: { start: string; end: string } | null; customOptions?: CustomOption[] | undefined } = {};

    // 메뉴명 변경
    if (name.trim() !== menu.name) {
      updates.name = name.trim();
    }

    // 카테고리 변경
    if (category !== menu.category) {
      updates.category = category;
    }

    const newPrice = parseInt(price);
    if (!isNaN(newPrice) && newPrice !== menu.price) {
      updates.price = newPrice;
    }

    if (description.trim() !== menu.description) {
      updates.description = description.trim();
    }

    // 이미지 변경 감지 및 저장
    const currentImageUrl = menu.image || '';
    const imageUrlChanged = imageUrl && imageUrl !== currentImageUrl;
    
    if (imageFile) {
      // 파일이 선택된 경우 업로드 후 URL 저장
      try {
        const uploadedUrl = await uploadImage(imageFile);
        updates.image = uploadedUrl;
      } catch (error) {
        console.error('Image upload failed:', error);
        toast.error('이미지 업로드에 실패했습니다');
        return; // 업로드 실패 시 저장 중단
      }
    } else if (imageUrlChanged && !imageUrl.startsWith('blob:')) {
      // 파일은 없지만 URL이 변경되었고, blob URL이 아닌 경우 (실제 URL)
      updates.image = imageUrl;
    }

    // 시간제 판매 설정 변경 감지
    const currentHours = menu.availableHours;
    const newHours = timeLimitEnabled ? { start: timeLimitStart, end: timeLimitEnd } : null;
    const hoursChanged = 
      (currentHours?.start !== newHours?.start) ||
      (currentHours?.end !== newHours?.end) ||
      (currentHours && !newHours) ||
      (!currentHours && newHours);
    
    if (hoursChanged) {
      updates.availableHours = newHours;
    }

    // 커스텀 옵션 변경 감지
    const currentCustomOptions = menu.customOptions || [];
    const validCustomOptions = customOptions.filter(opt => opt.name.trim().length > 0);
    const customOptionsChanged = 
      JSON.stringify(currentCustomOptions.map(opt => ({ id: opt.id, name: opt.name, price: opt.price, quantity: opt.quantity }))) !==
      JSON.stringify(validCustomOptions.map(opt => ({ id: opt.id, name: opt.name, price: opt.price, quantity: opt.quantity })));
    
    if (customOptionsChanged) {
      updates.customOptions = validCustomOptions.length > 0 ? validCustomOptions : undefined;
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    onSave(updates, reason.trim());
  };

  if (!menu) return null;

  const currentCustomOptions = menu.customOptions || [];
  const validCustomOptions = customOptions.filter(opt => opt.name.trim().length > 0);
  const customOptionsChanged = 
    JSON.stringify(currentCustomOptions.map(opt => ({ id: opt.id, name: opt.name, price: opt.price, quantity: opt.quantity }))) !==
    JSON.stringify(validCustomOptions.map(opt => ({ id: opt.id, name: opt.name, price: opt.price, quantity: opt.quantity })));

  const hasChanges =
    name.trim() !== menu.name ||
    category !== menu.category ||
    (parseInt(price) !== menu.price && !isNaN(parseInt(price))) ||
    description.trim() !== menu.description ||
    imageFile !== null ||
    (imageUrl && imageUrl !== (menu.image || "")) ||
    customOptionsChanged;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md !bg-gray-50 rounded-xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>메뉴 수정</DialogTitle>
            <DialogDescription>
              메뉴명, 가격, 설명, 사진을 수정합니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 메뉴명 */}
            <div className="space-y-2">
              <Label htmlFor="name">메뉴명</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="메뉴 이름을 입력하세요"
                maxLength={50}
              />
              {name.trim() !== menu.name && (
                <p className="text-xs text-[#F37021]">
                  {menu.name} → {name.trim() || '(이름 없음)'}
                </p>
              )}
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as MenuCategory)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {category !== menu.category && (
                <p className="text-xs text-[#F37021]">
                  {CATEGORY_LABELS[menu.category]} → {CATEGORY_LABELS[category]}
                </p>
              )}
            </div>

            {/* 사진 변경 */}
            <div className="space-y-2">
              <Label htmlFor="image">사진</Label>
              <div className="flex items-center gap-4">
                {imageUrl ? (
                  <img src={imageUrl} alt="미리보기" className="w-20 h-20 rounded object-cover border" onError={e => { e.currentTarget.style.display = 'none'; }} />
                ) : (
                  <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-gray-400">사진 없음</div>
                )}
                <input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block"
                />
              </div>
            </div>

            {/* 가격 */}
            <div className="space-y-2">
              <Label htmlFor="price">가격 (원)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
                step="500"
                placeholder="9000"
              />
              {parseInt(price) !== menu.price && !isNaN(parseInt(price)) && (
                <p className="text-xs text-[#F37021]">
                  {formatPrice(menu.price)} → {formatPrice(parseInt(price))}
                </p>
              )}
            </div>

            {/* 설명 */}
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                maxLength={200}
                placeholder="메뉴 설명을 입력하세요"
              />
              <p className="text-xs text-gray-500 text-right">
                {description.length}/200자
              </p>
            </div>

            {/* 시간제 판매 설정 */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <Label className="text-base font-medium">시간제 판매 설정</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timeLimitEnabled"
                  checked={timeLimitEnabled}
                  onCheckedChange={(checked) => setTimeLimitEnabled(checked as boolean)}
                />
                <Label htmlFor="timeLimitEnabled" className="cursor-pointer">
                  시간제 판매 사용
                </Label>
              </div>
              {timeLimitEnabled && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <Label htmlFor="timeLimitStart">시작 시간</Label>
                    <Input
                      id="timeLimitStart"
                      type="time"
                      value={timeLimitStart}
                      onChange={e => setTimeLimitStart(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeLimitEnd">종료 시간</Label>
                    <Input
                      id="timeLimitEnd"
                      type="time"
                      value={timeLimitEnd}
                      onChange={e => setTimeLimitEnd(e.target.value)}
                    />
                  </div>
                </div>
              )}
              {timeLimitEnabled && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
                  💡 <strong>{timeLimitStart} ~ {timeLimitEnd}</strong> 시간대에만 주문이 가능합니다.
                </div>
              )}
            </div>

            {/* 커스텀 옵션 관리 */}
            <div className="space-y-2">
              <AdminMenuCustomOptionsEditor
                value={customOptions}
                onChange={setCustomOptions}
              />
            </div>

            {/* 변경 사유 */}
            {hasChanges && (
              <div className="space-y-2">
                <Label htmlFor="reason">변경 사유</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="예: 원가 상승으로 인한 가격 조정 (선택사항)"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges || loading}
            >
              {loading ? '저장 중...' : '저장'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

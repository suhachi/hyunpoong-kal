/**
 * 메뉴 등록 다이얼로그
 * Phase 2-6: 신규 메뉴 생성 폼
 * 옵션 그룹을 동적으로 선택하고 사용
 */

import { useState, useEffect } from 'react';
import { Menu, MenuCategory, MenuBadge, CATEGORY_LABELS, BADGE_LABELS, MenuOptionGroup } from '../../types/menu';
import { OptionGroup } from '../../types/menu';
import { getOptionGroups } from '../../lib/admin/optionGroups.api';
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
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../lib/utils';

interface MenuCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (menuData: Partial<Menu>) => Promise<void>;
}

export function MenuCreateDialog({
  open,
  onOpenChange,
  onSave,
}: MenuCreateDialogProps) {
  // 기본 정보
  const [name, setName] = useState('');
  const [category, setCategory] = useState<MenuCategory>('noodle');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [selectedBadges, setSelectedBadges] = useState<MenuBadge[]>([]);
  const [allergens, setAllergens] = useState('');
  const [origin, setOrigin] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // 이미지
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 옵션 그룹 관리
  const [availableOptionGroups, setAvailableOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedOptionGroupIds, setSelectedOptionGroupIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  // 옵션 그룹 로드
  useEffect(() => {
    if (open) {
      loadOptionGroups();
    }
  }, [open]);

  const loadOptionGroups = async () => {
    try {
      const groups = await getOptionGroups();
      setAvailableOptionGroups(groups);
    } catch (error) {
      console.error('Failed to load option groups:', error);
    }
  };

  // 배지 토글
  const handleToggleBadge = (badge: MenuBadge) => {
    setSelectedBadges(prev =>
      prev.includes(badge)
        ? prev.filter(b => b !== badge)
        : [...prev, badge]
    );
  };

  // 이미지 URL 설정
  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
    setImageFile(null);
  };

  // 이미지 파일 선택 핸들러
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageUrl('');
    }
  };

  // 이미지 업로드 함수 (Firebase Storage 연동 필요, 여기선 mock)
  const uploadImage = async (file: File): Promise<string> => {
    // TODO: 실제 Firebase Storage 업로드 구현 필요
    // 예시: await uploadToFirebase(file)
    // 여기선 임시로 local preview URL 반환
    return URL.createObjectURL(file);
  };

  // 옵션 그룹 선택/해제
  const handleToggleOptionGroup = (groupId: string) => {
    setSelectedOptionGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // 폼 초기화
  const resetForm = () => {
    setName('');
    setCategory('noodle');
    setPrice('');
    setDescription('');
    setSelectedBadges([]);
    setAllergens('');
    setOrigin('');
    setIsAvailable(true);
    setImageUrl('');
    setImagePreview('');
    setImageFile(null);
    setSelectedOptionGroupIds([]);
  };

  // 저장 핸들러
  const handleSave = async () => {
    // 검증
    if (!name.trim()) {
      toast.error('메뉴 이름을 입력하세요');
      return;
    }
    if (!price || parseFloat(price) < 0) {
      toast.error('올바른 가격을 입력하세요');
      return;
    }
    if (!imageUrl.trim() && !imageFile) {
      toast.error('이미지 URL 또는 파일을 입력하세요');
      return;
    }
    setLoading(true);
    try {
      const selectedGroups = availableOptionGroups.filter(group =>
        selectedOptionGroupIds.includes(group.id)
      );
      let finalImageUrl = imageUrl.trim();
      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }
      const menuData: Partial<Menu> = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        description: description.trim(),
        badges: selectedBadges,
        allergens: allergens.trim(),
        origin: origin.trim() || '국내산',
        isAvailable,
        image: finalImageUrl,
        optionGroups: selectedGroups,
      };
      await onSave(menuData);
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || '메뉴 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // --- JSX 반환 시작 ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>메뉴 등록</DialogTitle>
          <DialogDescription>
            새로운 메뉴를 등록합니다. 필수 항목(*)을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-6">
            {/* 이미지 등록 (URL 또는 파일) */}
            <div>
              <Label htmlFor="imageUrl">이미지 URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={e => handleImageUrlChange(e.target.value)}
                disabled={!!imageFile}
              />
              <p className="text-xs text-gray-500 mt-1">
                권장: 1600px, WebP 형식, 3MB 이하
              </p>
              <Label htmlFor="imageFile" className="mt-2">이미지 파일 업로드</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                disabled={!!imageUrl}
              />
              {/* 이미지 미리보기 */}
              {imagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={() => {
                      setImagePreview('');
                      toast.error('이미지를 불러올 수 없습니다');
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setImageUrl('');
                      setImageFile(null);
                    }}
                  >
                    제거
                  </Button>
                </div>
              )}
            </div>
            {/* 카테고리 */}
            <div>
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={category} onValueChange={setCategory}>
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
            </div>
            {/* 가격 */}
            <div>
              <Label htmlFor="price">가격 (원) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="9000"
                value={price}
                onChange={e => setPrice(e.target.value)}
                min="0"
              />
            </div>
            {/* 설명 */}
            <div>
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                placeholder="메뉴 설명을 입력하세요"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {/* 배지 */}
            <div>
              <Label>배지</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(BADGE_LABELS).map(([key, label]) => (
                  <Badge
                    key={key}
                    variant={selectedBadges.includes(key as MenuBadge) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleToggleBadge(key as MenuBadge)}
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
            {/* 옵션 그룹 등 기타 필드 추가 필요시 여기에 */}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => { resetForm(); onOpenChange(false); }} disabled={loading}>취소</Button>
              <Button type="submit" disabled={loading}>등록</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

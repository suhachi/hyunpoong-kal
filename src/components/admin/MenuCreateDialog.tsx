/**
 * 메뉴 등록 다이얼로그
 * Phase 2-6: 신규 메뉴 생성 폼
 * 옵션 그룹을 동적으로 선택하고 사용
 */

import { useState, useEffect } from 'react';
import { Menu, MenuCategory, MenuBadge, CATEGORY_LABELS, BADGE_LABELS, MenuOptionGroup, CustomOption } from '../../types/menu';
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
import { Plus, X, Upload, Image as ImageIcon, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../lib/utils';
import { uploadMenuImage, validateImageFile } from '../../lib/storage';
import { USE_FIREBASE } from '../../config/env';

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
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 옵션 그룹 관리
  const [availableOptionGroups, setAvailableOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedOptionGroupIds, setSelectedOptionGroupIds] = useState<string[]>([]);

  // 커스텀 옵션 관리 (신규)
  const [customOptions, setCustomOptions] = useState<CustomOption[]>([]);

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

  // 이미지 파일 선택 핸들러
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 검증
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || '이미지 파일 검증에 실패했습니다.');
        e.target.value = ''; // 파일 선택 초기화
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 이미지 업로드 함수
  const uploadImage = async (file: File): Promise<string> => {
    // 파일 검증
    const validation = validateImageFile(file);
    if (!validation.valid) {
      throw new Error(validation.error || '이미지 파일 검증에 실패했습니다.');
    }

    if (USE_FIREBASE) {
      // Firebase Storage에 업로드
      try {
        const result = await uploadMenuImage(file);
        console.log('[MenuCreateDialog] Image uploaded to Firebase Storage:', result.path);
        return result.url;
      } catch (error: any) {
        console.error('[MenuCreateDialog] Firebase Storage upload failed:', error);
        throw new Error(error.message || '이미지 업로드에 실패했습니다.');
      }
    } else {
      // Mock 모드: 임시 blob URL 반환
      return URL.createObjectURL(file);
    }
  };

  // 옵션 그룹 선택/해제
  const handleToggleOptionGroup = (groupId: string) => {
    setSelectedOptionGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // 커스텀 옵션 추가
  const handleAddCustomOption = () => {
    const newOption: CustomOption = {
      id: `option-${Date.now()}`,
      name: '',
      price: 0,
      quantity: 1,
    };
    setCustomOptions(prev => [...prev, newOption]);
  };

  // 커스텀 옵션 제거
  const handleRemoveCustomOption = (id: string) => {
    setCustomOptions(prev => prev.filter(opt => opt.id !== id));
  };

  // 커스텀 옵션 업데이트
  const handleUpdateCustomOption = (id: string, field: keyof CustomOption, value: string | number) => {
    setCustomOptions(prev =>
      prev.map(opt =>
        opt.id === id ? { ...opt, [field]: value } : opt
      )
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
    setImagePreview('');
    setImageFile(null);
    setSelectedOptionGroupIds([]);
    setCustomOptions([]);
  };

  // 저장 핸들러
  const handleSave = async () => {
    console.log('[MenuCreateDialog] handleSave called');
    // 검증
    if (!name.trim()) {
      console.log('[MenuCreateDialog] Validation failed: name is empty');
      toast.error('메뉴 이름을 입력하세요');
      return;
    }
    if (!price || parseFloat(price) < 0) {
      console.log('[MenuCreateDialog] Validation failed: invalid price');
      toast.error('올바른 가격을 입력하세요');
      return;
    }
    if (!imageFile) {
      console.log('[MenuCreateDialog] Validation failed: no image file');
      toast.error('이미지 파일을 선택하세요');
      return;
    }
    console.log('[MenuCreateDialog] Validation passed, starting save process');
    setLoading(true);
    try {
      const selectedGroups = availableOptionGroups.filter(group =>
        selectedOptionGroupIds.includes(group.id)
      );
      console.log('[MenuCreateDialog] Selected option groups:', selectedGroups.length);
      // 이미지 파일 업로드
      console.log('[MenuCreateDialog] Uploading image file...');
      console.log('[MenuCreateDialog] USE_FIREBASE:', USE_FIREBASE);
      let finalImageUrl: string;
      if (USE_FIREBASE) {
        try {
          // Firebase 모드: 임시 ID로 업로드 (메뉴 생성 후 실제 ID로 업데이트 필요)
          const tempMenuId = `temp-${Date.now()}`;
          console.log('[MenuCreateDialog] Calling uploadMenuImage with tempMenuId:', tempMenuId);
          const result = await uploadMenuImage(imageFile!, tempMenuId);
          finalImageUrl = result.url;
          console.log('[MenuCreateDialog] Image uploaded to Firebase Storage:', result.path);
          console.log('[MenuCreateDialog] Firebase Storage URL:', finalImageUrl);
        } catch (error: any) {
          console.error('[MenuCreateDialog] Firebase Storage upload failed:', error);
          toast.error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          setLoading(false);
          return;
        }
      } else {
        // Mock 모드: blob URL 사용
        console.log('[MenuCreateDialog] Mock mode: using blob URL');
        finalImageUrl = await uploadImage(imageFile!);
      }
      console.log('[MenuCreateDialog] Image uploaded, URL:', finalImageUrl);
      // allergens를 string[]로 변환 (쉼표로 구분된 문자열을 배열로 변환)
      const allergensArray = allergens.trim()
        ? allergens.split(',').map(a => a.trim()).filter(a => a.length > 0)
        : [];
      // 유효한 커스텀 옵션만 필터링 (이름이 있는 것만)
      const validCustomOptions = customOptions.filter(opt => opt.name.trim().length > 0);

      const menuData: Partial<Menu> = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        description: description.trim(),
        badges: selectedBadges,
        allergens: allergensArray,
        origin: origin.trim() || '국내산',
        isAvailable,
        image: finalImageUrl,
        customOptions: validCustomOptions.length > 0 ? validCustomOptions : undefined,
        optionGroups: selectedGroups,
      };
      console.log('[MenuCreateDialog] menuData prepared:', menuData);
      console.log('[MenuCreateDialog] Calling onSave...');
      await onSave(menuData);
      console.log('[MenuCreateDialog] onSave completed successfully');
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error('[MenuCreateDialog] Error in handleSave:', error);
      toast.error(error.message || '메뉴 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // --- JSX 반환 시작 ---
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-50">
        <DialogHeader>
          <DialogTitle>메뉴 등록</DialogTitle>
          <DialogDescription>
            새로운 메뉴를 등록합니다. 필수 항목(*)을 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-6">
            {/* 이미지 파일 업로드 */}
            <div>
              <Label htmlFor="imageFile">이미지 파일 *</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                권장: 1600px, WebP 형식, 3MB 이하
              </p>
              {/* 이미지 미리보기 */}
              {imagePreview && (
                <div className="mt-3 relative">
                  <img
                    src={imagePreview}
                    alt="미리보기"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={() => {
                      setImagePreview('');
                      setImageFile(null);
                      toast.error('이미지를 불러올 수 없습니다');
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                    }}
                  >
                    제거
                  </Button>
                </div>
              )}
            </div>
            {/* 메뉴 이름 */}
            <div>
              <Label htmlFor="name">메뉴 이름 *</Label>
              <Input
                id="name"
                type="text"
                placeholder="예: 닭칼국수"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
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
                {Object.entries(BADGE_LABELS).map(([key, label]) => {
                  const isSelected = selectedBadges.includes(key as MenuBadge);
                  const badgeKey = key as MenuBadge;
                  // 배지별 색상 정의
                  const badgeColors: Record<MenuBadge, { selected: string; unselected: string }> = {
                    best: { selected: 'bg-red-500 text-white border-red-500', unselected: 'bg-red-50 text-red-600 border-red-200' },
                    signature: { selected: 'bg-purple-500 text-white border-purple-500', unselected: 'bg-purple-50 text-purple-600 border-purple-200' },
                    spicy: { selected: 'bg-orange-500 text-white border-orange-500', unselected: 'bg-orange-50 text-orange-600 border-orange-200' },
                    cold: { selected: 'bg-blue-500 text-white border-blue-500', unselected: 'bg-blue-50 text-blue-600 border-blue-200' },
                    seasonal: { selected: 'bg-green-500 text-white border-green-500', unselected: 'bg-green-50 text-green-600 border-green-200' },
                  };
                  const colors = badgeColors[badgeKey];
                  return (
                    <Badge
                      key={key}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer border-2 transition-colors ${isSelected ? colors.selected : colors.unselected
                        }`}
                      onClick={() => handleToggleBadge(badgeKey)}
                    >
                      {label}
                    </Badge>
                  );
                })}
              </div>
            </div>
            {/* 커스텀 옵션 관리 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>메뉴 옵션</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCustomOption}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  옵션 추가
                </Button>
              </div>
              {customOptions.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center border-2 border-dashed rounded-lg">
                  옵션을 추가하려면 "옵션 추가" 버튼을 클릭하세요
                </p>
              ) : (
                <div className="space-y-3">
                  {customOptions.map((option, index) => (
                    <Card key={option.id} className="bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-3 gap-3">
                            <div>
                              <Label htmlFor={`option-name-${option.id}`} className="text-xs">
                                옵션명 *
                              </Label>
                              <Input
                                id={`option-name-${option.id}`}
                                type="text"
                                placeholder="예: 곱빼기"
                                value={option.name}
                                onChange={e =>
                                  handleUpdateCustomOption(option.id, 'name', e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`option-price-${option.id}`} className="text-xs">
                                추가 가격 (원)
                              </Label>
                              <Input
                                id={`option-price-${option.id}`}
                                type="number"
                                placeholder="0"
                                value={option.price}
                                onChange={e =>
                                  handleUpdateCustomOption(
                                    option.id,
                                    'price',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                min="0"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`option-quantity-${option.id}`} className="text-xs">
                                수량
                              </Label>
                              <Input
                                id={`option-quantity-${option.id}`}
                                type="number"
                                placeholder="1"
                                value={option.quantity}
                                onChange={e =>
                                  handleUpdateCustomOption(
                                    option.id,
                                    'quantity',
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                min="1"
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveCustomOption(option.id)}
                            className="mt-6"
                          >
                            <X className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* 알레르기 정보 */}
            <div>
              <Label htmlFor="allergens">알레르기 유발 성분</Label>
              <Input
                id="allergens"
                type="text"
                placeholder="예: 밀, 대두, 닭고기 (쉼표로 구분)"
                value={allergens}
                onChange={e => setAllergens(e.target.value)}
              />
            </div>

            {/* 원산지 */}
            <div>
              <Label htmlFor="origin">원산지</Label>
              <Input
                id="origin"
                type="text"
                placeholder="예: 국내산"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
              />
            </div>
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

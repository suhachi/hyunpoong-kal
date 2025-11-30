/**
 * 메뉴 커스텀 옵션 편집 컴포넌트
 * 메뉴 등록/수정 다이얼로그에서 공통으로 사용
 */

import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Plus, X } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import type { CustomOption } from '../../types/menu';

interface AdminMenuCustomOptionsEditorProps {
  value: CustomOption[];
  onChange: (next: CustomOption[]) => void;
}

export function AdminMenuCustomOptionsEditor({
  value,
  onChange,
}: AdminMenuCustomOptionsEditorProps) {
  const [customOptions, setCustomOptions] = useState<CustomOption[]>(value);

  // 옵션 추가
  const handleAddCustomOption = () => {
    const newOption: CustomOption = {
      id: `option-${Date.now()}`,
      name: '',
      price: 0,
      quantity: 1,
    };
    const next = [...customOptions, newOption];
    setCustomOptions(next);
    onChange(next);
  };

  // 옵션 제거
  const handleRemoveCustomOption = (id: string) => {
    const next = customOptions.filter(opt => opt.id !== id);
    setCustomOptions(next);
    onChange(next);
  };

  // 옵션 업데이트
  const handleUpdateCustomOption = (id: string, field: keyof CustomOption, value: string | number) => {
    const next = customOptions.map(opt =>
      opt.id === id ? { ...opt, [field]: value } : opt
    );
    setCustomOptions(next);
    // 빈 이름 필터링 후 onChange 호출
    const validOptions = next.filter(opt => opt.name.trim().length > 0);
    onChange(validOptions);
  };

  return (
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
  );
}


/**
 * 메뉴 CSV 일괄 등록
 * Phase 2-6: CSV 파일로 메뉴 대량 등록
 */

import { useState } from 'react';
import { Menu } from '../../types/menu';
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
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../../lib/utils';

interface CSVRow {
  name: string;
  category: string;
  price: string;
  description: string;
  badges: string;
  options: string;
  imageUrl: string;
  allergens: string;
  origin: string;
}

interface ParsedMenu {
  data: Partial<Menu>;
  errors: string[];
  row: number;
}

interface MenuCSVImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (menus: Partial<Menu>[]) => Promise<void>;
}

export function MenuCSVImport({
  open,
  onOpenChange,
  onImport,
}: MenuCSVImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedMenus, setParsedMenus] = useState<ParsedMenu[]>([]);
  const [loading, setLoading] = useState(false);

  // CSV 파싱
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('CSV 파일만 업로드 가능합니다');
      return;
    }

    setFile(selectedFile);

    try {
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());

      if (lines.length < 2) {
        toast.error('CSV 파일에 데이터가 없습니다');
        return;
      }

      // 헤더 확인
      const headers = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['name', 'category', 'price'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        toast.error(`필수 컬럼이 누락되었습니다: ${missingHeaders.join(', ')}`);
        return;
      }

      // 데이터 파싱
      const parsed: ParsedMenu[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        const errors: string[] = [];
        const menuData: Partial<Menu> = {};

        // 이름 검증
        if (!row.name || row.name.length > 50) {
          errors.push('이름은 필수이며 50자 이내여야 합니다');
        } else {
          menuData.name = row.name;
        }

        // 카테고리 검증
        const validCategories = ['noodle', 'set', 'side', 'drink', 'alcohol'];
        if (!validCategories.includes(row.category)) {
          errors.push('유효하지 않은 카테고리입니다');
        } else {
          menuData.category = row.category as any;
        }

        // 가격 검증
        const price = parseInt(row.price);
        if (isNaN(price) || price < 0) {
          errors.push('가격은 0 이상의 정수여야 합니다');
        } else {
          menuData.price = price;
        }

        // 설명
        if (row.description) {
          menuData.description = row.description;
        }

        // 배지
        if (row.badges) {
          const badges = row.badges.split('|').map(b => b.trim());
          menuData.badges = badges as any;
        }

        // 옵션 (JSON)
        if (row.options) {
          try {
            menuData.options = JSON.parse(row.options);
          } catch {
            errors.push('옵션 JSON 형식이 잘못되었습니다');
          }
        }

        // 이미지
        if (row.imageUrl) {
          menuData.image = row.imageUrl;
        } else {
          errors.push('이미지 URL은 필수입니다');
        }

        // 알레르기
        if (row.allergens) {
          menuData.allergens = row.allergens.split('|').map(a => a.trim());
        }

        // 원산지
        if (row.origin) {
          menuData.origin = row.origin;
        }

        menuData.isAvailable = true;
        menuData.order = 999;

        parsed.push({
          data: menuData,
          errors,
          row: i + 1,
        });
      }

      setParsedMenus(parsed);
      toast.success(`${parsed.length}개 메뉴를 확인했습니다`);
    } catch (error) {
      console.error('CSV parsing error:', error);
      toast.error('CSV 파일을 읽는데 실패했습니다');
    }
  };

  // 일괄 등록
  const handleImport = async () => {
    const validMenus = parsedMenus.filter(m => m.errors.length === 0);

    if (validMenus.length === 0) {
      toast.error('등록 가능한 메뉴가 없습니다');
      return;
    }

    setLoading(true);

    try {
      await onImport(validMenus.map(m => m.data));
      
      toast.success(`${validMenus.length}개 메뉴가 등록되었습니다`);
      onOpenChange(false);
      
      // 초기화
      setFile(null);
      setParsedMenus([]);
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || '일괄 등록에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const validCount = parsedMenus.filter(m => m.errors.length === 0).length;
  const errorCount = parsedMenus.filter(m => m.errors.length > 0).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto !bg-gray-50 rounded-xl p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle>CSV 일괄 등록</DialogTitle>
          <DialogDescription>
            CSV 파일로 여러 메뉴를 한 번에 등록합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* CSV 형식 안내 */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <AlertDescription className="text-sm">
              <p className="mb-3 font-semibold text-blue-900">CSV 파일 형식:</p>
              <code className="text-sm bg-gray-100 p-3 block rounded font-mono break-all">
                name,category,price,description,badges,options,imageUrl,allergens,origin
              </code>
              <div className="mt-3 text-sm space-y-1">
                <p>• <strong>필수:</strong> name, category, price, imageUrl</p>
                <p>• <strong>badges:</strong> 파이프(|)로 구분 (예: best|signature)</p>
                <p>• <strong>options:</strong> JSON 형식</p>
                <p>• <strong>allergens/origin:</strong> 파이프(|)로 구분</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* 파일 선택 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CSV 파일 선택
            </label>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="h-12 text-base"
            />
            {file && (
              <p className="text-sm text-gray-600 mt-2">
                선택된 파일: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          {/* 미리보기 */}
          {parsedMenus.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-base px-3 py-1">
                  정상 {validCount}개
                </Badge>
                {errorCount > 0 && (
                  <Badge variant="destructive" className="text-base px-3 py-1">
                    오류 {errorCount}개
                  </Badge>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3 border-2 rounded-lg p-4 bg-gray-50">
                {parsedMenus.map((menu, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      menu.errors.length > 0 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base text-[#333] mb-1">
                          {menu.errors.length > 0 ? (
                            <AlertCircle className="w-5 h-5 inline mr-2 text-red-600 align-middle" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 inline mr-2 text-green-600 align-middle" />
                          )}
                          <span className="font-semibold">
                            {menu.data.name || '(이름 없음)'}
                          </span>
                          <span className="ml-2 text-[#D61C1C] font-medium">
                            {menu.data.price ? formatPrice(menu.data.price) : '0원'}
                          </span>
                        </p>
                        {menu.data.category && (
                          <p className="text-sm text-gray-600 mb-2">
                            카테고리: {menu.data.category}
                          </p>
                        )}
                        {menu.errors.length > 0 && (
                          <ul className="mt-2 text-sm text-red-700 space-y-1">
                            {menu.errors.map((error, i) => (
                              <li key={i} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{error}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                        행 {menu.row}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
            disabled={loading}
          >
            취소
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || validCount === 0}
            className="min-w-[150px]"
          >
            {loading ? '등록 중...' : `${validCount}개 메뉴 등록`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

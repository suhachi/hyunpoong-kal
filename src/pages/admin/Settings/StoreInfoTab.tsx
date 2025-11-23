/**
 * 가게 정보 설정 탭
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Separator } from '../../../components/ui/separator';
import { Store, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { storeDocRef, type StoreDoc } from '../../../lib/firebase/firestore-schema';
import { STORE_ID } from '../../../config/env';
import { useAuth } from '../../../contexts/AuthContext';
import { StoreLocationPicker } from '../../../components/admin/StoreLocationPicker';
import { AddressSearch } from '../../../components/admin/AddressSearch';

export function StoreInfoTab() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [storeInfo, setStoreInfo] = useState<Partial<StoreDoc>>({
    storeId: STORE_ID,
    name: '',
    address: {
      full: '',
      detail: '',
    },
    phone: '',
    businessHours: {
      open: '10:00',
      close: '22:00',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    },
    isOpen: true,
    deliveryAvailable: true,
    minOrderAmount: 15000,
    deliveryFee: 3000,
    settings: {
      pointsRate: 0.03,
      pointsMinUse: 1000,
    },
  });

  // 가게 정보 로드
  useEffect(() => {
    loadStoreInfo();
  }, []);

  const loadStoreInfo = async () => {
    setLoading(true);
    try {
      const docRef = storeDocRef(STORE_ID);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as StoreDoc;
        setStoreInfo({
          ...data,
        });
      } else {
        // 문서가 없으면 기본값 유지
        console.log('[StoreInfoTab] Store document does not exist, using defaults');
      }
    } catch (error: any) {
      console.error('[StoreInfoTab] Failed to load store info:', error);
      toast.error('가게 정보를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('로그인이 필요합니다');
      return;
    }

    // 필수 항목 검증
    if (!storeInfo.name || !storeInfo.name.trim()) {
      toast.error('가게 이름을 입력해주세요');
      return;
    }

    if (!storeInfo.phone || !storeInfo.phone.trim()) {
      toast.error('전화번호를 입력해주세요');
      return;
    }

    if (!storeInfo.address?.full || !storeInfo.address.full.trim()) {
      toast.error('주소를 입력해주세요');
      return;
    }

    setSaving(true);
    try {
      const docRef = storeDocRef(STORE_ID);
      
      // address 객체 생성 (undefined 값 제거)
      const addressData: any = {
        full: storeInfo.address?.full?.trim() || '',
        detail: storeInfo.address?.detail?.trim() || '',
      };
      
      // lat/lng가 있을 때만 추가 (undefined 제거)
      if (storeInfo.address?.lat != null) {
        addressData.lat = storeInfo.address.lat;
      }
      if (storeInfo.address?.lng != null) {
        addressData.lng = storeInfo.address.lng;
      }
      
      const updateData: Partial<StoreDoc> = {
        storeId: STORE_ID,
        name: storeInfo.name.trim(),
        phone: storeInfo.phone.trim(),
        address: addressData,
        businessHours: storeInfo.businessHours || {
          open: '10:00',
          close: '22:00',
          days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        },
        isOpen: storeInfo.isOpen ?? true,
        deliveryAvailable: storeInfo.deliveryAvailable ?? true,
        minOrderAmount: storeInfo.minOrderAmount || 15000,
        deliveryFee: storeInfo.deliveryFee || 3000,
        settings: storeInfo.settings || {
          pointsRate: 0.03,
          pointsMinUse: 1000,
        },
        updatedAt: serverTimestamp(),
      };

      // createdAt이 없으면 현재 시간으로 설정
      if (!storeInfo.createdAt) {
        updateData.createdAt = serverTimestamp();
      }

      await setDoc(docRef, updateData, { merge: true });
      toast.success('가게 정보가 저장되었습니다');
    } catch (error: any) {
      console.error('[StoreInfoTab] Failed to save store info:', error);
      toast.error('저장에 실패했습니다: ' + (error.message || '알 수 없는 오류'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#D61C1C]" />
      </div>
    );
  }

  return (
    <div data-testid="admin-settings-storeinfo-tab" className="space-y-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#D61C1C]" />
            <CardTitle>기본 정보</CardTitle>
          </div>
          <CardDescription>
            가게의 기본 정보를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">가게 이름 *</Label>
            <Input
              id="store-name"
              value={storeInfo.name || ''}
              onChange={(e) => setStoreInfo({
                ...storeInfo,
                name: e.target.value,
              })}
              placeholder="현풍닭칼국수"
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-phone">전화번호 *</Label>
            <Input
              id="store-phone"
              value={storeInfo.phone || ''}
              onChange={(e) => setStoreInfo({
                ...storeInfo,
                phone: e.target.value,
              })}
              placeholder="053-123-4567"
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* 주소 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>주소 정보</CardTitle>
          <CardDescription>
            가게의 주소를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-address-full">주소 *</Label>
            <AddressSearch
              value={storeInfo.address?.full || ''}
              onChange={(address, lat, lng) => {
                setStoreInfo({
                  ...storeInfo,
                  address: {
                    full: address,
                    detail: storeInfo.address?.detail || '',
                    lat: lat ?? storeInfo.address?.lat,
                    lng: lng ?? storeInfo.address?.lng,
                  },
                });
              }}
              placeholder="주소를 검색하세요 (예: 대구광역시 달성군 현풍면)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-address-detail">상세 주소</Label>
            <Input
              id="store-address-detail"
              value={storeInfo.address?.detail || ''}
              onChange={(e) => setStoreInfo({
                ...storeInfo,
                address: {
                  ...storeInfo.address,
                  full: storeInfo.address?.full || '',
                  detail: e.target.value,
                  lat: storeInfo.address?.lat,
                  lng: storeInfo.address?.lng,
                },
              })}
              placeholder="상세 주소를 입력하세요"
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* 영업 설정 */}
      <Card>
        <CardHeader>
          <CardTitle>영업 설정</CardTitle>
          <CardDescription>
            영업 상태 및 배달 설정을 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>영업 중</Label>
              <p className="text-sm text-[#2E1C10]/60">
                현재 영업 상태를 표시합니다
              </p>
            </div>
            <Switch
              checked={storeInfo.isOpen ?? true}
              onCheckedChange={(checked) => setStoreInfo({
                ...storeInfo,
                isOpen: checked,
              })}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>배달 가능</Label>
              <p className="text-sm text-[#2E1C10]/60">
                배달 서비스 제공 여부
              </p>
            </div>
            <Switch
              checked={storeInfo.deliveryAvailable ?? true}
              onCheckedChange={(checked) => setStoreInfo({
                ...storeInfo,
                deliveryAvailable: checked,
              })}
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="store-min-order">최소 주문 금액 (원)</Label>
            <Input
              id="store-min-order"
              type="number"
              value={storeInfo.minOrderAmount || 15000}
              onChange={(e) => setStoreInfo({
                ...storeInfo,
                minOrderAmount: parseInt(e.target.value) || 0,
              })}
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-delivery-fee">기본 배달비 (원)</Label>
            <Input
              id="store-delivery-fee"
              type="number"
              value={storeInfo.deliveryFee || 3000}
              onChange={(e) => setStoreInfo({
                ...storeInfo,
                deliveryFee: parseInt(e.target.value) || 0,
              })}
              className="bg-gray-50"
            />
          </div>
        </CardContent>
      </Card>

      {/* 영업시간 */}
      <Card>
        <CardHeader>
          <CardTitle>영업시간</CardTitle>
          <CardDescription>
            가게의 영업시간을 설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-open-time">오픈 시간</Label>
              <Input
                id="store-open-time"
                type="time"
                value={storeInfo.businessHours?.open || '10:00'}
                onChange={(e) => setStoreInfo({
                  ...storeInfo,
                  businessHours: {
                    ...storeInfo.businessHours,
                    open: e.target.value,
                    close: storeInfo.businessHours?.close || '22:00',
                    days: storeInfo.businessHours?.days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                  },
                })}
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="store-close-time">마감 시간</Label>
              <Input
                id="store-close-time"
                type="time"
                value={storeInfo.businessHours?.close || '22:00'}
                onChange={(e) => setStoreInfo({
                  ...storeInfo,
                  businessHours: {
                    ...storeInfo.businessHours,
                    open: storeInfo.businessHours?.open || '10:00',
                    close: e.target.value,
                    days: storeInfo.businessHours?.days || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                  },
                })}
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 위치(지도) */}
      <Card>
        <CardHeader>
          <CardTitle>위치(지도)</CardTitle>
          <CardDescription>
            주소 입력 후 지도를 클릭해서 가게 위치를 지정해 주세요. 지정된 위치는 고객 앱에서 지도에 표시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StoreLocationPicker
            lat={storeInfo.address?.lat}
            lng={storeInfo.address?.lng}
            addressText={storeInfo.address?.full}
            onChange={(value) => setStoreInfo({
              ...storeInfo,
              address: {
                ...storeInfo.address,
                full: storeInfo.address?.full || '',
                detail: storeInfo.address?.detail || '',
                lat: value.lat,
                lng: value.lng,
              },
            })}
          />
        </CardContent>
      </Card>

      {/* 저장 버튼 */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#D61C1C] hover:bg-[#B81515]"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              저장
            </>
          )}
        </Button>
      </div>
    </div>
  );
}


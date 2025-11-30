/**
 * 주소 입력 컴포넌트
 * Daum 주소 검색 API 사용
 */

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import type { DeliveryAddress } from "@/types/cart";

interface AddressInputProps {
  value?: DeliveryAddress;
  onChange: (address: DeliveryAddress) => void;
  required?: boolean;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          address: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
      };
    };
  }
}

export function AddressInput({ value, onChange, required = false }: AddressInputProps) {
  const [detailAddress, setDetailAddress] = useState(value?.detail || "");
  const postcodeRef = useRef<HTMLDivElement>(null);

  // Daum Postcode 스크립트 로드
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 이미 로드되어 있으면 스킵
    if (window.daum?.Postcode) return;

    const script = document.createElement("script");
    script.src = "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거하지 않음 (다른 컴포넌트에서도 사용 가능)
    };
  }, []);

  // 주소 검색 열기
  const handleOpenPostcode = () => {
    if (!window.daum?.Postcode) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: data => {
        const fullAddress = data.address;
        const address: DeliveryAddress = {
          address: fullAddress,
          detail: detailAddress,
        };
        onChange(address);
      },
      width: "100%",
      height: "100%",
    }).open();
  };

  // 상세 주소 변경
  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const detail = e.target.value;
    setDetailAddress(detail);
    if (value?.address) {
      onChange({
        ...value,
        detail,
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label>배달 주소 {required && <span className="text-red-500">*</span>}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="도로명 주소"
            value={value?.address || ""}
            readOnly
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={handleOpenPostcode}>
            <MapPin className="w-4 h-4 mr-1" />
            주소 검색
          </Button>
        </div>
        {value?.address && (
          <Input
            type="text"
            placeholder="상세 주소 (동/호수 등)"
            value={detailAddress}
            onChange={handleDetailChange}
            required={required}
          />
        )}
      </div>
      {value?.address && (
        <div className="text-sm text-gray-600">
          {value.address} {value.detail}
        </div>
      )}
    </div>
  );
}

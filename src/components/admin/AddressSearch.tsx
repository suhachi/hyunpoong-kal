import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";
import type { DeliveryAddress } from "@/types/order"; // or types/cart if preferred, they should be compatible
import { KAKAO_REST_API_KEY } from "@/config/env";

// Force update
interface AddressSearchProps {
    value?: DeliveryAddress | null;
    onChange: (value: DeliveryAddress) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    readOnly?: boolean;
}

export function AddressSearch({
    value,
    onChange,
    label,
    placeholder = "주소를 검색해주세요",
    required = false,
    className = "",
    readOnly = false,
}: AddressSearchProps) {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [isGeocoding, setIsGeocoding] = useState(false);

    /**
     * Kakao REST API를 사용한 Geocoding
     * 주소 문자열 → 위도/경도 변환
     * 
     * @param address - 주소 문자열
     * @returns { lat, lng } 또는 빈 객체 (실패 시)
     */
    async function geocodeAddress(address: string): Promise<{ lat?: number; lng?: number }> {
        // 1) REST API 키 확인
        if (!KAKAO_REST_API_KEY) {
            console.warn("[AddressSearch] KAKAO_REST_API_KEY가 설정되지 않아 Geocoding을 건너뜁니다.");
            return {};
        }

        try {
            // 2) Kakao REST API 호출
            const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
            
            const response = await fetch(url, {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
                },
            });

            if (!response.ok) {
                console.error("[AddressSearch] Geocoding API 호출 실패:", response.status);
                return {};
            }

            const result = await response.json();

            // 3) 응답에서 좌표 추출
            if (result.documents && result.documents.length > 0) {
                const firstResult = result.documents[0];
                const lat = parseFloat(firstResult.y); // Kakao API는 y가 위도
                const lng = parseFloat(firstResult.x); // x가 경도

                console.log("[AddressSearch] Geocoding 성공:", { address, lat, lng });

                return { lat, lng };
            } else {
                console.warn("[AddressSearch] Geocoding 결과 없음:", address);
                return {};
            }

        } catch (error) {
            console.error("[AddressSearch] Geocoding 에러:", error);
            return {};
        }
    }

    useEffect(() => {
        const scriptId = "daum-postcode-script";
        const existingScript = document.getElementById(scriptId);

        if (existingScript) {
            setIsScriptLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            // 스크립트는 전역적으로 사용되므로 언마운트 시 제거하지 않음 (재사용성)
        };
    }, []);

    const handleSearch = () => {
        if (!isScriptLoaded || !(window as any).daum) {
            alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
            return;
        }

        new (window as any).daum.Postcode({
            oncomplete: async (data: any) => {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                let addr = ""; // 주소 변수
                let extraAddr = ""; // 참고항목 변수

                //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if (data.userSelectedType === "R") {
                    // 사용자가 도로명 주소를 선택했을 경우
                    addr = data.roadAddress;
                } else {
                    // 사용자가 지번 주소를 선택했을 경우(J)
                    addr = data.jibunAddress;
                }

                // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
                if (data.userSelectedType === "R") {
                    // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                    // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                    if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
                        extraAddr += data.bname;
                    }
                    // 건물명이 있고, 공동주택일 경우 추가한다.
                    if (data.buildingName !== "" && data.apartment === "Y") {
                        extraAddr += extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
                    }
                    // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                    if (extraAddr !== "") {
                        extraAddr = " (" + extraAddr + ")";
                    }
                    // 조합된 참고항목을 해당 필드에 넣는다.
                    // (여기서는 주소 뒤에 붙이거나 별도 처리 가능)
                    addr += extraAddr;
                }

                // Geocoding: 주소 → 좌표 변환
                setIsGeocoding(true);
                let lat: number | undefined;
                let lng: number | undefined;

                try {
                    const coords = await geocodeAddress(addr);
                    lat = coords.lat;
                    lng = coords.lng;
                } catch (error) {
                    console.error("[AddressSearch] Geocoding 실패 (UX는 유지):", error);
                    // Geocoding 실패해도 주소 선택 자체는 정상 진행
                } finally {
                    setIsGeocoding(false);
                }

                // 부모 컴포넌트에 전달 (lat/lng 포함)
                onChange({
                    address: addr,
                    detail: value?.detail || "",
                    lat,
                    lng,
                });
            },
        }).open();
    };

    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!value) return;
        onChange({
            ...value,
            detail: e.target.value,
        });
    };

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                        value={value?.address || ""}
                        readOnly
                        placeholder={placeholder}
                        className="pl-9 bg-gray-50 cursor-pointer"
                        onClick={handleSearch}
                        required={required}
                    />
                </div>
                <Button type="button" onClick={handleSearch} variant="outline" disabled={isGeocoding}>
                    {isGeocoding ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            좌표 검색중
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4 mr-2" />
                            주소검색
                        </>
                    )}
                </Button>
            </div>
            {!readOnly && (
                <Input
                    value={value?.detail || ""}
                    onChange={handleDetailChange}
                    placeholder="상세 주소를 입력해주세요 (예: 101동 101호)"
                />
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import type { DeliveryAddress } from "@/types/order"; // or types/cart if preferred, they should be compatible

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
            oncomplete: (data: any) => {
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

                // 부모 컴포넌트에 전달
                onChange({
                    address: addr,
                    detail: value?.detail || "",
                    // lat, lng는 여기서 바로 알 수 없음 (Geocoding 필요). 
                    // 현재는 undefined로 유지하거나 기존 값 유지.
                    lat: value?.lat,
                    lng: value?.lng,
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
                <Button type="button" onClick={handleSearch} variant="outline">
                    <Search className="w-4 h-4 mr-2" />
                    주소검색
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

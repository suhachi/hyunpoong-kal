export function requestNicepayPayment({
    clientKey,
    orderId,
    amount,
    goodsName,
    returnUrl,
}: {
    clientKey: string;
    orderId: string;
    amount: number;
    goodsName: string;
    returnUrl: string;
}) {
    return new Promise((resolve, reject) => {
        // NICEPAY SDK 로드 여부 확인
        // @ts-ignore
        if (typeof AUTHNICE === "undefined") {
            reject(new Error("NICEPAY SDK not loaded"));
            return;
        }

        // @ts-ignore
        AUTHNICE.requestPay(
            {
                clientId: clientKey,
                method: "card",
                orderId,
                amount,
                goodsName,
                returnUrl,
            },
            (res: any) => {
                if (res?.authResultCode === "0000") resolve(res);
                else reject(res);
            },
        );
    });
}

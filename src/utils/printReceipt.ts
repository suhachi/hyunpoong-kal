import type { Order } from '../types/order';
import { formatPrice } from '../lib/utils';

interface StoreInfo {
    name: string;
    address: string;
    phone: string;
}

export function printOrderReceipt(
    orderId: string,
    order: Order,
    storeInfo: StoreInfo = {
        name: '현풍닭칼국수',
        address: '대구광역시 달성군 현풍읍', // 실제 주소로 변경 필요
        phone: '053-000-0000' // 실제 전화번호로 변경 필요
    }
) {
    const items = order.items
        .map(item => `
      <li>
        <div style="display: flex; justify-content: space-between;">
          <span>${item.menuName} x ${item.quantity}</span>
          <span>${formatPrice(item.subtotal)}</span>
        </div>
        ${item.options ? `
          <div style="font-size: 12px; color: #666; padding-left: 10px;">
            ${Object.entries(item.options)
                    .filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
                    .map(([key, value]) => {
                        if (key === 'toppings' && Array.isArray(value)) return `토핑: ${value.join(', ')}`;
                        if (key === 'noodle') return `면: ${value}`;
                        if (key === 'spicy') return `맵기: ${value}`;
                        return `${key}: ${value}`;
                    })
                    .join('<br/>')}
          </div>
        ` : ''}
      </li>
    `)
        .join('');

    const total = formatPrice(order.finalAmount);
    const delivery = order.deliveryType === 'delivery' ? '배달' : '포장';

    // Payment method label mapping
    const paymentMethodLabels: Record<string, string> = {
        app_card: '앱 결제',
        meet_card: '만나서 카드',
        meet_cash: '만나서 현금',
        card: '카드',
        transfer: '계좌이체',
        easy_pay: '간편결제',
        on_site: '만나서결제',
    };

    const payment = paymentMethodLabels[order.payment.method] || order.payment.method;

    // Handle createdAt which might be a Firestore Timestamp or string
    let createdDate: Date;
    if (typeof order.createdAt === 'string') {
        createdDate = new Date(order.createdAt);
    } else if (order.createdAt && typeof (order.createdAt as any).toDate === 'function') {
        createdDate = (order.createdAt as any).toDate();
    } else {
        createdDate = new Date();
    }

    const created = createdDate.toLocaleString('ko-KR');

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>영수증 #${orderId}</title>
  <style>
    body { font-family: monospace, sans-serif; font-size: 14px; color: #111; margin: 0; padding: 0; }
    .wrap { width: 280px; margin: 0 auto; padding: 10px; background: #fff; }
    h3 { text-align: center; margin: 8px 0; font-size: 18px; }
    .c { text-align: center; font-size: 12px; margin-bottom: 4px; }
    hr { border: 0; border-top: 1px dashed #000; margin: 8px 0; }
    ul { padding: 0; margin: 0; list-style: none; }
    li { margin-bottom: 6px; }
    .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 10px; }
    .badge { font-weight: bold; text-align: center; font-size: 20px; margin: 10px 0; border: 2px solid #000; padding: 5px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <div class="wrap">
    <h3>${storeInfo.name}</h3>
    <div class="c">${storeInfo.address}<br/>${storeInfo.phone}</div>
    <hr/>
    <div class="badge">${delivery}</div>
    <hr/>
    <div class="row"><span class="label">주문번호:</span> <span>${orderId.slice(-8)}</span></div>
    <div class="row"><span class="label">일시:</span> <span>${created}</span></div>
    <div class="row"><span class="label">결제:</span> <span>${payment}</span></div>
    <hr/>
    <div class="row"><span class="label">주문자:</span> <span>${order.phone}</span></div>
    ${order.deliveryAddress ? `<div class="row"><span class="label">주소:</span> <span style="text-align:right; max-width: 200px;">${order.deliveryAddress.address} ${order.deliveryAddress.detail}</span></div>` : ''}
    ${order.requests ? `<div class="row"><span class="label">요청:</span> <span style="text-align:right; max-width: 200px;">${order.requests}</span></div>` : ''}
    <hr/>
    <ul>${items}</ul>
    <hr/>
    <div class="total">합계: ${total}</div>
    <div class="c" style="margin-top:20px;">* 감사합니다! *</div>
  </div>
  <script>
    setTimeout(function() {
      window.print();
      // Optional: Close window after print (commented out for debugging)
      // setTimeout(function() { window.close(); }, 500);
    }, 500);
  </script>
</body>
</html>`;

    const w = window.open('', '_blank', 'width=360,height=600');
    if (!w) {
        alert('팝업이 차단되었습니다. 브라우저에서 팝업 허용 후 다시 시도해 주세요.');
        return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    // w.focus(); // Some browsers block focus calls
}

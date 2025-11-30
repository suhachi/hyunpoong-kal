import { describe, it, expect } from 'vitest';
import { calculateItemSubtotal, calculateCartSubtotal, calculateDeliveryFee, calculateTotalAmount } from '../lib/cart.utils';
import { getStatusList } from '../lib/orders.utils';
import { generateReceiptHtml } from '../utils/printReceipt';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../types/order';
import type { CartItem } from '../types/cart';
import type { Order } from '../types/order';

describe('Order Calculation Logic', () => {
  const mockItem: CartItem = {
    menuId: 'menu-1',
    menuName: 'Test Menu',
    menuImage: 'test.jpg',
    menuPrice: 10000,
    quantity: 2,
    options: {},
    optionPrices: {
      noodle: 1000,
      toppings: 2000,
      custom: 500
    },
    subtotal: 0 // Will be calculated
  };

  it('calculates item subtotal correctly', () => {
    // (10000 + 1000 + 2000 + 500) * 2 = 13500 * 2 = 27000
    const subtotal = calculateItemSubtotal(mockItem);
    expect(subtotal).toBe(27000);
  });

  it('calculates cart subtotal correctly', () => {
    const items = [mockItem, { ...mockItem, quantity: 1 }]; // 27000 + 13500 = 40500
    const total = calculateCartSubtotal(items);
    expect(total).toBe(40500);
  });

  it('calculates delivery fee correctly', () => {
    // Delivery, subtotal 20000 > min 15000 -> fee 3000
    expect(calculateDeliveryFee(20000, 'delivery', 15000, 3000)).toBe(3000);
    
    // Pickup -> fee 0
    expect(calculateDeliveryFee(20000, 'pickup', 15000, 3000)).toBe(0);

    // Delivery, subtotal 10000 < min 15000 -> fee 0 (and blocked elsewhere)
    expect(calculateDeliveryFee(10000, 'delivery', 15000, 3000)).toBe(0);
  });

  it('calculates total amount correctly', () => {
    // Subtotal 20000, fee 3000, discount 1000 -> 22000
    expect(calculateTotalAmount(20000, 3000, 1000)).toBe(22000);

    // Discount > Total -> 0
    expect(calculateTotalAmount(20000, 3000, 25000)).toBe(0);
  });
});

describe('Order Status Logic', () => {
  it('returns correct status list for delivery', () => {
    const list = getStatusList('delivery');
    expect(list).toEqual([
      OrderStatus.ACCEPTED,
      OrderStatus.COOKING,
      OrderStatus.DELIVERING,
      OrderStatus.COMPLETED
    ]);
  });

  it('returns correct status list for pickup', () => {
    const list = getStatusList('pickup');
    expect(list).toEqual([
      OrderStatus.ACCEPTED,
      OrderStatus.COOKING,
      OrderStatus.COMPLETED
    ]);
  });
});

describe('Receipt Generation Logic', () => {
  const mockOrder: Order = {
    orderId: 'ord-123',
    userId: 'user-1',
    storeId: 'store-1',
    items: [
      {
        menuId: 'm1',
        menuName: 'Kalguksu',
        menuImage: 'img.jpg',
        quantity: 1,
        price: 10000,
        options: { noodle: 'Normal' },
        subtotal: 10000,
      }
    ],
    subtotal: 10000,
    discount: 0,
    deliveryFee: 0,
    finalAmount: 10000,
    deliveryType: 'pickup',
    phone: '010-1234-5678',
    status: OrderStatus.COMPLETED,
    payment: {
      method: PaymentMethod.MEET_CARD,
      status: PaymentStatus.APPROVED,
      amount: 10000
    },
    timeline: {},
    createdAt: '2023-01-01T12:00:00Z',
    updatedAt: '2023-01-01T12:30:00Z'
  };

  it('generates HTML containing order details', () => {
    const html = generateReceiptHtml(mockOrder);
    expect(html).toContain('영수증 #ord-123');
    expect(html).toContain('Kalguksu x 1');
    expect(html).toContain('10,000원'); // formatPrice output check
    expect(html).toContain('만나서 카드'); // Payment method label check
  });
});


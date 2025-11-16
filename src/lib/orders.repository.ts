import type { Order, OrderStatus } from '../types/order';

export interface CreateOrderPayload {
  storeId: string;
  userId: string;
  items: Array<{
    menuId: string;
    menuName: string;
    menuImage: string;
    quantity: number;
    options?: any;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount?: number;
  couponId?: string;
  deliveryFee: number;
  finalAmount: number;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: any;
  phone: string;
  email?: string;
  requests?: string;
  payment?: any;
}

export interface OrdersRepository {
  createOrder(payload: CreateOrderPayload): Promise<Order>;
  listOrdersByUser(userId: string): Promise<Order[]>;
  listOrdersByStore(storeId: string): Promise<Order[]>;
  updateStatus(orderId: string, status: Order['status']): Promise<Order | null>;
}

const STORAGE_KEY = 'orders';

export class LocalOrdersRepository implements OrdersRepository {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderId = `ORD${Date.now()}`;

    const now = new Date().toISOString();

    const order: Order = {
      orderId,
      userId: payload.userId,
      storeId: payload.storeId,
      items: payload.items as any,
      subtotal: payload.subtotal,
      discount: payload.discount || 0,
      couponId: payload.couponId,
      deliveryFee: payload.deliveryFee,
      finalAmount: payload.finalAmount,
      deliveryType: payload.deliveryType,
      deliveryAddress: payload.deliveryAddress,
      phone: payload.phone,
      email: payload.email,
      requests: payload.requests,
      status: 'placed',
      payment: payload.payment || { method: 'on_site', status: 'pending', amount: payload.finalAmount },
      timeline: {
        pending: now,
        placed: now,
      } as any,
      createdAt: now,
      updatedAt: now,
    } as Order;

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    orders[orderId] = order;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    return Promise.resolve(order);
  }

  async listOrdersByUser(userId: string): Promise<Order[]> {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const list = Object.values(orders) as Order[];
    return Promise.resolve(list.filter((o) => o.userId === userId));
  }

  async listOrdersByStore(storeId: string): Promise<Order[]> {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const list = Object.values(orders) as Order[];
    return Promise.resolve(list.filter((o) => o.storeId === storeId));
  }

  async updateStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const order = orders[orderId] as Order | undefined;
    if (!order) return Promise.resolve(null);
    order.status = status as any;
    order.updatedAt = new Date().toISOString();
    order.timeline ||= {} as any;
    (order.timeline as any)[status] = new Date().toISOString();
    orders[orderId] = order;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return Promise.resolve(order);
  }
}

// export singleton
export const ordersRepository = new LocalOrdersRepository();

import {
  type Order,
  OrderStatus,
  type DeliveryAddress,
  type PaymentInfo,
  type OrderItem,
  PaymentMethod,
  PaymentStatus,
} from "@/types/order";

export interface CreateOrderPayload {
  storeId: string;
  userId: string;
  items: Array<OrderItem & { [key: string]: unknown }>;
  subtotal: number;
  discount?: number;
  couponId?: string;
  couponApplied?: boolean;
  deliveryFee: number;
  finalAmount: number;
  deliveryType: "delivery" | "pickup";
  deliveryAddress?: DeliveryAddress;
  phone: string; // Deprecated, use phoneNumber
  phoneNumber: string;
  email?: string;
  requests?: string;
  payment?: PaymentInfo;
  clientOrderId?: string; // Added for Idempotency
}

export interface OrdersRepository {
  createOrder(payload: CreateOrderPayload): Promise<Order>;
  listOrdersByUser(userId: string): Promise<Order[]>;
  listOrdersByStore(storeId: string): Promise<Order[]>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order | null>;
}

const STORAGE_KEY = "orders";

export class LocalOrdersRepository implements OrdersRepository {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderId = `ORD${Date.now()}`;

    const now = new Date().toISOString();

    const order: Order = {
      orderId,
      userId: payload.userId,
      storeId: payload.storeId,
      items: payload.items,
      subtotal: payload.subtotal,
      discount: payload.discount || 0,
      couponId: payload.couponId || null,
      couponApplied: payload.couponApplied || false,
      deliveryFee: payload.deliveryFee,
      finalAmount: payload.finalAmount,
      deliveryType: payload.deliveryType,
      deliveryAddress: payload.deliveryAddress || null,
      phoneNumber: payload.phoneNumber || payload.phone,
      email: payload.email,
      requests: payload.requests,
      status: OrderStatus.PENDING,
      payment: payload.payment || {
        method: PaymentMethod.MEET_CARD,
        status: PaymentStatus.PENDING,
        amount: payload.finalAmount,
      },
      clientOrderId: payload.clientOrderId,
      timeline: {
        [OrderStatus.PENDING]: now,
      },
      createdAt: now,
      updatedAt: now,
    } as unknown as Order; // Handle FTimestamp vs string mismatch for local mock

    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    orders[orderId] = order;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));

    return Promise.resolve(order);
  }

  async listOrdersByUser(userId: string): Promise<Order[]> {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const list = Object.values(orders) as Order[];
    return Promise.resolve(list.filter(o => o.userId === userId));
  }

  async listOrdersByStore(storeId: string): Promise<Order[]> {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const list = Object.values(orders) as Order[];
    return Promise.resolve(list.filter(o => o.storeId === storeId));
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const orders = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const order = orders[orderId] as Order | undefined;
    if (!order) return Promise.resolve(null);
    order.status = status;
    order.updatedAt = new Date().toISOString() as unknown as any;
    order.timeline ||= {};
    (order.timeline as Record<string, string | object>)[status] = new Date().toISOString();
    orders[orderId] = order;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    return Promise.resolve(order);
  }
}

// export singleton
export const ordersRepository = new LocalOrdersRepository();

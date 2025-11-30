/**
 * '생각대로' 배달대행사 Provider - 스켈레톤
 *
 * 실제 배달대행 계약 후 제공되는 API 스펙에 맞춰 구현
 * 현재는 스켈레톤 구조만 제공
 */

import type {
  DeliveryProvider,
  DeliveryTask,
  CreateTaskParams,
  CreateTaskResult,
  DeliveryStatus,
} from "../../../types/delivery";
import { getEnv } from "../../../config/env";

/**
 * '생각대로' 배달대행사 설정
 */
const SAENGGAKDAERO_CONFIG = {
  apiUrl: getEnv("VITE_SAENGGAKDAERO_API_URL", "https://api.saenggakdaero.com"),
  apiKey: getEnv("VITE_SAENGGAKDAERO_API_KEY", "YOUR_API_KEY_HERE"),
  merchantId: getEnv("VITE_SAENGGAKDAERO_MERCHANT_ID", "YOUR_MERCHANT_ID"),
};

/**
 * '생각대로' API Client
 */
class SaenggakdaeroClient {
  private baseUrl: string;
  private apiKey: string;
  private merchantId: string;

  constructor(config: typeof SAENGGAKDAERO_CONFIG) {
    this.baseUrl = config.apiUrl;
    this.apiKey = config.apiKey;
    this.merchantId = config.merchantId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "X-Merchant-Id": this.merchantId,
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Saenggakdaero] API Error:", response.status, errorText);
        throw new Error(`Saenggakdaero API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("[Saenggakdaero] Request failed:", error);
      throw error;
    }
  }

  /**
   * 배달 태스크 생성
   *
   * TODO: 실제 '생각대로' API 스펙에 맞게 수정
   */
  async createDeliveryTask(params: {
    orderId: string;
    pickup: { address: string; lat: number; lng: number; phone?: string };
    dropoff: { address: string; lat: number; lng: number; phone?: string };
  }) {
    // 현재는 Mock 응답
    console.info("[Saenggakdaero] createDeliveryTask (mock)", params);

    // TODO: 실제 API 호출
    /*
    return this.request<{ taskId: string }>('/v1/deliveries', {
      method: 'POST',
      body: JSON.stringify({
        order_id: params.orderId,
        pickup: {
          address: params.pickup.address,
          latitude: params.pickup.lat,
          longitude: params.pickup.lng,
          phone: params.pickup.phone,
        },
        dropoff: {
          address: params.dropoff.address,
          latitude: params.dropoff.lat,
          longitude: params.dropoff.lng,
          phone: params.dropoff.phone,
        },
      }),
    });
    */

    // Mock 응답
    return {
      taskId: `saenggakdaero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * 배달 태스크 조회
   *
   * TODO: 실제 '생각대로' API 스펙에 맞게 수정
   */
  async getDeliveryTask(taskId: string) {
    // 현재는 Mock 응답
    console.info("[Saenggakdaero] getDeliveryTask (mock)", taskId);

    // TODO: 실제 API 호출
    /*
    return this.request<any>(`/v1/deliveries/${taskId}`, {
      method: 'GET',
    });
    */

    // Mock 응답
    return {
      id: taskId,
      order_id: "",
      status: "REQUESTED",
      driver_id: null,
      driver_location: null,
      eta: 30,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * 배달 태스크 취소
   *
   * TODO: 실제 '생각대로' API 스펙에 맞게 수정
   */
  async cancelDeliveryTask(taskId: string) {
    // 현재는 Mock 응답
    console.info("[Saenggakdaero] cancelDeliveryTask (mock)", taskId);

    // TODO: 실제 API 호출
    /*
    return this.request<void>(`/v1/deliveries/${taskId}/cancel`, {
      method: 'POST',
    });
    */
  }
}

const client = new SaenggakdaeroClient(SAENGGAKDAERO_CONFIG);

/**
 * '생각대로' 상태를 내부 상태로 매핑
 *
 * TODO: 실제 '생각대로' API 상태 값에 맞게 수정
 */
function mapSaenggakdaeroStatus(status: string): DeliveryStatus {
  const statusMap: Record<string, DeliveryStatus> = {
    REQUESTED: "assigned",
    ASSIGNED: "assigned",
    PICKED_UP: "picked_up",
    IN_TRANSIT: "delivering",
    DELIVERED: "completed",
    CANCELLED: "canceled",
  };

  return statusMap[status] || "assigned";
}

/**
 * '생각대로' Delivery Provider 구현
 */
export const saenggakdaeroProvider: DeliveryProvider = {
  async createTask(params: CreateTaskParams): Promise<CreateTaskResult> {
    console.log("[Saenggakdaero] Creating task:", params);

    const response = await client.createDeliveryTask({
      orderId: params.orderId,
      pickup: {
        address: params.pickup.addr,
        lat: params.pickup.lat,
        lng: params.pickup.lng,
      },
      dropoff: {
        address: params.dropoff.addr,
        lat: params.dropoff.lat,
        lng: params.dropoff.lng,
      },
    });

    return {
      taskId: response.taskId,
    };
  },

  async getTask(taskId: string): Promise<DeliveryTask> {
    console.log("[Saenggakdaero] Getting task:", taskId);

    const data = await client.getDeliveryTask(taskId);

    // TODO: 실제 API 응답을 DeliveryTask 타입으로 변환
    return {
      taskId: data.id || taskId,
      orderId: data.order_id || "",
      driverId: data.driver_id,
      status: mapSaenggakdaeroStatus(data.status),
      eta: data.eta,
      lastCoord: data.driver_location
        ? {
            lat: data.driver_location.latitude,
            lng: data.driver_location.longitude,
            at: Date.now(),
          }
        : undefined,
      createdAt: new Date(data.created_at).getTime(),
      updatedAt: new Date(data.updated_at).getTime(),
    };
  },

  async cancelTask(taskId: string): Promise<void> {
    console.log("[Saenggakdaero] Canceling task:", taskId);

    await client.cancelDeliveryTask(taskId);
  },
};

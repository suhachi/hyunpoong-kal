"use strict";
/**
 * '생각대로' 배달대행사 Webhook 처리
 *
 * 배달대행사에서 주문 상태 변경 시 호출되는 콜백 엔드포인트
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSaenggakdaeroWebhook = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const config_1 = require("./config");
/**
 * '생각대로' 상태를 내부 주문 상태로 매핑
 */
function mapSaenggakdaeroStatusToOrderStatus(deliveryStatus) {
    const statusMap = {
        PICKED_UP: "delivering",
        IN_TRANSIT: "delivering",
        DELIVERED: "completed",
    };
    return statusMap[deliveryStatus] || null;
}
/**
 * '생각대로' Webhook 엔드포인트
 *
 * 배달대행사 콘솔에서 등록할 URL:
 * https://{region}-{project-id}.cloudfunctions.net/handleSaenggakdaeroWebhook
 */
exports.handleSaenggakdaeroWebhook = functions
    .region(config_1.REGION)
    .runWith(config_1.RUNTIME_OPTS)
    .https.onRequest(async (req, res) => {
    // CORS 설정
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    try {
        const { orderId, taskId, status, driver, location } = req.body;
        if (!orderId || !status) {
            console.error("[Saenggakdaero Webhook] Missing required fields:", req.body);
            res.status(400).send("Missing required fields: orderId, status");
            return;
        }
        console.log("[Saenggakdaero Webhook] Received:", {
            orderId,
            taskId,
            status,
            driver,
            location,
        });
        // TODO: IP 화이트리스트 검증
        // TODO: 시그니처 검증 (배달대행사에서 제공하는 시그니처 검증 로직)
        const db = admin.firestore();
        // 주문 문서 찾기 (stores/{storeId}/orders/{orderId} 또는 orders/{orderId})
        let orderRef = null;
        // 먼저 orders/{orderId}에서 찾기
        const orderDoc = await db.collection("orders").doc(orderId).get();
        if (orderDoc.exists) {
            orderRef = orderDoc.ref;
        }
        else {
            // stores/{storeId}/orders/{orderId} 구조에서 찾기
            const storesSnapshot = await db.collection("stores").get();
            for (const storeDoc of storesSnapshot.docs) {
                const storeOrderRef = storeDoc.ref.collection("orders").doc(orderId);
                const storeOrderDoc = await storeOrderRef.get();
                if (storeOrderDoc.exists) {
                    orderRef = storeOrderRef;
                    break;
                }
            }
        }
        if (!orderRef) {
            console.error("[Saenggakdaero Webhook] Order not found:", orderId);
            res.status(404).send("Order not found");
            return;
        }
        // 주문 상태 업데이트
        const orderStatus = mapSaenggakdaeroStatusToOrderStatus(status);
        const updates = {
            "delivery.status": status,
            "delivery.taskId": taskId || null,
            "delivery.updatedAt": admin.firestore.FieldValue.serverTimestamp(),
        };
        if (driver) {
            updates["delivery.driver"] = {
                id: driver.id || driver.driverId,
                name: driver.name,
                phone: driver.phone,
            };
        }
        if (location) {
            updates["delivery.lastLocation"] = {
                lat: location.lat || location.latitude,
                lng: location.lng || location.longitude,
                at: admin.firestore.FieldValue.serverTimestamp(),
            };
        }
        // 배달 상태에 따라 주문 상태도 업데이트
        if (orderStatus === "delivering") {
            updates.status = "delivering";
            updates["timeline.delivering"] = admin.firestore.FieldValue.serverTimestamp();
        }
        else if (orderStatus === "completed") {
            updates.status = "completed";
            updates["timeline.completed"] = admin.firestore.FieldValue.serverTimestamp();
        }
        await orderRef.update(updates);
        console.log("[Saenggakdaero Webhook] Order updated:", {
            orderId,
            status: orderStatus,
            updates,
        });
        res.status(200).send("OK");
    }
    catch (error) {
        console.error("[Saenggakdaero Webhook] Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

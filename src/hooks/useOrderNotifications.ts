import { useEffect, useRef } from "react";
import { onSnapshot, type Query } from "firebase/firestore";

interface NotificationOptions {
  role: "admin" | "user";
  enabled: boolean;
  notifyAdded: boolean;
  notifyModified: boolean;
  play?: (type: "new" | "modified", data: { id: string }) => void;
  toast?: (message: string, type: "new" | "modified", data: { id: string }) => void;
}

export function useOrderNotifications(q: Query, options: NotificationOptions) {
  const isFirstSnapshot = useRef(true);

  useEffect(() => {
    if (!options.enabled) return;

    const unsubscribe = onSnapshot(q, snapshot => {
      // 최초 스냅샷 무시 (앱 로드 시 대량 알림 방지)
      if (isFirstSnapshot.current) {
        isFirstSnapshot.current = false;
        return;
      }

      snapshot.docChanges().forEach(change => {
        const data = { id: change.doc.id, ...change.doc.data() };

        if (change.type === "added" && options.notifyAdded) {
          const message = `새 주문이 들어왔습니다! #${change.doc.id.slice(-8)}`;

          if (options.play) {
            options.play("new", { id: change.doc.id });
          }

          if (options.toast) {
            options.toast(message, "new", { id: change.doc.id });
          }
        }

        if (change.type === "modified" && options.notifyModified) {
          const message = `주문 상태가 변경되었습니다: #${change.doc.id.slice(-8)}`;

          if (options.toast) {
            options.toast(message, "modified", { id: change.doc.id });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [q, options.enabled, options.notifyAdded, options.notifyModified]);
}

// ⚠️ 경고: 아래 CSS import 순서를 절대 변경하지 마세요!
// ⚠️ 이 import를 삭제하면 디자인이 완전히 깨집니다!
import "./styles/globals.css"; // 1. Tailwind CSS + 기본 스타일
import "./styles/design-lock.css"; // 2. 브랜드 컬러 강제 고정 (최우선!)

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { registerServiceWorker, setupNetworkListeners } from "./lib/utils/pwa";
import { toast } from "sonner";

// Service Worker 등록 (프로덕션 환경, Figma Make 호환)
try {
  if (typeof import.meta !== "undefined" && import.meta.env?.PROD) {
    registerServiceWorker();
  }
} catch (error) {
  console.warn("[PWA] Service Worker 등록 실패 (환경 미지원):", error);
}

// 온라인/오프라인 상태 모니터링 (안전하게)
try {
  setupNetworkListeners(
    () => {
      toast.success("인터넷에 연결되었습니다.", {
        description: "다시 온라인 상태입니다.",
      });
    },
    () => {
      toast.error("인터넷 연결이 끊겼습니다.", {
        description: "오프라인 모드로 전환되었습니다.",
        duration: 5000,
      });
    },
  );
} catch (error) {
  console.warn("[PWA] 네트워크 리스너 설정 실패:", error);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

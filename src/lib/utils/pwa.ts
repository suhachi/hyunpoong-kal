/**
 * PWA 유틸리티
 * Service Worker 등록 및 오프라인 지원
 *
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

/**
 * Service Worker 등록
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      console.log("[PWA] Service Worker 등록 완료:", registration.scope);

      // 업데이트 확인
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;
        console.log("[PWA] 새로운 Service Worker 발견");

        newWorker?.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // 새 버전 사용 가능
            console.log("[PWA] 새 버전 사용 가능");
            showUpdateNotification();
          }
        });
      });

      return registration;
    } catch (error) {
      console.error("[PWA] Service Worker 등록 실패:", error);
      return null;
    }
  }

  console.warn("[PWA] Service Worker를 지원하지 않는 브라우저입니다.");
  return null;
}

/**
 * 업데이트 알림 표시
 */
function showUpdateNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("현풍닭칼국수", {
      body: "새로운 버전이 사용 가능합니다. 페이지를 새로고침해주세요.",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    });
  }
}

/**
 * 온라인/오프라인 상태 확인
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 온라인/오프라인 이벤트 리스너 등록
 */
export function setupNetworkListeners(onOnline?: () => void, onOffline?: () => void): () => void {
  const handleOnline = () => {
    console.log("[PWA] 온라인 상태");
    onOnline?.();
  };

  const handleOffline = () => {
    console.log("[PWA] 오프라인 상태");
    onOffline?.();
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  // 클린업 함수 반환
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * PWA 설치 가능 여부 확인
 */
export function setupInstallPrompt(onInstallable?: (event: BeforeInstallPromptEvent) => void): () => void {
  let deferredPrompt: BeforeInstallPromptEvent | null = null;

  const handleBeforeInstallPrompt = (e: Event) => {
    // 기본 설치 프롬프트 방지
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;

    console.log("[PWA] 설치 가능");
    onInstallable?.(deferredPrompt);
  };

  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

  // 클린업 함수 반환
  return () => {
    window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  };
}

/**
 * PWA 설치 프롬프트 표시
 */
export async function showInstallPrompt(deferredPrompt: BeforeInstallPromptEvent | null): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn("[PWA] 설치 프롬프트가 없습니다.");
    return false;
  }

  // 설치 프롬프트 표시
  await deferredPrompt.prompt();

  // 사용자의 선택 대기
  const { outcome } = await deferredPrompt.userChoice;
  console.log("[PWA] 사용자 선택:", outcome);

  return outcome === "accepted";
}

interface SyncManager {
  getTags(): Promise<string[]>;
  register(tag: string): Promise<void>;
}

interface ServiceWorkerRegistrationWithSync extends ServiceWorkerRegistration {
  sync: SyncManager;
}

/**
 * 백그라운드 동기화 등록 (오프라인 주문 등)
 */
export async function registerBackgroundSync(tag: string): Promise<void> {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      await (registration as ServiceWorkerRegistrationWithSync).sync.register(tag);
      console.log("[PWA] 백그라운드 동기화 등록:", tag);
    } catch (error) {
      console.error("[PWA] 백그라운드 동기화 등록 실패:", error);
    }
  }
}

/**
 * 캐시 정리
 */
export async function clearCache(cacheName?: string): Promise<void> {
  if ("caches" in window) {
    if (cacheName) {
      await caches.delete(cacheName);
      console.log("[PWA] 캐시 삭제:", cacheName);
    } else {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
      console.log("[PWA] 모든 캐시 삭제 완료");
    }
  }
}

/**
 * 캐시 크기 확인 (대략적)
 */
export async function getCacheSize(): Promise<number> {
  if (!("caches" in window)) return 0;

  let totalSize = 0;
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    for (const request of keys) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

/**
 * 캐시 크기를 사람이 읽을 수 있는 형식으로 변환
 */
export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

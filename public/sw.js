/**
 * Service Worker
 * PWA 오프라인 지원 및 캐싱 전략
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

const CACHE_NAME = 'hyunpung-chicken-v1.0.0';
const OFFLINE_URL = '/offline.html';

// 캐시할 정적 리소스
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  console.log('[SW] 설치 중...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] 정적 리소스 캐싱 중...');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // 새 서비스 워커 즉시 활성화
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  console.log('[SW] 활성화 중...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('[SW] 이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // 모든 클라이언트를 즉시 제어
  return self.clients.claim();
});

// Fetch 이벤트 - Network First 전략
self.addEventListener('fetch', (event) => {
  // POST 요청은 캐시하지 않음
  if (event.request.method !== 'GET') {
    return;
  }

  // Firebase API는 항상 네트워크 요청
  if (event.request.url.includes('firebaseapp.com') || 
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 응답을 복제하여 캐시에 저장
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 가져오기
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // HTML 페이지인 경우 오프라인 페이지 표시
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match(OFFLINE_URL);
          }
          
          // 기타 리소스는 에러 반환
          return new Response('오프라인 상태입니다.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// 백그라운드 동기화 (향후 확장)
self.addEventListener('sync', (event) => {
  console.log('[SW] 백그라운드 동기화:', event.tag);
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

// T2-9: FCM 푸시 알림(Mock) 뼈대
self.addEventListener('push', (event) => {
  console.log('[SW] 푸시 알림 수신:', event);

  event.waitUntil((async () => {
    // DevTools의 "Push" 기본 문자열 입력도 동작하도록 안전 파싱
    let data = {};
    try {
      if (event.data) {
        const raw = typeof event.data.text === 'function' ? await event.data.text() : '';
        if (raw) {
          try {
            data = JSON.parse(raw);
          } catch (_) {
            data = { title: '테스트 알림', body: raw };
          }
        }
      }
    } catch (e) {
      console.error('[SW] Push data parse error:', e);
      data = {};
    }

    const title = data.title || '현풍닭칼국수';
    const options = {
      body: data.body || '새로운 알림이 있습니다.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data,
    };

    await self.registration.showNotification(title, options);
  })());
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] 알림 클릭:', event);
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});

// 주문 동기화 함수 (Mock)
async function syncOrders() {
  console.log('[SW] 주문 동기화 중...');
  // TODO: IndexedDB에서 미전송 주문 가져와서 전송
  return Promise.resolve();
}

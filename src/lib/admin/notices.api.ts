/**
 * 관리자 공지사항 관리 API
 * USE_FIREBASE=false: Mock 데이터 반환
 * USE_FIREBASE=true: Firestore 연동
 */

import { Notice, NoticeFilters } from "../../types/notice";

const USE_FIREBASE = false;

// 샘플 데이터 제거: 초기 상태에서는 공지 없음
const mockNotices: Notice[] = [];

/**
 * 공지사항 목록 조회
 */
export async function getNotices(filters: NoticeFilters = {}): Promise<Notice[]> {
  if (USE_FIREBASE) {
    // TODO: Firestore 연동
    throw new Error("Firebase not configured");
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  let filtered = [...mockNotices];

  // 타입 필터
  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter(n => n.type === filters.type);
  }

  // 활성화 필터
  if (filters.isActive !== undefined) {
    filtered = filtered.filter(n => n.isActive === filters.isActive);
  }

  // 검색
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      n => n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search),
    );
  }

  // 우선순위 순으로 정렬
  filtered.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority; // 높은 우선순위가 먼저
    }
    return b.createdAt.getTime() - a.createdAt.getTime(); // 최신순
  });

  return filtered;
}

/**
 * 공지사항 단건 조회
 */
export async function getNoticeById(noticeId: string): Promise<Notice | null> {
  if (USE_FIREBASE) {
    // TODO: Firestore 연동
    throw new Error("Firebase not configured");
  }

  await new Promise(resolve => setTimeout(resolve, 100));
  return mockNotices.find(n => n.id === noticeId) || null;
}

/**
 * 공지사항 생성
 */
export async function createNotice(
  noticeData: Omit<Notice, "id" | "createdAt" | "updatedAt">,
  by: string,
  byName: string,
): Promise<Notice> {
  if (USE_FIREBASE) {
    // TODO: Firestore 연동
    throw new Error("Firebase not configured");
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  const maxId = mockNotices.reduce((max, n) => {
    const num = parseInt(n.id.replace("notice-", ""));
    return Math.max(max, isNaN(num) ? 0 : num);
  }, 0);
  const id = `notice-${String(maxId + 1).padStart(3, "0")}`;

  const newNotice: Notice = {
    ...noticeData,
    id,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: by,
    createdByName: byName,
  };

  mockNotices.unshift(newNotice);
  return newNotice;
}

/**
 * 공지사항 수정
 */
export async function updateNotice(
  noticeId: string,
  updates: Partial<Pick<Notice, "title" | "content" | "type" | "isActive" | "priority">>,
  by: string,
  byName: string,
): Promise<Notice> {
  if (USE_FIREBASE) {
    // TODO: Firestore 연동
    throw new Error("Firebase not configured");
  }

  await new Promise(resolve => setTimeout(resolve, 300));

  const notice = mockNotices.find(n => n.id === noticeId);
  if (!notice) {
    throw new Error("공지사항을 찾을 수 없습니다");
  }

  Object.assign(notice, updates, {
    updatedAt: new Date(),
  });

  return notice;
}

/**
 * 공지사항 삭제
 */
export async function deleteNotice(noticeId: string, by: string, byName: string): Promise<void> {
  if (USE_FIREBASE) {
    // TODO: Firestore 연동
    throw new Error("Firebase not configured");
  }

  await new Promise(resolve => setTimeout(resolve, 200));

  const index = mockNotices.findIndex(n => n.id === noticeId);
  if (index === -1) {
    throw new Error("공지사항을 찾을 수 없습니다");
  }

  mockNotices.splice(index, 1);
}

/**
 * 활성화된 공지사항 조회 (홈화면용)
 */
export async function getActiveNotices(limit: number = 5): Promise<Notice[]> {
  const notices = await getNotices({ isActive: true });
  return notices.slice(0, limit);
}

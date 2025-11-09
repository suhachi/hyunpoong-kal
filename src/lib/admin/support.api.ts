/**
 * 관리자 고객지원 API
 * Firebase Firestore 기반 1:1 채팅 시스템
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  limit,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { ChatSession, ChatMessage, MessageSender } from '../../types/support';

const SESSIONS_COLLECTION = 'support_sessions';
const MESSAGES_COLLECTION = 'support_messages';

/**
 * 모든 채팅 세션 가져오기
 */
export async function getAllSessions(filters?: {
  open?: boolean;
  assignedTo?: string;
}): Promise<ChatSession[]> {
  const constraints: QueryConstraint[] = [orderBy('lastAt', 'desc')];

  if (filters?.open !== undefined) {
    constraints.push(where('open', '==', filters.open));
  }

  if (filters?.assignedTo) {
    constraints.push(where('assignedTo', '==', filters.assignedTo));
  }

  const q = query(collection(db, SESSIONS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatSession[];
}

/**
 * 특정 세션의 메시지 가져오기
 */
export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('sessionId', '==', sessionId),
    orderBy('at', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ChatMessage[];
}

/**
 * 관리자가 메시지 전송
 */
export async function sendAdminMessage(
  sessionId: string,
  text: string,
  adminId: string
): Promise<void> {
  // 메시지 추가
  await addDoc(collection(db, MESSAGES_COLLECTION), {
    sessionId,
    from: 'admin' as MessageSender,
    type: 'text',
    text,
    at: Date.now(),
    readByAdmin: true,
    readByUser: false,
  });

  // 세션 업데이트
  const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    lastMessage: text,
    lastAt: Date.now(),
    updatedAt: Date.now(),
    assignedTo: adminId,
  });
}

/**
 * 세션 상태 변경 (열림/닫힘)
 */
export async function updateSessionStatus(
  sessionId: string,
  open: boolean,
  adminId?: string
): Promise<void> {
  const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
  const updateData: any = {
    open,
    updatedAt: Date.now(),
  };

  if (adminId) {
    updateData.assignedTo = adminId;
  }

  await updateDoc(sessionRef, updateData);
}

/**
 * 세션에 담당자 할당
 */
export async function assignSession(sessionId: string, adminId: string): Promise<void> {
  const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
  await updateDoc(sessionRef, {
    assignedTo: adminId,
    updatedAt: Date.now(),
  });
}

/**
 * 메시지 읽음 처리
 */
export async function markMessagesAsReadByAdmin(sessionId: string): Promise<void> {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('sessionId', '==', sessionId),
    where('readByAdmin', '==', false)
  );

  const snapshot = await getDocs(q);
  const updates = snapshot.docs.map((doc) =>
    updateDoc(doc.ref, { readByAdmin: true })
  );

  await Promise.all(updates);
}

/**
 * 세션 목록 실시간 구독
 */
export function subscribeToSessions(
  callback: (sessions: ChatSession[]) => void,
  filters?: { open?: boolean }
): () => void {
  const constraints: QueryConstraint[] = [orderBy('lastAt', 'desc')];

  if (filters?.open !== undefined) {
    constraints.push(where('open', '==', filters.open));
  }

  const q = query(collection(db, SESSIONS_COLLECTION), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatSession[];

    callback(sessions);
  });
}

/**
 * 특정 세션의 메시지 실시간 구독
 */
export function subscribeToMessages(
  sessionId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('sessionId', '==', sessionId),
    orderBy('at', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];

    callback(messages);
  });
}

/**
 * 읽지 않은 메시지 수 가져오기
 */
export async function getUnreadCount(sessionId: string): Promise<number> {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    where('sessionId', '==', sessionId),
    where('from', '==', 'user'),
    where('readByAdmin', '==', false)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * 통계: 대기중인 세션 수
 */
export async function getPendingSessionsCount(): Promise<number> {
  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('open', '==', true),
    where('assignedTo', '==', null)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

/**
 * 통계: 평균 응답 시간 (분)
 */
export async function getAverageResponseTime(): Promise<number> {
  // 실제로는 복잡한 계산이 필요하지만, 간단한 예시
  // 최근 10개 세션의 첫 응답까지 걸린 시간 평균
  return 5; // Mock: 5분
}

/**
 * 통계: 오늘 완료된 세션 수
 */
export async function getTodayCompletedCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();

  const q = query(
    collection(db, SESSIONS_COLLECTION),
    where('open', '==', false),
    where('updatedAt', '>=', todayTimestamp)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

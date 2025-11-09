/**
 * 날짜/시간 유틸리티
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 날짜 포맷팅
 * @example formatDate(new Date()) => '2025년 10월 30일'
 */
export function formatDate(date: Date | Timestamp | string): string {
  const d = convertToDate(date);
  if (!d) return '';
  
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  
  return `${year}년 ${month}월 ${day}일`;
}

/**
 * 날짜/시간 포맷팅
 * @example formatDateTime(new Date()) => '2025년 10월 30일 14:30'
 */
export function formatDateTime(date: Date | Timestamp | string): string {
  const d = convertToDate(date);
  if (!d) return '';
  
  const dateStr = formatDate(d);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${dateStr} ${hours}:${minutes}`;
}

/**
 * 시간만 포맷팅
 * @example formatTime(new Date()) => '14:30'
 */
export function formatTime(date: Date | Timestamp | string): string {
  const d = convertToDate(date);
  if (!d) return '';
  
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
}

/**
 * 상대 시간 포맷팅
 * @example formatRelativeTime(pastDate) => '3분 전'
 */
export function formatRelativeTime(date: Date | Timestamp | string): string {
  const d = convertToDate(date);
  if (!d) return '';
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  
  return formatDate(d);
}

/**
 * 영업 시간 확인
 */
export function isBusinessHour(time: string, businessHours: { start: string; end: string }): boolean {
  const timeNum = parseInt(time.replace(':', ''));
  const startNum = parseInt(businessHours.start.replace(':', ''));
  const endNum = parseInt(businessHours.end.replace(':', ''));
  
  return timeNum >= startNum && timeNum <= endNum;
}

/**
 * 오늘인지 확인
 */
export function isToday(date: Date | Timestamp | string): boolean {
  const d = convertToDate(date);
  if (!d) return false;
  
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * 이번 주인지 확인
 */
export function isThisWeek(date: Date | Timestamp | string): boolean {
  const d = convertToDate(date);
  if (!d) return false;
  
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return d >= weekAgo && d <= today;
}

/**
 * 이번 달인지 확인
 */
export function isThisMonth(date: Date | Timestamp | string): boolean {
  const d = convertToDate(date);
  if (!d) return false;
  
  const today = new Date();
  return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
}

/**
 * Date 객체로 변환 (헬퍼)
 */
function convertToDate(date: Date | Timestamp | string): Date | null {
  if (date instanceof Date) {
    return date;
  }
  
  if (date && typeof date === 'object' && 'toDate' in date) {
    return (date as Timestamp).toDate();
  }
  
  if (typeof date === 'string') {
    return new Date(date);
  }
  
  return null;
}

/**
 * 날짜 범위 생성
 */
export function getDateRange(type: 'today' | 'week' | 'month' | 'year'): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  switch (type) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

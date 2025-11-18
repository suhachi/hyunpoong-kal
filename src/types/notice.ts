/**
 * 공지사항 타입 정의
 */

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'event' | 'promotion';
  isActive: boolean;
  priority: number; // 우선순위 (높을수록 먼저 표시)
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

export interface NoticeFilters {
  type?: 'notice' | 'event' | 'promotion' | 'all';
  isActive?: boolean;
  search?: string;
}


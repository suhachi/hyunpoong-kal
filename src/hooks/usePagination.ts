/**
 * 페이지네이션 Custom Hook
 * 클라이언트 사이드 페이지네이션 로직 처리
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
) {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  // 총 페이지 수 계산
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / limit);
  }, [data.length, limit]);

  // 현재 페이지 데이터
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return data.slice(startIndex, endIndex);
  }, [data, page, limit]);

  // 페이지 이동
  const goToPage = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  // 다음 페이지
  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  // 이전 페이지
  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  // 첫 페이지로
  const goToFirstPage = useCallback(() => {
    setPage(1);
  }, []);

  // 마지막 페이지로
  const goToLastPage = useCallback(() => {
    setPage(totalPages);
  }, [totalPages]);

  // 페이지당 항목 수 변경
  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // 페이지 1로 리셋
  }, []);

  // 페이지 범위 계산
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, data.length);

  return {
    // 데이터
    paginatedData,
    
    // 페이지 정보
    page,
    limit,
    totalPages,
    totalItems: data.length,
    startIndex,
    endIndex,
    
    // 페이지 이동
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    
    // 설정
    changeLimit,
    
    // 상태
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

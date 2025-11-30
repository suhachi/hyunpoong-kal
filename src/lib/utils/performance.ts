/**
 * 성능 모니터링 유틸리티
 * React 컴포넌트 렌더링 성능 추적
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useEffect, useRef } from "react";

/**
 * 컴포넌트 렌더링 횟수 추적 Hook
 * @param componentName 컴포넌트 이름
 */
export function useRenderCount(componentName: string) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (process.env.NODE_ENV === "development") {
      console.log(`[Render] ${componentName}: ${renderCount.current}`);
    }
  });

  return renderCount.current;
}

/**
 * 컴포넌트 렌더링 시간 측정 Hook
 * @param componentName 컴포넌트 이름
 */
export function useRenderTime(componentName: string) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === "development") {
      console.log(`[Render Time] ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });
}

/**
 * Props 변경 추적 Hook
 * @param componentName 컴포넌트 이름
 * @param props Props 객체
 */
export function useWhyDidYouUpdate(componentName: string, props: Record<string, unknown>) {
  const previousProps = useRef<Record<string, unknown>>();

  useEffect(() => {
    if (previousProps.current && process.env.NODE_ENV === "development") {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};

      allKeys.forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`[Props Changed] ${componentName}:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}

interface PerformanceWithMemory {
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

/**
 * 메모리 사용량 체크
 */
export function checkMemoryUsage() {
  if ("memory" in performance && process.env.NODE_ENV === "development") {
    const memory = (performance as unknown as PerformanceWithMemory).memory;
    console.log("[Memory Usage]", {
      usedJSHeapSize: `${(memory.usedJSHeapSize / 1048576).toFixed(2)} MB`,
      totalJSHeapSize: `${(memory.totalJSHeapSize / 1048576).toFixed(2)} MB`,
      jsHeapSizeLimit: `${(memory.jsHeapSizeLimit / 1048576).toFixed(2)} MB`,
    });
  }
}

/**
 * 함수 실행 시간 측정
 * @param fn 측정할 함수
 * @param label 라벨
 */
export async function measureTime<T>(fn: () => T | Promise<T>, label: string): Promise<T> {
  const startTime = performance.now();
  const result = await fn();
  const endTime = performance.now();

  if (process.env.NODE_ENV === "development") {
    console.log(`[Time] ${label}: ${(endTime - startTime).toFixed(2)}ms`);
  }

  return result;
}

/**
 * Debounce 함수
 * @param func 실행할 함수
 * @param wait 대기 시간 (ms)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle 함수
 * @param func 실행할 함수
 * @param limit 제한 시간 (ms)
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

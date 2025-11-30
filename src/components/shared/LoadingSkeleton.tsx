/**
 * 로딩 스켈레톤 컴포넌트
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  className?: string;
  variant?: "default" | "card" | "list" | "table";
}

export function LoadingSkeleton({
  count = 3,
  height = 64,
  className = "",
  variant = "default",
}: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="h-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-10 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* 헤더 */}
        <div className="flex gap-4 p-4 bg-gray-100 rounded-t-lg">
          <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse" />
          <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse" />
          <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse" />
          <div className="h-5 bg-gray-300 rounded w-1/4 animate-pulse" />
        </div>
        {/* 로우 */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white border-b">
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // default
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-100 rounded-lg animate-pulse"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}

/**
 * 빈 상태 컴포넌트
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title,
  message, 
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {Icon && (
        <Icon className="w-16 h-16 mx-auto mb-4 text-[#8B7355]/40" />
      )}
      
      {title && (
        <h3 className="mb-2 text-[#1A1A1A]">
          {title}
        </h3>
      )}
      
      <p className="text-[#8B7355] mb-6">
        {message}
      </p>
      
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
}

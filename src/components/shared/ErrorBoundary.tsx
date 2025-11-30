/**
 * 에러 바운더리 컴포넌트
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F6F3] p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-[#D61C1C]" />

            <h2 className="mb-2 text-[#1A1A1A]">문제가 발생했습니다</h2>

            <p className="text-[#8B7355] mb-6">
              일시적인 오류가 발생했습니다.
              <br />
              잠시 후 다시 시도해주세요.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-[#8B7355] mb-2">
                  오류 상세 정보
                </summary>
                <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={this.handleReset} className="flex-1">
                다시 시도
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                className="flex-1 bg-[#D61C1C] hover:bg-[#B01616]"
              >
                홈으로 이동
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

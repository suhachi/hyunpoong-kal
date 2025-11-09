/**
 * 로그인 페이지
 * 이메일 로그인 / 구글 로그인 지원
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { ChickenIcon } from '../../components/icons';
import { LogIn, Mail, Lock, Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { DEBUG } from '../../config/env';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 로그인 후 돌아갈 페이지 (기본: 홈)
  const from = (location.state as any)?.from?.pathname || '/';

  // 로그인 성공 후 리다이렉션 (role에 따라 분기)
  const handleLoginSuccess = (userRole: string) => {
    // 관리자/점주는 관리자 대시보드로
    if (userRole === 'owner' || userRole === 'admin') {
      toast.success('관리자 로그인 성공!');
      navigate('/admin', { replace: true });
    } else {
      // 일반 고객은 이전 페이지나 홈으로
      toast.success('로그인 성공!');
      navigate(from, { replace: true });
    }
  };

  // 이메일 로그인
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await signIn(email, password);
      handleLoginSuccess(user.role);
    } catch (err: any) {
      console.error('로그인 실패:', err);
      setError(err.message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      toast.error('로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  // 구글 로그인
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      handleLoginSuccess(user.role);
    } catch (err: any) {
      console.error('구글 로그인 실패:', err);
      setError(err.message || '구글 로그인에 실패했습니다.');
      toast.error('구글 로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  // 테스트 계정 자동 입력 (개발용)
  const fillTestAccount = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setEmail('customer@example.com');
      setPassword('test1234');
    } else {
      setEmail('admin@hyunpungkalguksu.com');
      setPassword('admin1234');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F6F3] to-[#FFF5E6] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center pb-6">
          {/* 로고 */}
          <div className="flex justify-center">
            <div className="bg-[#D61C1C] rounded-full p-4">
              <ChickenIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl">현풍닭칼국수</CardTitle>
            <CardDescription>
              로그인하고 맛있는 칼국수를 주문하세요
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D61C1C] hover:bg-[#B01616]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  로그인 중...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  로그인
                </>
              )}
            </Button>
          </form>

          {/* 구분선 */}
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-2 text-xs text-gray-500">
                또는
              </span>
            </div>
          </div>

          {/* 구글 로그인 */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Chrome className="mr-2 h-4 w-4" />
            구글로 로그인
          </Button>

          {/* 개발용 테스트 계정 */}
          {DEBUG && (
            <div className="pt-4 space-y-2">
              <p className="text-xs text-gray-500 text-center">테스트 계정 (개발용)</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => fillTestAccount('customer')}
                >
                  고객 계정
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => fillTestAccount('admin')}
                >
                  관리자 계정
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              to="/signup"
              className="text-[#D61C1C] hover:underline font-medium"
            >
              회원가입
            </Link>
          </div>
          
          <div className="text-xs text-center text-gray-500">
            © 2024 KS컴퍼니 (사업자번호: 553-17-00098)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

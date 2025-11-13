/**
 * 회원가입 페이지
 * 이메일 가입 / 구글 가입 지원
 * 
 * KS컴퍼니 (사업자번호: 553-17-00098)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Checkbox } from '../../components/ui/checkbox';
import { ChickenIcon } from '../../components/icons';
import { UserPlus, Mail, Lock, User, Chrome, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 폼 유효성 검사
  const validateForm = (): string | null => {
    if (!formData.displayName.trim()) {
      return '이름을 입력해주세요.';
    }
    if (formData.displayName.length < 2) {
      return '이름은 최소 2자 이상이어야 합니다.';
    }
    if (!formData.email.includes('@')) {
      return '올바른 이메일 형식이 아닙니다.';
    }
    if (formData.password.length < 6) {
      return '비밀번호는 최소 6자 이상이어야 합니다.';
    }
    if (formData.password !== formData.confirmPassword) {
      return '비밀번호가 일치하지 않습니다.';
    }
    if (!agreedToTerms) {
      return '이용약관에 동의해주세요.';
    }
    if (!agreedToPrivacy) {
      return '개인정보 처리방침에 동의해주세요.';
    }
    return null;
  };

  // 이메일 회원가입
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.displayName);
      toast.success('회원가입 성공!', {
        description: '현풍닭칼국수에 오신 것을 환영합니다.',
      });
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      
      // Firebase 에러 메시지 한글화
      let errorMessage = '회원가입에 실패했습니다.';
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = '이미 사용 중인 이메일입니다.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '올바른 이메일 형식이 아닙니다.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = '비밀번호가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.';
      }
      
      setError(errorMessage);
      toast.error('회원가입 실패', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // 구글 회원가입
  const handleGoogleSignup = async () => {
    if (!agreedToTerms || !agreedToPrivacy) {
      setError('이용약관 및 개인정보 처리방침에 동의해주세요.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      toast.success('구글 가입 성공!', {
        description: '현풍닭칼국수에 오신 것을 환영합니다.',
      });
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error('구글 가입 실패:', err);
      setError(err.message || '구글 가입에 실패했습니다.');
      toast.error('구글 가입 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
            <CardTitle className="text-2xl">회원가입</CardTitle>
            <CardDescription>
              새 계정을 만들고 맛있는 칼국수를 즐기세요
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

          {/* 회원가입 폼 */}
          <form onSubmit={handleEmailSignup} className="space-y-4">
            {/* 이름 */}
            <div className="space-y-2">
              <Label htmlFor="displayName">이름</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="홍길동"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="최소 6자 이상"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  disabled={loading}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <span className="text-[#D61C1C]">*</span> 이용약관에 동의합니다
                </label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                  disabled={loading}
                />
                <label
                  htmlFor="privacy"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <span className="text-[#D61C1C]">*</span> 개인정보 처리방침에 동의합니다
                </label>
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
                  가입 중...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  회원가입
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

          {/* 구글 회원가입 */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={loading || !agreedToTerms || !agreedToPrivacy}
          >
            <Chrome className="mr-2 h-4 w-4" />
            구글로 가입하기
          </Button>

          {!agreedToTerms || !agreedToPrivacy ? (
            <p className="text-xs text-center text-gray-500">
              구글로 가입하려면 약관에 동의해주세요
            </p>
          ) : null}
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="text-[#D61C1C] hover:underline font-medium"
            >
              로그인
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

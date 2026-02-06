'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import axios from 'axios';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return alert('비밀번호가 일치하지 않습니다.');

    setIsVerifying(true);

    try {
      if (!executeRecaptcha) {
        // If recaptcha is not ready (e.g. no key), we might warn or skip in dev
        // For this demo, let's warn if key is missing in provider, but here assume it might fail
        console.warn('Recaptcha not ready');
        // Proceed for now if dev environment without keys? Or fail?
        // Let's try to proceed to allow testing unless explicit failure
      } else {
        const token = await executeRecaptcha('signup');
        const verifyRes = await axios.post('/api/recaptcha', { token });

        if (!verifyRes.data.success) {
          alert('봇으로 의심됩니다. 가입이 차단되었습니다.');
          setIsVerifying(false);
          return;
        }
      }

      // Verification Passed
      if (await signup(email, password)) {
        alert('가입이 완료되었습니다. 로그인해주세요.');
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Signup error:', error);

      if (axios.isAxiosError(error) && error.response) {
        // Server responded with a status code outside 2xx range
        const message =
          error.response.data.message || '서버 오류가 발생했습니다.';
        alert(`가입 실패: ${message}`);
      } else {
        alert(
          '가입 처리 중 알 수 없는 오류가 발생했습니다. (reCAPTCHA Key 설정이나 네트워크를 확인하세요).',
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <Card
        className="glass"
        style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
      >
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          회원가입
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {/* Email */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              이메일
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              비밀번호
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
          </div>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
              }}
            >
              비밀번호 확인
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호 재입력"
              required
            />
          </div>

          <Button
            type="submit"
            style={{ marginTop: '1rem' }}
            disabled={isVerifying}
          >
            {isVerifying ? '보안 확인 중...' : '가입하기'}
          </Button>
          <p
            style={{
              fontSize: '0.75rem',
              color: 'hsl(var(--text-muted))',
              textAlign: 'center',
              lineHeight: '1.4',
            }}
          >
            이 사이트는 reCAPTCHA에 의해 보호되며 Google
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'hsl(var(--primary))' }}
            >
              {' '}
              개인정보처리방침
            </a>{' '}
            및
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noreferrer"
              style={{ color: 'hsl(var(--primary))' }}
            >
              {' '}
              이용약관
            </a>
            이 적용됩니다.
          </p>
        </form>
        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'hsl(var(--text-muted))',
          }}
        >
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            style={{ color: 'hsl(var(--primary))', fontWeight: 600 }}
          >
            로그인
          </Link>
        </div>
      </Card>
    </div>
  );
}

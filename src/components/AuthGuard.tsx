'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !isLoading &&
      !user &&
      !pathname.startsWith('/login') &&
      !pathname.startsWith('/signup')
    ) {
      router.replace('/login');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Loading...
      </div>
    );
  }

  // Allow access to auth pages even if logged out
  if (
    !user &&
    (pathname.startsWith('/login') || pathname.startsWith('/signup'))
  ) {
    return <>{children}</>;
  }

  // If logged in, prevent access to login/signup
  if (
    user &&
    (pathname.startsWith('/login') || pathname.startsWith('/signup'))
  ) {
    // Optional: Redirect to dashboard if trying to access login while logged in?
    // For now, allow it or redirect. Let's redirect to dashboard.
    router.replace('/');
    return null;
  }

  // If no user and trying to access protected route (handled by useEffect), render nothing while redirecting
  if (!user) {
    return null;
  }

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce Light Mode styles for Auth pages
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    return () => {
      // Cleanup: Reset to system preference or user preference if needed on unmount
      // However, since we navigate away, the main layout or theme provider should handle restoration
    };
  }, []);

  return <div style={{ minHeight: '100vh' }}>{children}</div>;
}

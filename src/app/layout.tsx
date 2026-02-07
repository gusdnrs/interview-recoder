import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

import { AuthProvider } from '@/context/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Footer from '@/components/Footer';

import RecaptchaProvider from '@/providers/RecaptchaProvider';

export const metadata: Metadata = {
  title: 'Interview Recorder',
  description: '면접 질문 아카이빙',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RecaptchaProvider>
          <ThemeProvider>
            <AuthProvider>
              <AuthGuard>
                <Header />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                  }}
                >
                  <div style={{ flex: 1 }}>{children}</div>
                  <Footer />
                </div>
              </AuthGuard>
            </AuthProvider>
          </ThemeProvider>
        </RecaptchaProvider>
      </body>
    </html>
  );
}
